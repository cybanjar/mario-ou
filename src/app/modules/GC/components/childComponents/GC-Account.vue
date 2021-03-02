<template>
  <q-dialog v-model="dialog.dialog">
    <q-card style="width: 650px; max-width: 90vw; height: 430px">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          G/L Sub Account
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section style="height: 325px" class="q-pt-none">
        <div style="margintop: 10px" class="row">
          <SInput
            :key="i.name"
            :label-text="i.name"
            v-for="i in use_input"
            v-model="i.value"
            :style="{ marginRight: i.right, width: i.width }"
            :mask="i.mask"
            @click="onClick(i.onClick)"
          />
          <q-btn
            color="primary"
            icon="mdi-magnify"
            style="height: 25px; margintop: -5px; width: 238px"
            label="Search"
            type="submit"
            class="q-mt-md"
            size="sm"
            @click="onSearchAccount"
          />
        </div>
        <STable
          style="margintop: 15px"
          :columns="table_account"
          :data="dialog.data"
          :rows-per-page-options="[0]"
          :hide-bottom="dialog.hide_bottom"
          class="table-accounting-date"
        >
          <template #header-cell-fibukonto="props">
            <q-th :props="props" class="fixed-col left">{{
              props.col.label
            }}</q-th>
          </template>

          <template #body-cell-fibukonto="props">
            <q-td :props="props" class="fixed-col left">{{
              props.row.fibukonto
            }}</q-td>
          </template>

          <template #header-cell-actions="props">
            <q-th style="z-index: 4" :props="props" class="fixed-col right">{{
              props.col.label
            }}</q-th>
          </template>

          <template #body="props">
            <q-tr
              :props="props"
              @click="onRowClick(props.row)"
              :class="{
                selected: props.row.selected,
              }"
            >
              <q-td
                :key="col.name"
                :props="props"
                v-for="col in props.cols.filter(
                  (i) => !['actions'].includes(i.name)
                )"
              >
                {{ col.value }}
              </q-td>
            </q-tr>
          </template>
        </STable>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn size="sm" outline label="cencel" color="primary" v-close-popup />
        <q-btn size="sm" label="OK" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { table_account } from '../../tables/CashAdvance.table';
import { input_account, use_inputchild } from '../../Input/cash_advance';
export default defineComponent({
  props: {
    dialog: {} as any,
  },
  setup(props, { emit }) {
    const state = reactive({
      use_input: input_account,
    });

    const onSearchAccount = () => {
      emit('onSearchAccount');
    };

    const onRowClick = (datarow) => {
      const x = props.dialog.data;
      for (const i of x) {
        i.selected = false;
      }
      datarow['selected'] = true;
      use_inputchild.Settlement[4].value = `${datarow.fibukonto} - ${datarow.bezeich}`;
    };

    const onClick = (val) => {
      if (val == '1') {
        input_account[1].value = '';
        input_account[2].value = '';
      } else if (val == '2') {
        input_account[0].value = '';
        input_account[3].value = '';
      } else {
        input_account[0].value = '';
        input_account[1].value = '';
      }
    };

    return {
      ...toRefs(state),
      table_account,
      onSearchAccount,
      onRowClick,
      onClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
::v-deep .table-accounting-date {
  max-height: 30vh;

  thead tr {
    th {
      position: sticky;
      z-index: 3;
    }

    &:first-child th {
      top: 0;
    }
  }
}
tr.selected td {
  background-color: #2d00e2 !important;
  color: #fff;
}
</style>
