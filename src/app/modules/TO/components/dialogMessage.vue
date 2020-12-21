<template>
      <q-dialog v-model="dataMessage.modal" persistent>
        <q-card style="width: 720px; height: 415px;  max-width: 90vw;">
          <q-toolbar>
            <q-toolbar-title class="text-white text-weight-medium">Guest Message</q-toolbar-title>
          </q-toolbar>
          <q-card-section>
              <div class="row">
                    <div class="q-mt-none">
                      <q-btn color="primary" @click="newMessage" flat round>
                        <span style="color: 'red" class="mdi mdi-tab-plus mdi-24px"></span>
                        <q-tooltip>Add Data</q-tooltip>
                      </q-btn>
                      <q-btn color="primary" @click="modifyMessage" flat round>
                        <span class="mdi mdi-pencil-box-outline mdi-24px"></span>
                        <q-tooltip>Modify</q-tooltip>
                      </q-btn>
                      <q-btn color="primary" @click="deleteMessage" flat round>
                        <span class="mdi mdi-delete mdi-24px"></span>
                        <q-tooltip>Delete</q-tooltip>
                      </q-btn>
                    </div>
                    <q-separator/>
                    <SInput 
                    v-model="dataMessage.data.gname" 
                    label-text="Name" 
                    style="width: 212px; marginRight: 10px; marginTop: 10px"
                    disable
                    /> 
                    <SInput 
                    v-if="dataMessage.key == ''"
                    v-model="dataMessage.dataLoad.tMessages['t-messages'][0].messtext[1]" 
                    disable
                    label-text="Caller"  
                    style="width: 212px; marginRight: 10px; marginTop: 10px "/> 
                    <SInput 
                    v-else
                    v-model="newCaller" 
                    label-text="Caller"  
                    style="width: 212px; marginRight: 10px; marginTop: 10px "/> 
                    <SInput 
                    v-if="dataMessage.key == ''"
                    v-model="dataMessage.dataLoad.tMessages['t-messages'][0].messtext[2]"
                    disable
                    label-text="Phone No" 
                    style="width: 225px; marginTop: 10px"/> 
                    <SInput 
                    v-else
                    v-model="newPhone"
                    label-text="Phone No" 
                    style="width: 225px; marginTop: 10px"/> 
                    <SInput 
                    v-model="dataMessage.data.dateArival" 
                    label-text= "Arival"
                    disable
                    style="width: 155px; marginRight: 10px; marginTop: -10px"/>
                    <SInput 
                    v-model="dataMessage.data.dateDepart" 
                    disable
                    label-text= "Depature" 
                    style="width: 155px; marginRight: 25px; marginTop: -10px"/>
                    <SInput 
                    v-model="dataMessage.dataNr" 
                    label-text= "Message" 
                    disable
                    style="width: 60px; marginTop: -10px"/>
                    <SInput 
                    v-model="off" 
                    disable style="width: 40px; marginTop: 15px"/>
                    <SInput 
                    v-model="dataMessage.data.tot" 
                    disable
                    style="width: 60px; marginTop: 15px; marginRight: 10px"/> 
                    <SInput 
                    v-model="dataMessage.dataLoad.username" 
                    disable
                    label-text= "Created by" 
                    style="width: 155px; marginTop: -10px"/> 
                    <SInput 
                    v-model="dataMessage.data.inhous"
                    disable
                    label-text= "Inhouse" 
                    style="width: 155px; marginRight: 10px; marginTop: -10px"/> 
                    <SInput 
                    v-model="dataMessage.data.zinr" 
                    label-text= "Room"
                    disable 
                    style="width: 155px; marginTop: -10px; marginRight: 25px" /> 
                    <q-btn
                    block
                    color="primary"
                    max-height="5"
                    style="height: 25px; width: 71px; marginRight: 10px"
                    label="first"
                    type="submit"
                    size="sm"
                    @click="onClickFirst"
                  />
                    <q-btn
                    block
                    color="primary"
                    max-height="5"
                    style="height: 25px; width: 71px; marginRight: 10px"
                    label="prev"
                    type="submit"
                    size="sm"
                    :disable="dataMessage.disablePrev"
                    @click="onClickPrev"
                  />
                    <q-btn
                    block
                    color="primary"
                    max-height="5"
                    style="height: 25px; width: 71px; marginRight: 10px"
                    label="next"
                    type="submit"
                    :disable="dataMessage.disableNext"
                    @click="onClickNext"
                    size="sm"
                  />
                    <q-btn
                    block
                    color="primary"
                    max-height="5"
                    style="height: 25px; width: 71px;"
                    label="last"
                    type="submit"
                    size="sm"
                    @click="onClickLast"
                  />
                <div class="col-6 row">
                    <SInput 
                    v-model="dataMessage.data.newDate" 
                    label-text= "Date"
                    disable 
                    style="width: 155px; marginRight: 10px; marginTop: -10px"/> 
                    <SInput 
                    v-model="dataMessage.data.timeNew" 
                    label-text= "Time"
                    disable 
                    style="width: 155px; marginTop: -10px"/> 
                </div>
                <div class="col-6">
                  <div style="marginTop: -15px">
                    <q-input
                      v-if="dataMessage.key == ''"
                      v-model="dataMessage.dataLoad.tMessages['t-messages'][0].messtext[0]"
                      disable
                      filled
                      autogrow
                      style="marginTop: -10px"
                    />
                    <q-input
                      v-else
                      v-model="newText"
                      filled
                      autogrow
                      style="marginTop: -10px"
                    />
                  </div>
                </div>
              </div>
          </q-card-section>
        <q-separator/>
          <q-card-actions align="right" style=" marginTop: -5px;">
            <q-btn size="sm" outline @click="cencel" label="Cancel" color="primary" />
            <q-btn size="sm" @click="saveData" label="Save" color="primary" />
          </q-card-actions>
        </q-card>
      </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, watch } from '@vue/composition-api';
import {formatDates} from '../../../helpers/dateFormat.helpers'

export default defineComponent({
    props: {
        dataMessage: {type: Object, default: null}
    },
  setup(props, {emit}) {
    const state = reactive({
        off : 'of',
        newCaller: '',
        newPhone: '',
        newText: ''
    });
    const onClickFirst = () => {
      emit('onClickFirst')
    }
    const onClickLast = () => {
      emit('onClickLast')
    }
    const onClickPrev = () => {
      emit('onClickPrev')
    }
    const onClickNext = () => {
      emit('onClickNext')
    }
    const newMessage = () => {
      emit('newMessage')
      state.newCaller = ''
      state.newPhone = ''
      state.newText = ''
    }
    const deleteMessage = () => {
      emit('deleteMessage')
    }
    const saveData = () => {
      emit('saveData', {...state})
    }

    const cencel = () => {
      if (props.dataMessage.key !== '') {
        props.dataMessage.key = ''
      } else {
        props.dataMessage.modal = false
      }
    }
    const modifyMessage = () => {
      state.newCaller = props.dataMessage.dataLoad.tMessages['t-messages'][0].messtext[1]
      state.newPhone = props.dataMessage.dataLoad.tMessages['t-messages'][0].messtext[2]
      state.newText = props.dataMessage.dataLoad.tMessages['t-messages'][0].messtext[0]
      emit('modifayMessage', {...state})
    } 

    return {
        ...toRefs(state),
        onClickFirst,
        onClickLast,
        onClickPrev,
        onClickNext,
        newMessage,
        deleteMessage,
        saveData,
        modifyMessage,
        cencel
    }
  }
  })

</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
</style>