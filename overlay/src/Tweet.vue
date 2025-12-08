<template>
  <div v-html="html"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps<{
  url: string;
}>();

const html = ref<string>("");

onMounted(() => {
  const twitterUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(
    props.url
  )}&omit_script=true`;

  fetch(twitterUrl)
    .then((response) => response.json())
    .then((data) => {
      html.value = data.html;
    });
});
</script>

<style scoped></style>
