<template>
    <q-dialog v-model="dataWakeupcall.dialogWakeupcall" persistent>
        <q-card style="width: 455px; height: 700px;  max-width: 90vw;">
            <q-toolbar>
                <q-toolbar-title class="text-white text-weight-medium">WAKE UP CALL </q-toolbar-title>
            </q-toolbar>
            <q-card-section style="height: 530px">
                <div class='row'>
                    <SSelect :options="mode" v-model="dataMode" style="width: 250px; marginRight: 20px; marginTop: -5px" label-text="Mode"/>
                    <SInput 
                    label-text="Time" 
                    style="width: 130px; height: 30px; marginTop: -5px" 
                    filled
                    type="time"
                    v-model="timeWithSeconds" 
                    />
                    <SInput 
                    @blur="onClickGroupName"
                    v-model="groupName" 
                    style="width: 250px; marginRight: 20px; marginTop: -5px" 
                    label-text="Group Name"
                    :disable="disableGroupName"/>
                    <q-checkbox 
                    size="xs" 
                    v-on:click.native="methodCheckbox"
                    v-model="shape" 
                    label="Group Wake Up Call" 
                    style="marginLeft: -10px"/>
                    <SInput 
                    @blur="onClickRoomNumber"  
                    v-model="roomNumber" 
                    :disable="roomnumberDisable"
                    style="width: 130px; marginRight: 20px; marginTop: -5px" 
                    label-text="Room Number"/>
                    <SInput 
                    v-model="dataWakeupcall.prepareData.name" 
                    disable 
                    style="width: 250px; marginTop: -5px" 
                    label-text="Guest Name"/>
                    <SInput 
                    v-model="dataWakeupcall.prepareData.ankunft" 
                    disable 
                    style="width: 130px; marginRight: 20px; marginTop: -5px" 
                    label-text="Arrival">
                        <span class="mdi mdi-calendar"></span>
                    </SInput>
                    <SInput 
                    v-model="dataWakeupcall.prepareData.abreise" 
                    disable style="width: 130px; marginRight: 20px; marginTop: -5px" 
                    label-text="Depature">
                        <span class="mdi mdi-calendar"></span>
                    </SInput>
                    <q-btn
                        block
                        size= "sm"
                        color="primary"
                        max-height="5"
                        style="height: 25px; width: 100px; marginTop: 20px"
                        label="Cek Status"
                        type="submit"
                        class="q-mt-md"
                        @click="cekStatus"
                    />
                </div>
                <STable 
                :columns="tableWakeupcall" 
                :pagination.sync="pagination"
                class="table-accounting-date"
                row-key="name"
                :hide-bottom="dataWakeupcall.hide_bottom"
                :data="dataWakeupcall.data">
                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td
                        v-for="col in props.cols.filter(
                            col => !['hour', 'ack', 'result'].includes(col.name)
                        )"
                        :key="col.name" 
                        :props="props"
                        >{{col.value}}</q-td>
                        <q-td @click="onColClick(props.row)" :props="props" key="hour">
                            <q-tr v-if="timeFalidasi !== props.row.zinr">{{props.row.aenderung}}</q-tr>
                            <q-input @blur="blurTime" v-else v-model="inputTime" borderless  dense/>
                        </q-td>
                        <q-td :props="props" key="ack">
                            <q-checkbox v-if="boxFalidasi" size="xs" v-model="props.row.cekBox" />
                            <q-checkbox v-on:click.native="checkBoxfalse" v-else size="xs" v-model="checkboxData" />
                        </q-td>
                        <q-td :props="props" key="result">
                            {{props.row.result}}
                        </q-td>
                    </q-tr>
                </template>
                </STable>
            </q-card-section>
        <q-separator style="marginTop: -10px"/>
        <q-card-actions align="right" style="bottom: 0px">
            <q-btn size="sm" outline label="Cancel" color="primary" v-close-popup />
            <q-btn size="sm" @click="saveData" label="Save" color="primary" />
        </q-card-actions>
        </q-card>
    </q-dialog >
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, watch } from '@vue/composition-api';
import { tableWakeupcall, mode, dataTableWakeupcall } from '../tables/telephoneOperator.table'
import {formatDates} from '../../../helpers/dateFormat.helpers'
export default defineComponent({
    props: {
        dataWakeupcall: {type: Object, default: true}
    },
    setup(props, {emit}){
    let date = formatDates(new Date())
    const state = reactive({
        timeWithSeconds: '00:00',
        roomNumber: '',
        dataMode:   {
                    label: 'Set wake up call',
                    value: 'Wakeup Calls ON;01;PANA'
                    },
        shape: false,
        boxTime: false,
        disableGroupName: true,
        roomnumberDisable: false,
        groupName: '',
        timeFalidasi : '',
        boxFalidasi: false,
        inputTime: '',
        groupDisable: true,
        checkboxData: false,
    })

    const cekStatus = () => {
        emit('cekStatus', state.roomNumber)
    }

    const onClickRoomNumber = () => {
        emit('onClickRoomNumber', state.roomNumber)
    }

    const onClickGroupName = () => {
        emit('onClickGroupName', state.groupName)
    }

    const methodCheckbox = () => {
            if (state.shape == true) {
                state.disableGroupName = false
                state.roomnumberDisable = true
                state.boxFalidasi = true
            } else {
                state.disableGroupName = true
                state.roomnumberDisable = false
                state.boxFalidasi = false
                state.checkboxData = false
            }
    }

        
    const onColClick = (col) => {
        if (state.shape == true) {            
            state.timeFalidasi = col.zinr
            state.inputTime = col.aenderung
        }
    }

    const blurTime = () => {
        state.timeFalidasi = ''
    }

    const checkBoxfalse = () => {
        state.checkboxData = false
    }


    watch(() => state.roomNumber,
    (roomNumber) => {
        if(roomNumber.length !== 0){
            state.groupName = ''
        }
    })

    watch(() => state.groupName,
    (groupName) => {
        if(groupName.length !== 0){
            state.roomNumber = ''
            props.dataWakeupcall.prepareData.name = ''
        }
    })

    return {
        ...toRefs(state),
        tableWakeupcall,
        methodCheckbox,
        onColClick,
        checkBoxfalse,
        cekStatus,
        blurTime,
        mode,
        onClickRoomNumber,
        onClickGroupName,
        pagination: { page: 1, rowsPerPage: 0 }
    }
    }
})
</script>

<style lang="scss" scoped>
::v-deep .table-accounting-date {
    max-height: 36vh;
    thead tr {
    th {
        position: sticky;
        z-index: 3;
    }

    &:first-child th {
      top: 0;
    }
  }
}
.q-toolbar {
    background: $primary-grad;
}
</style>