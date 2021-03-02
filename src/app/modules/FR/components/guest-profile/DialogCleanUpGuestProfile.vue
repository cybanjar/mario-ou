<template>
  <q-dialog v-model="showDialog">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">Clean Up Guest Profile Data</span>
      </div>

      <q-form @submit="onCleanUp">
        <div class="dialog__body">
          <div class="bg-white q-px-xl q-py-lg">
            <div class="row q-col-gutter-x-lg">
              <div class="col-5">
                <div class="dialog__fieldset">
                  <div class="dialog__fieldset-title">
                    <h4>Guest Profile Preference</h4>
                  </div>
                  <SSelect
                    label-text="Guest Profile Type"
                    v-model="type"
                    emit-value
                    map-options
                    :options="typeOptions"
                  />

                  <q-option-group
                    v-model="formData.delType"
                    :options="delTypeOptions"
                    color="primary"
                  />
                </div>

                <div class="dialog__fieldset dialog__fieldset--small q-mt-lg">
                  <div class="dialog__fieldset-title">
                    <h4>Result</h4>
                  </div>
                  <div class="row q-pa-sm">
                    <div class="col-4">Found</div>
                    <div class="col-8">: {{ foundResult }}</div>

                    <div class="col-4">Deleted</div>
                    <div class="col-8">: {{ deleteResult }}</div>
                  </div>
                </div>
              </div>

              <div class="col-7">
                <div class="dialog__fieldset full-height">
                  <div class="dialog__fieldset-title">
                    <h4>Additional Information</h4>
                  </div>
                  <div class="row q-col-gutter-x-lg">
                    <div class="col-6">
                      <SInput label-text="Address" v-model="formData.address" />
                    </div>
                    <div class="col-6">
                      <DateInput
                        label-text="Last Stay Before"
                        placement="auto"
                        v-model="formData.lastStay"
                        :max-date="
                          date.subtractFromDate(new Date(), { days: 365 })
                        "
                      />
                    </div>

                    <div class="col-6">
                      <SInput label-text="City" v-model="formData.city" />
                    </div>
                    <div class="col-6">
                      <SInput
                        label-text="Sales Less Than"
                        input-class="text-right"
                        v-model.number="formData.minSales"
                      />
                    </div>

                    <div class="col-6">
                      <SInput label-text="Country" v-model="formData.country" />
                    </div>
                    <div class="col-5">
                      <SInput
                        label-text="History Older Than"
                        input-class="text-right"
                        class="input-with-badge"
                        hide-bottom-space
                        v-model.number="formData.ageHistory"
                        :rules="[
                          (val) =>
                            formData.delType !== 4 ||
                            val >= 2 ||
                            'History ages must be at least 2 years old.',
                        ]"
                      >
                        <template #after>
                          <div class="input-badge">Year</div>
                        </template>
                      </SInput>
                    </div>

                    <div class="col-6">
                      <SInput
                        label-text="Email Address"
                        v-model="formData.email"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="dialog__footer">
          <q-btn
            label="Close"
            flat
            color="primary"
            v-close-popup
            class="q-mr-md"
            no-caps
          />
          <q-btn type="submit" label="Clean Up" color="primary" no-caps />
        </div>
      </q-form>
    </div>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from '@vue/composition-api';
import DateInput from '../common/DateInput.vue';
import { date } from 'quasar';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import { GuestProfileType } from '../../models/guest-profile/guestProfile.model';

const defaultFormValues = {
  lastStay: date.subtractFromDate(new Date(), { year: 2 }),
  address: '',
  city: '',
  minSales: 0,
  country: '',
  ageHistory: 2,
  email: '',
  delType: 1,
};

export default defineComponent({
  components: {
    DateInput,
  },
  props: {
    show: { type: Boolean, required: true },
  },
  setup(props, { emit, root: { $api, $q } }) {
    const showDialog = useModelWrapper(props, emit, 'show');
    const formData = reactive({
      ...defaultFormValues,
    });
    const state = reactive({
      isFetching: false,
      foundResult: null as number,
      deleteResult: null as number,
    });

    const delTypeOptions = [
      { label: 'With History', value: 1 },
      { label: 'Without Address Only', value: 2 },
      { label: 'Without Segment Code Only', value: 3 },
      { label: 'History Only', value: 4 },
    ];

    const type = ref(GuestProfileType.Individual);
    const typeOptions = [
      { label: 'Individual', value: GuestProfileType.Individual },
      { label: 'Company', value: GuestProfileType.Company },
      { label: 'Travel Agent', value: GuestProfileType.TravelAgent },
    ];

    function onCleanUp() {
      $q.dialog({
        title: 'Confirm',
        message:
          'Please confirm the deletion of the guest Profile / histories.',
        ok: 'Yes',
        cancel: 'No',
      }).onOk(async () => {
        $q.loading.show();

        const result = await $api.frontOfficeReception.cleanUp({
          deltype: formData.delType,
          sorttype: type.value,
          adr1: formData.address || ' ',
          city: formData.city || ' ',
          cntry: formData.country || ' ',
          email: formData.email || ' ',
          lastStay: date.formatDate(formData.lastStay, 'MM/DD/YY'),
          minSales: formData.minSales,
          ageHistory: formData.ageHistory,
        });
        state.foundResult = result.fAnz;
        state.deleteResult = result.dAnz;

        resetForm();
        $q.loading.hide();
        $q.notify({
          type: 'positive',
          message: 'Clean up process is finished.',
        });
      });
    }

    function resetForm() {
      Object.entries(defaultFormValues).forEach(([key, value]) => {
        formData[key] = value;
      });
    }

    return {
      ...toRefs(state),
      showDialog,
      delTypeOptions,
      type,
      typeOptions,
      formData,
      onCleanUp,
      date,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  max-width: 854px !important;
  &__body {
    max-height: 480px !important;
    overflow: auto;
  }

  &__fieldset {
    border: 1px solid rgba(0, 0, 0, 0.12);
    padding: 32px 18px 8px;
    position: relative;
    width: 100%;

    &--small {
      padding-top: 22px;
    }
  }

  &__fieldset-title {
    background-color: #fff;
    padding: 0 12px;
    position: absolute;
    top: -18px;

    h4 {
      color: #555;
      font-size: 16px;
      font-weight: 700;
      margin: 0;
    }
  }
}

.input-with-badge::v-deep {
  .q-field--outlined .q-field__control {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 0;
    border-top-left-radius: 4px;
    border-top-right-radius: 0;

    &::before {
      border-right: none;
    }
  }

  .q-field__after {
    padding-left: 0;

    .input-badge {
      background-color: #c4c4c4;
      border-radius: 0 4px 4px 0;
      color: #555;
      font-size: 12px;
      padding: 0 8px;
    }
  }
}
</style>
