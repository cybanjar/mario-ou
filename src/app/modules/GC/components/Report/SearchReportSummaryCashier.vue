<template>
  <section class="mt-7">
    <div id="input" class="q-pa-md">
        <v-date-picker 
          v-model="search"  
          :popover="{ visibility: 'click' }">
          <SInput
            label-text="Billing Date"
            slot-scope="{ inputProps }"
            readonly
            v-bind="inputProps"
            clearable
            placeholder="Select Date"
        />
        </v-date-picker>
        <q-btn
          color="primary"
          icon="mdi-magnify"
          label="Search"
          type="submit"
          class="q-mt-md full-width"
          size="sm"
          unelevated
          @click="onSearch"
        />
    </div>
    <q-separator style="border-width: 1px;" class="q-my-md" />
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { DatePicker } from 'v-calendar';

export default defineComponent({
    props: {
        search: {} as any
    },
    setup(props, {emit}){
      const onSearch = () => {
        emit('onSearch', props.search)
      }

      return {
          onSearch
      }
    },
    components: {
      'v-date-picker': DatePicker,
    },
})
</script>