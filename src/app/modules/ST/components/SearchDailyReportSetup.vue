<template>
    <div class="row">
      <div class="col">
        <div class="row">
         <SInput 
            :label-text="sinput.label"
            :style="{'width': sinput.width, 'marginRight': sinput.right}"
            v-model="sinput.value"
            :disable="sinput.disable"
            v-for="sinput in use_input.filter(x => [
            'File Number', 'Category'
            ].includes(x.label))"
            :key='sinput.value'
            />
        </div>
          <SFile
          v-for="sinput in use_input.filter(x => [
            'File Name'
            ].includes(x.label))"
            :key='sinput.value'
        />
        <div class="row">
          <SInput 
            :disable="sinput.disable"
            v-model="sinput.value"
            :label-text="sinput.label"
            :style="{'width': sinput.width, 'marginRight': sinput.right}"
            v-for="sinput in use_input.filter(x => [
            'Last Column', 'Last Row'
            ].includes(x.label))"
            :key='sinput.value'
            />
        </div>
      </div>
      <div class="col">
        <SInput 
            :disable="sinput.disable"
            v-model="sinput.value"
            :label-text="sinput.label"
            :style="{'width': sinput.width, 'marginRight': sinput.right}"
            v-for="sinput in use_input.filter(x => [
            'Description', 'Google Sheet Link'
            ].includes(x.label))"
            :key='sinput.value'
            />
          <div class="row justify-between" style="marginTop: 43px; width: 375px">
            <q-btn
              block
              :color="vhpwords"
              max-height="10"
              label="VHP WORDS"
              type="submit"
              style="height: 25px; width: 100px"
              size="sm"
              unelevated
              @click="vhpWords"
            />
            <q-btn
              block
              color="grey"
              max-height="10"
              label="Load Macro"
              type="submit"
              style="height: 25px; width: 100px"
              size="sm"
              unelevated
              @click="loadMacro"
            />
          </div>
        </div>
      <div class="col self-end">
          <div class="row justify-between" style="width: 375px; marginBottom: 15px">
            <q-btn
              block
              :color="colors"
              max-height="10"
              label="Cancel"
              type="submit"
              style="height: 25px; width: 100px"
              size="sm"
              unelevated
              @click="onCancel(colors)"
            />
            <q-btn
              block
              :color="colors"
              max-height="10"
              label="Save"
              type="submit"
              style="height: 25px; width: 100px"
              size="sm"
              unelevated
              @click="onSave(colors)"
            />
          </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
  defineComponent,
  toRefs,
  reactive,
} from '@vue/composition-api';
import {use_input} from '../utils/DailyReportSetup'
export default defineComponent({
    props: {
      colors: {} as any,
      vhpwords: {} as any,
    },
    setup(_, {emit }) {
        const state = reactive({
            use_input: use_input
        });

        const onCancel = (colors) => {
          if (colors == 'primary') {
            emit('onCancel')
          }
        }
        const onSave = (colors) => {
          if (colors == 'primary') {
            emit('onSave')
          }
        }
        const vhpWords = () => {
          emit('vhpWords')
        }
        const loadMacro = () => {
          emit('loadMacro')
        }
        return {
          ...toRefs(state),
          onCancel,
          onSave,
          vhpWords,
          loadMacro
        }
    },
})
</script>