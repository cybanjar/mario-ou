import {
  defineComponent,
  nextTick,
  PropType,
  reactive,
  ref,
} from '@vue/composition-api';
import { date } from 'quasar';
import InlineSvg from 'vue-inline-svg';
import { toNumber } from '~/app/helpers/typeConverter.helper';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import { SelectItem } from '~/app/shared/models/select.model';
import { useDisposableDialog } from '../../composables/disposableDialog';
import {
  ModifyGuestProfile,
  GuestProfileForm,
  MainSegment,
  MainSegmentConfig,
  TableForecast,
  TableGuestContact,
  TableHistory,
} from '../../models/common/dialogGuestProfile.model';
import { ModifyConfig } from '../../models/common/modify.model';
import { AttachContractRate } from '../../models/guest-profile/attachContractRate.model';
import { GuestProfileType } from '../../models/guest-profile/guestProfile.model';
import {
  tableHeaderForecast,
  tableHeaderGuestContact,
  tableHeaderHistory,
} from '../../tables/common/dialogGuestProfile.table';

const defaultFormValues = {
  name: '',
  companyTitle: '',
  phone: '',
  fax: '',
  email: '',
  mainContact: '',
  country: '',
  bookSource: null as number,
  mainSegment: [] as MainSegment[],
  address: '',
  city: '',
  postalCode: '',
  salesId: '',
  referenceNumberLeft: '' as number | string,
  referenceNumberRight: '' as number | string,
  channelManagerCode: '',
  contractRate: '',
  paymentMethod: null as number,
  creditLimit: '' as number | string,
  days: 0 as number | string,
  creditAccountNumber: '',
  remark: '',
};

export default defineComponent({
  components: {
    InlineSvg,
    DialogAttachContractRate: () =>
      import('../../components/guest-profile/DialogAttachContractRate.vue'),
    DialogContactPersonCompany: () =>
      import('../../components/guest-profile/DialogContactPersonCompany.vue'),
    DialogCreditCard: () =>
      import('../../components/common/DialogCreditCard.vue'),
    DialogGuestInformation: () =>
      import('../../components/guest-profile/DialogGuestInformation.vue'),
  },
  props: {
    show: { type: Boolean, required: true },
    type: { type: Number as PropType<GuestProfileType>, required: true },
    guestNumber: { type: Number, default: null },
  },
  setup(props, { emit, root: { $api, $q } }) {
    const showDialog = useModelWrapper(props, emit, 'show');
    const tab = ref('main-information');
    const formStatus = reactive({ view: false, disabled: false });
    const formData = reactive({ ...defaultFormValues });
    const isPreparing = ref(false);
    const formRef = ref(null);

    if (showDialog.value) {
      if (props.guestNumber) {
        formStatus.view = true;
        formStatus.disabled = true;
      }

      (async () => {
        isPreparing.value = true;
        await setupFormOptions();
        if (formStatus.view) await prepareModify(false);
        isPreparing.value = false;
      })();
    }

    /* Setup form options */
    const titleOptions = ref<string[]>([]);
    const countryOptions = ref<SelectItem<string>[]>([]);
    const bookSourceOptions = ref<SelectItem<number>[]>([]);
    const mainSegmentOptions = ref<MainSegment[]>([]);
    const salesIdOptions = ref<SelectItem<string>[]>([]);
    const paymentMethodOptions = ref<SelectItem<number>[]>([]);

    let currentMainSegmentConfig: MainSegmentConfig = null;

    async function setupFormOptions() {
      const [
        resHTParam0,
        resTitleOptions,
        resCountryOptions,
        resBookSourceOptions,
        resMainSegment,
        resSalesIdOptions,
        resPaymentMethodOptions,
      ] = await Promise.all([
        $api.frontOfficeReception.getHTParam0({ casetype: 3, inpParam: 153 }),
        $api.frontOfficeReception.readQueasy(141),
        $api.frontOfficeReception.getGCFNation(0),
        $api.frontOfficeReception.getBookSource(),
        $api.frontOfficeReception.getMainSegment(props.guestNumber),
        $api.frontOfficeReception.getSalesId(),
        $api.frontOfficeReception.loadArtikel({ caseType: 5, deptNo: 0 }),
      ]);

      titleOptions.value = resTitleOptions.map((e) => e.char1);
      countryOptions.value = resCountryOptions.map((e) => ({
        value: e.kurzbez,
        label: `${e.kurzbez} - ${e.bezeich}`,
      }));
      bookSourceOptions.value = resBookSourceOptions.map((e) => ({
        value: e['source-code'],
        label: `${e['source-code']} - ${e.bezeich}`,
      }));
      mainSegmentOptions.value = resMainSegment.options;
      salesIdOptions.value = resSalesIdOptions.map((e) => ({
        value: e.userinit,
        label: `${e.userinit} - ${e.username}`,
      }));
      paymentMethodOptions.value = resPaymentMethodOptions.map((e) => ({
        value: e.artnr,
        label: `${e.artnr} - ${e.bezeich}`,
      }));

      currentMainSegmentConfig = resMainSegment.config;

      // Setup some default value
      if (!formStatus.view) {
        formData.country = resHTParam0.fchar;
      } else {
        formData.mainSegment = resMainSegment.current;
      }
    }
    /* End Setup form options */

    let currentModifyData: ModifyGuestProfile = null;
    let currentModifyConfig: ModifyConfig = null;
    const table = reactive({
      history: [] as TableHistory[],
      guestContact: [] as TableGuestContact[],
      forecast: [] as TableForecast[],
    });

    async function prepareModify(change: boolean) {
      const {
        modifyConfig,
        data,
        history,
        guestContact,
        forecast,
      } = await $api.frontOfficeReception.prepareModifyGuestProfile({
        type: props.type,
        guestNumber: props.guestNumber,
        change,
      });

      currentModifyConfig = modifyConfig;

      if (change) {
        if (modifyConfig.recordUse) {
          $q.notify({
            type: 'negative',
            message: 'Guest Record is being modified by other user.',
          });
          return;
        } else formStatus.disabled = false;
      }

      table.history = history;
      table.guestContact = guestContact;
      table.forecast = forecast;

      // Map modify data after table. Because we need data from tables
      currentModifyData = data;
      mapModifyData();
    }

    function mapModifyData() {
      formData.name = currentModifyData.name;
      formData.companyTitle = currentModifyData.anredefirma;
      formData.phone = currentModifyData.telefon;
      formData.fax = currentModifyData.fax;
      formData.email = currentModifyData['email-adr'];
      formData.country = currentModifyData.land;
      formData.bookSource = currentModifyData.segment3 || null;
      formData.address = `${currentModifyData.adresse1}\n${currentModifyData.adresse2}\n${currentModifyData.adresse3}`;
      formData.city = currentModifyData.wohnort;
      formData.postalCode = currentModifyData.plz;
      formData.salesId = currentModifyData.phonetik3;
      formData.referenceNumberLeft = currentModifyData['firmen-nr'] || '';
      formData.referenceNumberRight = currentModifyData['point-gastnr'] || '';
      formData.channelManagerCode = currentModifyData.steuernr;
      formData.contractRate = currentModifyData.contractRate;
      formData.paymentMethod = currentModifyData.zahlungsart || null;
      formData.creditLimit = currentModifyData.kreditlimit || '';
      formData.days = currentModifyData.number1;
      formData.creditAccountNumber = currentModifyData.cardnr;
      formData.remark = currentModifyData.bemerkung;

      // Set main contact
      if (table.guestContact[0]) {
        const contact = table.guestContact[0];
        formData.mainContact = `${contact.NAME}, ${contact.vorname} ${contact.anrede}`;
      } else {
        formData.mainContact = currentModifyData.namekontakt;
      }
    }

    async function enableModify() {
      $q.loading.show();
      await prepareModify(true);
      $q.loading.hide();
    }

    async function onSubmit() {
      if (formStatus.disabled) {
        showDialog.value = false;
        return;
      }

      if (
        !formData.name ||
        !formData.country ||
        !formData.bookSource ||
        formData.mainSegment.length < 1
      ) {
        tab.value = 'main-information';
        nextTick(() => {
          formRef.value.validate();
        });
        return;
      }

      $q.loading.show();
      let guestNumber: number;

      if (formStatus.view) {
        guestNumber = props.guestNumber;
        const checkTime = await $api.frontOfficeReception.checkTime({
          caseType: 3,
          idTable: guestNumber,
          idTable1: 0,
          nameTable: 'guest',
          initTime2: currentModifyConfig.initTime,
          initDate2: date.formatDate(currentModifyConfig.initDate, 'MM/DD/YY'),
        });
        if (!checkTime) {
          $q.notify({
            type: 'negative',
            message:
              'Your Time was Expired. Another user has modified this record.',
          });
          $q.loading.hide();
          return;
        }
      } else {
        guestNumber = await $api.frontOfficeReception.createGuestNumber(
          props.type
        );
      }

      const [address1, address2, ...address3] = formData.address.split('\n');
      const requestData: GuestProfileForm = {
        gastnr: guestNumber,
        karteityp: props.type,
        name: formData.name,
        anredefirma: formData.companyTitle,
        land: formData.country,
        bemerkung: formData.remark,
        zahlungsart: formData.paymentMethod ?? 0,
        namekontakt: formData.mainContact,
        telefon: formData.phone,
        phonetik3: formData.salesId,
        'firmen-nr': toNumber(formData.referenceNumberLeft),
        'point-gastnr': toNumber(formData.referenceNumberRight),
        adresse1: address1 ?? '',
        adresse2: address2 ?? '',
        adresse3: address3.join('\n'),
        wohnort: formData.city,
        plz: formData.postalCode,
        kreditlimit: toNumber(formData.creditLimit),
        fax: formData.fax,
        cardnr: formData.creditAccountNumber,
        number1: toNumber(formData.days),
        'email-adr': formData.email,
        steuernr: formData.channelManagerCode,
        segment3: formData.bookSource ?? 0,
      };
      await $api.frontOfficeReception.saveGuestProfile(requestData);

      await $api.frontOfficeReception.saveMainSegment({
        guestNumber,
        vipFlag1: currentMainSegmentConfig.vipFlag1,
        mainscode: currentMainSegmentConfig.mainscode,
        mainseg: currentMainSegmentConfig.mainseg,
        data: formData.mainSegment,
      });

      $q.loading.hide();

      $q.notify({
        type: 'positive',
        message: 'Successfully save guest profile.',
      });

      if (formStatus.view) {
        formStatus.disabled = true;
        await releaseModify();
      } else {
        showDialog.value = false;
      }
    }

    async function releaseModify() {
      await $api.frontOfficeReception.checkTime({
        caseType: 2,
        idTable: props.guestNumber,
        idTable1: 0,
        nameTable: 'guest',
        initTime2: currentModifyConfig.initTime,
        initDate2: date.formatDate(currentModifyConfig.initDate, 'MM/DD/YY'),
      });
    }

    async function onCancel() {
      if (formStatus.view && !formStatus.disabled) {
        mapModifyData(); // Reset form data with current modify data
        formStatus.disabled = true;
        await releaseModify();
      } else {
        showDialog.value = false;
      }
    }

    function onSaveContractRate(contractRates: AttachContractRate[]) {
      if (contractRates.length) {
        const contractRate = contractRates[0];
        formData.contractRate = contractRate.char1 + '  ' + contractRate.char2;
      } else formData.contractRate = '';
    }

    return {
      GuestProfileType,
      tableHeaderGuestContact,
      tableHeaderHistory,
      tableHeaderForecast,

      showDialog,
      tab,
      formData,
      isPreparing,
      formStatus,
      formRef,

      titleOptions,
      countryOptions,
      bookSourceOptions,
      mainSegmentOptions,
      salesIdOptions,
      paymentMethodOptions,

      table,

      enableModify,
      onSubmit,
      onCancel,
      onSaveContractRate,

      dialogAttachContractRate: useDisposableDialog(),
      dialogContactPersonCompany: useDisposableDialog(),
      dialogCreditCard: useDisposableDialog(),
      dialogGuestInformation: useDisposableDialog(),
    };
  },
});
