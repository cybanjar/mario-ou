<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:600px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <!-- <div class="row">
            <div class="col">
                <q-card-section>
                <STable
                    class=""
                    grid
                    hide-header
                    hide-bottom
                    :loading="isLoading"
                    :columns="tableHeadersPrint"
                    :data="data.dataTablePrint"
                    row-key="name"
                    separator="cell"
                    :rows-per-page-options="[0]"
                    :pagination.sync="pagination">
                    <template v-slot:loading>
                        <q-inner-loading showing color="primary" />
                    </template>

                    <template v-slot:item="props">
                        <div class="q-pa-xs col-sm-3 col-md-4">
                        <q-card flat bordered :class="props.row['selected'] ? 'bg-cyan text-center text-white' : 'bg-white text-center text-black'">
                            <q-card-section @click="onRowClickTablePrint(props.row)" >
                                <strong>{{ props.row.name }}</strong>
                            </q-card-section>
                        </q-card>
                        </div>
                    </template>
                    </STable>

                    <div class="row">
                        <div class="col-3">
                            <SInput outlined value="52" class="q-mx-xs q-mt-md" label-text="Outlet Number" :disable="true" readonly/>
                        </div>
                        <div class="col-7">
                            <SInput outlined value="Ahmad" class="q-mx-xs q-mt-md" label-text="Name" :disable="true" readonly/>
                        </div>
                    </div>
                </q-card-section>
            </div>            
        </div>         -->

        <q-card-section>
            <div class="row">
                <div class="col-3">
                    <SInput outlined value="1" class="q-mx-xs q-mt-sm" label-text="Outlet Number" :disable="true" readonly/>
                </div>
                <div class="col-9">
                    <SInput outlined value="Ahmad" class="q-mx-xs q-mt-sm" label-text="Name" :disable="true" readonly/>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-3 col-sm-4">
                    <q-card flat bordered>
                        <q-card-section class="" >
                            <strong>Harris Cafee</strong>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn outline color="primary" label="Cancel" @click="onCancelDialog"  />
          <q-btn unelevated color="primary" label="OK" @click="onOkDialogSelectUser"/>
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
    showDialogChangeOutlet: { type: Boolean, required: true },
    dataSelectedChangeOutlet: { type: Object, required: true },
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
      () => props.showDialogChangeOutlet, (showDialogCashierTransfer) => {
        if (props.showDialogChangeOutlet) {
          state.data.buttonOkEnable = false;
          state.title = 'Change Outlet';

          console.log("Selected Data : ", props.dataSelectedChangeOutlet);
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showDialogChangeOutlet,
        set: (val) => {
            emit('onDialogChangeOutlet', val, '');
        },
    });

    const tableHeadersPrint = [
      {
            label: "Name", 
            field: "name",
            name: "name",
            align: "center",
        }, 
        // {
        //     label: "id", 
        //     field: "id",
        //     name: "id",
        //     align: "center",
        // },
    ];

    // -- 
    const onOkDialogSelectUser = () => {
        emit('onDialogChangeOutlet', false, 'ok');
    }

    const onCancelDialog = () => {
      // for(let i = 0; i<state.data.dataTablePrint.length; i++) {
      //   const datarow = state.data.dataTablePrint[i];
      //   datarow['selected'] = false;
      // }

      // for (let i = 0; i<state.data.dataTablePayment.length; i++) {
      //   const datarow = state.data.dataTablePayment[i];
      //   datarow['selected'] = false;
      // }  

      // state.data.buttonOkEnable = false;
      emit('onDialogChangeOutlet', false, '');
    }

    return {
      dialogModel,
      ...toRefs(state),
      tableHeadersPrint,
      onOkDialogSelectUser,
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

