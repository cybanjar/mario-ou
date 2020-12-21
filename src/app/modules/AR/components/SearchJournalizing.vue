<template>
  <section class="mt-7 q-pa-md">
    <div v-if="initPrep.data.isLoading" class="q-pa-md text-center">
      <q-spinner color="primary" size="4em" :thickness="3" />
    </div>
    <template v-else>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <SInput
          v-model="fromDate"
          type="date"
          label-text="From Date"
          disabled
          readonly
        />
        <SInput
          label-text="To Date"
          v-model="toDate"
          type="date"
          :rules="[(val) => !!val || 'Please Input Since Date']"
        />
        <SInput
          label-text="Reference Number"
          v-model="refNum"
          :rules="[(val) => !!val || 'Please Input Reference Number']"
        />
        <SInput
          label-text="Description"
          v-model="description"
          :rules="[(val) => !!val || 'Please Input Description']"
        />

        <div class="q-px-sm q-py-md">
          <q-btn
            icon="mdi-magnify"
            label="Search"
            type="submit"
            class="full-width"
            color="primary"
          />
        </div>
        <q-separator spaced />
        <SRemarkLeftDrawer label="Debit" :value="debit | money" />
        <SRemarkLeftDrawer label="Credit" :value="credit | money" />
        <div class="q-px-sm q-py-md">
          <q-btn
            icon="mdi-content-save"
            label="Save"
            color="white"
            text-color="gray"
            class="full-width"
            :disabled="noSave"
            outline
          >
            <q-popup-proxy :offset="[0, -100]">
              <q-banner inline-actions rounded class="bg-orange text-white">
                <template v-slot:avatar>
                  <q-icon name="mdi-gavel" />
                </template>
                Do you really want to transfer A/R Payments to GL Journals?
                <template v-slot:action>
                  <q-btn flat v-close-popup label="Cancel" />
                  <q-btn flat v-close-popup @click="onSave" label="Ok" />
                </template>
              </q-banner>
            </q-popup-proxy>
          </q-btn>
        </div>
      </q-form>
    </template>
  </section>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { formatToOB } from '~/app/helpers/formatterDate.helper';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';

export default defineComponent({
  props: {
    debit: { type: Number, required: false, default: 0 },
    credit: { type: Number, required: false, default: 0 },
    noSave: { type: Boolean, required: false, default: true },
  },
  setup(props, { emit, root: { $api } }) {
    const filter = reactive({
      toDate: '2019-01-14', // this is hardcode
      fromDate: '2019-01-14',
      refNum: '',
      description: '',
    });

    const initPrep = usePrepare(
      true,
      () => $api.common.getGeneralParam(2, 110),
      (tempData) => {
        filter.fromDate = tempData?.fdate;
        filter.toDate = tempData?.fdate;
      }
    );

    function onSubmit() {
      const params = {
        fromDate: formatToOB(new Date(filter.fromDate)),
        refno: filter.refNum,
        toDate: formatToOB(new Date(filter.toDate)),
        description: filter.description,
      };
      emit('search', params);
    }

    function onSave() {
      emit('save');
    }

    return {
      ...toRefs(filter),
      onSubmit,
      onSave,
      initPrep,
    };
  },
  components: {
    DialogSelectGuest: () => import('./DialogSelectGuest.vue'),
  },
});
</script>
