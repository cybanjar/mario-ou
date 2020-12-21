<template>
  <div style="marginLeft: 20px; marginTop: 25px">
    <div class="row">
      <SSelect
        :key="i.name"
        v-for="i in searches.InputSearch.filter(x => [
        'Supp No', 'To Store'].includes(x.name))"
        :label-text="i.name"
        :style="{width: i.width, marginRight: i.right}"
        v-model="i.value"
        :options="i.options"
        />
      <SInput
        :key="i.name"
        v-for="i in searches.InputSearch.filter(x => [
        'Delivery Note'].includes(x.name))"
        :label-text="i.name"
        :style="{width: i.width, marginRight: i.right}"
        v-model="i.value"
      />
      <SSelect
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        :options="i.options"
        :key="i.name"
        v-for="i in searches.InputSearch.filter(x => [
        'Articel Number'].includes(x.name))"
        :label-text="i.name"
        :style="{width: i.width, marginRight: i.right}"
        v-model="i.value"
        @filter="filterFn"
        @input="ariticelnumber(i.value)"
        />
      <SInput
        :key="i.name"
        v-for="i in searches.InputSearch.filter(x => [
        'Quanity', 'Price'].includes(x.name))"
        :label-text="i.name"
        :style="{width: i.width, marginRight: i.right}"
        v-model="i.value"
      />
      <q-btn
        color="primary"
        style="height: 25px; width: 150px; right: -170px; marginTop: 10px"
        icon="mdi-plus"
        size="sm"
        label="Add"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  toRefs,
  reactive,
  ref,
} from '@vue/composition-api';
export default defineComponent({
    props: {
        searches: {} as any
    },
    setup(props, { emit }) {
        const state = reactive({
          price: 0
        })

        const ariticelnumber = (e) => {
          props.searches.InputSearch[3].value = e.value
        }

        const filterFn = (val, update) => {
          emit('filterFn', val, update)
        }
        
        return {
          ...toRefs(state),
          filterFn,
          ariticelnumber
        }
    },
})
</script>