import {
  defineComponent,
  computed,
  watch,
  ref,
  reactive,
  toRefs,
} from '@vue/composition-api';
import { store } from '~/store';
import { DatePicker } from 'v-calendar';
import TablePUNewPurchaseOrder from '../components/TablePUNewPurchaseOrder.vue';
import { date } from 'quasar';

const defaultFormValues = {
  poNumber: '',
  purchaseRequest: '',
  creditTerm: 30,
  paymentDate: '',
  currency: '',
  department: null,
  supplier: null,
  orderDate: new Date(),
  deliveryDate: date.addToDate(new Date(), { days: 1 }),
  orderType: '',
  orderName: '',
  instruction: '',
  released: false,
  enterDiscount: true,
  deliveryUnitPrice: true,
  article: null,
  deliveryUnit: '',
  content: null,
  quantity: 0,
  price: 0,
  remark: '',
  recId: null,

  lessDiscount: 0,
  secondDiscount: 0,
  addVat: 0,
  applyForAllItem: false,
};

export default defineComponent({
  components: {
    'v-date-picker': DatePicker,
    TablePUNewPurchaseOrder,
  },
  props: {
    dialog: { type: Boolean, required: true },
  },
  setup(props, { emit, root: { $api } }) {
    const dialogModel = computed({
      get: () => props.dialog,
      set: (val) => {
        emit('update:dialog', val);
      },
    });
    const username = store.state.auth.user.userName;

    const formState = reactive(defaultFormValues);

    const supplierList = ref([]);
    const supplierOptions = ref([]);
    function supplierLabel(supp) {
      return `${supp['lief-nr']} - ${supp.firma}`;
    }

    function filterSuppliers(val, update) {
      update(() => {
        const text = val.toLowerCase();
        supplierOptions.value = supplierList.value.filter(
          (v) => v.firma.toLowerCase().indexOf(text) > -1
        );
      });
    }

    watch(() => formState.supplier, onChangeSupplier);

    function onChangeSupplier() {
      if (formState.poNumber === '') {
        prepareLoadData();
      } else {
        $api.purchasing.poMkPOCheckLiefnr({
          docuNr: formState.poNumber,
          liefNr: formState.supplier.value,
        });
      }
    }

    const param266 = ref(0);
    const recIdOrder = ref(0);

    async function prepareLoadData() {
      const [, data] = await $api.purchasing.poMkPOPrepare({
        docuNr: ' ',
        pvILanguage: 1,
        liefNr: formState.supplier.value,
        prDeptnr: 0,
        poType: 1,
        potype: 1,
        bedienerUsername: username,
        ordernameScreenValue: ' ',
        crterm: 30,
      });

      if (data) {
        formState.poNumber = data.docuNr;
        formState.orderDate = data.billdate;
        param266.value = data.p266;
        recIdOrder.value = data['rec-id'];
      }
    }

    const articleOptions = ref([]);
    function articleLabel(art) {
      return `${art.artnr} - ${art.bezeich}`;
    }

    watch(() => formState.article, onChangeArticle);

    async function onChangeArticle() {
      formState.content = formState.article['lief-einheit'];
      formState.deliveryUnit = formState.article.traubensorte;
      formState.price = formState.article['ek-aktuell'];

      const article = await $api.purchasing.poMkPOCreateLArtikel({
        sArtnr: formState.article.artnr,
      });

      formState.recId = article['rec-id'];
    }

    const amount = computed(() => formState.price * formState.quantity + '.00');
    const totalAmount = computed(() => 0);

    const isPreparing = ref<boolean>(true);
    (async function () {
      const [resSupp, resArt, resCurrency, resDept] = await Promise.all([
        $api.common.selectSupplier(),
        $api.common.getAllArtikel(),
        $api.common.readCurrency(),
        $api.settings.invLoadCostCenter(),
      ]);

      supplierList.value = resSupp;
      supplierOptions.value = resSupp;
      articleOptions.value = resArt;
      currencyOptions.value = resCurrency;
      departmentOptions.value = resDept.costList['cost-list'];

      isPreparing.value = false;
    })();

    const departmentOptions = ref([]);
    const currencyOptions = ref([]);

    const diffPercent = ref(0);

    function onAddArticle() {
      if (formState.content === 0) {
        formState.content = 1;
      }
      $api.purchasing.poMkPOUpdLArtikel({
        recId: formState.recId,
      });
      const actualPrice = formState.article['ek-aktuell'];
      const diffPrice = formState.price - actualPrice;
      diffPercent.value = Math.round((diffPrice / actualPrice) * 100);
      if (diffPercent.value > param266.value) {
        dialogPrice.value = true;
      } else if (formState.enterDiscount) {
        dialogDiscount.value = true;
      } else {
        addArticle();
      }
    }

    const priceEl = ref();

    const dialogPrice = ref(false);
    const discountWarning = computed(() => {
      return `Price difference to the actual price = ${diffPercent.value}%, max.allowed = ${param266.value}% Please confirm the entered purchase price`;
    });

    function onCancelWarning() {
      dialogPrice.value = false;
      priceEl.value.$refs.input.focus();
    }

    function onContinueWarning() {
      dialogPrice.value = false;

      if (formState.enterDiscount) {
        dialogDiscount.value = true;
      }
    }

    const dialogDiscount = ref(false);

    watch(dialogDiscount, (val) => {
      if (!val) {
        formState.lessDiscount = 0;
        formState.secondDiscount = 0;
        formState.addVat = 0;
      }
    });

    function onApplyDiscount() {
      addArticle();
      dialogDiscount.value = false;
    }

    const articles = ref([]);

    async function addArticle() {
      const firstCut = Math.round(
        (formState.price * formState.lessDiscount) / 100
      );
      const totalDiscount =
        formState.lessDiscount + formState.secondDiscount + formState.addVat;
      const totalCut = Math.round((formState.price * totalDiscount) / 100);

      const [, res] = await $api.purchasing.poMkPOCreateLOrder({
        pos: ' ',
        recIdLOrderhdr: formState.recId,
        recIdLArtikel: recIdOrder.value,
        sArtnr: formState.article.artnr,
        liefNr: formState.supplier.value,
        docuNr: formState.poNumber,
        pr: formState.purchaseRequest,
        remark: formState.remark,
        price0: formState.price,
        price1: formState.price - firstCut,
        price: formState.price - totalCut,
        currDisc: formState.lessDiscount,
        currDisc2: formState.secondDiscount,
        currVat: formState.addVat,
        qty: formState.quantity,
        potype: '1',
        newBez: ' ',
        dunitPrice: formState.deliveryUnit.toString(),
        bedienerUsername: username,
      });

      if (res) {
        const [tlOrder] = res.tlOrder['t-l-order'];
        const [discount] = res.discList['disc-list'];

        const newArticle = {
          artnr: tlOrder.artnr,
          anzahl: tlOrder.anzahl,
          einzelpreis: tlOrder.einzelpreis,
          warenwert: tlOrder.warenwert,
          besteller: tlOrder.besteller,
          bezeich: tlOrder['a-bezeich'],
          einheit: tlOrder['lief-einheit'],
          disc: discount.disc,
          disc2: discount.disc2,
          vat: discount.vat,
          discVal: discount['disc-val'],
          disc2Val: discount['disc2-val'],
          vatVal: discount['vat-val'],
        };

        articles.value.push(newArticle);
      }
    }

    function onDeleteItem(recId) {
      const delIdx = articles.value.findIndex((art) => art.recId === recId);

      if (delIdx > -1) {
        articles.value.splice(delIdx, 1);
      }

      $api.purchasing.poMkPOBtnDel({
        recId,
      });
    }

    function onSave() {
      const formatDate = (dateIn) => date.formatDate(dateIn, 'YYYY-MM-DD');
      dialogModel.value = false;

      $api.purchasing.poMkPOBtnGo1({
        tLOrderhdr: {
          't-l-orderhdr': [
            {
              bestelldatum: formatDate(formState.orderDate),
              'lief-nr': formState.supplier.value['lief-nr'],
              besteller: username,
              lieferdatum: formatDate(formState.deliveryDate),
              bestellart: formState.orderType,
              'docu-nr': formState.poNumber,
              'angebot-lief': [101, 30, 1],
              gedruckt: formatDate(new Date()),
              gefaxt: formatDate(formState.paymentDate),
              'lief-fax': ['', formState.orderName, formState.instruction],
              txtnr: 0,
              betriebsnr: 0,
              'rec-id': recIdOrder.value,
            },
          ],
        },
      });
    }

    function onCancel() {
      dialogModel.value = false;

      $api.purchasing.poMkPOBtnStop({
        poType: 1,
        recId: recIdOrder.value,
        liefNr: formState.supplier.value,
        docuNr: formState.poNumber,
      });
    }

    return {
      isPreparing,
      dialogModel,

      username,

      supplierOptions,
      supplierLabel,
      filterSuppliers,

      articleOptions,
      articleLabel,
      articles,

      amount,
      totalAmount,

      departmentOptions,
      currencyOptions,

      ...toRefs(formState),
      onAddArticle,
      priceEl,
      dialogPrice,
      discountWarning,
      onCancelWarning,
      onContinueWarning,

      dialogDiscount,
      onApplyDiscount,
      onDeleteItem,

      onSave,
      onCancel,
    };
  },
});
