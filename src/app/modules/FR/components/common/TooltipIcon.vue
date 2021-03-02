<template>
  <q-icon v-bind="$attrs" :color="color">
    <q-tooltip anchor="top middle" self="center middle">
      {{ tooltipText }}
    </q-tooltip>
  </q-icon>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: {
    color: { type: String, default: 'primary' },
    tooltipText: { type: String, required: true },
  },
});
</script>
