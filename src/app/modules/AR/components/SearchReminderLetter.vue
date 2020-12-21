<template>
  <div class="q-pa-md">
    <q-form @submit="search" style="position: unset;">
      <SelectFilter
        label-text="From Article"
        :options="articleOptions"
        option-value="value"
        option-label="label"
        v-model="formData.fromArt"
        hide-bottom-space
        lazy-rules
        :rules="[(val) => val || 'Please select from article']"
      />
      <SelectFilter
        label-text="To Article"
        :options="articleOptions"
        option-value="value"
        option-label="label"
        v-model="formData.toArt"
        hide-bottom-space
        lazy-rules
        :rules="[]"
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
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { loadArticleList } from '../shared/article-list.comp';

export default defineComponent({
  setup(_, { root: { $api }, emit }) {
    const { articleOptions, isPrefetch } = loadArticleList(
      $api,
      '4',
      false,
      true
    );

    const state = reactive({
      formData: {
        fromArt: null,
        toArt: null,
      },
    });

    function search() {
      const { fromArt, toArt } = state.formData;
      emit('search', fromArt, toArt);
    }

    return {
      ...toRefs(state),
      articleOptions,
      isPrefetch,
      search,
    };
  },
  components: {
    SelectFilter: () => import('../../AP/components/SelectFilter.vue'),
  },
});
</script>
