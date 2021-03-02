<template>
  <div class="row q-gutter-md">
    <div class="col">
      <SInput 
        v-for="items in sinput.filter(items => 
          [
            'Room', 'Description', 'Size (m2)'
          ].includes(items.labelText)
        )"
        :label-text="items.labelText" 
        v-model="items.value" 
        :disable="items.disable" 
      />
    </div>
    <div class="col">
      <SInput 
        v-for="items in sinput.filter(items => 
          [
            'Extension', 'Max Person',
          ].includes(items.labelText)
        )"
        :label-text="items.labelText" 
        v-model="items.value" 
        :disable="items.disable"
      />
      <SInputCurrency
        v-for="items in sinput.filter(items => 
          [
            'Daily Rate',
          ].includes(items.labelText)
        )"
        :label-text="items.labelText" 
        v-model="items.value" 
        :disable="items.disable"
        :currency="{
          distractionFree: false,
          currency: null,
        }"
      />
    </div>

    <div class="col">
      <div class="row" style="alignItems: center">
        <SInput
          v-for="items in sinput.filter(items => 
            [
              'Prepare'
            ].includes(items.labelText)
          )"
          :label-text="items.labelText" 
          v-model="items.value" 
          :disable="items.disable"
          placeholder="Minutes"
          hide-bottom-space
          style="width: 90px; marginRight: 10px"
        ></SInput>
        <q-btn
          block
          color="primary"
          max-height="10"
          icon="mdi-minus"
          type="submit"
          style="height: 25px; width: 30px; marginRight: 10px; marginTop: 10px"
          size="sm"
          unelevated
          @click="onMinus"
          :disable="!searches.active"
        />
        <q-btn
          block
          color="primary"
          max-height="10"
          icon="mdi-plus"
          type="submit"
          style="height: 25px; width: 30px; marginTop: 10px"
          size="sm"
          unelevated
          @click="onPlus"
          :disable="!searches.active"
        />
      </div>
      <SSelect
        v-for="items in sinput.filter(items => 
          [
            'Parent Room',
          ].includes(items.labelText)
        )"
        :label-text="items.labelText" 
        v-model="items.value" 
        :disable="items.disable"
        :options="items.options"
      />
    </div>

    <div class="col">
      <SFile
        v-for="items in sinput.filter(items => 
          [
            'Picture Name',
          ].includes(items.labelText)
        )"
        :label-text="items.labelText" 
        v-model="items.value" 
        :disable="items.disable"
        accept="image/*"
      >
        <span class="mdi mdi-attachment mdi-rotate-315 mdi-18px"></span>
      </SFile>
      <div 
        class="column"           
        :key="items.labelText"
        v-for="items in sinput.filter(items => 
          [
            'Toggle'
          ].includes(items.labelText)
        )">
        <span>Change Description</span>
        <q-toggle 
          v-model="items.value" 
          :disable="items.disable"
          style="marginLeft: -10px"
        />
      </div>
    </div>

    <div class="col" style="alignSelf: flex-end">
      <div class="row" style="marginBottom: 15px">
        <div class="col">
          <q-btn
            block
            color="white"
            text-color="primary"
            max-height="10"
            label="Cancel"
            type="submit"
            style="height: 25px; width: 70px; marginRight: 10px"
            size="sm"
            unelevated
            outline
            :disable="!searches.active"
            @click="onCancel"
          />
        </div>
        <div class="col">
          <q-btn
            block
            color="primary"
            max-height="10"
            label="Save"
            type="submit"
            style="height: 25px; width: 70px"
            size="sm"
            unelevated
            @click="onSave"
            :disable="!searches.active"
          />
        </div>
      </div>
    </div>

      <q-dialog v-model="cencel" persistent>
        <q-card style="marginTop: -200px; width: 400px">
          <q-card-section class="row items-center">
            <div style="color: #1e68c9; marginright: 20px">
              <span class="mdi mdi-help-circle-outline mdi-36px"></span>
            </div>
            <span style="marginLeft: 10px; color: grey; fontWeight: 500">
              Do you want to interrupt?
            </span>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              unelevated
              size="sm"
              label="Cancel"
              color="primary"
              outline
              @click="cencel = false"
            />
            <q-btn
              unelevated
              size="sm"
              label="Oke"
              color="primary"
              @click="onCancelOke"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive } from '@vue/composition-api';
import { sinput } from '../utils/RoomMeeting';


export default defineComponent({
  props: {
    searches: {} as any,
  },
  setup(props, { root: { $api }, emit }) {
    let valuePrepare = 0
    const state = reactive({
      sinput: sinput,
      cencel: false
    });
    const onSave = () => {
      emit('onSave')
    }

    const onMinus = () => {
      if(valuePrepare !== 0){
        valuePrepare -= 15
        sinput[6].value = valuePrepare as any
      }
    }

    const onPlus = () => {
      valuePrepare += 15
      sinput[6].value = valuePrepare as any
    }

    const onCancel = () => {
      state.cencel = true
    }

    const onCancelOke = () => {
      state.cencel = false
      props.searches.active = false
      for(const i in sinput){
        sinput[i].disable = true
        if (i == '9') {
          sinput[i].value = false
        } else {
          sinput[i].value = ''
        }
      }
      emit('onCancelOke')
    }
    return {
      ...toRefs(state),
      onSave,
      onMinus,
      onPlus,
      onCancel,
      onCancelOke
    };
  },
});
</script>
