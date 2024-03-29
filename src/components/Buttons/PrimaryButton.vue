<template>
  <q-btn glossy :loading="loading" class="btn-pb no-border-radius" />
</template>

<script setup>
const props = defineProps({
  loading: Boolean,
});
</script>

<style lang="scss" scoped>
.btn-pb {
  font-size: 12px;
  letter-spacing: 2px;
  font-weight: 600;
  background-color: $bronze;
  color: #ffffff;
}
</style>
