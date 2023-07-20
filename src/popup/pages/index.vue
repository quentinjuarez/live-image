<template>
  <div class="flex justify-center items-center h-full" @click="handleLogout">
    <img v-if="store.imgUrl" class="h-full" :src="store.imgUrl" />
    <div v-else>Pas d'image</div>
  </div>
</template>

<script setup lang="ts">
const store = useStore();
const router = useRouter();

const handleLogout = () => {
  store.logout();
  router.push("/login");
};
</script>

<style scoped></style>
