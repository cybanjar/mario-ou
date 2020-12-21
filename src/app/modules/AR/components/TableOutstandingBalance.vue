<template>
  <STable
    row-key="key"
    :loading="loading"
    :columns="columns"
    :data="data"
    :pagination="{ rowsPerPage: 10 }"
    :rows-per-page-options="[10]"
    :selected.sync="selected"
    selection="multiple"
    v-on="$listeners"
  >
    <template #body-cell-actions="props">
      <q-td :props="props" class="fixed-col right">
        <q-icon name="mdi-dots-vertical" size="16px">
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
      </q-td>
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
    return {
      columns,
      selected,
      onDelete,
      onEdit,
    };
  },
});
</script>
