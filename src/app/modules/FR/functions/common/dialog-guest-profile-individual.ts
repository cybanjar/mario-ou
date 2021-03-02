import {
  defineComponent,
  ref,
  reactive,
  watch,
  toRefs,
  nextTick,
} from '@vue/composition-api';
import { date } from 'quasar';
import InlineSvg from 'vue-inline-svg';
import { toNumber } from '~/app/helpers/typeConverter.helper';
import { useModelWrapper } from '~/app/shared/compositions/use-model-wrapper.composition';
import { SelectItem } from '~/app/shared/models/select.model';
import { store } from '~/store';
import DateInput from '../../components/common/DateInput.vue';
import { useDisposableDialog } from '../../composables/disposableDialog';
import {
  ModifyGuestProfile,
  GuestProfileForm,
  TableForecast,
  TableGuestContact,
  TableHistory,
  UploadIdCardType,
} from '../../models/common/dialogGuestProfile.model';
import { ModifyConfig } from '../../models/common/modify.model';
import { GuestProfileType } from '../../models/guest-profile/guestProfile.model';
import {
  tableHeaderForecast,
  tableHeaderGuestContact,
  tableHeaderHistory,
} from '../../tables/common/dialogGuestProfile.table';

const defaultFormValues = {
  name: '',
  firstName: '',
  title: '',
  gender: '',
  country: '',
  nation: '',
  birthdate: null as Date,
  birthPlace: '',
  idCard: '',
  idCardType: '',
  expiredDate: null as Date,
  idCardNumber: '',
  mobileNumber: '',
  emailAddress: '',
  phoneNumber: '',
  fax: '',
  occupation: '',
  paymentMethod: null as number,
  creditLimit: '' as number | string,
  province: '',
  localRegion: '',
  city: '',
  postalCode: '',
  address: '',
  vip: false,
  vipSegment: null as number,
  remark: '',
};

export default defineComponent({
  components: {
    DateInput,
    InlineSvg,
    DialogContactPersonIndividual: () =>
      import(
        '../../components/guest-profile/DialogContactPersonIndividual.vue'
      ),
    DialogCreditCard: () =>
      import('../../components/common/DialogCreditCard.vue'),
    DialogGuestInformation: () =>
      import('../../components/guest-profile/DialogGuestInformation.vue'),
  },
  props: {
    show: { type: Boolean, required: true },
    guestNumber: { type: Number, default: null },
  },
  setup(props, { emit, root: { $api, $q } }) {
    const showDialog = useModelWrapper(props, emit, 'show');
    const tab = ref('personal-information');
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
    const defaultCountry = ref<string>(null);
    const titleOptions = ref<string[]>([]);
    const countryOptions = ref<SelectItem<string>[]>([]);
    const idCardTypeOptions = ref<string[]>([]);
    const paymentMethodOptions = ref<SelectItem<number>[]>([]);
    const localRegionOptions = ref<SelectItem<string>[]>([]);
    const vipSegmentOptions = ref<SelectItem<number>[]>([]);

    async function setupFormOptions() {
      const [
        resHTParam0,
        resTitleOptions,
        resCountryOptions,
        resIdCardTypeOptions,
        resPaymentMethodOptions,
        resLocalRegionOptions,
        resVIPSegment,
      ] = await Promise.all([
        $api.frontOfficeReception.getHTParam0({ casetype: 3, inpParam: 153 }),
        $api.frontOfficeReception.readQueasy(141),
        $api.frontOfficeReception.getGCFNation(0),
        $api.frontOfficeReception.readQueasy(27),
        $api.frontOfficeReception.loadArtikel({ caseType: 5, deptNo: 0 }),
        $api.frontOfficeReception.getGCFNation(-1),
        $api.frontOfficeReception.getVIPSegment(props.guestNumber),
      ]);

      defaultCountry.value = resHTParam0.fchar;

      titleOptions.value = resTitleOptions.map((e) => e.char1);
      countryOptions.value = resCountryOptions.map((e) => ({
        value: e.kurzbez,
        label: `${e.kurzbez} - ${e.bezeich}`,
      }));
      idCardTypeOptions.value = resIdCardTypeOptions.map((e) => e.char1);
      paymentMethodOptions.value = resPaymentMethodOptions.map((e) => ({
        value: e.artnr,
        label: `${e.artnr} - ${e.bezeich}`,
      }));
      localRegionOptions.value = resLocalRegionOptions.map((e) => ({
        value: e.kurzbez,
        label: `${e.kurzbez} - ${e.bezeich}`,
      }));
      vipSegmentOptions.value = resVIPSegment.options.map((e) => ({
        value: e.segmentcode,
        label: e.bezeich,
      }));

      // Setup some default value
      if (!formStatus.view) {
        formData.nation = defaultCountry.value;
        formData.country = defaultCountry.value;
      } else {
        if (resVIPSegment.current.length > 0) {
          formData.vip = true;
          const selectedVipSegment = vipSegmentOptions.value.find(
            (opt) => opt.label === resVIPSegment.current
          );
          formData.vipSegment = selectedVipSegment?.value;
        }
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
        type: GuestProfileType.Individual,
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

      currentModifyData = data;
      mapModifyData();

      table.history = history;
      table.guestContact = guestContact;
      table.forecast = forecast;
    }

    function mapModifyData() {
      formData.name = currentModifyData.name;
      formData.firstName = currentModifyData.vorname1;
      formData.title = currentModifyData.anrede1;
      formData.gender = currentModifyData.geschlecht;
      formData.country = currentModifyData.land;
      formData.nation = currentModifyData.nation1;
      formData.birthdate = currentModifyData.geburtdatum1
        ? new Date(currentModifyData.geburtdatum1)
        : null;
      formData.birthPlace = currentModifyData.telex;
      formData.idCard = currentModifyData.base64ImageFile;
      formData.idCardType = currentModifyData['geburt-ort1'];
      formData.expiredDate = currentModifyData.geburtdatum2
        ? new Date(currentModifyData.geburtdatum2)
        : null;
      formData.idCardNumber = currentModifyData['ausweis-nr1'];
      formData.mobileNumber = currentModifyData['mobil-telefon'];
      formData.emailAddress = currentModifyData['email-adr'];
      formData.phoneNumber = currentModifyData.telefon;
      formData.fax = currentModifyData.fax;
      formData.occupation = currentModifyData.beruf;
      formData.paymentMethod = currentModifyData.zahlungsart || null;
      formData.creditLimit = currentModifyData.kreditlimit || '';
      formData.province = currentModifyData['geburt-ort2'];
      formData.localRegion = currentModifyData.nation2;
      formData.city = currentModifyData.wohnort;
      formData.postalCode = currentModifyData.plz;
      formData.address = `${currentModifyData.adresse1}\n${currentModifyData.adresse2}\n${currentModifyData.adresse3}`;
      formData.remark = currentModifyData.bemerkung;
    }

    async function enableModify() {
      $q.loading.show();
      await prepareModify(true);
      $q.loading.hide();
    }

    const { country, vip } = toRefs(formData);
    watch(country, (newValue) => {
      if (newValue !== defaultCountry.value) formData.localRegion = '';
    });

    watch(vip, (newValue) => {
      if (!newValue) formData.vipSegment = null;
    });

    function onChangeIdCardFile(evt: Event) {
      const files = (evt.target as HTMLInputElement).files;
      if (!files.length) return;

      const file = files[0];
      if (file.size > 4_000_000) {
        // 4_000_000 is equivalent to 4000000. It's numeric separator to make number more readable
        return $q.notify({ type: 'negative', message: 'Image too large!' });
      } else if (!file.type.includes('image/')) {
        return $q.notify({ type: 'negative', message: 'Only accept image!' });
      }

      // Convert to Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        // It's safe to use a comma as the separator because it's not a part of the base64 index table. Ref: https://en.wikipedia.org/wiki/Base64
        const base64 = (reader.result as string).split(',')[1];
        formData.idCard = base64;
      };
      reader.readAsDataURL(file);
    }

    async function onSubmit() {
      if (formStatus.disabled) {
        showDialog.value = false;
        return;
      }

      if (!formData.name || !formData.nation || !formData.country) {
        tab.value = 'personal-information';
        nextTick(() => {
          formRef.value.validate();
        });
        return;
      } else if (formData.vip && formData.vipSegment === null) {
        tab.value = 'additional-information';
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
          GuestProfileType.Individual
        );
      }

      const [address1, address2, ...address3] = formData.address.split('\n');
      const requestData: GuestProfileForm = {
        gastnr: guestNumber,
        karteityp: GuestProfileType.Individual,
        name: formData.name,
        vorname1: formData.firstName,
        anrede1: formData.title,
        land: formData.country,
        plz: formData.postalCode,
        wohnort: formData.city,
        char1: store.state.auth.user.userInit,
        telefon: formData.phoneNumber,
        nation1: formData.nation,
        nation2: formData.localRegion,
        beruf: formData.occupation,
        'ausweis-nr1': formData.idCardNumber,
        geburtdatum1:
          formData.birthdate &&
          date.formatDate(formData.birthdate, 'YYYY/MM/DD'),
        geburtdatum2:
          formData.expiredDate &&
          date.formatDate(formData.expiredDate, 'YYYY/MM/DD'),
        'geburt-ort1': formData.idCardType,
        'geburt-ort2': formData.province,
        bemerkung: formData.remark,
        logiernachte: 1,
        'point-gastnr': formData.paymentMethod ?? 0,
        zahlungsart: formData.paymentMethod ?? 0,
        adresse1: address1 ?? '',
        adresse2: address2 ?? '',
        adresse3: address3.join('\n'),
        fax: formData.fax,
        telex: formData.birthPlace,
        geschlecht: formData.gender,
        kreditlimit: toNumber(formData.creditLimit),
        'mobil-telefon': formData.mobileNumber,
        'email-adr': formData.emailAddress,
      };
      await $api.frontOfficeReception.saveGuestProfile(requestData);

      await $api.frontOfficeReception.saveVipSegment(
        guestNumber,
        formData.vipSegment ?? 0
      );

      const currentIdCard = formStatus.view
        ? currentModifyData.base64ImageFile
        : '';
      if (formData.idCard !== currentIdCard) {
        if (formData.idCard.length > 0) {
          await $api.frontOfficeReception.uploadIdCard({
            type: UploadIdCardType.Upload,
            guestNumber,
            data: formData.idCard,
          });
        } else {
          await $api.frontOfficeReception.uploadIdCard({
            type: UploadIdCardType.Delete,
            guestNumber,
            data: currentIdCard, // Use current Id Card to prevent null error from API
          });
        }
      }

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

    return {
      tableHeaderGuestContact,
      tableHeaderHistory,
      tableHeaderForecast,

      showDialog,
      tab,
      formData,
      isPreparing,
      formStatus,
      formRef,

      defaultCountry,
      titleOptions,
      countryOptions,
      idCardTypeOptions,
      paymentMethodOptions,
      localRegionOptions,
      vipSegmentOptions,

      table,

      enableModify,
      onChangeIdCardFile,
      onSubmit,
      onCancel,

      dialogContactPersonIndividual: useDisposableDialog(),
      dialogCreditCard: useDisposableDialog(),
      dialogGuestInformation: useDisposableDialog(),
    };
  },
});
