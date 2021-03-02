<template>
  <q-dialog v-model="modal.dialog" persistent>
    <q-card style="width: 400px;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">Create Phone Book</q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <SInput 
          :label-text="sinput.label"
          :key="sinput.label"
          :style="{'marginTop': sinput.top}"
          v-for="sinput in SInputAddPhoneBook.filter(x => 
          ['Departement', 'Name', 'Address'].includes(x.label)
          )" 
          v-model="sinput.value" />
        <div class="row q-gutter-xs">
          <div 
            :key="sinput.label"
            :style="{'marginTop': sinput.top}"
            v-for="sinput in SInputAddPhoneBook.filter(x => 
            ['Country', 'City', 'Zip'].includes(x.label)
            )"  
            class="col">
            <SInput :label-text="sinput.label" v-model="sinput.value" />
          </div>
        </div>
        <SInput 
          v-for="sinput in SInputAddPhoneBook.filter(x =>
            ['Email'].includes(x.label)
          )" 
          :style="{'marginTop': sinput.top}"
          :key="sinput.label"
          :label-text="sinput.label" 
          v-model="sinput.value" />
        <div class="row q-gutter-xs">
          <div 
            :key="sinput.label"
            :style="{'marginTop': sinput.top}"
            v-for="sinput in SInputAddPhoneBook.filter(x => 
            ['Phone Number', 'Extention'].includes(x.label)
            )"  
            class="col">
            <SInput :label-text="sinput.label" v-model="sinput.value" />
          </div>
        </div>
        <div class="row q-gutter-xs">
          <div 
            :key="sinput.label"
            :style="{'marginTop': sinput.top}"
            v-for="sinput in SInputAddPhoneBook.filter(x => 
            ['Mobile Number', 'Contact Name'].includes(x.label)
            )"  
            class="col">
            <SInput :label-text="sinput.label" v-model="sinput.value" />
          </div>
        </div>
        <SInput 
          v-for="sinput in SInputAddPhoneBook.filter(x =>
            ['Remark'].includes(x.label)
          )" 
          :style="{'marginTop': sinput.top}"
          :key="sinput.label"
          :label-text="sinput.label" 
          v-model="sinput.value" />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          outline
          color="primary"
          label="Cancel"
          size="sm"
          v-close-popup 
        />

        <q-btn
          :loading="modal.loading"
          unelevated
          size="sm"
          color="primary"
          label="Save"
          @click="onSave" 
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, toRefs } from '@vue/composition-api';
import { SInputAddPhoneBook } from '../utils/paramsPhoneBook'
export default defineComponent({
  props: {
    modal: {} as any,
  },
  setup(_, { emit, root: { $api } }) {
    const data = reactive({
      SInputAddPhoneBook: SInputAddPhoneBook
    });
    
    const onSave = () => {
      emit('onSave', data.SInputAddPhoneBook)
    }

    return {
      ...toRefs(data),
      onSave
    };
  },
});
</script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}

.total-budget {
  border-radius: 4px;
  border: 1px solid $primary;

  span {
    display: inline-block;
    padding: 4px 11px;

    &:first-child {
      border-right: 1px solid $primary;
    }

    &:last-child {
      flex: 1;
      text-align: right;
    }
  }
}
</style>
