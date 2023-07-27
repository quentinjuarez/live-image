<template>
  <div
    class="w-[600px] h-[400px] bg-gray-900 text-gray-100 text-base font-custom selection:bg-purple-500/50"
    :style="stylesColors"
  >
    <header
      aria-label="Site Header"
      class="bg-gray-800 h-10 flex items-center justify-center text-xl w-full font-bold"
    >
      {{ t(routeName) }}
    </header>

    <div class="p-4 h-[calc(100%-40px)]">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t, setLocale } from "@/locales";
import { generateStyleVariables } from "tailwindcss-custom-colors";

const store = useStore();
const route = useRoute();

const routeName = computed(() => {
  return `header.${String(route.name)}`;
});

const stylesColors = computed(() => {
  return generateStyleVariables({
    color: "#940BDF",
    name: "primary",
  });
});

watch(
  () => store.locale,
  (newValue) => {
    setLocale(newValue);
  },
  { immediate: true }
);
</script>

<style scoped></style>
