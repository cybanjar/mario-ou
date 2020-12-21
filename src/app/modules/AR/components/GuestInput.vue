<template>
  <q-btn
    color="white"
    class="q-mb-lg full-width"
    icon="mdi-open-in-new"
    text-color="black"
    @click="dialog.show"
    :label="label"
  >
    <DialogSelectGuest
      :show="dialog.status"
      @hide="dialog.hide"
      @save="setGuest"
    ></DialogSelectGuest>
  </q-btn>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
} from '@vue/composition-api';
import { useDialog } from '~/app/shared/compositions/use-dialog.composition';
export default defineComponent({
  props: {
    value: { type: Object, required: true },
  },
  setup(props, { emit }) {
    const dialog = useDialog();
    const dialogGuestLabel = computed(() =>
      props.value?.gname ? props.value.gname : 'Select Guest'
    );

    const state = reactive({
      dialogGuestLabel,
      show: false,
    });
    const label = computed(() => (props.value?.gname ? props.value.gname : ''));

    function setGuest(guest) {
      emit('input', guest);
    }

    return {
      ...toRefs(state),
      dialog,
      setGuest,
      label,
    };
  },
  components: {
    DialogSelectGuest: () => import('./DialogSelectGuest.vue'),
  },
});
</script>
