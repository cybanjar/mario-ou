<template>
  <section>
    <div class="q-pa-md">
      <q-form @submit="onSearch">
        <SInput label-text="Search Supplier Name" v-model="supplierName" />

        <q-btn
          block
          color="primary"
          max-height="28"
          icon="mdi-magnify"
          label="Search"
          type="submit"
          class="q-mt-md full-width"
        />
      </q-form>
    </div>

    <q-separator style="border-width: 1px;" class="q-my-md" />

    <div class="q-px-md">
      <SRemarkLeftDrawer
        label="Remark"
        :value="remark.trim().length > 0 ? remark : 'None'"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';

export default defineComponent({
  props: {
    remark: { type: String, required: true },
  },
  setup(_, { emit }) {
    const state = reactive({
      supplierName: null,
    });

    function onSearch() {
      emit('onSearch', state.supplierName);
    }

    return {
      ...toRefs(state),
      onSearch,
    };
  },
});
</script>
