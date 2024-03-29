<template>
  <q-dialog persistent>
    <q-card class="q-pa-md" style="width: 80vw">
      <q-card-section>
        <SectionTitle class="block"
          >Nota de agenda de tratamiento
        </SectionTitle>
      </q-card-section>
      <q-card-section>
        <TreatmentScheduleNoteForm
          :treatment-schedule-note="props.treatmentScheduleNote"
          @create:success="getTreatmentScheduleNote"
          @update:success="getTreatmentScheduleNote"
          @deleted:success="getTreatmentScheduleNote"
          @cancel="$emit('cancel')"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import SectionTitle from '../SectionTitle.vue';
import PrimaryButton from '../Buttons/PrimaryButton.vue';
import TreatmentScheduleNoteForm from 'src/components/TreatmentScheduleNote/TreatmentScheduleNoteForm.vue';

const props = defineProps({
  treatmentScheduleNote: Object,
});

const emit = defineEmits(['event:success', 'cancel']);

const getTreatmentScheduleNote = async (eventObject) => {
  emit('event:success', eventObject);
};
</script>
