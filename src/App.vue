<script setup>
import "beercss";

import FooterOverview from "./components/FooterOverview.vue";
import ItemList from "./components/ItemList.vue";

import { onMounted, onUnmounted, ref } from "vue";

let portToBackground = null;

const showPopup = ref(true);
const itemsList = ref({});

onMounted(() => {
  // Reset badge text
  chrome.action.setBadgeText({ text: "" });

  // Read items from storage
  chrome.storage.local.get(null, function (items) {
    // items is an object with items in storage
    for (let key in items) {
      console.log(`[ema-popup] found in storage ${key}`, items[key]);
      itemsList.value[key] = items[key];
    }
  });

  // Watch storage updates
  chrome.storage.onChanged.addListener(function (changes, area) {
    console.log("[ema-popup] storage changed: ", changes);
    for (let key in changes) {
      if (changes[key].newValue) {
        itemsList.value[key] = changes[key].newValue;
      } else {
        delete itemsList.value[key];
      }
    }
  });

  // Connect to the background script
  portToBackground = chrome.runtime.connect({ name: "popup" });
  portToBackground.onMessage.addListener(function (msg) {
    console.log("[ema-popup] received msg from background script:", msg);
  });
});

onUnmounted(() => {
  // Disconnect from the background script
  if (portToBackground) {
    portToBackground.disconnect();
    portToBackground = null;
  }
});
</script>

<template>
  <main v-show="showPopup">
    <ItemList :items="itemsList" />
    <FooterOverview @togglePopup="showPopup = false" />
  </main>
</template>
