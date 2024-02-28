<template>
  <div class="row item no-margin">
    <div class="small-padding" @click="open" style="cursor: pointer">
      <div class="crop-text">{{ props.item.title }}</div>
      <div class="small-text">{{ hostname }}</div>
    </div>
    <div class="small-padding" @click="deleteItem">
      <button class="small circle transparent">
        <i>delete</i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, onBeforeUnmount } from "vue";


const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  itemKey: {
    type: String,
    required: true,
  },
});

function deleteItem() {
  browser.storage.sync.remove(props.itemKey);
}

onMounted(() => {
});

onBeforeUnmount(() => {
});
</script>

<style scoped>
.crop-text {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item {
  background-color: var(--surface-container-lowest);
}
</style>
