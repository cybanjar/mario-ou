<template>
  <q-popup-proxy ref="popUp" v-bind="$attrs" v-on="$listeners">
    <q-banner inline-actions rounded class="banner-alert bg-white text-black">
      <template #avatar>
        <q-icon name="mdi-information" size="sm" class="text-yellow" />
      </template>
      <div>
        {{ message }}
      </div>
      <template #action>
        <div class="row q-gutter-sm">
          <q-btn outline color="gray" v-close-popup size="sm" label="No" />
          <q-btn
            color="primary"
            unelevated
            size="sm"
            @click="$emit('save')"
            label="Yes"
          />
        </div>
      </template>
    </q-banner>
  </q-popup-proxy>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: {
    message: { type: String, required: true },
  },
  setup(_, { refs }) {
    const hide = () => (refs.popUp as any).hide();

    return { hide };
  },
});
</script>
<style lang="scss">
.banner-alert {
  max-width: 240px;
  .q-banner {
    &__avatar,
    &__actions,
    &__content {
      font-size: 10px;
    }
    &__actions {
      width: 100%;
    }
  }
}
</style>
