<template>
  <q-dialog v-model="dialogModel">
    <q-card style="min-width: 90%">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Create PO
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <div class="row">
          <div class="col-5">
            <div class="row q-col-gutter-x-lg">
              <div class="col-6">
                <SInput
                  label-text="Purchase Order Number"
                  v-model="poNumber"
                  disable
                />
              </div>

              <div class="col-6">
                <SInput label-text="Created By" :value="username" disable />
              </div>

              <div class="col-6">
                <SInput
                  label-text="Purchase Request Number"
                  v-model="purchaseRequest"
                />
              </div>
              <div class="col-6">
                <SInput
                  label-text="Credit Term"
                  v-model="creditTerm"
                  input-class="text-right"
                >
                  <template #after>
                    <span class="credit-days">Days.</span>
                  </template>
                </SInput>
              </div>

              <div class="col-6">
                <v-date-picker
                  v-model="paymentDate"
                  :masks="{ input: 'DD/MM/YYYY' }"
                  :popover="{
                    visibility: 'click',
                    placement: 'bottom-start',
                  }"
                >
                  <template #default="{ inputValue, inputEvents }">
                    <SInput
                      label-text="Payment Date"
                      readonly
                      :value="inputValue"
                      v-on="inputEvents"
                    >
                      <template #append>
                        <q-icon name="mdi-calendar" />
                      </template>
                    </SInput>
                  </template>
                </v-date-picker>
              </div>

              <div class="col-6">
                <SSelect
                  label-text="Currency"
                  v-model="currency"
                  :options="currencyOptions"
                  option-label="wabkurz"
                  option-value="wabkurz"
                  :loading="isPreparing"
                />
              </div>

              <div class="col-6">
                <SSelect
                  label-text="Department"
                  option-value="varname"
                  :loading="isPreparing"
                  :option-label="
                    (i) => (i === null ? 'Empty' : `${i.num} - ${i.name}`)
                  "
                  v-model="department"
                  :options="departmentOptions"
                >
                  <template #selected>
                    <div :class="{ 'text-grey-6': !department }">
                      {{
                        department
                          ? `${department.num} - ${department.name}`
                          : 'Please Select'
                      }}
                    </div>
                  </template>
                </SSelect>
              </div>

              <div class="col-6">
                <SSelect
                  label-text="Supplier"
                  :options="supplierOptions"
                  :option-label="supplierLabel"
                  option-value="lief-nr"
                  v-model="supplier"
                  use-input
                  placeholder="Please Select"
                  @filter="filterSuppliers"
                  fill-input
                  input-debounce="0"
                />
              </div>

              <div class="col-6">
                <v-date-picker
                  v-model="orderDate"
                  :masks="{ input: 'DD/MM/YYYY' }"
                  :popover="{
                    visibility: 'click',
                    placement: 'bottom-start',
                  }"
                >
                  <template #default="{ inputValue, inputEvents }">
                    <SInput
                      label-text="Order Date"
                      readonly
                      :value="inputValue"
                      v-on="inputEvents"
                    >
                      <template #append>
                        <q-icon name="mdi-calendar" />
                      </template>
                    </SInput>
                  </template>
                </v-date-picker>
              </div>

              <div class="col-6">
                <v-date-picker
                  v-model="deliveryDate"
                  :masks="{ input: 'DD/MM/YYYY' }"
                  :popover="{
                    visibility: 'click',
                    placement: 'bottom-start',
                  }"
                >
                  <template #default="{ inputValue, inputEvents }">
                    <SInput
                      label-text="Delivery Date"
                      readonly
                      :value="inputValue"
                      v-on="inputEvents"
                    >
                      <template #append>
                        <q-icon name="mdi-calendar" />
                      </template>
                    </SInput>
                  </template>
                </v-date-picker>
              </div>
              <div class="col-6">
                <SInput label-text="Type of Order" v-model="orderType" />
              </div>
              <div class="col-6">
                <SInput label-text="Order Name" v-model="orderName" />
              </div>
              <div class="col-6">
                <SInput
                  label-text="Instruction"
                  v-model="instruction"
                  type="textarea"
                />
              </div>
              <div class="col-6">
                <div class="col-4 column">
                  <label class="inline-block q-mb-xs">Released</label>
                  <q-toggle size="md" v-model="released" />
                </div>
              </div>
            </div>
          </div>

          <div class="col-7">
            <div class="row q-col-gutter-x-md q-px-lg">
              <div class="col-4 column">
                <label class="inline-block q-mb-xs"> Enter Discount VAT </label>
                <q-toggle size="md" v-model="enterDiscount" />
              </div>
              <div class="col-8 column">
                <label class="inline-block q-mb-xs">Delivery Unit Price</label>
                <q-toggle size="md" v-model="deliveryUnitPrice" />
              </div>

              <div class="col-7">
                <div class="select-item">
                  <SSelect
                    label-text="Select Item"
                    :options="articleOptions"
                    :option-label="articleLabel"
                    option-value="lief-nr"
                    v-model="article"
                    :disable="!poNumber"
                  >
                    <template #selected>
                      <div :class="{ 'text-grey-6': !article }">
                        {{
                          article
                            ? articleLabel(article)
                            : '-- Please Select --'
                        }}
                      </div>
                    </template>
                  </SSelect>

                  <SInput
                    label-text="Delivery Unit"
                    v-model="deliveryUnit"
                    disable
                  />

                  <SInput label-text="Content" v-model="content" disable />
                </div>
              </div>
              <div class="col-2">
                <SInput
                  label-text="Quantity"
                  v-model="quantity"
                  type="number"
                />
              </div>
              <div class="col-3">
                <SInputCurrency
                  label-text="Price"
                  v-model="price"
                  ref="priceEl"
                  :currency="{
                    distractionFree: false,
                    currency: null,
                  }"
                />
              </div>

              <div class="col-3">
                <SInput label-text="Amount" :value="amount" disable />
              </div>
              <div class="col-4">
                <SInput label-text="Remark" v-model="remark" />
              </div>
              <div class="col-2 flex items-center">
                <q-btn
                  color="primary"
                  label="Add"
                  class="full-width"
                  @click="onAddArticle"
                />
              </div>

              <div class="col-3">
                <SInput
                  label-text="Total Amount"
                  v-model="totalAmount"
                  readonly
                  input-class="text-right"
                  mask="#.00"
                />
              </div>

              <div class="col-12">
                <TablePUNewPurchaseOrder
                  :rows="articles"
                  @delete="onDeleteItem"
                />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          color="white"
          text-color="black"
          label="Cancel"
          @click="onCancel"
          class="q-mr-lg"
        />

        <q-btn color="primary" label="Save" @click="onSave" />
      </q-card-actions>

      <q-dialog v-model="dialogPrice" persistent>
        <q-card>
          <q-card-section>
            <p class="text-body-1">{{ discountWarning }}</p>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn
              color="white"
              text-color="black"
              label="No"
              @click="onCancelWarning"
              class="q-mr-lg"
            />

            <q-btn color="primary" label="Yes" @click="onContinueWarning" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="dialogDiscount" persistent>
        <q-card style="max-width: 350px">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Input Discount And V.A.T</div>
            <q-space />
            <q-btn icon="mdi-close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section>
            <div class="row q-col-gutter-x-sm">
              <div class="col-6">
                <SInputCurrency
                  label-text="Less Discount"
                  v-model="lessDiscount"
                  :currency="{
                    distractionFree: false,
                    currency: null,
                  }"
                />
              </div>
              <div class="col-6">
                <SInputCurrency
                  label-text="Second Discount"
                  v-model="secondDiscount"
                  :currency="{
                    distractionFree: false,
                    currency: null,
                  }"
                />
              </div>
              <div class="col-6">
                <SInputCurrency
                  label-text="Add V.A.T"
                  v-model="addVat"
                  :currency="{
                    distractionFree: false,
                    currency: null,
                  }"
                />
              </div>
              <div class="col-6 column">
                <label class="inline-block q-mb-xs">Apply For All Item</label>
                <q-toggle size="md" v-model="applyForAllItem" />
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn color="primary" label="OK" @click="onApplyDiscount" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </q-dialog>
</template>

<script src="../functions/useDialogPUPurchaseOrder.ts"></script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}

.credit-days {
  font-size: 14px;
  color: #8b8585;
}

.select-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 86px 62px;
}
</style>
