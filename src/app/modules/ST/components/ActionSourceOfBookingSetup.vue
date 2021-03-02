<template>
    <div class="row">
      <div class="col">

        <div class="row">
            <SInput 
              v-for="item in sinput.filter(x => !['Description'].includes(x.label))" 
              :disable="item.disable" 
              :style="item.style" 
              :key="item.label"
              :label-text="item.label"
              v-model="item.value"  
            />
        </div>
        
        <div class="row">
          <div class="col">
            <SInput 
              v-for="item in sinput.filter(x => ['Description'].includes(x.label))" 
              :disable="item.disable" 
              :key="item.label"
              :label-text="item.label"
              v-model="item.value"  
            />
          </div>
        </div>

      </div>
        
      <!-- Button save cancel -->
      <div class="col self-end q-mb-md">
          <div class="row justify-end">
            <q-btn
              block
              :color="colors"
              label="Cancel"
              type="submit"
              size="sm"
              :outline="colors == 'grey'? false: true"
              unelevated
              :disable="actived"
              class="q-btn-cancel"
              @click="onCancel"
            />
            <q-btn
              :disable="actived"
              block
              :color="colors"
              label="Save"
              type="submit"
              size="sm"
              unelevated
              class="q-btn-save"
              @click="onSave"
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
import {sinput} from '../utils/TableSourceOfBooking'
export default defineComponent({
    props: {
      colors: {} as any,
      actived: {} as any
    },
    setup(_, { root: { $api }, emit }) {
        const state = reactive({
            sinput: sinput
        });

        const onSave = () => {
          emit('onSave')
        }

        const onCancel = () => {
          for(const i of sinput){
            i.disable = true
          }
        }

        return {
          ...toRefs(state),
          onSave,
          onCancel,
        }
    },
})
</script>