<template>
  <section>
    <q-dialog v-model="dialogModel" persistent>
      <q-card  style="max-width: 1500px;width:450px;">
        <q-toolbar>
          <q-toolbar-title class="text-white text-weight-medium">{{title}}</q-toolbar-title>
        </q-toolbar>

        <q-card-section>
          <div class="q-ma-sm q-gutter-xs">
            <!-- <SInput outlined v-model="data.dataInputMultiple" label-text="Multiple" data-layout="numeric" ref="priceBox" @focus="showKeyboard" /> -->
          </div>

          <div class="q-ma-sm row q-gutter-xs">
            <div class="col">
              <vue-touch-keyboard
              id="keyboard"
              :layout="layout"
              :input="input" />
            </div>
          </div>
          
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn outline color="primary" label="Cancel" @click="onCancelDialog"  />
          <q-btn unelevated color="primary" label="OK" @click="onOkDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script lang="ts">
import {defineComponent, computed, watch, reactive, toRefs,} from '@vue/composition-api';
import { Notify } from 'quasar';

interface State {
  isLoading: boolean;
  data: {
    
  },
  layout: string;
  input: null;
  title: string;
}

export default defineComponent({
  props: {
    showDialogSelectMenuItem: { type: Boolean, required: true },
  },

  setup(props, { emit, root: { $api } }) {
    const state = reactive<State>({
      isLoading: false,
      data: {
        
      },
      title: '',
      layout: 'numeric',
      input: null,
    });

    watch(
      () => props.showDialogSelectMenuItem, (showDialogInputMultiple) => {
        if (props.showDialogSelectMenuItem) {
          state.title = 'Select Menu item';
        }
      }
    );

    const dialogModel = computed({
        get: () => props.showDialogSelectMenuItem,
        set: (val) => {
            emit('onDialogInputDescription', val, state.data);
        },
    });

    const showKeyboard = (e) => {
      if (e.target.localName == "input") {
        state.input = e.target; 
        state.layout = e.target.dataset.layout;
      } 
    }

    // -- 
    const onOkDialog = () => {
      emit('onDialogInputDescription', false, state.data);
    }

    const onCancelDialog = () => {
      state.data = {};
      emit('onDialogInputDescription', false, {});
    }

    return {
      dialogModel,
      ...toRefs(state),
      onOkDialog,
      showKeyboard,
      onCancelDialog,
      pagination: { rowsPerPage: 0 },
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

