<template>
  <div v-if="code" class="flex gap-2">
    <input
      :value="url"
      type="password"
      class="p-1 border border-gray-300 bg-white rounded"
    />
    <button
      @click="handleCopy"
      class="bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded text-white pointer"
    >
      <span v-if="copy">Copié!</span>
      <span v-else>Copier le lien</span>
    </button>
  </div>
  <div v-else>
    <div>Pas d'accès encore configuré</div>

    <button
      @click="handleCreate"
      class="bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded text-white pointer"
    >
      Créer un code
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

const code = ref<string>();

onMounted(() => {
  chrome.storage.local.get("code", (result) => {
    code.value = result.code as string | undefined;
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
</script>

<style scoped></style>
