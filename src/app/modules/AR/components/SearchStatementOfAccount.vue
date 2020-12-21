<template>
  <section>
    <!-- Unset the position so v-date-picker can show up -->
    <q-form @submit="search" style="position: unset;">
      <div class="q-pa-md column items-center">
        <q-btn
          color="white"
          class="q-mb-lg"
          text-color="black"
          @click="selecteGuest()"
          :label="dialogGuestLabel"
        />
        <q-option-group
          :options="locationTypeOptions"
          type="radio"
          dense
          inline
          class="q-mb-md"
          v-model="formData.locationType"
        />
        <q-separator></q-separator>
        <q-btn
          block
          color="primary"
          max-height="28"
          icon="mdi-magnify"
          label="Search"
          type="submit"
          class="q-mt-md full-width"
        />
        <q-separator></q-separator>
      </div>
    </q-form>
  </section>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  toRef,
} from '@vue/composition-api';
import { ResDispDebitor } from '../models/debitor.model';

export default defineComponent({
  props: {
    selectedGuest: { type: Object as () => ResDispDebitor, required: true },
  },
  setup(props, { emit }) {
    const formData = reactive({
      locationType: 0,
    });
    const locationTypeOptions = [
      { value: 0, label: 'Local' },
      { value: 2, label: 'Foreign' },
    ];
    const guest = toRef(props, 'selectedGuest');
    const dialogGuestLabel = computed(() =>
      guest.value?.gname ? guest.value.gname : 'Select Guest'
    );

    function selecteGuest() {
      emit('selectGuest', true);
    }

    function search() {
      emit('search', formData.locationType);
    }

    return {
      locationTypeOptions,
      formData,
      search,
      dialogGuestLabel,
      selecteGuest,
    };
  },
});
</script>

<style scoped></style>
