<template>
  <div class="q-pa-md">
    <div v-if="artOptionsPrep.data.isLoading" class="q-pa-md text-center">
      <q-spinner color="primary" size="4em" :thickness="3" />
    </div>

    <template v-else>
      <q-form @submit="search" style="position: unset;">
        <SelectFilter
          label-text="From Article"
          :options="artOptionsPrep.result"
          option-value="value"
          option-label="label"
          v-model="formData.fromArt"
          hide-bottom-space
          lazy-rules
          :rules="[(val) => val || 'Please select from article']"
        />
        <SelectFilter
          label-text="To Article"
          :options="artOptionsPrep.result"
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
    </template>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
} from '@vue/composition-api';
import { mapWithBezeich } from '~/app/helpers/mapSelectItems.helpers';
import { usePrepare } from '~/app/shared/compositions/use-prepare.composition';

export default defineComponent({
  setup(_, { root: { $api }, emit }) {
    const artOptionsPrep = usePrepare(
      true,
      () =>
        $api.accountReceivable.getReadArticleCoreList({
          caseType: '4',
          dept: 0,
          actFlag: true,
        }),

      undefined,
      (tempData) => mapWithBezeich(tempData, 'artnr'),
      []
    );

    const state = reactive({
      formData: {
        fromArt: 1,
        toArt: 26,
      },
    });

    function search() {
      const { fromArt, toArt } = state.formData;
      emit('search', fromArt, toArt);
    }

    onMounted(() => search());
    return {
      ...toRefs(state),
      artOptionsPrep,
      search,
    };
  },
  components: {
    SelectFilter: () => import('../../AP/components/SelectFilter.vue'),
  },
});
</script>
