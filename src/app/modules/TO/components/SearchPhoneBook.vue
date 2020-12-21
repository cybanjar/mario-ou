<template>
  <section class="mt-7">
    <div id="input" class="q-pa-md">
      <SInput label-text="Name" v-model="Name" />
      <SInput label-text="Department" v-model="Department" />
      <SInput label-text="Phone Number" v-model="Phone" />
      <SInput label-text="Mobile Number" v-model="Mobile" />

      <q-btn
        block
        size="sm"
        color="primary"
        max-height="10"
        style="height: 25px"
        icon="mdi-magnify"
        label="Search"
        type="submit"
        class="q-mt-md full-width"
        @click="onSearch"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from '@vue/composition-api';
import { log } from 'util';


export default defineComponent({

  setup(_, { emit }) {
    const state = reactive({
      
      Name: ref(null),
      Department: ref(null),
      Phone: ref(null),
      Mobile: ref(null),
    });

    const onSearch = () => {
      emit('onSearch', { ...state });
    };

    return {
      ...toRefs(state),
      onSearch,
    };
  },
});
</script>

<style lang="scss" scoped>
#input {
  width: 200px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

#radio {
  margin-left: -9px;
}
</style>
