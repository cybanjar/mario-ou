<template>
  <div
    class="column items-center justify-center full-height cursor-pointer"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
    @click="onClick(item)"
  >
    <img
      :src="
        isHover
          ? require(`~/app/icons/Icon-${item.logo}-Hover.svg`)
          : require(`~/app/icons/Icon-${item.logo}.svg`)
      "
      class="img-icon"
    />

    <span class="q-mt-md">{{ item.name }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';

export default defineComponent({
  props: {
    item: { type: Object, required: true },
  },
  setup(_, {root: {$router}}) {
    const onClick = (item) => {
      if (item.name == 'Night Audit') {
        sessionStorage.removeItem('key')
        sessionStorage.removeItem('value')
      }
      $router.push(item.path)
    }
    return {
      isHover: ref(false),
      onClick
    };
  },
});
</script>

<style lang="scss" scoped>
.img-icon {
  max-width: 100px;
  height: 60px;
}
</style>
