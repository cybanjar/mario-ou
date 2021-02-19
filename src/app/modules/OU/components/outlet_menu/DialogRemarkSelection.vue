<template>
    <q-dialog v-model="dialogModel">
        <q-card style="max-width: 700px;">
            <q-toolbar>
                <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
            </q-toolbar>

            <div>
                <STable
                    grid                                                            
                    hide-header
                    :loading="isFetching"
                    :data="dataTable"
                    :columns="tableHeaders"
                    hide-bottom
                    separator="cell"
                    :rows-per-page-options="[0]"
                    :pagination.sync="pagination" >
                    <template v-slot:item="props">
                        <div class="q-pa-xs q-ml-md" style="min-width: 200px">
                            <q-card flat bordered >
                                <q-card-section @click="onClickTable(props.row)" :class="props.row.selected == false ? 'bg-white text-center text-black' : 'bg-cyan text-center text-white'">
                                    <strong>{{ props.row.bezeich }}</strong>
                                </q-card-section>
                            </q-card>
                        </div>
                    </template>
                </STable>
            </div>

            <q-separator />

            <q-card-actions align="right">
                <q-btn color="primary" label="Cancel" @click="onClickCancel()"/>
                <q-btn color="primary" label="Ok" @click="onClickSave()"/>
            </q-card-actions>
        </q-card>

        <q-dialog v-model="dialogCustomRemark">
            <q-card class="q-pa-md" style="max-width: 400px;">
                <SInput outlined label-text="Custom Remark" v-model="customRemark" data-layout="compact" ref="customRemarkBox" @focus="showKeyboard"/>
                <vue-touch-keyboard
                    id="keyboardRemark"
                    :options="options"
                    v-if="keyboardVisible" 
                    layout="compact"
                    :input="input" />

                <q-separator />

                <q-card-actions align="right">
                    <q-btn unelevated outline color="primary" label="Cancel" @click="dialogCustomRemark = false"/>
                    <q-btn unelevated color="primary" label="Ok" @click="dialogABC(false)"/>
                </q-card-actions>
            </q-card>
        </q-dialog>


    </q-dialog>
</template>

<script>
import { defineComponent, onMounted, toRefs, watch, computed, reactive, } from '@vue/composition-api';
import { Notify} from 'quasar';
import Vue from 'vue';

// import style from 'vue-touch-keyboard/dist/vue-touch-keyboard.css';
// import VueTouchKeyboard from "vue-touch-keyboard";

// Vue.use(VueTouchKeyboard);
// Vue.use(style);
// Vue.component('vue-touch-keyboard', VueTouchKeyboard.components);

export default defineComponent({
    props: {
        dialogRemarkSelection: { type: Boolean, required: true },
        dialogRemarkSelectedData: {type: null, required: true},
    },
    setup(props, { emit, root: { $api, $root } }) {

    const state = reactive({
      isFetching: true,
      dataPrepare: {},
      title: "Remark Selection",
      dataTable: [{
            "id": "0",
            "bezeich": "ABC",
            "selected": false
        }, {
            "id": "1",
            "bezeich": "More Salt",
            "selected": false
        }, {
            "id": "2",
            "bezeich": "More Sugar",
            "selected": false
        }, {
            "id": "3",
            "bezeich": "More Pepper",
            "selected": false
        }, {
            "id": "4",
            "bezeich": "Cold",
            "selected": false
        }, {
            "id": "5",
            "bezeich": "Hot",
            "selected": false
        }, {
            "id": "6",
            "bezeich": "More Chilli",
            "selected": false
        }, {
            "id": "7",
            "bezeich": "Small",
            "selected": false
        }, {
            "id": "8",
            "bezeich": "Big",
            "selected": false
        }],
      dataTableSelected: [],
      customRemark: "",
      dialogCustomRemark: false,
      input: null,
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      keyboardVisible: false,
    });

    const tableHeaders = [
      {
        label: 'id',
        field: 'id',
        sortable: false,
        align: 'center',
        width: 120,
        divider: true,
      },
      {
        label: 'bezeich',
        field: 'bezeich',
        sortable: false,
        align: 'center',
        width: 200,
        divider: true,
      },
    ];

     watch(
      () => props.dialogRemarkSelection, (dialogRemarkSelection) => {
        if (props.dialogRemarkSelection) {            
            state.dataTableSelected = props.dialogRemarkSelectedData;

            let flagCustomRemarkFound = false;

            for (let i = 0; i<state.dataTable.length; i++) {
                const dataRowTable = state.dataTable[i];

                for (let x = 0; x<state.dataTableSelected.length; x++) {
                    const dataRowSelected = state.dataTableSelected[x];

                    if (dataRowSelected['id'] == dataRowTable['id'] && dataRowSelected['selected']) {
                        state.dataTable[i]['selected'] = dataRowSelected['selected'];
                    }

                    if (dataRowTable['id'] == 0 && flagCustomRemarkFound == false) {
                        state.dataTable[i]['bezeich'] = dataRowSelected['bezeich'];
                        state.customRemark = dataRowSelected['bezeich'];
                        flagCustomRemarkFound = true;
                    }
                }
            }
            state.isFetching = false;
        }
      }
    );

    const dialogModel = computed({
        get: () => props.dialogRemarkSelection,
        set: (val) => {
            emit('onDialogRemarkSelection', val, null);
        },
    });

    const onClickTable = (data) => {
        const selectedOnData = data['selected'];

        for (let i = 0; i<state.dataTable.length; i++) {
            const datarow = state.dataTable[i];
            if (datarow['id'] == 0 && datarow['id'] == data['id'] && selectedOnData == datarow['selected']) {
                dialogABC(true);
                break;
            } else {
                if (datarow['id'] == data['id'] && selectedOnData == datarow['selected']) {
                    state.dataTable[i]['selected'] = !datarow['selected'];
                    break;
                }
            }
        }
    }

    const onClickSave = () => {
        state.dataTableSelected = [];

        for (let i = 0; i<state.dataTable.length; i++) {
            if (state.dataTable[i]['selected'] == true) {
                state.dataTableSelected.push(state.dataTable[i]);
            }
        }
        emit('onDialogRemarkSelection', false, state.dataTableSelected);
    }

    const onClickCancel = () => {
        state.dataTableSelected = [];

        for (let i = 0; i<state.dataTable.length; i++) {
            state.dataTable[i]['selected'] = false;
        }

        emit('onDialogRemarkSelection', false, null);
    }

    const dialogABC = (val) => {
        // console.log("customRemark : ", state.customRemark);
        state.dialogCustomRemark = val;

        if (!val) {
            if (state.customRemark.trim() != "") {
                for (let i = 0; i<state.dataTable.length; i++) {
                    const datarow = state.dataTable[i];

                    if (datarow['id'] == 0) {
                        state.dataTable[i]['bezeich'] = state.customRemark;   
                        state.dataTable[i]['selected'] = true;
                        break;
                    } 
                }
            } else {
                state.dataTable[0]['bezeich'] = "ABC";   
                state.dataTable[0]['selected'] = false;
            }
        }
    }

    const showKeyboard = (e) => {
      if (e.target.localName == "input") {
        state.input = e.target; 
      } 
      if (!state.keyboardVisible) {
        state.keyboardVisible = true;
      } 
    }

    return {
      ...toRefs(state),
      dialogModel,
      tableHeaders,
      onClickTable,
      onClickSave,
      onClickCancel,
      dialogABC,
      pagination: {
        rowsPerPage: 0,
      },
      showKeyboard
    };
  },

})
</script>

<style lang="scss">
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

#keyboardRemark {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;

	z-index: 1000;
	width: 100%;
	max-width: 1000px;
	margin: 0 auto;

	padding: 1em;

	background-color: #EEE;
	box-shadow: 0px -3px 10px rgba(black, 0.3);

	border-radius: 10px;
}
</style>