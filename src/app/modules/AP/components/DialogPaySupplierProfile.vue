<template>
  <q-dialog :value="show" @hide="hide">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">Supplier Administration</span>
      </div>
      <q-form @submit="onSubmit">
        <div class="bg-white q-pa-lg">
          <div class="dialog__form-top row justify-between">
            <div class="col-6">
              <SInput label-text="Supplier Number" disable />
            </div>
            <div class="col-2">
              <SInput label-text="Title" />
            </div>
            <div class="col-3">
              <SInput label-text="Supplier Name" />
            </div>
          </div>

          <q-splitter :value="139" unit="px">
            <template #before>
              <q-tabs
                v-model="tab"
                vertical
                no-caps
                active-color="primary"
                indicator-color="primary"
              >
                <q-tab name="contact" label="Contact" />
                <q-tab name="address" label="Address" />
                <q-tab name="bank-account" label="Bank Account" />
                <q-tab name="additional-info" label="Additional Info" />
              </q-tabs>
            </template>

            <template #after>
              <div class="q-pl-lg">
                <q-tab-panels
                  v-model="tab"
                  animated
                  swipeable
                  vertical
                  transition-prev="jump-up"
                  transition-next="jump-up"
                >
                  <q-tab-panel name="contact">
                    <div class="row justify-between">
                      <div class="col-6">
                        <SInput label-text="Contact Name" />
                      </div>
                      <div class="col-2">
                        <SInput label-text="First Name" />
                      </div>
                      <div class="col-3">
                        <SInput label-text="Title" />
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-12">
                        <SInput label-text="Phone 1" />
                        <SInput label-text="Phone 2" />
                        <SInput label-text="Fax" />
                      </div>
                    </div>
                  </q-tab-panel>

                  <q-tab-panel name="address">
                    <div class="row">
                      <div class="col-12">
                        <SInput label-text="Address" />
                        <SInput />
                        <SInput />
                        <SInput label-text="City" />
                        <SInput label-text="Postal Code" />
                        <SelectFilter
                          label-text="Country"
                          :options="countryList"
                          option-value="nationnr"
                          option-label="bezeich"
                        />
                      </div>
                    </div>
                  </q-tab-panel>

                  <q-tab-panel name="bank-account">
                    <div class="row">
                      <div class="col-12">
                        <SInput label-text="Bank Name" />
                        <SInput label-text="Bank Account Number" />
                        <SInput label-text="Bank Account Holder" />
                      </div>
                    </div>
                  </q-tab-panel>

                  <q-tab-panel name="additional-info">
                    <div class="row">
                      <div class="col-12">
                        <SSelect
                          label-text="Segment"
                          :options="segment"
                          v-model="data.segment"
                          emit-value
                          map-options
                          option-label="l-bezeich"
                          option-value="l-segmentcode"
                        >
                          <template
                            v-if="data.segment === null"
                            v-slot:selected
                          >
                            <div class="text-grey-6">All</div>
                          </template>
                        </SSelect>
                        <SInput label-text="Account Number" />
                        <SInput label-text="Discount" />
                      </div>
                      <div class="col-3">
                        <SInput
                          label-text="Last Delivery"
                          v-model="data.date"
                          hide-bottom-space
                          readonly
                          :rules="['date']"
                        >
                          <template #append>
                            <q-icon name="mdi-calendar" />
                          </template>

                          <q-popup-proxy
                            ref="qDateProxy"
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              v-model="data.date"
                              mask="DD/MM/YYYY"
                              today-btn
                              @input="() => $refs.qDateProxy.hide()"
                            />
                          </q-popup-proxy>
                        </SInput>
                      </div>
                      <div class="col-12">
                        <SInput label-text="Remark" type="textarea" rows="4" />
                      </div>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </div>
            </template>
          </q-splitter>
        </div>
        <div class="dialog__footer">
          <q-btn
            label="Cancel"
            color="primary"
            flat
            class="q-mr-sm"
            v-close-popup
          />
          <q-btn label="Submit" type="submit" color="primary" />
        </div>
      </q-form>
    </div>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from '@vue/composition-api';
import { date } from 'quasar';
import { ResCountry, ResSegment } from '../models/supplier-profile.model';

export default defineComponent({
  props: {
    show: { type: Boolean, required: true },
  },
  setup(_, { emit, root: { $api } }) {
    const hide = () => emit('hide');
    const tab = ref('contact');

    // Start fetch Country data
    const countryList = ref<ResCountry[]>([]);
    (async () => {
      countryList.value = await $api.accountsPayable.getCountry();
    })();
    // End fetch Country data

    // Start fetch Segment data
    const segment = ref<ResSegment[]>([]);
    (async () => {
      segment.value = await $api.accountsPayable.getSegment();
    })();
    // End fetch Segment data

    // TODO: Form still not working in react version
    // Place all form data here
    const data = reactive({
      country: null,
      segment: null,
      date: date.formatDate(new Date(), 'DD/MM/YYYY'),
    });

    function onSubmit() {
      // TODO: Form still not working in react version
    }

    return {
      hide,
      tab,
      countryList,
      segment,
      data,
      onSubmit,
    };
  },
  components: {
    SelectFilter: () => import('./SelectFilter.vue'),
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  max-width: 900px !important;

  &__form-top {
    margin-left: 164px;
  }

  .q-tab-panel {
    padding: 0;
  }
}
</style>
