<template>
  <q-page>
    <q-drawer :value="true" side="left" bordered :width="250" persistent>
      <slot name="filters" />
    </q-drawer>

    <div class="q-pa-lg">
      <SharedModuleActions @onActions="$emit('onActions', $event)" />

      <slot name="table" />
    </div>

    <slot />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  components: {
    SharedModuleActions: () =>
      import('~/app/shared/components/SharedModuleActions.vue'),
  },
});
</script>
