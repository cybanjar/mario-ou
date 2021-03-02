<template>
  <q-dialog v-model="modal.active" persistent>
    <q-card style="min-width: 1100px; height: 550px">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Deposit Admin
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
            </div>
          </div>
          <div class="col">
            <SearchDeposit :searches="searches" />
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
import { tableHeaders } from '../tables/Deposit.table';

export default defineComponent({
  props: {
    modal: {} as any,
  },
  setup(_, { emit }) {
    const state = reactive({
      data: [],
      searches: {
        active: false,
        edit: false,
        article: [
          { value: '1', label: 'BCA' },
          { value: '2', label: 'MANDIRI' },
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
      onAdd,
      onSave,
      tableHeaders,
    };
  },
  components: {
    SearchDeposit: () => import('./SearchDeposit.vue'),
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
</style>
