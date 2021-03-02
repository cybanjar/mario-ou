<template>
  <div class="row q-gutter-md">
    <div class="col">
      <SSelect
        label-text="Room"
        :options="searches.store"
        v-model="store"
        :disable="!searches['active']"
      />
      <SSelect
        label-text="Seating"
        :options="searches.store"
        v-model="store"
        :disable="!searches['active']"
      />
      <SInput
        label-text="Description"
        v-model="day"
        :disable="!searches['active']"
      />
    </div>
    <div class="col">
      <SInput
        label-text="Size (m2)"
        v-model="day"
        :disable="!searches['active']"
      />
      <SInput
        label-text="Extension"
        v-model="day"
        :disable="!searches['active']"
      />
      <SInput
        label-text="Max Person"
        v-model="day"
        :disable="!searches['active']"
      />
    </div>
    <div class="col">
      <SInputCurrency
        label-text="Daily Rate"
        v-model="price"
        :disable="!searches['active']"
        :currency="{
          distractionFree: false,
          currency: null,
        }"
      />
      <SInputMoney
        label-text="Prepare"
        v-model.number="duit"
        hide-bottom-space
        :disable="!searches['active']"
      ></SInputMoney>
      <SFile
        label-text="Picture Name"
        v-model="file"
        accept="image/*"
        :disable="!searches['active']"
      >
        <span class="mdi mdi-attachment mdi-rotate-315 mdi-18px"></span>
      </SFile>
    </div>
    <div class="col self-end">
      <div class="q-gutter-md" style="width: 375px; marginBottom: 15px">
        <q-btn
          block
          color="white"
          text-color="primary"
          max-height="10"
          label="Cancel"
          type="submit"
          style="height: 25px; width: 100px"
          size="sm"
          unelevated
          :disable="!searches['active']"
        />
        <q-btn
          block
          color="primary"
          max-height="10"
          label="Save"
          type="submit"
          style="height: 25px; width: 100px"
          size="sm"
          unelevated
          :disable="!searches['active']"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive } from '@vue/composition-api';
export default defineComponent({
  props: {
    searches: {} as any,
  },
  setup(_, { root: { $api } }) {
    const state = reactive({
      duit: 1000,
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>
