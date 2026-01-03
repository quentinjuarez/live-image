<template>
  <div class="p-4 min-w-[300px]">
    <div v-if="code" class="flex flex-col gap-4">
      <div class="flex gap-2">
        <input
          :value="url"
          type="password"
          class="p-1 border border-gray-300 bg-white rounded flex-1"
        />
        <button
          @click="handleCopy"
          class="bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded text-white pointer"
        >
          <span v-if="copy">Copié!</span>
          <span v-else>Copier le lien</span>
        </button>
      </div>

      <div class="border-t pt-4 border-gray-500">
        <h3 class="font-semibold mb-3">Paramètres</h3>

        <div class="mb-4">
          <label class="block mb-2 text-sm">
            Largeur: <span class="font-semibold">{{ settings.width }}%</span>
          </label>
          <input
            v-model.number="settings.width"
            @input="saveSettings"
            type="range"
            min="50"
            max="100"
            step="10"
            class="w-full"
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
            class="w-full"
          />
        </div>
      </div>

      <div class="border-t pt-4 border-gray-500">
        <button
          @click="handleStop"
          class="bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded text-white pointer"
        >
          Stop
        </button>
      </div>
    </div>
    <div v-else>
      <div class="mb-3">Pas d'accès encore configuré</div>

      <button
        @click="handleCreate"
        class="bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded text-white pointer"
      >
        Créer un code
      </button>
    </div>
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
  const frontUrl = import.meta.env.VITE_FRONT_URL;
  return code.value ? `${frontUrl}/?code=${code.value}` : "";
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
