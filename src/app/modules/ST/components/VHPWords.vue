<template>
    <q-dialog v-model="dialogVHPWords.confirm" persistent>
      <q-card style="marginTop: -10px; width: 685px; max-width: 90vw; height: 500px">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-small">Text Macro Editor</q-toolbar-title>
        </q-toolbar>
        <q-card-section style="height: 400px">
            <div class="row">
                <q-btn 
                  v-for="items in buttonVHPWords" 
                  unelevated size="sm" 
                  :label="items.label" 
                  color="primary" 
                  :outline="items.outline"
                  :style="{'marginRight': items.mr}"/>
            </div>
            <div style="height: 300px; backgroundColor: pink; marginTop: 20px">
              <q-editor dense v-model="dialogVHPWords.editor" min-height="20rem" max-height="40vh" :toolbar="[]" />
            </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn style="width: 80px" unelevated size="sm" label="Oke" color="primary" @click="onOke"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import {buttonVHPWords} from '../utils/DailyReportSetup'

export default defineComponent({
    props: {
        dialogVHPWords: {} as any
    },
    setup(props, {emit}){
      const onOke = () => {
        emit('onOke', props.dialogVHPWords)
      }
      return{
        onOke,
        buttonVHPWords
      }
    }
})
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
</style>