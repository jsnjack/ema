<template>
  <div class="small-padding footer">
    <nav class="no-space">
      <button @click="addNewItem" class="border left-round small">
        <i class="small">add</i>
        <span>Add</span>
      </button>
      <button @click="testSelectors" class="border no-round small">
        <i class="small">experiment</i>
        <span>Test</span>
      </button>
      <button @click="copyAllSelectors" class="border right-round small">
        <i class="small">content_copy</i>
        <span>Copy</span>
      </button>
      <div class="max"></div>
      <button @click="openDocs" class="transparent circle small">
        <i>help</i>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { defineEmits, inject } from "vue";

const emit = defineEmits(["togglePopup"]);
const eventBus = inject("eventBus");

function addNewItem() {
  emit("togglePopup");

  chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    let currentTab = tabs[0];
    if (!currentTab) {
      return;
    }
    console.log("[ema-popup] injecting inject.js in the current tab");
    chrome.scripting.executeScript({
      target: {
        tabId: currentTab.id,
      },
      files: ["inject.js"],
    });
  });
}

function testSelectors() {
  emit("togglePopup");
  eventBus.emit("testSelectors");
}

function copyAllSelectors() {
  emit("togglePopup");
  eventBus.emit("copyAllSelectors");
}

function openDocs() {
  chrome.tabs.create({ url: "https://docs.surfly.com" });
  window.close();
}
</script>

<style scoped>
.footer {
  background-color: var(--primary-container);
}
</style>
