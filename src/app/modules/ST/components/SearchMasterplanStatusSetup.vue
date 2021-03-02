<template>
  <div class="row q-gutter-md">
    <div class="col">
      <SInput 
        v-for="item in sinput.filter( x => ['No', 'Code'].includes(x.label))"
        :label-text="item.label" 
        v-model="item.value" 
        :disable="item.disable" />
    </div>
    <div class="col">
      <SInput 
        v-for="item in sinput.filter( x => ['Description'].includes(x.label))"
        :label-text="item.label" 
        v-model="item.value" 
        :disable="item.disable" />
      <SSelect
        v-for="item in sinput.filter( x => ['Type'].includes(x.label))"
        :label-text="item.label" 
        v-model="item.value" 
        :options="item.options"
        :disable="item.disable" />
    </div>
    <div class="col" style="alignSelf: flex-end">
      <div class="q-gutter-md" style="textAlign: end; marginBottom: 15px">
        <q-btn
          block
          color="white"
          text-color="primary"
          max-height="10"
          label="Cancel"
          type="submit"
          style="height: 25px; width: 100px"
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
          @click="onSave"
          :disable="!searches.active"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive } from '@vue/composition-api';
import { sinput } from '../utils/MasterPlan';
export default defineComponent({
  props: {
    searches: {} as any,
  },
  setup(_, { emit }) {
    const state = reactive({
      sinput: sinput
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
