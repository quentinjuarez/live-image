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

    <input type="color" v-model="color" />

    <div class="space-y-2">
      <div v-for="c in colors" :key="c" class="p-1" :class="c">{{ c }}</div>
    </div>

    <!-- <div class="p-4 h-[calc(100%-40px)]">
      <RouterView></RouterView>
    </div> -->
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

const color = ref("#FF0000");

const stylesColors = computed(() => {
  const variables = generateStyleVariables({
    color: color.value,
    name: "primary",
  });

  let style = document.getElementById("style-colors");
  if (style) style.remove();

  style = document.createElement("style");
  style.setAttribute("id", "style-colors");
  style.innerHTML = `
    @layer base {
      :root {
        ${variables}
      }
    }`;
  document.head.appendChild(style);
  return variables;
});

const colors = ref([
  "bg-primary-100",
  "bg-primary-200",
  "bg-primary-300",
  "bg-primary-400",
  "bg-primary-500",
  "bg-primary-600",
  "bg-primary-700",
  "bg-primary-800",
  "bg-primary-900",
]);

watch(
  () => store.locale,
  (newValue) => {
    setLocale(newValue);
  },
  { immediate: true }
);
</script>

<style scoped></style>
