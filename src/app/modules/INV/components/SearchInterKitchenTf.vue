<template>
  <section style="marginLeft: 30px; marginTop: 20px" class="mt-7">
    <SInput
      :key="i.name"
      v-for="i in searches.use_input.filter(x => [
       'User'
      ].includes(x.name))"
      :label-text="i.name"
      :style="{width: i.width, marginTop: i.top, marginRight: i.right}"
      :disable="i.disable"
      v-model="i.value"
    />
    <SSelect
      :key="i.name"
      v-for="i in searches.use_input.filter(x => [
      'From Departement', 'To Departement', 'Articel Name'
      ].includes(x.name))"
      :label-text="i.name"
      :style="{width: i.width, marginTop: i.top, marginRight: i.right}"
      :disable="i.disable"
      v-model="i.value"
      :options="i.option"
    />
    <SInput
      :key="i.name"
      v-for="i in searches.use_input.filter(x => [
      'Quantity',
      ].includes(x.name))"
      :label-text="i.name"
      :style="{width: i.width, marginTop: i.top, marginRight: i.right}"
      :disable="i.disable"
      v-model="i.value"
    />
    <q-btn
      color="primary"
      icon="mdi-plus"
      label="add"
      style="width: 160px; height: 25px"
      size="sm"
      @click="add"
      unelevated
    />
    <q-separator style="border-width: 1px;" class="q-my-md" />
    <SRemarkLeftDrawer 
        class="col" 
        style="marginRight: 10px" 
        label="Price" 
        :value="searches.art" />
  </section>
</template>


<script lang="ts">
import { defineComponent } from '@vue/composition-api';
export default defineComponent({
  props: {
      searches: {} as any
  },
  setup(props, { emit }) {
    const add = () => {
      emit('add', {...props});
    };
    return {
      add,
    };
  },
});
</script>

