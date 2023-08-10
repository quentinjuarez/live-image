<template>
  <div :style="stylesColors">
    <input type="color" v-model="color" />

    <div class="space-y-2">
      <div v-for="c in colors" :key="c" class="p-1" :class="c">{{ c }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { generateStyleVariables } from "tailwindcss-custom-colors";

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
</script>
