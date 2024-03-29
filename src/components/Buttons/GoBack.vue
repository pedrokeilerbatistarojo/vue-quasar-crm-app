<template>
  <q-btn stretch flat :icon="icon" :label="label" @click="$router.back()" />
</template>

<script setup>
defineProps({ label: String, icon: String });
</script>
