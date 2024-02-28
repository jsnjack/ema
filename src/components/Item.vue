<template>
  <div class="row item no-margin">
    <div class="small-padding max">
      <div v-if="!editing" class="medium-text" @dblclick="startEditing">{{ props.item.selector }}</div>
      <div v-else class="field small">
        <input type="text" class="medium-text" v-model="editedSelector" @blur="saveChanges" @keydown.enter="saveChanges">
      </div>
    </div>
    <div>
      <button class="small circle transparent" @click="open">
        <i>open_in_new</i>
      </button>
      <button class="small circle transparent" @click="deleteItem">
        <i>delete</i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, onBeforeUnmount, ref } from "vue";

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

const editing = ref(false);
const editedSelector = ref(props.item.selector);

function startEditing() {
  editing.value = true;
}

function saveChanges() {
  props.item.selector = editedSelector.value;
  chrome.storage.local.set({ [props.itemKey]: props.item });
  editing.value = false;
}

function deleteItem() {
  chrome.storage.local.remove(props.itemKey);
}

function open() {
  chrome.tabs.create({ url: props.item.url });
  window.close();
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
