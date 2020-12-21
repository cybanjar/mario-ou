<template>
  <q-dialog :value="show" @hide="hide">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">Supplier Turnover</span>
      </div>
      <div class="bg-white q-pa-lg">
        <STable
          :loading="state.isFetching"
          :columns="columns"
          :data="state.data"
          :pagination="{ rowsPerPage: 0 }"
          :rows-per-page-options="[0]"
        />
      </div>
      <div class="dialog__footer">
        <q-btn label="Close" color="primary" v-close-popup />
      </div>
    </div>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from '@vue/composition-api';
import { date } from 'quasar';
import { TableHeader } from '../../../../components/VhpUI/typings';
import { ResSupplierTurnover } from '../models/supplier-profile.model';
import { formatterMoney } from '~/app/helpers/formatterMoney.helper';

export default defineComponent({
  props: {
    show: { type: Boolean, required: true },
    liefNr: { type: Number, default: null },
  },
  setup(props, { emit, root: { $api } }) {
    const hide = () => emit('hide');

    const columns: TableHeader<ResSupplierTurnover>[] = [
      {
        label: 'Date',
        field: (row) => date.formatDate(new Date(row.datum), 'DD/MM/YYYYYY'),
        name: 'datum',
        align: 'left',
        sortable: true,
      },
      {
        label: 'Turnover',
        field: (row) => formatterMoney(row.gesamtumsatz),
        name: 'gesamtumsatz',
        sortable: true,
      },
    ];

    const state = reactive({
      data: [] as ResSupplierTurnover[],
      isFetching: false,
    });

    watch(
      () => props.liefNr,
      async (liefNr) => {
        if (!liefNr) return;

        state.isFetching = true;
        state.data = await $api.accountsPayable.getSupplierTurnover({ liefNr });
        state.isFetching = false;
      }
    );

    return {
      hide,
      columns,
      state,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  width: 300px;
}
</style>
