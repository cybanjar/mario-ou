<template>
  <q-dialog v-model="dialogMasterFolioMember">
    <q-card style="max-width: 1000px;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Master Folio Member - {{ masterFolioMember.billRechnr }}
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-3 q-pr-md">
            <div>
              <SInput
                label-text="Total Room"
                v-model="masterFolioMember.totRoom"
                readonly
              />
              <SInput
                label-text="Total Audit"
                v-model="masterFolioMember.totAdult"
                readonly
              />
            </div>
          </div>
          <div class="col-9">
            <STable
              :loading="table.isFetching"
              :columns="tableHeaders"
              :data="table.data"
              :rows-per-page-options="[10, 13, 16]"
              :pagination.sync="table.pagination"
            >
            </STable>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="OK"
          @click="$emit('onDialogMasterFolioMember', false)"
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
  onMounted,
  watch,
} from '@vue/composition-api';
import { tableHeaders } from '../../tables/masterFolioMember.table';

export default defineComponent({
  props: {
    dialog: { type: Boolean, required: true },
    masterFolioMember: { type: Object },
  },
  setup(props, { emit }) {
    const state = reactive({
      table: {
        data: [],
        isFetching: true,
        pagination: {
          rowsPerPage: 10,
        },
      },
    });

    onMounted(async () => {
      state.table.isFetching = false;
    });

    watch(
      () => props.masterFolioMember,
      async (items: any) => {
        items['b1List']['b1-list'].length > 0
          ? (state.table.data = items['b1List']['b1-list'])
          : [];
      }
    );

    const dialogMasterFolioMember = computed({
      get: () => props.dialog,
      set: (val) => {
        emit('onDialogPrintCallCharge', val);
      },
    });

    return {
      tableHeaders,
      dialogMasterFolioMember,
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
