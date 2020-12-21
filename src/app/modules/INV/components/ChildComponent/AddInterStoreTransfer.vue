<template>
    <q-dialog persistent v-model="child_dialog.dialog" position="top">
        <q-card style="width: 820px; max-width: 90vw; marginTop: 50px">
          <q-toolbar>
            <q-toolbar-title class="text-white text-weight-medium">Inter Store Transfer</q-toolbar-title>
          </q-toolbar>
          <q-card-section>
              <div class="row">
                <SInput
                  v-for="i in use_input.filter(x => [
                  'Delivery Number'].includes(x.name))"
                  :key="i.name"
                  :label-text="i.name"
                  v-model="i.value"
                  :style="{marginRight: i.right, width: i.width}"
                  :disable="i.disable"
                />
                <SSelect
                  v-for="i in use_input.filter(x => 
                  child_dialog.actual.includes(x.name))"
                  :key="i.name"
                  :label-text="i.name"
                  v-model="i.value"
                  :style="{marginRight: i.right, width: i.width}"
                  :options="i.options"
                  @input="trans_code(i.onClick)"
                />
                <SInput
                  v-for="i in use_input.filter(x => child_dialog.actual1
                  .includes(x.name))"
                  :key="i.name"
                  :label-text="i.name"
                  v-model="i.value"
                  :style="{marginRight: i.right, width: i.width}"
                  :disable="i.disable"
                  @click="onModalAccount(i.onclick)"
                />
              </div>
              <div>
              <q-splitter v-model="shape">
                <template v-slot:before>
                  <q-tabs 
                    v-model="tab" 
                    vertical 
                    active-color="primary"
                    indicator-color="primary"
                    dense
                    no-caps
                    inline-label
                    class="text-gray shadow-2"
                    >
                    <q-tab name="mails" label="Header" />
                    <q-tab name="alarms" label="item" />
                  </q-tabs>
                </template>
                <template v-slot:after>
                    <InterStoreChild 
                    :dialog="dialog" 
                    :tab="tab" 
                    @clickAdd="trans_code"/>
                    <SelectCostAllocations 
                    :dialog="dialogSelect"
                    :dialogg="dialog"/>
                </template>
              </q-splitter>
              </div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn color="primary" outline size="sm" @click="close" label="Cancel" />
            <q-btn unelevated size="sm" :loading="loading" @click="trans_code('3')" color="primary" label="Select" />
          </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  reactive,
  onMounted,
  toRefs,
  watch,
} from '@vue/composition-api';
import {use_input} from '../../tables/storeRequisition'
import {store_req} from '../../utils/store'
import {Notify} from 'quasar'
export default defineComponent({
   props: {
       child_dialog: {} as any,
       dialog: {} as any ,
   },
   setup(props, { emit }){
       const state = reactive({
           use_input : use_input,
           tab: 'mails',
           shape: 15,
           loading: false,
           dialogSelect: {
             dialog: false
           } 
       })
       const trans_code = (val) => {
         emit('trans_code', val)
       }
       const onModalAccount = (val) => {
         if(val == '2'){
           state.dialogSelect.dialog = true
         }
       }
       const close = () => {
          Notify.create({
            message: props.dialog.data.length !== 0 ? 
            'The created records are still in temporary buffer Do you really want to leave WITHOUT updating?'
            : 'Do you want to interrupt?',
              color: 'primary',
              position: 'center',
              timeout: 0,
              actions: [
              { label: 'No', color: 'white', handler: () => { /* ... */ }, size: 'sm'},
              { label: 'Yes', color: 'white', handler: () => {
               props.child_dialog.dialog = false }, size: 'sm'}
            ]
            });
       }
       return {
           ...toRefs(state),
           trans_code,
           onModalAccount,
           close
       }
   },
   components: {
       InterStoreChild: () => import('./InterStoreChild.vue'),
       SelectCostAllocations: () => import('./SelectCostAllecations.vue'),
   }
})
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
</style>
