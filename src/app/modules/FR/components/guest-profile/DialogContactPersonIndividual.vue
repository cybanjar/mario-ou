<template>
  <q-dialog v-model="showDialog">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">Guest Contact of {{ dialogTitle }}</span>
      </div>

      <div class="dialog__body">
        <div class="bg-white q-py-md q-px-lg">
          <q-btn flat round @click="setDisable(false)">
            <img
              :src="
                require(`~/app/icons/${
                  disableStatus ? 'Icon-Add' : 'Icon-AddDisable'
                }.svg`)
              "
              height="25"
            />
          </q-btn>
          <div class="row q-col-gutter-x-lg q-mt-md">
            <div class="col-7">
              <q-tabs
                v-model="tabActive"
                class="text-grey"
                active-color="primary"
                indicator-color="primary"
                dense
                no-caps
              >
                <q-tab name="personalInfo" label="Personal Information" />
                <q-tab name="addressInfo" label="Address Information" />
              </q-tabs>
              <q-form @submit="isEdit ? onEdit() : onSubmit()">
                <q-tab-panels v-model="tabActive" animated>
                  <q-tab-panel name="personalInfo" class="q-pa-none q-pt-md">
                    <div class="row q-col-gutter-x-lg">
                      <div class="col-6">
                        <SInput
                          label-text="Name"
                          v-model="formData.name"
                          :disable="disableStatus"
                          :rules="[(val) => !!val || 'Field is required']"
                          :key="disableStatus"
                          :lazy-rules="true"
                        />
                      </div>
                      <div class="col-6">
                        <SInput
                          label-text="First Name"
                          v-model="formData.firstName"
                          :disable="disableStatus"
                        />
                      </div>
                      <div class="col-6">
                        <SSelect
                          label-text="Title"
                          v-model="formData.title"
                          :options="titleOptions"
                          :disable="disableStatus"
                        />
                      </div>
                      <div class="col-6">
                        <SInput
                          label-text="Phone"
                          v-model="formData.phone"
                          :disable="disableStatus"
                          :rules="[(val) => !!val || 'Field is required']"
                          :key="disableStatus"
                          :lazy-rules="true"
                        />
                      </div>
                      <div class="col-6">
                        <SInput
                          label-text="Mobile Phone"
                          v-model="formData.mobilePhone"
                          :disable="disableStatus"
                        />
                      </div>
                      <div class="col-6">
                        <SInput
                          label-text="Fax"
                          v-model="formData.fax"
                          :disable="disableStatus"
                        />
                      </div>
                      <div class="col-6">
                        <SInput
                          label-text="Email"
                          v-model="formData.email"
                          :disable="disableStatus"
                        />
                      </div>
                      <div class="col-6">
                        <SSelect
                          label-text="Relation"
                          v-model="formData.relation"
                          :options="relationOptions"
                          :disable="disableStatus"
                          :key="disableStatus"
                          :lazy-rules="true"
                        />
                      </div>
                    </div>
                  </q-tab-panel>

                  <q-tab-panel name="addressInfo" class="q-pa-none q-pt-md">
                    <div class="row q-col-gutter-x-lg">
                      <div class="col-6">
                        <DateInput
                          label-text="Birthdate"
                          v-model="formData.birthdate"
                          placement="auto"
                          :disable="disableStatus"
                        />
                      </div>
                      <div class="col-6">
                        <SInput
                          label-text="Birthplace"
                          v-model="formData.birthPlace"
                          :disable="disableStatus"
                        />
                      </div>
                      <div class="col-6">
                        <SInput
                          label-text="ID Card Number"
                          v-model="formData.idCardNumber"
                          :disable="disableStatus"
                        />
                      </div>
                      <div class="col-3">
                        <SSelect
                          label-text="ID Card Type"
                          v-model="formData.idCardType"
                          :options="idCardTypeOptions"
                          :disable="disableStatus"
                        />
                      </div>
                      <div class="col-3">
                        <SSelect
                          label-text="Nationality"
                          emit-value
                          v-model="formData.nationality"
                          :options="nationalityOptions"
                          :disable="disableStatus"
                        />
                      </div>
                      <div class="col-6">
                        <SInput
                          label-text="Issue Place"
                          v-model="formData.issuePlace"
                          :disable="disableStatus"
                        />
                      </div>
                      <div class="col-12">
                        <SInput
                          label-text="Address"
                          rows="2"
                          v-model="formData.address"
                          type="textarea"
                          :disable="disableStatus"
                        />
                      </div>
                      <div class="col-6">
                        <SInput
                          label-text="City"
                          v-model="formData.city"
                          :disable="disableStatus"
                        />
                      </div>
                      <div class="col-3">
                        <SInput
                          label-text="Postal Code"
                          v-model="formData.postalCode"
                          :disable="disableStatus"
                        />
                      </div>
                      <div class="col-3">
                        <SSelect
                          label-text="Country"
                          emit-value
                          v-model="formData.country"
                          :options="nationalityOptions"
                          :disable="disableStatus"
                        />
                      </div>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>

                <div class="row justify-between q-mt-md">
                  <q-btn
                    color="primary"
                    text-color="primary"
                    label="Cancel"
                    outline
                    @click="disableStatus = true"
                  />

                  <q-btn
                    color="primary"
                    label="Save"
                    type="submit"
                    :disable="disableStatus"
                  />
                </div>
              </q-form>
            </div>

            <div class="col-5">
              <STable
                row-key="$_index"
                :columns="tableHeaderGuestContact"
                :data="rowsWithIndex"
                :selected.sync="selected"
                @row-click="onRowClick"
                no-data-text="No Data"
                class="sticky-header"
                style="max-height: 420px"
                no-pagination
              >
                <template #body-cell-person-icon="props">
                  <q-td :props="props">
                    <q-icon
                      name="mdi-account-outline"
                      color="light-blue-4"
                      size="16px"
                      v-if="props.row.hauptkontakt"
                    />
                  </q-td>
                </template>

                <template #body-cell-actions="props">
                  <q-td :props="props">
                    <q-icon
                      name="mdi-dots-vertical"
                      size="16px"
                      class="cursor-pointer"
                    >
                      <q-menu auto-close anchor="bottom right" self="top right">
                        <q-list>
                          <q-item
                            clickable
                            v-ripple
                            @click="setMainContact(props.row)"
                          >
                            <q-item-section>Set Main Contact</q-item-section>
                          </q-item>
                          <q-item
                            clickable
                            v-ripple
                            @click="disableStatus = false"
                          >
                            <q-item-section>Modify</q-item-section>
                          </q-item>
                          <q-item
                            clickable
                            v-ripple
                            @click="onDelete(props.row)"
                          >
                            <q-item-section>Delete</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-icon>
                  </q-td>
                </template>
              </STable>
            </div>
          </div>
        </div>
      </div>

      <div class="dialog__footer">
        <q-btn label="OK" color="primary" v-close-popup />
      </div>

      <q-inner-loading :showing="isFetching" color="primary" />
    </div>
  </q-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  toRefs,
  reactive,
  watch,
  ref,
} from '@vue/composition-api';
import DateInput from '../common/DateInput.vue';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import {
  CreateContactPerson,
  GuestContact,
} from '../../models/guest-profile/contactPerson.model';
import { TableHeader } from '~/components/VhpUI/typings';
import { SelectItem } from '~/app/shared/models/select.model';
import { useDirectSelectedRow } from '../../composables/selectedRow';
import { date } from 'quasar';

const tableHeaderGuestContact: TableHeader[] = [
  { label: '', name: 'person-icon', align: 'center' },
  {
    label: 'Name',
    name: 'name',
    field: 'fullName',
    align: 'left',
    format: (_, row) => {
      return `${row.name}, ${row.vorname} ${row.anrede}`;
    },
  },
  { label: '', name: 'actions', align: 'center' },
];

const defaultFormValues = {
  name: '',
  firstName: '',
  title: '',
  phone: '',
  mobilePhone: '',
  fax: '',
  email: '',
  relation: null as SelectItem<number>,
  birthdate: null as Date,
  birthPlace: '',
  idCardNumber: '',
  idCardType: '',
  nationality: '',
  issuePlace: '',
  address: '',
  city: '',
  postalCode: '',
  country: '',
};

export default defineComponent({
  components: {
    DateInput,
  },
  props: {
    show: { type: Boolean, required: true },
    guestNumber: { type: Number, default: null },
  },
  setup(props, { emit, root: { $api, $q } }) {
    const showDialog = useModelWrapper(props, emit, 'show');
    const formData = reactive({ ...defaultFormValues });
    const state = reactive({
      isFetching: true,
      dialogTitle: '',
      segmentCode: 0,
      titleOptions: [] as string[],
      relationOptions: [] as SelectItem<number>[],
      idCardTypeOptions: [] as string[],
      nationalityOptions: [] as SelectItem<string>[],
      countryOptions: [] as SelectItem<string>[],
    });
    const guestContactRows = ref<GuestContact[]>([]);

    const UIState = reactive({
      tabActive: 'personalInfo',
      disableStatus: true,
    });

    if (showDialog.value && props.guestNumber) {
      getData();
    }

    async function getData() {
      state.isFetching = true;

      const [
        resIDCardType,
        resTitle,
        resNationalityCountry,
        resPrepareData,
      ] = await Promise.all([
        $api.frontOfficeReception.readQueasy(27),
        $api.frontOfficeReception.readQueasy(141),
        $api.frontOfficeReception.getGCFNation(0),
        $api.frontOfficeReception.prepareContactPerson(props.guestNumber),
      ]);

      state.dialogTitle = resPrepareData.fTitle;
      state.idCardTypeOptions = resIDCardType.map((value) => value.char1);
      state.titleOptions = resTitle.map((value) => value.char1);
      state.segmentCode = resPrepareData.guestContact[0]?.segmentcode;
      guestContactRows.value = resPrepareData.guestContact;
      state.relationOptions = resPrepareData.relationOptions.map((value) => ({
        label: `${value.number1} - ${value.char1}`,
        value: value.number1,
      }));
      state.nationalityOptions = resNationalityCountry.map((value) => ({
        label: `${value.kurzbez} - ${value.bezeich}`,
        value: value.kurzbez,
      }));

      state.isFetching = false;
    }

    async function onSubmit() {
      if (!formData.name || !formData.phone)
        return $q.dialog({
          message: 'Name and Phone must be filled!',
        });

      $q.loading.show();

      const reqCreateData: CreateContactPerson = {
        gastnr: props.guestNumber,
        name: formData.name,
        vorname: formData.firstName,
        email: formData.email,
        nat: formData.nationality,
        anrede: formData.title,
        nation2: formData.country,
        'ausweis-art': formData.idCardType,
        'ausweis-nr1': formData.idCardNumber,
        geburtdatum1: date.formatDate(formData.birthdate, 'YYYY-MM-DD'),
        'geburt-ort1': formData.birthPlace,
        segmentcode: state.segmentCode,
        'pass-aust1': formData.issuePlace,
        'pers-bez': formData.relation?.value ?? 0,
        'email-adr': formData.address,
        'v-titel': formData.city,
        'a-titel': formData.postalCode,
        fax: formData.fax,
        telefon: formData.phone,
        'telefon-privat': formData.mobilePhone,
        'p-bezeich': formData.relation?.label.split(' - ')[1] ?? '',
      };

      await $api.frontOfficeReception.gcf0Contact(
        reqCreateData,
        props.guestNumber,
        1
      );

      $q.loading.hide();

      setDisable(true);
      getData();
    }

    const isEdit = ref(false);
    const guestContactSelectedRow = ref<GuestContact>(null);
    const { rowsWithIndex, selected, onRowClick } = useDirectSelectedRow(
      guestContactRows,
      guestContactSelectedRow,
      true
    );
    watch(guestContactSelectedRow, (newValue) => {
      if (newValue) {
        UIState.disableStatus = true;
        isEdit.value = true;

        const currentRelation = state.relationOptions.find(({ value }) => {
          return value === newValue['pers-bez'];
        });

        formData.name = newValue.name;
        formData.firstName = newValue.vorname;
        formData.email = newValue.funktion.split(';')[0] ?? '';
        formData.nationality = newValue.funktion.split(';')[1] ?? '';
        formData.title = newValue.anrede;
        formData.country = newValue.nation2;
        formData.idCardType = newValue['ausweis-art'];
        formData.idCardNumber = newValue['ausweis-nr1'];
        formData.birthdate = newValue.geburtdatum1
          ? new Date(newValue.geburtdatum1)
          : null;
        formData.birthPlace = newValue['geburt-ort1'];
        formData.issuePlace = newValue['pass-aust1'];
        formData.city = newValue['v-titel'];
        formData.postalCode = newValue['a-titel'];
        formData.address = newValue['email-adr'];
        formData.fax = newValue.fax;
        formData.phone = newValue.telefon;
        formData.mobilePhone = newValue['telefon-privat'];
        formData.relation = currentRelation;
      }
    });

    async function onEdit() {
      if (!formData.name || !formData.phone)
        return $q.dialog({
          message: 'Name and Phone must be filled!',
        });

      $q.loading.show();

      const reqEditData: GuestContact = {
        ...guestContactSelectedRow.value,
        name: formData.name,
        vorname: formData.firstName,
        email: formData.email,
        nat: formData.nationality,
        funktion: `${formData.email};${formData.nationality}`,
        anrede: formData.title,
        nation2: formData.country,
        'ausweis-art': formData.idCardType,
        'ausweis-nr1': formData.idCardNumber,
        geburtdatum1: date.formatDate(formData.birthdate, 'YYYY-MM-DD'),
        'geburt-ort1': formData.birthPlace,
        segmentcode: state.segmentCode,
        'pass-aust1': formData.issuePlace,
        'pers-bez': formData.relation?.value ?? 0,
        'email-adr': formData.address,
        'v-titel': formData.city,
        'a-titel': formData.postalCode,
        fax: formData.fax,
        telefon: formData.phone,
        'telefon-privat': formData.mobilePhone,
        'p-bezeich': formData.relation.label.split(' - ')[1] ?? '',
      };

      await $api.frontOfficeReception.gcf0Contact(
        reqEditData,
        props.guestNumber,
        2
      );

      $q.loading.hide();

      setDisable(true);
      getData();
    }

    async function setMainContact(row: GuestContact) {
      $q.loading.show();
      await $api.frontOfficeReception.setMainContact(row.gastnr, row['rec-id']);
      $q.loading.hide();
      getData();
    }

    function onDelete(row: GuestContact) {
      $q.dialog({
        title: 'Warning!',
        message: `Do you really want to DELETE the contact Name ${row.name}, ${row.vorname}, ${row.anrede} ?`,
        cancel: true,
      }).onOk(async () => {
        $q.loading.show();

        await $api.frontOfficeReception.deleteContactPerson(
          row.gastnr,
          row['kontakt-nr']
        );

        $q.loading.hide();
        resetForm();
        getData();
      });
    }

    function setDisable(value: boolean) {
      UIState.disableStatus = value;
      resetForm();
    }

    function resetForm() {
      Object.entries(defaultFormValues).forEach(([key, value]) => {
        formData[key] = value;
      });
      UIState.tabActive = 'personalInfo';
      isEdit.value = false;
    }

    return {
      ...toRefs(UIState),
      ...toRefs(state),
      tableHeaderGuestContact,
      showDialog,
      formData,
      isEdit,

      onSubmit,
      onEdit,
      onDelete,
      setMainContact,
      setDisable,
      resetForm,

      rowsWithIndex,
      onRowClick,
      selected,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  max-width: 854px !important;

  &__body {
    max-height: 450px !important;
    overflow: auto;
  }
}
</style>
