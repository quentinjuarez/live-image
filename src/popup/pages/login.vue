<template>
  <div class="flex items-center justify-center w-full h-full">
    <button
      class="bg-purple-500 text-white rounded px-2 py-1"
      @click="handleLogin"
    >
      LOGIN
    </button>
  </div>
</template>

<script setup lang="ts">
const store = useStore();
const router = useRouter();

const handleLogin = () => {
  store.login();
  router.push("/");
};
</script>

<style scoped></style>
