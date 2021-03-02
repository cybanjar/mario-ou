<template>
  <q-dialog v-model="dialog" persistent>
    <q-card style="width: 318px">
      <q-toolbar>
        <q-toolbar-title class="text-white text-weight-medium">
          Modify Supplier Quotation
        </q-toolbar-title>
      </q-toolbar>

      <q-card-section style="max-height: 80vh" class="scroll">
        <div class="row q-pa-lg" v-if="row !== null">
          <div class="col-12">
            <SSelect :value="item.supName" label-text="Supplier" disable />
          </div>

          <div class="col-12">
            <SInput label-text="Document Number" v-model="item['docu-nr']" />
          </div>

          <div class="col-12">
            <SInput
              label-text="Item"
              :value="`${item.artnr} - ${item.artName}`"
              disable
            />
          </div>

          <div class="col-6">
            <SInput
              label-text="Delivery Unit"
              :value="item.devUnit"
              disable
              class="q-mr-xs"
            />
          </div>

          <div class="col-6">
            <SInput
              label-text="Content"
              :value="item.content"
              disable
              class="q-ml-xs"
            />
          </div>

          <div class="col-12">
            <SSelect
              label-text="Currency"
              v-model="item.curr"
              :options="currencyOptions"
              option-label="wabkurz"
              option-value="wabkurz"
              :loading="isPreparing"
            />
          </div>

          <div class="col-12">
            <SInput
              label-text="Minimum Quantity"
              v-model="item.minQty"
              input-class="text-right"
            />
          </div>

          <div class="col-6">
            <SInput
              label-text="Due Day"
              v-model="item.delivDay"
              input-class="text-right"
              class="q-mr-xs"
            />
          </div>
          <div class="col-6">
            <SInput
              label-text="Discount (%)"
              v-model="item.disc"
              input-class="text-right"
              class="q-ml-xs"
            />
          </div>

          <div class="col-12 relative-position">
            <v-date-picker
              v-model="item.validity"
              :masks="{ input: 'DD/MM/YYYY' }"
              :columns="2"
              :popover="{
                visibility: 'click',
                placement: 'bottom-start',
              }"
              is-range
            >
              <template #default="{ inputValue, inputEvents }">
                <SInput
                  label-text="Date"
                  placeholder="From - Until"
                  readonly
                  :value="`${inputValue.start} - ${inputValue.end}`"
                  v-on="inputEvents.start"
                >
                  <template #append>
                    <q-icon name="mdi-calendar" />
                  </template>
                </SInput>
              </template>
            </v-date-picker>
          </div>

          <div class="col-12">
            <SInput label-text="Remark" v-model="item.remark" />
          </div>

          <div class="col-12">
            <label class="inline-block q-mb-xs">Enable Item</label>
            <q-toggle size="md" v-model="item.activeFlag" />
          </div>

          <div class="col-12">
            <label class="inline-block q-mb-xs">Availability</label>
            <q-toggle size="md" v-model="item.avl" />
          </div>
        </div>
      </q-card-section>

      <div style="max-height: 80vh" class="scroll"></div>

      <q-separator />

      <q-card-actions align="center">
        <q-btn
          color="white"
          text-color="black"
          label="Cancel"
          @click="onCancel"
          class="q-mr-lg"
        />

        <q-btn color="primary" label="Save" @click="onSave" />
      </q-card-actions>

      <q-dialog v-model="dialogCancel" persistent>
        <q-card style="width: 424px" class="q-pa-md">
          <q-card-section>
            <div class="row">
              <q-icon
                name="mdi-comment-question-outline"
                size="21px"
                class="q-mt-sm q-mr-md"
                color="orange"
              />
              <div class="column">
                <p class="text-h6 q-mb-xs">Question</p>
                <p>All changes will not be saved. Do you want to continue?</p>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              color="white"
              text-color="black"
              label="No"
              @click="onCancelAction(false)"
              class="q-mr-sm"
            />

            <q-btn color="primary" label="Yes" @click="onCancelAction(true)" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="dialogConfirm" persistent>
        <q-card style="width: 424px" class="q-pa-md">
          <q-card-section>
            <div class="row">
              <q-icon
                name="mdi-comment-question-outline"
                size="21px"
                class="q-mt-sm q-mr-md"
                color="orange"
              />
              <div class="column">
                <p class="text-h6 q-mb-xs">Question</p>
                <p>Confirm this supplier quotation?</p>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              color="white"
              text-color="black"
              label="No"
              @click="onConfirmAction(false)"
              class="q-mr-lg"
            />

            <q-btn
              color="primary"
              label="Yes"
              @click="onConfirmAction(true)"
              :loading="isSaving"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </q-dialog>
</template>

<script src="../functions/useDialogPUModifySupplierQuotation.ts"></script>

<style lang="scss" scoped>
.q-toolbar {
  background: $primary-grad;
}
</style>
