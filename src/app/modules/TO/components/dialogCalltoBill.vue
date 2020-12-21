<template>
   <div class="q-pa-md q-gutter-sm">
     <q-dialog persistent
         v-model="dataCallToBill.dialogBill"
       >
         <q-card style="width: 300px">
           <q-card-section>
             <div class="text-h6">dialogCall di buat di FOC</div>
           </q-card-section>

           <q-card-section class="q-pt-none">
            <q-option-group
              v-model="group"
              :options="options"
              color="primary"
              size="sm"
            />
           </q-card-section>
           <q-card-actions align="right" class="bg-white text-teal">
             <q-btn flat label="OK" v-close-popup />
           </q-card-actions>
         </q-card>
       </q-dialog>
   </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
  watch,
  
} from '@vue/composition-api';
export default defineComponent({
   props : {
       dataCallToBill : {type: Object, default: null}
   },
   setup(_,{}){
       const state = reactive({
    group: 'op1',
      options: [
        {
          label: 'Option 1',
          value: 'op1'
        },
        {
          label: 'Option 2',
          value: 'op2'
        },
        {
          label: 'Option 3',
          value: 'op3'
        }
      ]
       })

       return {
        ...toRefs(state),
       }
   }
    
})
</script>