<template>
  <div
    class="flex justify-center items-center h-screen w-screen"
    :style="{ '--width': width + '%' }"
  >
    <!-- Show download instructions if no code -->
    <div
      v-if="!code || (!dev && !isOBS)"
      class="w-full h-full bg-linear-to-br from-[#667eea] to-[#764ba2] flex justify-center items-center p-8"
    >
      <div class="bg-white rounded-2xl p-12 max-w-200 shadow-2xl">
        <h1 class="text-4xl m-0 mb-2 text-[#667eea]">Extension Live Image</h1>
        <p class="text-xl text-gray-600 m-0 mb-8">
          Affichez du contenu X/Twitter dans votre overlay de stream
        </p>

        <div class="my-8">
          <h2 class="text-2xl text-gray-800 mb-4">Comment commencer :</h2>
          <ol class="list-none p-0 [counter-reset:step-counter]">
            <li
              class="[counter-increment:step-counter] mb-6 pl-12 relative before:content-[counter(step-counter)] before:absolute before:left-0 before:top-0 before:bg-[#667eea] before:text-white before:w-8 before:h-8 before:rounded-full before:flex before:items-center before:justify-center before:font-bold"
            >
              <strong class="block text-lg mb-2 text-gray-800"
                >Téléchargez l'extension Chrome</strong
              >
              <p class="my-2 text-gray-600 leading-relaxed">
                Installez depuis le Chrome Web Store
              </p>
            </li>
            <li
              class="[counter-increment:step-counter] mb-6 pl-12 relative before:content-[counter(step-counter)] before:absolute before:left-0 before:top-0 before:bg-[#667eea] before:text-white before:w-8 before:h-8 before:rounded-full before:flex before:items-center before:justify-center before:font-bold"
            >
              <strong class="block text-lg mb-2 text-gray-800"
                >Obtenez votre code de connexion</strong
              >
              <p class="my-2 text-gray-600 leading-relaxed">
                Cliquez sur l'icône de l'extension et copiez votre code unique
              </p>
            </li>
            <li
              class="[counter-increment:step-counter] mb-6 pl-12 relative before:content-[counter(step-counter)] before:absolute before:left-0 before:top-0 before:bg-[#667eea] before:text-white before:w-8 before:h-8 before:rounded-full before:flex before:items-center before:justify-center before:font-bold"
            >
              <strong class="block text-lg mb-2 text-gray-800"
                >Ajoutez à OBS/Logiciel de Streaming</strong
              >
              <p class="my-2 text-gray-600 leading-relaxed" v-if="code">
                Ajoutez cette URL comme Source Navigateur avec votre code :
              </p>

              <div class="flex gap-2" v-if="code">
                <input
                  :value="displayUrl"
                  type="password"
                  class="p-1 border border-gray-300 bg-white rounded flex-1"
                />
                <button
                  @click="handleCopy"
                  class="bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded text-white cursor-pointer transition-colors"
                >
                  <span v-if="copy">Copié!</span>
                  <span v-else>Copier le lien</span>
                </button>
              </div>

              <div
                v-else
                class="bg-yellow-100 border border-yellow-500 rounded-lg p-4"
              >
                <strong class="block text-yellow-900 mb-2">
                  Code de Connexion Manquant
                </strong>
                <p class="m-0 text-yellow-900">
                  Cette page nécessite un paramètre
                  <code class="bg-black/10 px-2 py-1 rounded">code</code> dans
                  l'URL pour se connecter à l'extension. Vous pouvez le trouver
                  en cliquant sur l'icône de l'extension dans votre navigateur
                  après l'avoir installée.
                </p>
              </div>
            </li>
            <li
              class="[counter-increment:step-counter] mb-6 pl-12 relative before:content-[counter(step-counter)] before:absolute before:left-0 before:top-0 before:bg-[#667eea] before:text-white before:w-8 before:h-8 before:rounded-full before:flex before:items-center before:justify-center before:font-bold"
            >
              <strong class="block text-lg mb-2 text-gray-800"
                >Commencez à streamer !</strong
              >
              <p class="my-2 text-gray-600 leading-relaxed">
                Faites un clic droit sur les images ou cliquez sur le bouton
                Live Image sur les tweets
              </p>
            </li>
          </ol>
        </div>
      </div>
    </div>

    <!-- Show content when code is present -->
    <Transition name="fade" v-else>
      <img
        v-if="isVisible && type === 'image'"
        :src="url"
        :style="{ width: width + '%' }"
        class="max-h-screen h-auto object-contain"
      />

      <VueTweet
        v-else-if="isVisible && type === 'tweet'"
        :tweet-url="url"
        class="max-h-screen overflow-auto"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import VueTweet from "vue-tweet";

type ContentType = "image" | "tweet";

const type = ref<ContentType>("image");
const url = ref("");
const isVisible = ref(false);

let hideTimer: number | undefined;

const location = new URL(window.location.href);

const validateCode = (code?: string | null): string => {
  if (!code) return "";
  // uuid v4 regex
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(code) ? code : "";
};

const code = computed(() => {
  return validateCode(location.searchParams.get("code"));
});

const dev = computed(() => {
  return location.searchParams.get("mode") === "dev";
});

let ws: WebSocket | null = null;
let reconnectTimer: number | undefined;

const connectWebSocket = () => {
  if (!code.value) return;

  const wsUrl = new URL(import.meta.env.VITE_WS_URL);
  wsUrl.searchParams.set("code", code.value);

  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log("WebSocket connected");
    // Clear any pending reconnect timer
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = undefined;
    }
  };

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

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  ws.onclose = () => {
    console.log("WebSocket closed, reconnecting in 5 seconds...");
    ws = null;
    // Retry connection after 5 seconds
    reconnectTimer = window.setTimeout(() => {
      connectWebSocket();
    }, 5000);
  };
};

onMounted(() => {
  connectWebSocket();
});

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

const displayUrl = computed(
  () => `${window.location.origin}/?code=${code.value}`
);

const isOBS = computed(() => {
  return /obs/i.test(navigator.userAgent.toLowerCase());
});

const copy = ref(false);

const handleCopy = () => {
  if (displayUrl.value) {
    navigator.clipboard.writeText(displayUrl.value);
    copy.value = true;
    setTimeout(() => {
      copy.value = false;
    }, 2000);
  }
};
</script>

<style>
/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

iframe {
  width: 550px !important;
}
</style>
