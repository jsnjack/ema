<template>
    <div class="small-margin small-padding">
        <a class="chip no-elevate" @click="open">{{ props.hostname }}</a>
        <Item v-for="item in props.items" :key="item.key" :item="item" :itemKey="item.key" />
    </div>
</template>

<script setup>
import Item from "./Item.vue";
import { defineProps } from "vue";

const props = defineProps({
    items: {
        type: Object,
        required: true,
    },
    hostname: {
        type: String,
        required: true,
    },
});

function open() {
    browser.tabs.create({ url: `https://${props.hostname}` });
    window.close();
}
</script>

<style scoped>
div {
    background-color: var(--surface-container-lowest);
}
</style>
