<template>
  <STable
    v-bind="$attrs"
    row-key="key"
    :columns="columns"
    v-on="$listeners"
    virtual-scroll
    :pagination.sync="pagination"
    :rows-per-page-options="[0]"
    fixed-header
  >
    <template v-slot:header="props">
      <q-tr :props="props" v-for="(space, index) in shape" :key="index">
        <q-th
          v-for="col in space"
          :key="col.name"
          :rowspan="col.height"
          :colspan="col.width"
          :props="getProp(props.cols, col.name, props)"
        >
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template #body-cell-actions="props">
      <q-td :props="props" class="fixed-col right">
        <q-icon name="mdi-dots-vertical" size="16px">
          <q-menu auto-close anchor="bottom right" self="top right">
            <q-list>
              <q-item clickable @click="emitDelete(props.row)" v-ripple>
                <q-item-section>Delete</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-icon>
      </q-td>
    </template>
  </STable>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  inheritAttrs: true,
  props: {
    columns: { type: Array, required: false, default: [] },
    shape: { type: Array, required: false, default: [] },
  },
  setup(prop, { emit }) {
    const pagination = ref();
    function emitDelete(data) {
      emit('delete', data);
    }

    function getProp(params: any[], as, asa) {
      const hasField = params.findIndex((a) => a.name === as);
      return !!~hasField ? asa : undefined;
    }

    function findHeader(params: any, col: any[], selector: string) {
      const item = col.find((s) => s.name === params);

      return item !== undefined
        ? item[selector]
          ? item[selector]
          : undefined
        : params;
    }
    return {
      emitDelete,
      findHeader,
      pagination,
      getProp,
    };
  },
});
</script>
