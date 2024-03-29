<template>
  <SectionTitle>Informes</SectionTitle>
  <q-card class="q-mt-md q-pa-md">
    <q-form>
      <h6 class="q-my-sm">Informe de producción</h6>
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-3">
          <DateFilter
            v-model="productionReportForm.created_at_from"
            label="Fecha desde"
          />
        </div>
        <div class="col-12 col-md-3">
          <DateFilter
            v-model="productionReportForm.created_at_to"
            label="Fecha hasta"
          />
        </div>
        <div class="col-12 col-md-4">
          <CompanySelect
            v-model="productionReportForm.company_id"
            label="Empresa"
            clearable
          />
        </div>
      </div>

      <div class="flex q-col-gutter-sm">
        <div>
          <SecondaryButton
            label="Seleccionar productos"
            @click="showProductSelection = true"
          />
        </div>
        <div>
          <SecondaryButton
            label="Seleccionar tipos de producto"
            @click="showProductTypeSelection = true"
          />
        </div>
      </div>
      <PrimaryButton
        v-if="!loading"
        class="q-mt-md"
        label="Generar"
        @click="getProductionReport"
      />
      <q-spinner v-else size="sm" class="q-mt-md" color="dark-blue"></q-spinner>
    </q-form>

    <q-dialog v-model="showProductSelection" full-width persistent>
      <q-card>
        <q-card-section>
          <div class="flex justify-between">
            <p class="text-h6">Seleccionar productos a incluir en el reporte</p>
            <div>
              <q-btn v-close-popup icon="close" flat round dense />
            </div>
          </div>
          <PrimaryButton
            label="Terminar selección"
            @click="showProductSelection = false"
          />
        </q-card-section>
        <q-card-section>
          <ProductSelectionList
            v-model:selected="reportProductIds"
            style="height: 500px"
            virtual-scroll
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showProductTypeSelection" full-width persistent>
      <q-card>
        <q-card-section>
          <div class="flex justify-between">
            <p class="text-h6">
              Seleccionar tipos de productos a incluir en el reporte
            </p>
            <div>
              <q-btn v-close-popup icon="close" flat round dense />
            </div>
          </div>
          <PrimaryButton
            label="Terminar selección"
            @click="showProductTypeSelection = false"
          />
        </q-card-section>
        <q-card-section>
          <ProductTypeSelectionList
            v-model:selected="reportProductTypeIds"
            style="height: 500px"
            virtual-scroll
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import PrimaryButton from 'src/components/Buttons/PrimaryButton.vue';
import DateFilter from 'src/components/Filter/DateFilter.vue';
import SectionTitle from 'src/components/SectionTitle.vue';
import { useErrorNotification } from 'src/composables/errorNotification';
import { usePdfUtils } from 'src/composables/pdfUtils';
import { useOrderStore } from 'src/stores/order';
import { reactive, ref, watch } from 'vue';
import CompanySelect from 'src/components/Form/CompanySelect.vue';
import SecondaryButton from 'src/components/Buttons/SecondaryButton.vue';
import ProductSelectionList from 'src/components/Product/ProductSelectionList.vue';
import ProductTypeSelectionList from 'src/components/Product/ProductTypeSelectionList.vue';

const { fetchProductionReport } = useOrderStore();
const { productionReport, loading } = storeToRefs(useOrderStore());
const { notifyError } = useErrorNotification();
const { dataURItoBlob } = usePdfUtils();
const productionReportForm = reactive({
  created_at_from: null,
  created_at_to: null,
  company_id: null,
  product_id: null,
  product_type_id: null,
});
const showProductSelection = ref(false);
const showProductTypeSelection = ref(false);
const reportProductIds = ref([]);
const reportProductTypeIds = ref([]);

watch(
  reportProductIds,
  () =>
    (productionReportForm.product_id = reportProductIds.value.length
      ? reportProductIds.value.map((product) => product.id)
      : null)
);

watch(
  reportProductTypeIds,
  () =>
    (productionReportForm.product_type_id = reportProductTypeIds.value.length
      ? reportProductTypeIds.value.map((productType) => productType.id)
      : null)
);

const getProductionReport = () => {
  if (
    productionReportForm.created_at_from !== undefined &&
    productionReportForm.created_at_from !== null
  ) {
    productionReportForm.created_at_from =
      productionReportForm.created_at_from + ' 00:00:00';
  }
  if (
    productionReportForm.created_at_to !== undefined &&
    productionReportForm.created_at_to !== null
  ) {
    productionReportForm.created_at_to =
      productionReportForm.created_at_to + ' 23:59:59';
  }

  fetchProductionReport(productionReportForm)
    .then(() => {
      const blob = dataURItoBlob(productionReport.value.content);
      const url = URL.createObjectURL(blob);

      window.open(url, '_blank');
    })
    .catch(() =>
      notifyError('Ha ocurrido un error al intentar descargar el PDF.')
    );
};
</script>
