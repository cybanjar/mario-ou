<template>
  <q-dialog v-model="dialogModel">
    <q-card style="width: 500px;">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">Create Phone Book</q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <!-- {{ dataSelected }} -->
        <SInput label-text="Department" v-model="department" />
        <SInput label-text="Name" v-model="name" />
        <SInput label-text="Address" v-model="address" />
        <div class="row q-gutter-xs">
          <div class="col">
            <SInput label-text="Country" v-model="country" />
          </div>
          <div class="col">
            <SInput label-text="City" v-model="city" />
          </div>
          <div class="col">
            <SInput label-text="Zip" v-model="zip" />
          </div>
        </div>
        <SInput label-text="Email" v-model="email" />
        <div class="row q-gutter-xs">
          <div class="col">
            <SInput label-text="Phone number" v-model="phonenumber" />
          </div>
          <div class="col">
            <SInput label-text="Extention" v-model="extention" />
          </div>
        </div>
        <div class="row q-gutter-xs">
          <div class="col">
            <SInput label-text="Mobile number" v-model="mobilenumber" />
          </div>
          <div class="col">
            <SInput label-text="Contact Name" v-model="contactname" />
          </div>
        </div>
        <SInput label-text="Remark" v-model="remark" />
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          outline
          color="primary"
          label="Cancel"
          @click="$emit('onModal', false)"
          size="sm"
        />

        <q-btn
          size="sm"
          color="primary"
          label="Save"
          @click="$emit('onModal', false)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, computed, reactive } from '@vue/composition-api';

export default defineComponent({
  props: {
    modal: { type: Boolean, required: true },
  },
  setup(props, { emit, root: { $api } }) {
    const data = reactive({
      title: '',
    });

    const dialogModel = computed({
      get: () => props.modal,
      set: (val) => {
        emit('onModal', val);
      },
    });

    return {
      dialogModel,
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
