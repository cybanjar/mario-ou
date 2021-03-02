<template>
  <p>Create Reservation Page</p>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  setup(_, { root: { $route } }) {
    console.log($route.params.id);
  },
});
</script>
