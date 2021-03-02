<template>
  <q-dialog v-model="grid.active" persistent>
    <q-card style="min-width: 1100px; height: 550px">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Grid
        </q-toolbar-title>
      </q-toolbar>
      <q-card-section class="q-pt-none">
        <div class="column" style="margin: 20px">
          <div class="col">
            <div class="q-mb-md">
              <q-btn flat round class="q-mr-lg">
                <img
                  :src="require('~/app/icons/Icon-Add.svg')"
                  height="25"
                  @click="onAdd"
                />
              </q-btn>
              <q-btn flat round class="q-mr-lg">
                <q-icon name="mdi-check-circle" height="25" />
              </q-btn>
            </div>
          </div>
          <div class="col">
            <SearchGrid :searches="searches" />
          </div>
          <div class="col">
            <STable
              dense
              :columns="tableHeaders"
              :data="data"
              :rows-per-page-options="[0]"
              :hide-bottom="false"
              class="table-accounting-date"
              flat
              bordered
            >
            </STable>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn
          unelevated
          size="sm"
          v-close-popup
          color="primary"
          outline
          label="Cancel"
        />
        <q-btn
          unelevated
          size="sm"
          color="primary"
          label="OK"
          @click="onSave"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  toRefs,
  reactive,
  onMounted,
} from '@vue/composition-api';
import { tableHeaders } from '../tables/Grid.table';

export default defineComponent({
  props: {
    grid: {} as any,
  },
  setup(_, { emit }) {
    const state = reactive({
      data: [],
      searches: {
        active: false,
        roomtype: [
          { value: 'DLKN', label: 'DLKN' },
          { value: 'DLKS', label: 'DLKS' },
          { value: 'DLTN', label: 'DLTN' },
          { value: 'DLTS', label: 'DLTS' },
          { value: 'JRSK', label: 'JRSK' },
        ],
        arrangement: [
          { value: 'BCA', label: 'BCA' },
          { value: 'COM', label: 'COM' },
          { value: 'DBS', label: 'DBS' },
          { value: 'FB', label: 'FB' },
          { value: 'IMG', label: 'IMG' },
        ],
      },
    });

    const onSave = () => {
      emit('onSave', { ...state });
    };

    const onAdd = () => {
      state.searches.active = true;
    };


    return {
      ...toRefs(state),
      onSave,
      onAdd,
      tableHeaders,
    };
  },
  components: {
    SearchGrid: () => import('./SearchesGrid.vue'),
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
</style>
