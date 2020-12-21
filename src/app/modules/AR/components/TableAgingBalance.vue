<template>
  <STable
    row-key="key"
    v-bind="$attrs"
    v-on="$listeners"
    :columns="columns"
    :pagination="{ rowsPerPage: 10 }"
    :rows-per-page-options="[10]"
  >
    <template #body-cell-actions="props">
      <q-td :props="props" class="fixed-col right">
        <q-icon name="mdi-dots-vertical" size="16px">
          <q-menu auto-close anchor="bottom right" self="top right">
            <q-list v-if="showDetail">
              <q-item clickable v-ripple @click="showReserv(props.row)">
                <q-item-section avatar>
                  <q-icon class="inline" name="mdi-page-next" color="gray" />
                </q-item-section>

                <q-item-section> View Reservation</q-item-section>
              </q-item>
            </q-list>
            <q-list v-else>
              <q-item clickable v-ripple @click="showCusAgings(props.row)">
                <q-item-section avatar>
                  <q-icon
                    class="inline"
                    name="mdi-account-arrow-left"
                    color="gray"
                  />
                </q-item-section>

                <q-item-section> Customer Aging List</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-icon>
      </q-td>
    </template>
  </STable>
</template>
<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import { mainColumns } from '../tables/aging-balance.table';
import { AgingBalance } from '../models/aging-balance';

export default defineComponent({
  inheritAttrs: true,
  props: {
    showDetail: { type: Boolean, required: false, default: false },
    withBalance: { type: Boolean, required: false, default: false },
    displayMain: { type: Boolean, required: false, default: true },
  },
  setup(props, { emit }) {
    const columns = computed(() =>
      mainColumns(0, props.withBalance, props.showDetail, props.displayMain)
    );

    function showReserv(params: AgingBalance) {
      emit('showReserv', { billNo: params.billNumber });
    }

    function showCusAgings(params: AgingBalance) {
      emit('showCustomer', {
        user: params.articleNumber,
        guest: params.guestNumber,
      });
    }

    return { columns, showCusAgings, showReserv };
  },
});
</script>
