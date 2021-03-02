<template>
  <q-dialog v-model="showDialog" :persistent="!formStatus.disabled">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">
          {{ formStatus.view ? 'View' : 'Create' }} Guest Profile Individual
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
                  <q-tab
                    name="personal-information"
                    label="Personal Information"
                  />
                  <q-tab
                    name="account-information"
                    label="Account Information"
                  />
                  <q-tab name="address-detail" label="Address Detail" />
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
                  <q-tab-panel name="personal-information" class="q-pt-none">
                    <div class="row q-col-gutter-x-lg">
                      <div class="col-6">
                        <SInput
                          label-text="Name"
                          v-model="formData.name"
                          :disable="formStatus.disabled"
                          :rules="[(val) => !!val || 'Field is required']"
                          :hide-bottom-space="true"
                          :maxlength="35"
                        />
                      </div>
                      <div class="col-6">
                        <SInput
                          label-text="First Name"
                          v-model="formData.firstName"
                          :disable="formStatus.disabled"
                          :maxlength="35"
                        />
                      </div>

                      <div class="col-3">
                        <SSelect
                          label-text="Title"
                          :options="titleOptions"
                          v-model="formData.title"
                          :disable="formStatus.disabled"
                        />
                      </div>
                      <div class="col-3">
                        <SSelect
                          label-text="Gender"
                          :options="['Male', 'Female']"
                          v-model="formData.gender"
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
                          label-text="Nation"
                          :options="countryOptions"
                          v-model="formData.nation"
                          :disable="formStatus.disabled"
                          emit-value
                          :rules="[(val) => !!val || 'Field is required']"
                          :hide-bottom-space="true"
                        />
                      </div>

                      <div class="col-6">
                        <DateInput
                          label-text="Birthdate"
                          placement="auto"
                          v-model="formData.birthdate"
                          :disable="formStatus.disabled"
                        />
                      </div>
                      <div class="col-6">
                        <SInput
                          label-text="Birthplace"
                          v-model="formData.birthPlace"
                          :disable="formStatus.disabled"
                          :maxlength="24"
                        />
                      </div>

                      <div class="col-6">
                        <span>Upload ID Card</span>
                        <div
                          class="upload-id-image"
                          :class="formStatus.disabled && 'disabled'"
                          v-if="formData.idCard.length"
                        >
                          <img
                            :src="'data:image/png;base64,' + formData.idCard"
                          />
                          <q-btn
                            color="white"
                            icon="mdi-delete"
                            text-color="red"
                            padding="xs"
                            @click="formData.idCard = ''"
                          />
                        </div>
                        <template v-else>
                          <label class="upload-id-card" for="upload-id-card">
                            <q-icon name="mdi-camera" size="74px" />
                            <p>Upload ID Card</p>
                          </label>
                          <input
                            type="file"
                            id="upload-id-card"
                            accept="image/*"
                            @change="onChangeIdCardFile"
                            :disabled="formStatus.disabled"
                          />
                        </template>
                      </div>
                      <div class="col-6">
                        <div class="row q-col-gutter-x-lg">
                          <div class="col-6">
                            <SSelect
                              label-text="ID Card Type"
                              :options="idCardTypeOptions"
                              v-model="formData.idCardType"
                              :disable="formStatus.disabled"
                              emit-value
                              map-options
                            />
                          </div>

                          <div class="col-6">
                            <DateInput
                              label-text="Expired Date"
                              placement="auto"
                              v-model="formData.expiredDate"
                              :disable="formStatus.disabled"
                            />
                          </div>
                        </div>
                        <SInput
                          label-text="ID Card Number"
                          v-model="formData.idCardNumber"
                          :disable="formStatus.disabled"
                          :maxlength="20"
                        />
                      </div>
                    </div>
                  </q-tab-panel>

                  <q-tab-panel name="account-information" class="q-pt-none">
                    <div class="q-mb-md">
                      <b>Private Information</b>
                    </div>
                    <div class="row q-col-gutter-x-lg q-mb-lg">
                      <div class="col-6">
                        <SInput
                          label-text="Mobile Number"
                          v-model="formData.mobileNumber"
                          :disable="formStatus.disabled"
                          :maxlength="20"
                        />
                      </div>
                      <div class="col-6">
                        <SInput
                          label-text="Email Address"
                          v-model="formData.emailAddress"
                          :disable="formStatus.disabled"
                          :maxlength="24"
                        />
                      </div>
                    </div>

                    <div class="q-mb-md">
                      <b>Work Information</b>
                    </div>
                    <div class="row q-col-gutter-x-lg">
                      <div class="col-6">
                        <SInput
                          label-text="Phone Number"
                          v-model="formData.phoneNumber"
                          :disable="formStatus.disabled"
                          :maxlength="20"
                        />
                      </div>
                      <div class="col-6">
                        <SInput
                          label-text="Fax"
                          v-model="formData.fax"
                          :disable="formStatus.disabled"
                          :maxlength="20"
                        />
                      </div>

                      <div class="col-6">
                        <SInput
                          label-text="Occupation"
                          v-model="formData.occupation"
                          :disable="formStatus.disabled"
                          :maxlength="24"
                        />
                      </div>
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
                    </div>
                  </q-tab-panel>

                  <q-tab-panel name="address-detail" class="q-pt-none">
                    <div class="row q-col-gutter-x-lg">
                      <div class="col-6">
                        <SInput
                          label-text="Province"
                          v-model="formData.province"
                          :disable="formStatus.disabled"
                          :maxlength="20"
                        />
                      </div>
                      <div class="col-6">
                        <SSelect
                          label-text="Local Region"
                          :options="localRegionOptions"
                          v-model="formData.localRegion"
                          emit-value
                          :disable="
                            defaultCountry !== formData.country ||
                            formStatus.disabled
                          "
                        />
                      </div>

                      <div class="col-6">
                        <SInput
                          label-text="City"
                          v-model="formData.city"
                          :disable="formStatus.disabled"
                          :maxlength="20"
                        />
                      </div>
                      <div class="col-6">
                        <SInput
                          label-text="Postal Code"
                          v-model="formData.postalCode"
                          :disable="formStatus.disabled"
                        />
                      </div>

                      <div class="col-12">
                        <SInput
                          label-text="Address"
                          type="textarea"
                          v-model="formData.address"
                          :disable="formStatus.disabled"
                        />
                      </div>
                    </div>
                  </q-tab-panel>

                  <q-tab-panel name="additional-information" class="q-pt-none">
                    <div class="row q-col-gutter-x-lg q-col-gutter-y-md">
                      <div class="col-6">
                        <div class="row items-center">
                          <div class="col-6">
                            <label class="inline-block">VIP</label>
                            <q-toggle
                              size="md"
                              v-model="formData.vip"
                              :disable="formStatus.disabled"
                            />
                          </div>

                          <div class="col-6">
                            <SSelect
                              :disable="!formData.vip || formStatus.disabled"
                              :options="vipSegmentOptions"
                              v-model="formData.vipSegment"
                              emit-value
                              map-options
                              input-classes="q-mb-none"
                              :rules="[
                                (val) =>
                                  !formData.vip ||
                                  val !== null ||
                                  'Field is required',
                              ]"
                              :hide-bottom-space="true"
                            />
                          </div>
                        </div>
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
              <q-item
                clickable
                :disable="!formStatus.view"
                v-ripple
                class="justify-center icon-button"
                @click="dialogContactPersonIndividual.open()"
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

    <DialogContactPersonIndividual
      :show.sync="dialogContactPersonIndividual.state.show"
      :key="dialogContactPersonIndividual.state.key"
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

<script src="../../functions/common/dialog-guest-profile-individual.ts"></script>

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

.upload-id-image {
  position: relative;

  &.disabled {
    opacity: 1 !important;
  }

  img {
    border-radius: 8px;
    display: block;
    width: 100%;
  }

  button {
    position: absolute;
    right: 16px;
    top: 16px;
    visibility: hidden;
  }

  &:not(.disabled):hover button {
    visibility: visible;
  }
}

.upload-id-card {
  background-color: #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  display: block;
  padding: 30px 0;
  text-align: center;

  p {
    color: #8b8585;
    margin: 0;
  }

  i {
    color: rgba(40, 135, 210, 0.35);
  }

  & + input[type='file'] {
    display: none;
  }
}

.table {
  max-height: 145px;
}
</style>
