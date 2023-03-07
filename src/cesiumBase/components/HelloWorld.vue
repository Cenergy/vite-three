




<script setup>
import { ref } from "vue";
import Scene from "./Scene.vue";

defineProps({
    msg: String,
});

const count = ref(0);
</script>

<template>
    <Scene></Scene>
</template>

<style scoped>
.read-the-docs {
    color: #888;
}
</style>
