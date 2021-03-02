<template>
  <STable
    row-key="key"
    table-class="fixed-width-table"
    :loading="loading"
    :columns="columns"
    :data="data"
    :pagination.sync="pagination"
    :rows-per-page-options="[0]"
    v-on="$listeners"
    fixed-header
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          :class="{
            'fixed-col right': col.name === 'actions',
          }"
        >
          <q-icon
            v-if="col.name === 'actions'"
            name="mdi-dots-vertical"
            size="16px"
          >
            <q-menu auto-close anchor="bottom right" self="top right">
              <q-list>
                <q-item clickable v-ripple>
                  <q-item-section @click="onEdit(props.row)"
                    >Edit Info</q-item-section
                  >
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section @click="onDelete(props.row)"
                    >Delete</q-item-section
                  >
                </q-item>
              </q-list>
            </q-menu>
          </q-icon>
          <STooltip :key="col.name" v-else :value="col.value" />
        </q-td>
      </q-tr>
    </template>
  </STable>
</template>
<script lang="ts">
import { defineComponent, ref, watch, computed } from '@vue/composition-api';
import { getOutstandDebtColumns } from '../tables/outstading-debits.table';
import DialogConfirm from './DialogConfirm.vue';
import DialogPromp from './DialogPromp.vue';

export default defineComponent({
  props: {
    loading: { type: Boolean, required: true },
    data: { type: Array, required: true },
    isManualInvChecked: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, { emit, parent: { $q, $parent } }) {
    const selected = ref<[]>([]);
    const pagination = ref({
      rowsPerPage: 0,
    });
    const columns = computed(() =>
      getOutstandDebtColumns(props.isManualInvChecked)
    );

    function onDelete(key) {
      // TODO: red color
      $q.dialog({
        title: 'Are you sure to delete?',
        component: DialogConfirm,
        parent: $parent,
      }).onOk(() => emit('action:delete', key));
    }

    watch(
      () => props.loading,
      (value) => {
        if (value === true) {
          selected.value = [];
        }
      }
    );

    function onEdit(key) {
      $q.dialog({
        title: 'Edit Info',
        component: DialogPromp,
        parent: $parent,
        prompt: {
          model: '',
          type: 'text',
        },
      }).onOk((data) =>
        emit('action:edit', {
          tbRecid: key.arRecid,
          remarks: data,
        })
      );
    }

    function addHover(n: any) {
      console.log(n);
      return n;
    }
    return {
      columns,
      selected,
      onDelete,
      pagination,
      onEdit,
      addHover,
    };
  },
});
</script>
<style>
.fixed-width-table .q-table {
  table-layout: fixed;
}
</style>
