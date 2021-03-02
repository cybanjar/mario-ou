<template>
    <div class="row">
      <div class="col">

        <div class="row">
          <div class="col q-pr-md">
            <SInput  label-text="Number" />            
          </div>
          <div class="col">
              <SSelect  label-text="Currency" />
          </div>
        </div>
        <q-checkbox v-model="checkboxFixRate" label="Fix Rates during whole stay" />
        <SInput label-text="Market Name" />
        
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
              class="q-btn-cancel"
            />
            <q-btn
              block
              :color="colors"
              label="Save"
              type="submit"
              size="sm"
              unelevated
              class="q-btn-save"
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
      colors: {} as any
    },
    setup(_, { root: { $api } }) {
        const state = reactive({
            use_input: use_input,
            checkboxFixRate: true
        });
        return {
          ...toRefs(state),
        }
    },
})
</script>