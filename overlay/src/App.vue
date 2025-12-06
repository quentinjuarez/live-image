<template>
  <img ref="imgRef" />
</template>

<script setup lang="ts">
import { ref } from "vue";
const ws = new WebSocket(import.meta.env.VITE_WS_URL || "ws://localhost:3334");

const imgRef = ref<HTMLImageElement>();

ws.onmessage = (ev) => {
  if (!imgRef.value) return;
  const data = JSON.parse(ev.data);
  imgRef.value.src = data.image;
  imgRef.value.classList.add("visible");

  // Hide after 5s
  setTimeout(() => imgRef.value?.classList.remove("visible"), 5000);
};
</script>

<style scoped>
img {
  max-width: 50%;
  opacity: 0;
  transition: opacity 0.5s ease;
}

img.visible {
  opacity: 1;
}
</style>
