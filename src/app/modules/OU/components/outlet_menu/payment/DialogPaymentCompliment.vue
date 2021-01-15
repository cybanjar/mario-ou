<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:500px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <q-card-section>
          <div class="q-ma-sm row q-gutter-xs">
              <div class="col">
              </div>

              <div class="col">
                <SInput outlined  label-text="Balance" :disable="true" readonly/>
              </div>
          </div>

          <div class="q-ma-sm row q-gutter-xs">
              <div class="col">
              </div>

              <div class="col">
                <SInput class="q-mr-md" outlined  label-text="Voucher Number"/>
              </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-none">
          <div>
            <div class="full-width bg-grey-3">
              <p class="q-pa-md"><strong> Pay </strong></p>
            </div>

            <STable
              grid
              hide-header
              hide-bottom
              :loading="isLoading"
              :columns="tableHeaders"
              :data="data.dataDetail"
              row-key="name"
              separator="cell"
              :rows-per-page-options="[0]"
              :pagination.sync="pagination">
              <template v-slot:loading>
                <q-inner-loading showing color="primary" />
              </template>

              <template v-slot:item="props">
                <div class="q-pa-xs col-xl-3 col-sm-3 col-md-3">
                  <q-card>
                    <q-card-section @click="onRowClickTable(props.row)" :class="props.row['selected'] ? 'bg-cyan text-center text-white' : 'bg-white text-center text-black'">
                        <strong>{{ props.row.name }}</strong>
                    </q-card-section>
                  </q-card>
                </div>
              </template>
            </STable>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn color="primary" class="q-mr-sm" label="Cancel" @click="onCancelDialog"  />
          <q-btn color="primary" label="OK" @click="onOkDialogSelectUser"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script lang="ts">
import {defineComponent, computed, watch, reactive, toRefs,} from '@vue/composition-api';
import { Notify } from 'quasar';

interface State {
  isLoading: boolean;
  data: {
    dataDetail: [];
    buttonOkEnable: boolean;
  }
  title: string;
}

export default defineComponent({
  props: {
    showPaymentCompliment: { type: Boolean, required: true },
    selectedPayment: { type: Object, required: true },
    selectedPrint: { type: Object, required: true }, 
    // dataSelectedOrderTaker: {type: null, required: true},
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      data: {
        dataDetail: [],
        buttonOkEnable: false,
      },
      title: '',
    });

    watch(
      () => props.showPaymentCompliment, (showPaymentCompliment) => {
        if (props.showPaymentCompliment) {
          state.data.buttonOkEnable = false;
          state.title = 'Compliment';

          console.log("selectedPrint", props.selectedPrint);
          console.log("selectedPayment", props.selectedPayment);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showPaymentCompliment,
        set: (val) => {
            emit('onDialogPaymentCompliment', val, null);
        },
    });

    const onRowClickTable = (dataRow) => {
      
    }

    const tableHeaders = [
      {
            label: "name", 
            field: "name",
            name: "name",
            align: "center",
        }, {
            label: "id", 
            field: "id",
            name: "id",
            align: "center",
        },
    ];

    // -- 
    const onOkDialog = () => {
    }

    const onCancelDialog = () => {
      emit('onDialogPaymentCompliment', false);
    }

    return {
      dialogModel,
      ...toRefs(state),
      tableHeaders,
      onRowClickTable,
      onOkDialog,
      onCancelDialog,
      pagination: { rowsPerPage: 0 },
    };
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}

.total-budget {
  border-radius: 4px;
  border: 1px solid $primary;

  span {
    display: inline-block;
    padding: 4px 11px;

    &:first-child {
      border-right: 1px solid $primary;
    }

    &:last-child {
      flex: 1;
      text-align: right;
    }
  }
}
</style>

