<template>
  <STable
    row-key="key"
    :loading="loading"
    :columns="journalizingColumns"
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
                <q-item-section avatar>
                  <q-icon
                    class="inline"
                    name="mdi-account-outline"
                    color="gray"
                  />
                </q-item-section>

                <q-item-section @click="onView(props.row)">
                  View Bill</q-item-section
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
import { defineComponent, ref, watch } from '@vue/composition-api';
import { journalizingColumns } from '../tables/journalizing.table';

export default defineComponent({
  props: {
    loading: { type: Boolean, required: true },
    data: { type: Array, required: true },
  },
  setup(props) {
    const selected = ref<[]>([]);

    watch(
      () => props.loading,
      (value) => {
        if (value === true) {
          selected.value = [];
        }
      }
    );

    function onView() {
      console.log('view bill');
    }

    return {
      journalizingColumns,
      selected,
      onView,
    };
  },
});
</script>
