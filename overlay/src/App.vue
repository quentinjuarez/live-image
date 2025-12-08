<template>
  <div class="flex justify-center items-center h-screen w-screen">
    <img v-if="type === 'image'" ref="imgRef" class="w-[80vw] h-[80vh]" />
    <VueTweet
      v-else
      :tweet-url="url"
      class="w-[80vw] h-[80vh] *:flex justify-center items-center"
    />
  </div>
</template>

<script setup lang="ts">
import VueTweet from "vue-tweet";
import { ref } from "vue";

const location = new URL(window.location.href);
const code = location.searchParams.get("code");
const type = ref<"tweet" | "image">("image");
const url = ref<string>("");

if (!code) {
  // You could display an error message to the user
  console.error("Room ID is missing from the URL");
}

const wsUrl = new URL(import.meta.env.VITE_WS_URL);
wsUrl.searchParams.set("code", code!);
const ws = new WebSocket(wsUrl);

const imgRef = ref<HTMLImageElement>();

ws.onmessage = (ev) => {
  if (!imgRef.value) return;
  const data = JSON.parse(ev.data);
  if (data.url.includes("status")) {
    type.value = "tweet";
    url.value = data.url;
    return;
  }

  type.value = "image";
  url.value = data.url;
  imgRef.value.src = data.url;
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
