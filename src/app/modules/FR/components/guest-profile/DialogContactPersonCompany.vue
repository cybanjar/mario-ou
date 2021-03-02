<template>
  <q-dialog v-model="showDialog">
    <div class="dialog">
      <div class="dialog__header">
        <span class="dialog__title">Contacts Name</span>
      </div>

      <div class="dialog__body">
        <div class="bg-white q-pa-lg">
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

          <div class="row q-pt-md q-col-gutter-x-lg">
            <div class="col-6">
              <q-form
                class="row q-col-gutter-x-lg"
                @submit="isEdit ? onEdit() : onSubmit()"
              >
                <div class="col-6">
                  <SInput
                    label-text="Name"
                    v-model="formData.name"
                    :disable="disableStatus"
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
                    label-text="Guest Profile Number"
                    v-model.number="formData.guestProfileNumber"
                    :disable="disableStatus"
                    readonly
                  >
                    <template #append>
                      <q-icon
                        name="mdi-help-circle"
                        size="xs"
                        class="cursor-pointer"
                        color="primary"
                        @click="dialogSelectGuest.open()"
                      />
                    </template>
                  </SInput>
                </div>
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
                    label-text="Birth Place"
                    v-model="formData.birthPlace"
                    :disable="disableStatus"
                  />
                </div>
                <div class="col-6">
                  <SInput
                    label-text="Phone"
                    v-model="formData.phone"
                    :disable="disableStatus"
                  />
                </div>
                <div class="col-6">
                  <SInput
                    label-text="Extension"
                    v-model="formData.extension"
                    :disable="disableStatus"
                  />
                </div>
                <div class="col-6">
                  <SInput
                    label-text="Department"
                    v-model="formData.departement"
                    :disable="disableStatus"
                  />
                </div>
                <div class="col-6">
                  <SInput
                    label-text="Function"
                    v-model="formData.funktion"
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
                <div class="col-12">
                  <div class="row justify-between q-mt-md">
                    <q-btn
                      color="primary"
                      text-color="primary"
                      label="Cancel"
                      outline
                      @click="setDisable(true)"
                    />

                    <q-btn
                      color="primary"
                      label="Save"
                      type="submit"
                      :disable="disableStatus"
                    />
                  </div>
                </div>
              </q-form>
            </div>

            <div class="col-6">
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
                          <q-item clickable v-ripple @click="changeMainContact">
                            <q-item-section> Set Main Contact </q-item-section>
                          </q-item>
                          <q-item
                            clickable
                            v-ripple
                            @click="disableStatus = false"
                          >
                            <q-item-section> Modify </q-item-section>
                          </q-item>
                          <q-item clickable v-ripple @click="onDelete">
                            <q-item-section>Delete</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-icon>
                  </q-td>
                </template>
              </STable>

              <DialogSelectGuest
                :show.sync="dialogSelectGuest.state.show"
                :key="dialogSelectGuest.state.key"
                :add-button="true"
                @selectedGuest="
                  (value) => (formData.guestProfileNumber = value.gastnr)
                "
              />
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
  ref,
  reactive,
  watch,
  toRefs,
} from '@vue/composition-api';
import DateInput from '../common/DateInput.vue';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import { CPCompanyTravel } from '../../models/guest-profile/contactPerson.model';
import { useDirectSelectedRow } from '../../composables/selectedRow';
import { date } from 'quasar';
import { useDisposableDialog } from '../../composables/disposableDialog';

const tableHeaderGuestContact = [
  { label: '', name: 'person-icon', align: 'center' },
  {
    label: 'Name',
    name: 'name',
    field: 'name',
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
  guestProfileNumber: null as number,
  birthdate: null as Date,
  birthPlace: '',
  phone: '',
  email: '',
  extension: '',
  departement: '',
  funktion: '',
};

export default defineComponent({
  components: {
    DialogSelectGuest: () => import('../common/DialogSelectGuest.vue'),
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
      mainContact: null as CPCompanyTravel,
      titleOptions: [] as string[],
    });
    const guestContactRows = ref<CPCompanyTravel[]>([]);
    const disableStatus = ref(true);

    if (showDialog.value && props.guestNumber) {
      getData();
    }

    function setDisable(value: boolean) {
      disableStatus.value = value;
      resetForm();
    }

    async function getData() {
      state.isFetching = true;

      const [resTitle, resPrepareData, mainContactData] = await Promise.all([
        $api.frontOfficeReception.readQueasy(141),
        $api.frontOfficeReception.soaReadAktKont(props.guestNumber, 2),
        $api.frontOfficeReception.soaReadAktKont(props.guestNumber, 4),
      ]);

      state.titleOptions = resTitle.map((value) => value.char1);
      state.mainContact = mainContactData[0];
      guestContactRows.value = resPrepareData;

      state.isFetching = false;
    }

    async function onSubmit() {
      $q.loading.show();

      const requestForm: CPCompanyTravel = {
        gastnr: props.guestNumber,
        Kategorie: 1,
        'kontakt-nr': 0,
        name: formData.name,
        vorname: formData.firstName,
        funktion: formData.funktion,
        abteilung: formData.departement,
        sprachcode: 0,
        anrede: formData.title,
        nation2: ' ',
        'ausweis-art': ' ',
        'ausweis-nr1': ' ',
        geburtdatum1: date.formatDate(formData.birthdate, 'YYYY-MM-DD'),
        'geburt-ort1': formData.birthPlace,
        segmentcode: 0,
        'pass-aust1': ' ',
        durchwahl: formData.extension,
        hauptkontakt: false,
        'pers-bez': 0,
        betriebsnr: 0,
        'email-adr': formData.email,
        'v-titel': ' ',
        'a-titel': ' ',
        briefanrede: ' ',
        fax: ' ',
        telefon: formData.phone,
        'telefon-privat': ' ',
        'fax-privat': '',
        'betrieb-gast': formData.guestProfileNumber,
      };

      await $api.frontOfficeReception.gcfContactBtnExit(
        props.guestNumber,
        requestForm,
        1
      );

      $q.loading.hide();

      setDisable(true);
      getData();
    }

    const isEdit = ref(false);
    const guestContactSelectedRow = ref<CPCompanyTravel>(null);
    const { rowsWithIndex, selected, onRowClick } = useDirectSelectedRow(
      guestContactRows,
      guestContactSelectedRow,
      true
    );
    watch(guestContactSelectedRow, (newValue) => {
      if (newValue) {
        setDisable(true);
        isEdit.value = true;
        disableStatus.value = true;

        formData.name = newValue.name;
        formData.firstName = newValue.vorname;
        formData.title = newValue.anrede;
        formData.guestProfileNumber = newValue['betrieb-gast'];
        formData.birthdate = newValue.geburtdatum1
          ? new Date(newValue.geburtdatum1)
          : null;
        formData.birthPlace = newValue['geburt-ort1'];
        formData.phone = newValue.telefon;
        formData.email = newValue['email-adr'];
        formData.extension = newValue.durchwahl;
        formData.departement = newValue.abteilung;
        formData.funktion = newValue.funktion;
      }
    });

    async function onEdit() {
      $q.loading.show();

      const editRequestForm: CPCompanyTravel = {
        ...guestContactSelectedRow.value,
        gastnr: props.guestNumber,
        name: formData.name,
        vorname: formData.firstName,
        funktion: formData.funktion,
        abteilung: formData.departement,
        anrede: formData.title,
        geburtdatum1: date.formatDate(formData.birthdate, 'YYYY-MM-DD'),
        'geburt-ort1': formData.birthPlace,
        durchwahl: formData.extension,
        'email-adr': formData.email,
        telefon: formData.phone,
        'betrieb-gast': formData.guestProfileNumber,
      };

      await $api.frontOfficeReception.gcfContactBtnExit(
        props.guestNumber,
        editRequestForm,
        2
      );

      $q.loading.hide();

      setDisable(true);
      getData();
    }

    async function changeMainContact() {
      $q.loading.show();

      if (state.mainContact) {
        const reqUndoMainContact: CPCompanyTravel = {
          ...state.mainContact,
          gastnr: props.guestNumber,
          geburtdatum1: date.formatDate(
            state.mainContact.geburtdatum1,
            'YYYY-MM-DD'
          ),
          hauptkontakt: false,
        };
        await $api.frontOfficeReception.aktKontSave(reqUndoMainContact, 1);
      }

      const reqChangeMainContact: CPCompanyTravel = {
        ...guestContactSelectedRow.value,
        gastnr: props.guestNumber,
        name: formData.name,
        vorname: formData.firstName,
        funktion: formData.funktion,
        abteilung: formData.departement,
        hauptkontakt: true,
        anrede: formData.title,
        geburtdatum1: date.formatDate(formData.birthdate, 'YYYY-MM-DD'),
        'geburt-ort1': formData.birthPlace,
        durchwahl: formData.extension,
        'email-adr': formData.email,
        telefon: formData.phone,
        'betrieb-gast': formData.guestProfileNumber,
      };
      await $api.frontOfficeReception.aktKontSave(reqChangeMainContact, 1);

      $q.loading.hide();
      getData();
    }

    async function onDelete() {
      $q.loading.show();

      const deleteRequestForm: CPCompanyTravel = {
        ...guestContactSelectedRow.value,
        gastnr: props.guestNumber,
        name: formData.name,
        vorname: formData.firstName,
        funktion: formData.funktion,
        abteilung: formData.departement,
        anrede: formData.title,
        geburtdatum1: date.formatDate(formData.birthdate, 'YYYY-MM-DD'),
        'geburt-ort1': formData.birthPlace,
        durchwahl: formData.extension,
        'email-adr': formData.email,
        telefon: formData.phone,
        'betrieb-gast': formData.guestProfileNumber,
      };

      if (guestContactSelectedRow.value.hauptkontakt) {
        const newMainContact: CPCompanyTravel[] = await $api.frontOfficeReception.soaReadAktKont(
          props.guestNumber,
          3
        );
        if (newMainContact.length) {
          await $api.frontOfficeReception.aktKontSave(
            {
              ...newMainContact[0],
              hauptkontakt: true,
            },
            1
          );
        }
      }

      await $api.frontOfficeReception.aktKontSave(deleteRequestForm, 2);

      $q.loading.hide();

      setDisable(true);
      getData();
    }

    function resetForm() {
      Object.entries(defaultFormValues).forEach(([key, value]) => {
        formData[key] = value;
      });
      isEdit.value = false;
    }

    return {
      ...toRefs(state),
      tableHeaderGuestContact,
      showDialog,
      formData,
      disableStatus,
      isEdit,

      changeMainContact,
      setDisable,
      onSubmit,
      onEdit,
      onDelete,

      rowsWithIndex,
      onRowClick,
      selected,
      dialogSelectGuest: useDisposableDialog(),
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  max-width: 854px !important;
  &__body {
    max-height: 470px !important;
    overflow: auto;
  }
}
</style>
