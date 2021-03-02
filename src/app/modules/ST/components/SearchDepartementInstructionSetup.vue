<template>
  <div class="row">
    <div class="col row">
      <SInput 
       v-for="item in sinput"
       :label-text="item.label" 
        v-model="item.value" 
        :style="item.style"
        :disable="item.disable" />
    </div>
    <div class="col" style="marginBottom: 17px; alignSelf: flex-end; textAlign: end">
        <q-btn
          block
          color="white"
          text-color="primary"
          max-height="10"
          label="Cancel"
          type="submit"
          style="height: 25px; width: 100px; marginRight: 10px"
          size="sm"
          unelevated
          outline
          :disable="!searches.active"
        />
        <q-btn
          block
          color="primary"
          max-height="10"
          label="Save"
          type="submit"
          style="height: 25px; width: 100px"
          size="sm"
          unelevated
          :disable="!searches.active"
          @click="onSave"
        />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive } from '@vue/composition-api';
import { sinput } from '../utils/DepartementInstructionSetup';
export default defineComponent({
  props: {
    searches: {} as any,
  },
  setup(_, { emit }) {
    const state = reactive({
      sinput: sinput,
    });

    const onSave = () => {
      emit('onSave')
    }
    return {
      ...toRefs(state),
      onSave
    };
  },
});
</script>
