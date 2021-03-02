<template>
  <section class="mt-7">
    <div class="q-pa-md">
      <SSelect
        label-text="Supplier"
        :options="supplierOptions"
        v-model="supplier"
        :loading="isPreparing"
        :option-label="supplierLabel"
        use-input
        @filter="filterSuppliers"
        fill-input
        hide-selected
        input-debounce="0"
        placeholder="Please select"
      />

      <SSelect
        label-text="Select Item"
        :options="filters.articles"
        :option-label="articleLabel"
        option-value="lief-nr"
        v-model="article"
        :loading="isPreparing"
      >
        <template #selected>
          <div :class="{ 'text-grey-6': !article }">
            {{ article ? articleLabel(article) : '-- Please Select --' }}
          </div>
        </template>
      </SSelect>

      <SInput label-text="Document Number" v-model="docNum" />

      <q-btn
        block
        color="primary"
        max-height="28"
        icon="mdi-magnify"
        label="Search"
        class="q-mt-md full-width"
        @click="onSearch"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref, reactive } from '@vue/composition-api';

export default defineComponent({
  props: {
    isPreparing: { type: Boolean, default: false },
    filters: { type: Object, required: true },
  },

  setup(props, { emit }) {
    const searches = reactive({
      supplier: '',
      article: '',
      docNum: '',
    });

    function onSearch() {
      emit('search', { ...searches });
    }

    const supplierOptions = ref([...props.filters.suppliers]);
    function supplierLabel(supp) {
      if (supp) {
        if (supp.label === 'All') {
          return supp.label;
        }

        return `${supp.value} - ${supp.label}`;
      }

      return '';
    }

    function filterSuppliers(val, update) {
      update(() => {
        const text = val.toLowerCase();
        supplierOptions.value = props.filters.suppliers.filter(
          (v) => v.label.toLowerCase().indexOf(text) > -1
        );
      });
    }

    function articleLabel(art) {
      return `${art.artnr} - ${art.bezeich}`;
    }

    return {
      ...toRefs(searches),
      supplierOptions,
      supplierLabel,
      filterSuppliers,
      onSearch,
      articleLabel,
    };
  },
});
</script>
