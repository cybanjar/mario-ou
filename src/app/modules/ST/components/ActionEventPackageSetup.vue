<template>
    <div class="row q-mb-md">
      <div class="col">

        <div class="row">
          <div class="col q-pr-md">
            <SInput  label-text="Package Code" />            
              <SInput type="number"  label-text="Price" />
          </div>
        </div>
        <q-checkbox v-model="package" label="Package Active?" />
      </div>
      
      <div class="col justify-center q-ml-md">
        <SInput label-text="Package Description" />        
        <label>Comments</label>
        <q-input
            v-model="comments"
            outlined
            borderless
            type="textarea"
        />
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
            package: true,
            comments: ""
        });
        return {
          ...toRefs(state),
        }
    },
})
</script>