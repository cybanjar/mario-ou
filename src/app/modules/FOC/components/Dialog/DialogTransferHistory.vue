<template>
  <q-dialog v-model="dialogTransferHistoryModel">
    <q-card style="max-width: 1000px;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Transfer History
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-12">
            <q-table
              dense
              :loading="isFetching"
              :columns="tableHeaders"
              :data="accounts"
              separator="cell"
              :rows-per-page-options="[10, 13, 16]"
              :pagination.sync="pagination"
            >
            </q-table>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="OK"
          @click="$emit('onDialogTransferHistory', false)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
} from '@vue/composition-api';

export default defineComponent({
  props: {
    dialog: { type: Boolean, required: true },
  },
  setup(props, { emit }) {
    const state = reactive({
      isFetching: false,
      pagination: {
        rowsPerPage: 10,
      },
      accounts: [
        {
          departmentNumber: '1101',
          articleNumber: '2003002990',
          description: 'American Resoles',
          amount: '12,000.000.00',
          roomNumber: '301',
          billNumber: '37163',
          systemDate: '14:47:22',
          time: '17/12/2019',
          createdID: '01020',
        },
        {
          departmentNumber: '1102',
          articleNumber: '2003002990',
          description: 'American Resoles',
          amount: '12,000.000.00',
          roomNumber: '301',
          billNumber: '37163',
          systemDate: '14:47:22',
          time: '17/12/2019',
          createdID: '01020',
        },
        {
          departmentNumber: '1103',
          articleNumber: '2003002990',
          description: 'American Resoles',
          amount: '12,000.000.00',
          roomNumber: '301',
          billNumber: '37163',
          systemDate: '14:47:22',
          time: '17/12/2019',
          createdID: '01020',
        },
        {
          departmentNumber: '1104',
          articleNumber: '2003002990',
          description: 'American Resoles',
          amount: '12,000.000.00',
          roomNumber: '301',
          billNumber: '37163',
          systemDate: '14:47:22',
          time: '17/12/2019',
          createdID: '01020',
        },
        {
          departmentNumber: '1105',
          articleNumber: '2003002990',
          description: 'American Resoles',
          amount: '12,000.000.00',
          roomNumber: '301',
          billNumber: '37163',
          systemDate: '14:47:22',
          time: '17/12/2019',
          createdID: '01020',
        },
        {
          departmentNumber: '1106',
          articleNumber: '2003002990',
          description: 'American Resoles',
          amount: '12,000.000.00',
          roomNumber: '301',
          billNumber: '37163',
          systemDate: '14:47:22',
          time: '17/12/2019',
          createdID: '01020',
        },
        {
          departmentNumber: '1107',
          articleNumber: '2003002990',
          description: 'American Resoles',
          amount: '12,000.000.00',
          roomNumber: '301',
          billNumber: '37163',
          systemDate: '14:47:22',
          time: '17/12/2019',
          createdID: '01020',
        },
        {
          departmentNumber: '1108',
          articleNumber: '2003002990',
          description: 'American Resoles',
          amount: '12,000.000.00',
          roomNumber: '301',
          billNumber: '37163',
          systemDate: '14:47:22',
          time: '17/12/2019',
          createdID: '01020',
        },
        {
          departmentNumber: '1109',
          articleNumber: '2003002990',
          description: 'American Resoles',
          amount: '12,000.000.00',
          roomNumber: '301',
          billNumber: '37163',
          systemDate: '14:47:22',
          time: '17/12/2019',
          createdID: '01020',
        },
        {
          departmentNumber: '1110',
          articleNumber: '2003002990',
          description: 'American Resoles',
          amount: '12,000.000.00',
          roomNumber: '301',
          billNumber: '37163',
          systemDate: '14:47:22',
          time: '17/12/2019',
          createdID: '01020',
        },
        {
          departmentNumber: '1111',
          articleNumber: '2003002990',
          description: 'American Resoles',
          amount: '12,000.000.00',
          roomNumber: '301',
          billNumber: '37163',
          systemDate: '14:47:22',
          time: '17/12/2019',
          createdID: '01020',
        },
      ],
    });

    const dialogTransferHistoryModel = computed({
      get: () => props.dialog,
      set: (val) => {
        emit('onDialogTransferHistory', val);
      },
    });

    const tableHeaders = [
      {
        label: 'Department Number',
        field: 'departmentNumber',
        name: 'departmentNumber',
        align: 'right',
        sortable: true,
      },
      {
        label: 'Article Number',
        field: 'articleNumber',
        name: 'articleNumber',
        align: 'left',
        sortable: true,
      },
      {
        label: 'Description',
        field: 'description',
        name: 'description',
        align: 'left',
        sortable: true,
      },
      {
        label: 'Amount',
        field: 'amount',
        name: 'amount',
        align: 'right',
        sortable: true,
      },
      {
        label: 'Room Number',
        field: 'roomNumber',
        name: 'roomNumber',
        align: 'left',
        sortable: true,
      },
      {
        label: 'Bill Number',
        field: 'billNumber',
        name: 'billNumber',
        align: 'left',
        sortable: true,
      },
      {
        label: 'System Date',
        field: 'systemDate',
        name: 'systemDate',
        align: 'left',
        sortable: true,
      },
      {
        label: 'Time',
        field: 'time',
        name: 'time',
        align: 'left',
        sortable: true,
      },
      {
        label: 'Created ID',
        field: 'createdID',
        name: 'createdID',
        align: 'left',
        sortable: true,
      },
    ];

    return {
      tableHeaders,
      dialogTransferHistoryModel,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
</style>
