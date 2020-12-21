<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <q-form @submit="onSearch">
        <SInput
          label-text="Account Number"
          v-model="accountNumber"
          :placeholder="placeholder"
          :mask="mask"
          unmasked-value
        />

        <SSelect
          label-text="Main Account"
          :options="filters.mains"
          v-model="main"
          :loading="isFetching"
        />

        <SSelect
          label-text="Account Category"
          :options="filters.categories"
          v-model="category"
          :loading="isFetching"
        />

        <SSelect
          label-text="Account Department"
          :options="filters.departments"
          v-model="department"
          :loading="isFetching"
        />

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
      <SRemarkLeftDrawer label="Remark & Last User Changed" :value="remark" />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { store } from '~/store';
import { SelectItem } from '~/app/shared/models/select.model';

interface FilterModel {
  accountNumber: null | SelectItem;
  main: null | SelectItem;
  category: null | SelectItem;
  department: null | SelectItem;
}

export default defineComponent({
  props: {
    isFetching: { type: Boolean, default: false },
    filters: { type: Object, required: true },
    remark: { type: String, required: true },
  },
  setup(_, { emit }) {
    const searches = reactive<FilterModel>({
      accountNumber: null,
      main: null,
      category: null,
      department: null,
    });

    const onSearch = () => {
      emit('onSearch', { ...searches });
    };

    return {
      ...toRefs(searches),
      onSearch,
      placeholder: store.state.auth.user?.coaFormat || '',
      mask: store.getters.auth.getCoaFormat,
    };
  },
});
</script>
