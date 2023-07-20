<template>
  <div class="flex justify-center items-center h-screen">
    <img v-if="imgUrl" class="" :src="imgUrl" />
    <div v-else>Pas d'image</div>
  </div>
</template>

<script setup lang="ts">
const imgUrl = ref(null);

const getImg = () => {
  chrome.storage.local.get("imgUrl", (result) => {
    imgUrl.value = result.imgUrl;
  });
};

onMounted(() => {
  getImg();

  chrome.storage.onChanged.addListener(function () {
    return getImg();
  });
});
</script>

<style scoped></style>
