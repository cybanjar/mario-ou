<template>
  <section class="mt-7">
    <div id="input" class="q-pa-md">

        <DateInput
          label-text="Billing Date"
          v-model="search"
        />

        <q-btn
          color="primary"
          icon="mdi-magnify"
          label="Search"
          type="submit"
          class="q-mt-md full-width"
          size="sm"
          unelevated
          @click="onSearch"
        />
    </div>
    <q-separator style="border-width: 1px;" class="q-my-md" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import DateInput from '~/app/modules/FR/components/common/DateInput.vue';

export default defineComponent({
  components: {
    DateInput,
  },

    props: {
        search: {} as any
    },
    setup(props, {emit}){
      const onSearch = () => {
        emit('onSearch', props.search)
      }

      return {
          onSearch
      }
    },
})
</script>