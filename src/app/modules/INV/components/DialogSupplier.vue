<template>
  <q-dialog v-model="dialogModel">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">Select Supplier</span>
      </div>
      <q-form @submit="onSubmit">
        <div class="bg-white q-pa-lg">
          <div class="col">
            <STable
              dense
              :columns="tableHeaders"
              :data="supplier"
              separator="cell"
              @row-click="onRowClick"
              :rows-per-page-options="[10, 13, 16]"
              :pagination.sync="pagination"
            ></STable>
          </div>
        </div>
        <div class="dialog__footer">
          <q-btn
            label="Cancel"
            color="primary"
            flat
            class="q-mr-sm"
            @click="$emit('onDialog', false)"
          />
          <q-btn label="Submit" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  toRefs,
  reactive,
  computed,
  onMounted,
} from '@vue/composition-api';
import { date } from 'quasar';

export default defineComponent({
  props: {
    show: { type: Boolean, required: true },
  },
  setup(props, { emit, root: { $api } }) {
    const hide = () => emit('hide');

    const dialogModel = computed({
      get: () => props.show,
      set: (val) => {
        emit('onDialog', val);
      },
    });

    // Start fetch Country data

    // End fetch Country data

    // Start fetch Segment data

    // End fetch Segment data

    // TODO: Form still not working in react version
    // Place all form data here
    const data = reactive({
      isFetching: true,
      supplier: [],
      dataSelected: {},
    });

    onMounted(async () => {
      const [resSupplier] = await Promise.all([
        $api.inventory.FetchCommon('getSupplierList'),
      ]);

      data.supplier = resSupplier['supplyList']['supply-list'];
      data.isFetching = false;
    });

    const onRowClick = (_, dataRow) => {
      data.dataSelected = dataRow;
    };

    const tableHeaders = [
      {
        label: 'Company Name',
        field: 'firma',
        name: 'firma',
        align: 'left',
        sortable: false,
      },
      {
        label: 'Address',
        field: 'adresse1',
        name: 'adresse1',
        align: 'left',
        sortable: false,
      },
      {
        label: 'Phone 1',
        field: 'telefon',
        name: 'telefon',
        align: 'left',
        sortable: false,
      },
      {
        label: 'Phone 2',
        field: 'telefon',
        name: 'telefon',
        align: 'left',
        sortable: false,
      },
      {
        label: 'Telefax',
        field: 'fax',
        name: 'fax',
        align: 'left',
        sortable: false,
      },
      {
        label: 'City',
        field: 'wohnort',
        name: 'wohnort',
        align: 'left',
        sortable: false,
      },
      {
        label: 'Land',
        field: 'land',
        name: 'land',
        align: 'left',
        sortable: false,
      },
    ];

    function onSubmit() {
      emit('getSupplier', data.dataSelected);
      emit('onDialog', false);
    }

    return {
      ...toRefs(data),
      tableHeaders,
      hide,
      onRowClick,
      dialogModel,
      onSubmit,
      pagination: {
        rowsPerPage: 10,
      },
    };
  },
  components: {},
});
</script>
<style lang="scss" scoped>
.dialog {
  max-width: 900px !important;
  width: 100%;

  &__header {
    background: linear-gradient(#1488cc, #2b32b2);
    border-bottom: 1px solid #e8e8e8;
    color: #fff;
    padding: 16px 24px;
  }

  &__title {
    font-size: 16px;
  }

  &__form-top {
    margin-left: 164px;
  }

  &__footer {
    background: #fff;
    border-top: 1px solid #e8e8e8;
    border-radius: 0 0 4px 4px;
    padding: 10px 16px;
    text-align: right;
  }

  .q-tab-panel {
    padding: 0;
  }
}
</style>
