<template>
  <q-dialog v-model="dialogModel">
    <q-card style="width: 520px;">
      <q-card-section v-if="selectedParam">
        <p class="q-mb-sm">
          {{ selectedParam.bezeichnung }}
        </p>

        <SInput v-model="paramInput">
          <template v-slot:prepend>
            <div class="left-box">
              Value
            </div>
          </template>
        </SInput>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-lg">
        <q-btn
          dense
          outline
          color="primary"
          label="Cancel"
          @click="onCancel"
          class="q-mr-sm"
        />

        <q-btn
          dense
          color="primary"
          label="Save"
          @click="onUpdateParam"
          :loading="isUpdating"
          :disable="isUpdating"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from '@vue/composition-api';

export default defineComponent({
  props: {
    dialog: { type: Boolean, required: true },
    selectedParam: { type: Object, default: null },
  },
  setup(props, { emit, root: { $api } }) {
    const paramInput = ref('');
    const isUpdating = ref(false);

    watch(
      () => props.selectedParam,
      (selectedParam) => {
        if (selectedParam) {
          paramInput.value = selectedParam.values;
        }
      }
    );

    const dialogModel = computed({
      get: () => props.dialog,
      set: (val) => {
        emit('onDialog', val);
      },
    });

    const onCancel = () => {
      isUpdating.value = false;
      emit('onDialog', false);
    };

    const onUpdateParam = async () => {
      isUpdating.value = true;
      const { selectedParam } = props;
      let intval = '';
      let decval = '';
      let dateval = '';
      let logval: any = '';
      let charval = '';
      let i = '';
      let d = '';
      let l: any = '';
      let dd = '';
      let s = '';
      switch (selectedParam.feldtyp) {
        case 1:
          intval = paramInput.value;
          i = selectedParam.values;
          break;
        case 2:
          decval = paramInput.value;
          d = selectedParam.values;
          break;
        case 3:
          dateval = paramInput.value;
          dd = selectedParam.values;
          break;
        case 4:
          logval = paramInput.value === 'yes';
          l = selectedParam.values === 'no';
          break;
        case 5:
          charval = paramInput.value;
          s = selectedParam.values;
          break;
        default:
          break;
      }

      const body = {
        pvILanguage: '1',
        htpNumber: selectedParam.paramnr,
        htgrpNumber: selectedParam.paramgruppe,
        intval,
        decval,
        dateval,
        logval,
        charval,
        userInit: '01',
        i,
        d,
        l,
        dd,
        s,
      };

      const [, res] = await $api.generalLedger.getGLHtpCheck(body);
      if (res) {
        emit('onUpdate', selectedParam.paramnr, paramInput.value);
      }
      isUpdating.value = false;
    };

    return {
      dialogModel,
      paramInput,
      onCancel,
      isUpdating,
      onUpdateParam,
    };
  },
});
</script>

<style lang="scss" scoped>
.left-box {
  background-color: #fafafa;
  border-right: 1px solid $primary;
  font-size: 14px;
  padding-right: 12px;
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
