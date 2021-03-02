<template>
  <q-dialog v-model="showDialog" :persistent="!formStatus.disabled">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">
          {{ formStatus.view ? 'View' : 'Create' }} Guest Profile
          {{ type === GuestProfileType.Company ? 'Company' : 'Travel Agent' }}
        </span>
      </div>
      <q-form @submit="onSubmit" ref="formRef">
        <div class="row bg-white" style="max-height: 500px; overflow: auto">
          <div class="col q-pt-lg q-pl-lg">
            <div class="row items-start">
              <div class="col-2 q-mr-lg">
                <SInput
                  label-text="Guest Number"
                  :value="guestNumber"
                  disable
                />
              </div>

              <q-btn
                flat
                round
                class="q-mr-md icon-button"
                :disable="!formStatus.disabled"
                @click="enableModify"
              >
                <inline-svg
                  :src="require('~/app/icons/FR/Icon-Writing.svg')"
                  height="30"
                />
              </q-btn>

              <q-btn
                flat
                round
                class="icon-button"
                :disable="!formStatus.disabled"
              >
                <img
                  :src="
                    require(`~/app/icons/FR/${
                      formStatus.disabled ? 'Icon-Print' : 'Icon-PrintDisabled'
                    }.svg`)
                  "
                  height="30"
                />
              </q-btn>
            </div>

            <q-splitter :value="162" unit="px">
              <template #before>
                <q-tabs
                  v-model="tab"
                  vertical
                  no-caps
                  active-color="primary"
                  indicator-color="primary"
                >
                  <q-tab name="main-information" label="Main Information" />
                  <q-tab name="sales-accounting" label="Sales and Accounting" />
                  <q-tab
                    name="additional-information"
                    label="Additional Information"
                  />
                </q-tabs>
              </template>

              <template #after>
                <q-tab-panels
                  v-model="tab"
                  animated
                  swipeable
                  vertical
                  transition-prev="jump-up"
                  transition-next="jump-up"
                  keep-alive
                >
                  <q-tab-panel name="main-information" class="q-pt-none">
                    <div class="row q-col-gutter-x-lg">
                      <div class="col-6">
                        <SInput
                          :label-text="`${
                            type === GuestProfileType.Company
                              ? 'Company'
                              : 'Agent'
                          } Name`"
                          v-model="formData.name"
                          :disable="formStatus.disabled"
                          :rules="[(val) => !!val || 'Field is required']"
                          :hide-bottom-space="true"
                          :maxlength="34"
                        />
                      </div>
                      <div class="col-3">
                        <SSelect
                          label-text="Company Title"
                          :options="titleOptions"
                          v-model="formData.companyTitle"
                          :disable="formStatus.disabled"
                        />
                      </div>

                      <div class="col-6">
                        <SInput
                          label-text="Phone"
                          v-model="formData.phone"
                          :disable="formStatus.disabled"
                          :maxlength="24"
                        />
                      </div>
                      <div class="col-6">
                        <SInput
                          label-text="Fax"
                          v-model="formData.fax"
                          :disable="formStatus.disabled"
                          :maxlength="24"
                        />
                      </div>

                      <div class="col-6">
                        <SInput
                          label-text="Email"
                          v-model="formData.email"
                          :disable="formStatus.disabled"
                        />
                      </div>
                      <div class="col-6">
                        <SInput
                          label-text="Main Contact"
                          v-model="formData.mainContact"
                          :disable="formStatus.disabled"
                        />
                      </div>

                      <div class="col-3">
                        <SSelect
                          label-text="Country"
                          :options="countryOptions"
                          v-model="formData.country"
                          :disable="formStatus.disabled"
                          emit-value
                          :rules="[(val) => !!val || 'Field is required']"
                          :hide-bottom-space="true"
                        />
                      </div>
                      <div class="col-3">
                        <SSelect
                          label-text="Book Source"
                          :options="bookSourceOptions"
                          v-model="formData.bookSource"
                          :disable="formStatus.disabled"
                          emit-value
                          map-options
                          :rules="[(val) => !!val || 'Field is required']"
                          :hide-bottom-space="true"
                        />
                      </div>

                      <div class="col-6">
                        <SSelect
                          label-text="Main Segment"
                          :options="mainSegmentOptions"
                          :option-label="
                            (opt) => `${opt.segmentcode} - ${opt.bezeich}`
                          "
                          v-model="formData.mainSegment"
                          :disable="formStatus.disabled"
                          multiple
                          use-chips
                          :rules="[
                            (val) =>
                              (val && val.length > 0) || 'Field is required',
                          ]"
                          :hide-bottom-space="true"
                        />
                      </div>

                      <div class="col-6">
                        <SInput
                          label-text="Address"
                          type="textarea"
                          v-model="formData.address"
                          :disable="formStatus.disabled"
                        />
                      </div>
                      <div class="col-6">
                        <SInput
                          label-text="City"
                          v-model="formData.city"
                          :disable="formStatus.disabled"
                        />
                        <SInput
                          label-text="Postal Code"
                          v-model="formData.postalCode"
                          :disable="formStatus.disabled"
                          :maxlength="10"
                        />
                      </div>
                    </div>
                  </q-tab-panel>

                  <q-tab-panel name="sales-accounting" class="q-pt-none">
                    <div class="row q-col-gutter-x-lg q-mb-lg">
                      <div class="col-3">
                        <SSelect
                          label-text="Sales ID"
                          :options="salesIdOptions"
                          v-model="formData.salesId"
                          :disable="formStatus.disabled"
                          emit-value
                          map-options
                        />
                      </div>
                      <div class="col-3">
                        <SInput
                          label-text="Reference Number"
                          v-model.number="formData.referenceNumberLeft"
                          :disable="formStatus.disabled"
                        />
                      </div>
                      <div class="col-6">
                        <SInput
                          label-text="Reference Number"
                          v-model.number="formData.referenceNumberRight"
                          :disable="formStatus.disabled"
                        />
                      </div>

                      <div class="col-6">
                        <SInput
                          label-text="Channel Manager Code"
                          v-model="formData.channelManagerCode"
                          :disable="formStatus.disabled"
                        />
                      </div>
                      <div class="col-6">
                        <SInput
                          label-text="Contract Rate"
                          :value="formData.contractRate"
                          :disable="formStatus.disabled || !formStatus.view"
                          readonly
                        >
                          <template #append>
                            <q-icon
                              name="mdi-help-circle"
                              :color="
                                !formStatus.disabled && formStatus.view
                                  ? 'primary'
                                  : null
                              "
                              size="20px"
                              class="cursor-pointer"
                              @click="dialogAttachContractRate.open()"
                            />
                          </template>
                        </SInput>
                      </div>
                    </div>

                    <div class="row q-col-gutter-x-lg">
                      <div class="col-6">
                        <SSelect
                          label-text="Payment Method"
                          :options="paymentMethodOptions"
                          v-model="formData.paymentMethod"
                          :disable="formStatus.disabled"
                          emit-value
                          map-options
                        />
                      </div>
                      <div class="col-6">
                        <SInput
                          label-text="Credit Limit"
                          v-model.number="formData.creditLimit"
                          :disable="formStatus.disabled"
                        />
                      </div>

                      <div class="col-3">
                        <SInput
                          input-class="text-right"
                          label-text="Days"
                          type="number"
                          min="0"
                          v-model.number="formData.days"
                          :disable="formStatus.disabled"
                        />
                      </div>
                      <div class="col-3">
                        <SInput
                          label-text="Credit Account Number"
                          v-model="formData.creditAccountNumber"
                          :disable="formStatus.disabled"
                        />
                      </div>
                    </div>
                  </q-tab-panel>

                  <q-tab-panel name="additional-information" class="q-pt-none">
                    <div class="row q-col-gutter-x-lg q-col-gutter-y-md">
                      <div class="col-6">
                        <SInput
                          label-text="Remark"
                          type="textarea"
                          v-model="formData.remark"
                          :disable="formStatus.disabled"
                          input-classes="q-mb-none"
                        />
                      </div>
                      <div class="col-6">
                        <label>History</label>
                        <STable
                          class="table sticky-header"
                          :columns="tableHeaderHistory"
                          :data="table.history"
                          no-data-text="No Data"
                        />
                      </div>

                      <div class="col-6">
                        <label>Guest Contact</label>
                        <STable
                          class="table sticky-header"
                          :columns="tableHeaderGuestContact"
                          :data="table.guestContact"
                          no-data-text="No Data"
                        />
                      </div>
                      <div class="col-6">
                        <label>Forecast</label>
                        <STable
                          class="table sticky-header"
                          :columns="tableHeaderForecast"
                          :data="table.forecast"
                          no-data-text="No Data"
                        />
                      </div>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </template>
            </q-splitter>
          </div>

          <div class="dialog__sidebar-right q-pt-lg">
            <q-list>
              <q-item clickable v-ripple class="justify-center">
                <img
                  :src="require('~/app/icons/FR/Icon-MemberCard.svg')"
                  height="20"
                />
              </q-item>

              <q-item
                clickable
                :disable="!formStatus.view"
                v-ripple
                class="justify-center icon-button"
                @click="dialogContactPersonCompany.open()"
              >
                <inline-svg
                  :src="require('~/app/icons/FR/Icon-PhoneBook.svg')"
                  height="27"
                />
              </q-item>

              <q-item
                clickable
                :disable="!formStatus.view"
                v-ripple
                class="justify-center icon-button"
                @click="dialogCreditCard.open()"
              >
                <inline-svg
                  :src="require('~/app/icons/FR/Icon-PayCard.svg')"
                  height="20"
                />
              </q-item>

              <q-item
                clickable
                :disable="!formStatus.view"
                v-ripple
                class="justify-center icon-button"
                @click="dialogGuestInformation.open()"
              >
                <q-icon
                  name="mdi-poll"
                  size="28px"
                  class="dialog__sidebar-right-icon-color"
                />
              </q-item>

              <q-item
                clickable
                :disable="!formStatus.view"
                v-ripple
                class="justify-center icon-button"
                @click="
                  $router.push(`/fr/extra/guest-profile-history/${guestNumber}`)
                "
              >
                <q-icon
                  name="mdi-history"
                  size="26px"
                  class="dialog__sidebar-right-icon-color"
                />
              </q-item>
            </q-list>
          </div>
        </div>

        <div class="dialog__footer">
          <q-btn
            label="Cancel"
            color="primary"
            flat
            class="q-mr-sm"
            @click="onCancel"
          />
          <q-btn label="Save" type="submit" color="primary" />
        </div>
      </q-form>

      <q-inner-loading :showing="isPreparing" color="primary" />
    </div>

    <DialogAttachContractRate
      :show.sync="dialogAttachContractRate.state.show"
      :key="dialogAttachContractRate.state.key"
      :guest-number="guestNumber"
      v-if="guestNumber"
      @save="onSaveContractRate"
    />

    <DialogContactPersonCompany
      :show.sync="dialogContactPersonCompany.state.show"
      :key="dialogContactPersonCompany.state.key"
      :guest-number="guestNumber"
      v-if="guestNumber"
    />

    <DialogCreditCard
      :show.sync="dialogCreditCard.state.show"
      :key="dialogCreditCard.state.key"
      :guest-number="guestNumber"
      v-if="guestNumber"
    />

    <DialogGuestInformation
      :show.sync="dialogGuestInformation.state.show"
      :key="dialogGuestInformation.state.key"
      :guest-number="guestNumber"
      v-if="guestNumber"
    />
  </q-dialog>
</template>

<script src="../../functions/common/dialog-guest-profile-company.ts"></script>

<style lang="scss" scoped>
.dialog {
  max-width: 980px !important;

  &__sidebar-right {
    border-left: 1px solid rgba(0, 0, 0, 0.12);
    padding-left: 0;
  }

  &__sidebar-right-icon-color {
    color: #c4c4c4;
  }
}

.icon-button {
  &.disabled {
    opacity: 1 !important;
  }

  &:not(.disabled)::v-deep svg path {
    fill: $primary;
  }

  &:not(.disabled) i {
    color: $primary;
  }
}

.table {
  max-height: 145px;
}
</style>
