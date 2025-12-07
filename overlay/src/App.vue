<template>
  <img ref="imgRef" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const url = new URL(window.location.href);
const roomId = url.searchParams.get("code");

if (!roomId) {
  // You could display an error message to the user
  console.error("Room ID is missing from the URL");
}

const wsUrl = new URL(import.meta.env.VITE_WS_URL || "ws://localhost:3334");
wsUrl.searchParams.set("id", roomId!);
const ws = new WebSocket(wsUrl);

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
