<template>
  <div
    class="flex justify-center items-center h-screen w-screen"
    :style="{ '--width': width + '%' }"
  >
    <Transition name="fade">
      <img
        v-if="isVisible && type === 'image'"
        :src="url"
        class="content-image"
      />

      <VueTweet
        v-else-if="isVisible && type === 'tweet'"
        :tweet-url="url"
        class="content-tweet"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VueTweet from "vue-tweet";

type ContentType = "image" | "tweet";

const type = ref<ContentType>("image");
const url = ref("");
const isVisible = ref(false);

let hideTimer: number | undefined;

const location = new URL(window.location.href);
const code = location.searchParams.get("code");

if (!code) {
  console.error("Room ID is missing from the URL");
}

const wsUrl = new URL(import.meta.env.VITE_WS_URL);
wsUrl.searchParams.set("code", code!);
const ws = new WebSocket(wsUrl);

type Settings = {
  hideTime?: number; // in seconds
  width?: number; // in percentage of viewport width
};

const width = ref(80);

function showContent(
  newType: ContentType,
  newUrl: string,
  settings: Settings = {}
) {
  type.value = newType;
  url.value = newUrl;
  isVisible.value = true;
  width.value = settings.width ?? 80;

  clearTimeout(hideTimer);
  if (settings.hideTime === 0) return;

  hideTimer = window.setTimeout(() => {
    isVisible.value = false;
  }, (settings.hideTime ?? 5) * 1000);
}

ws.onmessage = (ev) => {
  const data = JSON.parse(ev.data);

  if (!data.url) {
    isVisible.value = false;
  } else if (data.url.includes("status")) {
    showContent("tweet", data.url, data.settings);
  } else {
    showContent("image", data.url, data.settings);
  }
};
</script>

<style>
.content-image {
  width: var(--width);
  max-height: 100vh;
  height: auto;
  object-fit: contain;
}

.content-tweet {
  max-height: 100vh;
  overflow: auto;
}

iframe {
  width: 550px !important;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
