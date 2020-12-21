<template>
  <section class="mt-7">
    <div id="input" class="q-pa-md">
      <q-form @submit="onSearch">
        <SInput label-text="Delivery Note" v-model="inputan" unmasked-value />
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
        />
      </q-form>
    </div>

    <q-separator style="border-width: 1px;" class="q-my-md" />
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
} from '@vue/composition-api';
import {date} from 'quasar'
export default defineComponent({
  props: {
    orderDate: {type:String, required: true} as any
    },
  setup(props, { emit }) {
    const state = reactive({
      inputan: ''
    });

    const onSearch = () => {
      emit('onSearch', {...state});
    };
    return {
      onSearch,
      ...toRefs(state),
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
</style>
