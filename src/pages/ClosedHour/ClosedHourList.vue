<template>
  <SectionTitle>Horarios cerrados</SectionTitle>
  <PrimaryButton
    class="float-right q-mt-lg"
    label="Gestionar"
    :to="{ name: 'closed-hours.manage' }"
  />
  <ClosedHourTable deleteable/>
</template>

<script setup>
import SectionTitle from 'src/components/SectionTitle.vue';
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import ClosedHourTable from 'src/components/ClosedHour/ClosedHourTable.vue';
</script>
