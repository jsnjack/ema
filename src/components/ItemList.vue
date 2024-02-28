<template>
  <div class="medium-height middle-align center-align padding" style="background-color: var(--surface-container-lowest)"
    v-if="Object.keys(props.items).length === 0">
    <div class="center-align">
      <i class="extra">orders</i>
      <h5>Empty</h5>
    </div>
  </div>
  <HostnameItems v-for="item in sortedItems" :key="item.hostname" :items="item.items" :hostname="item.hostname" />
</template>

<script setup>
import HostnameItems from "./HostnameItems.vue";
import { defineProps, computed, inject } from "vue";


const props = defineProps({
  items: {
    type: Object,
    required: true,
  },
});

const sortedItems = computed(() => {
  // Sorted items is a list of items sorted by selector and grouped by hostname
  // which is extracted from url
  let sortedItems = [];
  for (let key in props.items) {
    let item = props.items[key];
    let url = new URL(item.url);
    let hostname = url.hostname;
    let found = false;
    for (let i = 0; i < sortedItems.length; i++) {
      if (sortedItems[i].hostname === hostname) {
        sortedItems[i].items.push({ key, ...item });
        found = true;
        break;
      }
    }
    if (!found) {
      sortedItems.push({ hostname, items: [{ key, ...item }] });
    }
  }
  // Sort items by hostname
  sortedItems.sort((a, b) => {
    if (a.hostname < b.hostname) {
      return -1;
    }
    if (a.hostname > b.hostname) {
      return 1;
    }
    return 0;
  });
  return sortedItems;
});

const eventBus = inject("eventBus");
eventBus.on("testSelectors", () => {
  console.log("[ema-popup] testSelectors");
  let totalElementsMasked = 0;
  chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    let currentTab = tabs[0];
    if (!currentTab) {
      return;
    }
    console.log("[ema-popup] injecting inject_styles.js in the current tab");
    chrome.scripting.executeScript({
      target: {
        tabId: currentTab.id,
      },
      files: ["inject_styles.js"],
    }).then(() => {
      for (let key in props.items) {
        let item = props.items[key];
        chrome.scripting.executeScript({
          target: {
            tabId: currentTab.id,
          },
          func: (selector) => {
            let totalElementsMasked = 0;
            const cleanedSelectors = new Set();
            // Emulate Surfly behavior by adding an extra selector with * in the end
            selector.split(',').forEach(s => {
              const baseSelector = s.trim();
              cleanedSelectors.add(baseSelector);
              if (!baseSelector.endsWith(' *')) {
                cleanedSelectors.add(`${baseSelector} *`);
              }
            });
            for (let sampleSelector of cleanedSelectors) {
              let endsWithStar = false;
              if (sampleSelector.endsWith("*")) {
                endsWithStar = true;
                sampleSelector = sampleSelector.slice(0, -1);
              }
              let elements = document.querySelectorAll(sampleSelector);
              for (let i = 0; i < elements.length; i++) {
                totalElementsMasked++;
                elements[i].classList.add("pt-highlight");
                if (endsWithStar) {
                  for (let el of elements[i].getElementsByTagName("*")) {
                    totalElementsMasked++;
                    el.classList.add("pt-highlight");
                  }
                }
              }
            }
            console.log(`[ema-popup] selector ${selector} found ${totalElementsMasked} elements`);
            return totalElementsMasked;
          },
          args: [item.selector],
        }).then((result) => {
          totalElementsMasked += result[0].result;
          chrome.action.setBadgeText({ text: totalElementsMasked.toString() }).then(() => {
            setTimeout(() => {
              window.close();
            }, 0);
          });
        }, (error) => {
          console.error("[ema-popup] error testing selector", error);
        });
      }
    });
  });
});

eventBus.on("copyAllSelectors", () => {
  console.log("[ema-popup] copyAllSelectors");
  let selectors = [];
  for (let key in props.items) {
    let item = props.items[key];
    selectors.push(item.selector);
  }
  navigator.clipboard.writeText(selectors.join(", ")).then(() => {
    document.activeElement.blur();
  });
});

</script>

<style scoped>
</style>
