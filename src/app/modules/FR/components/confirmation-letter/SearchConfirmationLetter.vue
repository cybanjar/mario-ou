<template>
  <section class="mt-7 full-height">
    <div class="q-pa-md">
      <q-form @submit="onSearch">
        <DateInput
          label-text="Date"
          position-fixed
          placement="auto"
          v-model="formData.date"
        />
        <SInput label-text="Guest Name" v-model="formData.guestName">
          <template>
            <q-btn
              icon="mdi-magnify"
              size="12px"
              dense
              unelevated
              type="submit"
            />
          </template>
        </SInput>
        <q-btn
          label="Search"
          class="full-width q-mt-xl"
          color="primary"
          type="submit"
        />
      </q-form>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api';
import DateInput from '../../components/common/DateInput.vue';

export interface SearchConfirmationLetter {
  date: Date | null;
  guestName: string | null;
}

export default defineComponent({
  components: {
    DateInput,
  },

  setup(_, { emit }) {
    const formData = reactive<SearchConfirmationLetter>({
      date: null,
      guestName: '',
    });
    function onSearch() {
      emit('search', { ...formData });
    }
    onSearch();
    return {
      formData,
      onSearch,
    };
  },
});
</script>
