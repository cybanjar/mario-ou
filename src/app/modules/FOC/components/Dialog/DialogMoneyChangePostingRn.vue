<template>
  <q-dialog v-model="getDialogMoneyChangePostingRn">
    <q-card class="dialog-card">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Select Room Number of in-house Guests
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-3 q-px-md">
            <SInput label-text="Room Number" v-model="roomNumber">
              <template v-slot:append>
                <div class="btn-input-search">
                  <q-icon
                    name="mdi-magnify"
                    class="cursor-pointer"
                    color="white"
                    size="16px"
                    @click="onSearchRoomNumber('roomNumber')"
                  />
                </div>
              </template>
            </SInput>
          </div>
          <div id="tableLayoutId" class="col-12 q-px-md q-mt-lg">
            <STable
              :loading="isFetching"
              :columns="ResTableHeaders"
              :data="getSelectPGuest"
              row-key="indexFoc"
              :noPagination="true"
              :selected.sync="onSelectTable"
              :class="getSelectPGuest.length > 0 && 'selected-table'"
              @row-click="onClickTable"
            >
              <template #header-cell-zinr="props">
                <q-th :props="props" class="fixed-col left">
                  {{ props.col.label }}
                </q-th>
              </template>

              <template #body-cell-zinr="props">
                <q-td :props="props" class="fixed-col left">
                  {{ props.row.zinr }}
                </q-td>
              </template>
            </STable>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          color="white"
          text-color="black"
          label="Cancel"
          @click="onClickCancel"
        />
        <q-btn color="primary" label="Select" @click="onClickOk" />
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
  ref,
} from '@vue/composition-api';
import { store } from '~/store';
import { ResTableHeaders } from '~/app/modules/FOC/tables/quickPostingToGuestFolioRn.table';
import { ResTableLists } from '~/app/modules/FOC/models/qucikPostingToGuestFolioRn.model';

export default defineComponent({
  setup(props, { root: { $api } }) {
    const state = reactive({
      isFetching: false,
      roomNumber: '',
      selectedPGuest: {},
    });

    const getDialogMoneyChangePostingRn = computed(() => {
      return store.getters.focGuestFolio.GET_DIALOG_MONEY_CHANGE_POSTING_RN;
    });

    const getSelectPGuest = computed(() => {
      let res: any = store.getters.focGuestFolio.GET_SELECT_P_GUEST;
      if (res.b1List) {
        res.b1List['b1-list'].map((item, index) => {
          item.indexFoc = index;
        });
      }
      return res.b1List?.['b1-list'] || [];
    });

    const onSelectTable = ref<ResTableLists[]>([]);
    const onClickTable = (_, row: ResTableLists) => {
      onSelectTable.value = [row];
      state.selectedPGuest = [row][0];
    };

    const onClickCancel = async () => {
      store.commit.focGuestFolio.SET_DIALOG_MONEY_CHANGE_POSTING_RN(false);
    };

    const onClickOk = async () => {
      store.commit.focGuestFolio.SET_SELECTED_P_GUEST(state.selectedPGuest);
      store.commit.focGuestFolio.SET_DIALOG_MONEY_CHANGE_POSTING_RN(false);
    };

    return {
      ResTableHeaders,
      getDialogMoneyChangePostingRn,
      getSelectPGuest,
      onSelectTable,
      onClickTable,
      onClickCancel,
      onClickOk,

      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog-card {
  max-width: 1000px;
  width: 1000px;
}

.q-toolbar {
  background: $primary-grad;
}

#tableLayoutId {
  .selected-table {
    tbody tr.selected td {
      background: #1485cb !important;
      color: #fff;
    }
  }
  max-height: 450px !important;
  overflow: scroll;
}
</style>
