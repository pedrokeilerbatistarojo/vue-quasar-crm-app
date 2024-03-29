<template>
  <div
    v-if="errors"
    class="q-pa-md q-mb-lg bg-red-10 text-white rounded-borders"
  >
    <div v-for="error in errors" :key="error">
      {{ error[0] }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  errors: Object,
});
</script>
