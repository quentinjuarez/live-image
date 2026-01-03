<template>
  <div class="p-4 min-w-75">
    <h1 class="text-2xl font-bold mb-4 block">Live Image</h1>
    <section v-if="code" class="flex flex-col gap-4">
      <div>
        <h3 class="font-semibold mb-3 text-lg">Lien Source Navigateur</h3>
        <div class="flex gap-2">
          <button
            @click="handleCopy"
            class="bg-violet-500 hover:bg-violet-600 py-3 px-5 rounded-lg text-white cursor-pointer transition-colors"
          >
            <span v-if="copy">Copié!</span>
            <span v-else>Copier le lien</span>
          </button>
        </div>
      </div>

      <div>
        <h3 class="font-semibold mb-3 text-lg">Paramètres</h3>

        <div class="mb-4">
          <label class="block mb-2 text-sm">
            Largeur: <span class="font-semibold">{{ settings.width }}%</span>
          </label>
          <input
            v-model.number="settings.width"
            @input="saveSettings"
            type="range"
            min="10"
            max="100"
            step="10"
            class="w-full accent-violet-500"
          />
        </div>

        <div>
          <label class="block mb-2 text-sm">
            Temps d'affichage:
            <span class="font-semibold">{{
              settings.hideTime ? settings.hideTime + "s" : "Infini"
            }}</span>
          </label>
          <input
            v-model.number="settings.hideTime"
            @input="saveSettings"
            type="range"
            min="0"
            max="10"
            step="1"
            class="w-full accent-violet-500"
          />
        </div>
      </div>

      <div>
        <h3 class="font-semibold mb-3 text-lg">Arrêter le partage en cours</h3>
        <button
          @click="handleStop"
          class="bg-violet-500 hover:bg-violet-600 py-3 px-5 rounded-lg text-white cursor-pointer transition-colors"
        >
          Stop
        </button>
      </div>
    </section>
    <section v-else>
      <h3 class="font-semibold mb-3 text-lg">Pas d'accès encore configuré</h3>

      <button
        @click="handleCreate"
        class="bg-violet-500 hover:bg-violet-600 py-3 px-5 rounded-lg text-white cursor-pointer transition-colors"
      >
        Commencer
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";

const code = ref<string>();

const settings = reactive({
  width: 80,
  hideTime: 5,
});

onMounted(() => {
  chrome.storage.local.get(["code", "settings"], (result) => {
    code.value = result.code as string | undefined;
    if (result.settings) {
      Object.assign(settings, result.settings);
    }
  });
});

const url = computed(() => {
  return code.value ? `${process.env.FRONT_URL}/?code=${code.value}` : "";
});

const handleCreate = () => {
  const value = crypto.randomUUID();
  chrome.storage.local.set({ code: value });
  code.value = value;
};

const copy = ref(false);

const handleCopy = () => {
  if (url.value) {
    navigator.clipboard.writeText(url.value);
    copy.value = true;
    setTimeout(() => {
      copy.value = false;
    }, 2000);
  }
};

const saveSettings = () => {
  chrome.storage.local.set({ settings: { ...settings } });
};

const handleStop = () => {
  chrome.runtime.sendMessage({
    action: "stop",
    url: "",
  });
};
</script>

<style scoped></style>
