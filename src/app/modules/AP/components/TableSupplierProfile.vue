<template>
  <div>
    <STable
      row-key="lief-nr"
      :loading="isFetching"
      :columns="supplierListColumns"
      :data="supplierList"
      :virtual-scroll="true"
      :pagination="{ rowsPerPage: 0 }"
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="28"
      :class="supplierList.length > 0 && 'supplier-list-table'"
      class="virtual-scroll-sticky-header"
      :selected.sync="selected"
      @row-click="onRowClick"
    >
      <template #header-cell-firma="props">
        <q-th :props="props" class="fixed-col left">
          {{ props.col.label }}</q-th
        >
      </template>

      <template #body-cell-firma="props">
        <q-td :props="props" class="fixed-col left">
          {{ props.row.firma }}
        </q-td>
      </template>

      <template #body-cell-phone-1="props">
        <q-td
          :props="props"
          :set="(phone1 = props.row.telefon.substring(0, 22))"
        >
          <div class="ellipsis phone-column">{{ phone1 }}</div>
          <q-tooltip
            anchor="top middle"
            self="center middle"
            v-if="phone1.trim().length > 0"
            >{{ phone1 }}</q-tooltip
          >
        </q-td>
      </template>

      <template #body-cell-phone-2="props">
        <q-td
          :props="props"
          :set="(phone2 = props.row.telefon.substring(23, 75))"
        >
          <div class="ellipsis phone-column">{{ phone2 }}</div>
          <q-tooltip
            anchor="top middle"
            self="center middle"
            v-if="phone2.trim().length > 0"
            >{{ phone2 }}</q-tooltip
          >
        </q-td>
      </template>

      <template #body-cell-address="props">
        <q-td
          :props="props"
          :set="(address = `${props.row.adresse1} ${props.row.adresse2} ${props.row.adresse3}`)"
        >
          <div class="ellipsis address-column">{{ address }}</div>
          <q-tooltip
            anchor="top middle"
            self="center middle"
            v-if="address.trim().length > 0"
            >{{ address }}</q-tooltip
          >
        </q-td>
      </template>

      <template #header-cell-actions="props">
        <q-th :props="props" class="fixed-col right">
          {{ props.col.label }}
        </q-th>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props" class="fixed-col right">
          <q-icon name="mdi-dots-vertical" size="16px">
            <q-menu auto-close anchor="bottom right" self="top right">
              <q-list>
                <q-item
                  clickable
                  v-ripple
                  @click="$router.push('/ap/purchase-order')"
                >
                  <q-item-section>Purchase Order</q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section>Edit</q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section>Delete</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  @click="showDialogTurnover(props.row['lief-nr'])"
                >
                  <q-item-section>Turnover</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-icon>
        </q-td>
      </template>
    </STable>

    <DialogSupplierTurnover
      :show="dialogTurnover.visible"
      :lief-nr="dialogTurnover.liefNr"
      @hide="hideDialogTurnover"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from '@vue/composition-api';
import { supplierListColumns } from '../tables/supplier-list.table';
import { ResSupplierList } from '../models/supplier-profile.model';

export default defineComponent({
  props: {
    isFetching: { type: Boolean, required: true },
    supplierList: { type: Array, required: true },
  },
  setup(_, { emit }) {
    const selected = ref<ResSupplierList[]>([]);

    function onRowClick(_, row: ResSupplierList) {
      selected.value = [row];
      emit('onRowClick', row.notizen[0]);
    }

    // Start dialog supplier turnover setup
    const dialogTurnover = reactive({
      visible: false,
      liefNr: null as number | null,
    });
    function showDialogTurnover(liefNr: number) {
      dialogTurnover.liefNr = liefNr;
      dialogTurnover.visible = true;
    }
    function hideDialogTurnover() {
      dialogTurnover.liefNr = null;
      dialogTurnover.visible = false;
    }
    // End dialog supplier turnover setup

    return {
      supplierListColumns,
      onRowClick,
      selected,
      dialogTurnover,
      showDialogTurnover,
      hideDialogTurnover,
    };
  },
  components: {
    DialogSupplierTurnover: () => import('./DialogSupplierTurnover.vue'),
  },
});
</script>

<style lang="scss" scoped>
.supplier-list-table {
  height: 80vh;

  .phone-column {
    width: 150px;
  }

  .address-column {
    width: 350px;
  }
}
</style>
