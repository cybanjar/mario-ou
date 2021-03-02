import { DoRequest } from '../config/repository';
import { store } from '~/store';
import { toBoolean } from '~/app/helpers/typeConverter.helper';
import {
  PrepareReservation,
  RefreshRoom,
  ReqRefreshRoom,
  ReqSearchReservation,
  Reservation,
  ReservationStatus,
} from '~/app/modules/FR/models/reservation/reservation.model';
import {
  ReqGroupCheckIn,
  GroupCheckIn,
} from '~/app/modules/FR/models/group-check-in/groupCheckIn.model';
import {
  ReqSearchGuestProfile,
  GuestProfileType,
  ResSearchGuestProfile,
} from '~/app/modules/FR/models/guest-profile/guestProfile.model';
import {
  AllotmentList,
  Arrangement,
  CreateAllotment,
  ResCheckResLine,
  ReqGlobalAllotment,
  GlobalAllotment,
  SaveGlobalAllotment,
} from '~/app/modules/FR/models/guest-profile/createAllotment.model';
import {
  PrepareContactPerson,
  CreateContactPerson,
  CPCompanyTravel,
  GuestContact,
} from '~/app/modules/FR/models/guest-profile/contactPerson.model';
import { SelectGuest } from '~/app/modules/FR/models/common/selectGuest.model';
import {
  ReqGuestInformartion,
  ResGuestInformation,
  ReqOutletBill,
  OutletBill,
} from '~/app/modules/FR/models/guest-profile/guestInformation.model';
import {
  ReqCleanUp,
  ResCleanUp,
} from '~/app/modules/FR/models/guest-profile/cleanUp.model';
import {
  PrepareReservationByCreationDate,
  ReqReservationByCreationDate,
  MainReservation,
  ReservationMember,
} from '~/app/modules/FR/models/reservation-by-creation-date/reservationByCreationDate.model';
import {
  ReqSearchReinstateCancelledReservation,
  ReinstateCancelledReservation,
} from '~/app/modules/FR/models/reinstate-cancelled-reservation/reinstateCancelledReservation.model';
import { ConfirmationLetter } from '~/app/modules/FR/models/confirmation-letter/confirmationLetter.model';
import {
  ReqSearchMemoRoomNumber,
  MemoRoomNumber,
} from '~/app/modules/FR/models/memo-room-number/memoRoomNumber.model';
import {
  ReqSearchByVoucher,
  ResSearchByVoucher,
} from '~/app/modules/FR/models/reservation/searchByVoucher.model';
import {
  BookSource,
  GCFNation,
  HTParam0,
  Artikel,
  ReadQueasy,
  ReqHTParam0,
  SalesId,
  VIPSegment,
  ReqLoadArtikel,
  RoomType,
} from '~/app/modules/FR/models/common/options.model';
import {
  GuestProfileForm,
  PrepareModifyGuestProfile,
  ReqPrepareModifyGuestProfile,
  ReqSaveMainSegment,
  ReqUploadIdCard,
  ResMainSegment,
} from '~/app/modules/FR/models/common/dialogGuestProfile.model';
import {
  mapModifyConfig,
  ReqCheckTime,
} from '~/app/modules/FR/models/common/modify.model';
import { AttachContractRate } from '~/app/modules/FR/models/guest-profile/attachContractRate.model';
import {
  Guest,
  ReadHtparam,
  ReqReadHtparam,
  ResLine,
} from '~/app/modules/FR/models/common/common.model';
import {
  ReqViewRates,
  ResViewRates,
} from '~/app/modules/FR/models/extra/guest-profile-view-rates/guestProfileViewRates.model';
import {
  BillDetail,
  CreateGuestProfileHistory,
  GuestBill,
  GuestProfileHistory,
  HistoryList,
  ReqHistoryList,
  SearchGuestProfileHistory,
} from '~/app/modules/FR/models/extra/guest-profile-guest-history/guestProfileGuestHistory.model';
import { GuestReservationList } from '~/app/modules/FR/models/extra/guest-profile-guest-history/guestReservationList.model';
import {
  ReqRoomReservation,
  PrepareRoomPlan,
  RoomReservation,
  ReqChangeRoom,
  RoomPlan,
} from '~/app/modules/FR/models/room-plan/roomPlan.model';
import {
  PrepareManageReservation,
  ReservationListData,
  ReservationMemberData,
} from '~/app/modules/FR/models/extra/manage-reservation/manageReservation.model';
import {
  ReqViewAllotment,
  ViewAllotment,
} from '~/app/modules/FR/models/extra/view-allotment/viewAllotment.model';
import {
  ReqReservationRemark,
  ReservationRemark,
} from '~/app/modules/FR/models/common/dialogReservationRemark.model';

const FR_URL = 'vhpFOR';
const COMMON_URL = 'Common';

/**
 * CONTRACT
 *
 * Contract for repository endpoints
 * Define contract first before creating the method
 */
export interface FrontOfficeReceptionEndpoints {
  //#region Reservation
  prepareReservation: () => Promise<PrepareReservation>;
  searchReservation: (body: ReqSearchReservation) => Promise<Reservation[]>;
  searchByVoucher: (body: ReqSearchByVoucher) => Promise<ResSearchByVoucher>;
  getVoucherSorttype: (reservationNumber: number) => Promise<ReservationStatus>;
  reservationRemark: (body: ReqReservationRemark) => Promise<ReservationRemark>;
  arlBlockRoom: (reservationId: number, reason: string) => Promise<string>;
  arlReleaseRoom: (reservationId: number) => Promise<number>;
  arlAddQueueRoom: (roomNumber: string) => Promise<void>;
  incognitoGuest: (resnr: number, reslinnr: number) => Promise<void>;
  refreshRoom: (req: ReqRefreshRoom) => Promise<RefreshRoom>;
  //#endregion

  //#region Guest Profile
  searchGuestProfile: (
    body: ReqSearchGuestProfile
  ) => Promise<ResSearchGuestProfile>;
  deleteGuestProfile: (
    guestNumber: number,
    totalRecord: number
  ) => Promise<string>;

  //#region Guest Information Dialog
  searchGuestInformation: (
    body: ReqGuestInformartion
  ) => Promise<ResGuestInformation>;
  searchOutletBill: (body: ReqOutletBill) => Promise<OutletBill[]>;
  //#endregion

  //#region Clean-Up
  cleanUp: (body: ReqCleanUp) => Promise<ResCleanUp>;
  //#endregion

  //#region Contact Person Individual Dialog
  prepareContactPerson: (guestNumber: number) => Promise<PrepareContactPerson>;
  gcf0Contact: (
    formData: CreateContactPerson | GuestContact,
    guestNumber: number,
    caseType: number
  ) => Promise<void>;
  deleteContactPerson: (
    guestNumber: number,
    contactNumber: number
  ) => Promise<void>;
  setMainContact: (guestNumber: number, recId: number) => Promise<void>;
  //#endregion

  //#region Contact Person Company Dialog
  soaReadAktKont: (
    guestNumber: number,
    casetype: number
  ) => Promise<CPCompanyTravel[]>;
  selectGuest: (type: GuestProfileType, name: string) => Promise<SelectGuest[]>;
  gcfContactBtnExit: (
    guestnumber: number,
    formData: CPCompanyTravel,
    caseType: number
  ) => Promise<void>;
  aktKontSave: (formData: CPCompanyTravel, caseType: number) => Promise<void>;
  //#endregion

  //#region Create Allotment Dialog
  prepareCreateAllotment: (guestNumber: number) => Promise<AllotmentList[]>;
  getRoomType: () => Promise<RoomType[]>;
  getArrangement: () => Promise<Arrangement[]>;
  createAllotment: (body: CreateAllotment) => Promise<void>;
  readKontline: (guestNumber: number, code: string) => Promise<[]>;
  checkResline: (
    allotmentCode: string,
    allotmentNumber: number
  ) => Promise<ResCheckResLine>;
  deleteAllotment: (
    allotmentCode: string,
    allotmentNumber: number,
    guestNumber: number
  ) => Promise<void>;
  getGlobalAllotment: (body: ReqGlobalAllotment) => Promise<GlobalAllotment[]>;
  saveGlobalAllotment: (body: SaveGlobalAllotment) => Promise<void>;
  deleteCheckGlobalAllotment: (
    guestNumber: number,
    code: string
  ) => Promise<{ errorFlag: boolean; msgStr: string }>;
  //#endregion

  //#region Merge Guest Profile Diaolog
  mergeGuestProfile: (
    guestNumber: number,
    mergeGuestNumber: number,
    type: GuestProfileType
  ) => Promise<string>;
  //#endregion

  //#region Change Guest Profile Dialog
  changeGuestProfileType: (
    guestNumber: number,
    type: GuestProfileType
  ) => Promise<string>;
  //#endregion

  //#region Reservation By Creation Date
  prepareReservationByCreationDate: () => Promise<PrepareReservationByCreationDate>;
  searchMainReservation: (
    body: ReqReservationByCreationDate
  ) => Promise<MainReservation[]>;
  searchReservationMember: (
    body: ReqReservationByCreationDate
  ) => Promise<ReservationMember[]>;
  //#endregion

  //#region Search Memo Room Number
  searchMemoRoomNumber: (
    body: ReqSearchMemoRoomNumber
  ) => Promise<MemoRoomNumber[]>;
  //#endregion

  //#region Group Check In
  getGroupCheckIn: (body: ReqGroupCheckIn) => Promise<GroupCheckIn[]>;
  //#endregion

  //#region Reinstate Cancelled Reservation
  searchReinstateCancelledReservation: (
    body: ReqSearchReinstateCancelledReservation
  ) => Promise<ReinstateCancelledReservation[]>;
  //#region

  //#region Confirmation Letter
  searchConfirmationLetter: (
    lname: string,
    fdate: string
  ) => Promise<ConfirmationLetter[]>;
  //#endregion

  //#region Common
  readGuest: (guestNumber: number) => Promise<Guest>;
  getHTParam0: (body: ReqHTParam0) => Promise<HTParam0>;
  readHtparam: (body: ReqReadHtparam) => Promise<ReadHtparam>;
  readQueasy: (key: number) => Promise<ReadQueasy[]>;
  getGCFNation: (code: number) => Promise<GCFNation[]>;
  loadArtikel: (body: ReqLoadArtikel) => Promise<Artikel[]>;
  getVIPSegment: (
    guestNumber: number | null
  ) => Promise<{ options: VIPSegment[]; current: string }>;
  getBookSource: () => Promise<BookSource[]>;
  getMainSegment: (guestNumber: number | null) => Promise<ResMainSegment>;
  getSalesId: () => Promise<SalesId[]>;
  createGuestNumber: (type: GuestProfileType) => Promise<number>;
  saveGuestProfile: (data: GuestProfileForm) => Promise<void>;
  saveVipSegment: (guestNumber: number, segmentCode: number) => Promise<void>;
  uploadIdCard: (req: ReqUploadIdCard) => Promise<void>;
  saveMainSegment: (req: ReqSaveMainSegment) => Promise<void>;
  prepareModifyGuestProfile: (
    req: ReqPrepareModifyGuestProfile
  ) => Promise<PrepareModifyGuestProfile>;
  checkTime: (body: ReqCheckTime) => Promise<boolean>;
  //#endregion

  getAttachContractRate: (
    guestNumber: number
  ) => Promise<{
    existing: AttachContractRate[];
    selected: AttachContractRate[];
  }>;
  checkAccessContractRate: (guestNumber: number) => Promise<boolean>;
  readResLine: (guestNumber: number) => Promise<ResLine>;
  saveContractRate: (
    guestNumber: number,
    data: AttachContractRate[]
  ) => Promise<void>;

  saveCreditCard: (guestNumber: number, data: string) => Promise<void>;

  readGuestPr: (guestNumber: number) => Promise<string>;
  viewRateCode: (body: ReqViewRates) => Promise<ResViewRates>;

  //#region Extra - Guest Profile History
  prepareGuestProfileHistory: (
    guestNumber: number
  ) => Promise<{ fdate: string; tTittle: string }>;
  searchGuestProfileHistory: (
    body: SearchGuestProfileHistory
  ) => Promise<GuestProfileHistory[]>;
  readSegment: (guestNumber: number) => Promise<[]>;
  selectSegment: () => Promise<{ code: number; remark: string }[]>;
  createGuestProfileHistory: (body: CreateGuestProfileHistory) => Promise<void>;
  editGuestProfileHistory: (
    recidNumber: number,
    body: CreateGuestProfileHistory
  ) => Promise<void>;
  guestReservationList: (
    guestNumber: string
  ) => Promise<GuestReservationList[]>;
  readHistoryList: (body: ReqHistoryList) => Promise<HistoryList>;
  getViewHistory: (
    reservationNumber: number,
    body: HistoryList
  ) => Promise<HistoryList[]>;
  getGuestBill: (
    reservationNumber: number,
    reslinnr: number
  ) => Promise<GuestBill[]>;
  getBillDetail: (
    reservationNumber: number,
    body: HistoryList
  ) => Promise<BillDetail[]>;
  //#endregion

  //#region Room Plan
  prepareRoomPlan: () => Promise<PrepareRoomPlan>;
  roomPlan: (currDate: string, ciDate: string) => Promise<RoomPlan>;
  roomReservation: (body: ReqRoomReservation) => Promise<RoomReservation>;
  changeRoomCheck: (req: ReqChangeRoom) => Promise<string>;
  changeRoom: (req: ReqChangeRoom) => Promise<string>;
  //#endregion

  //#region Extra - Manage Reservation
  prepareManageReservation: (
    guestNumber: number
  ) => Promise<PrepareManageReservation>;
  reservationList: (guestNumber: number) => Promise<ReservationListData[]>;
  reservationMember: (
    guestNumber: number,
    reservationNumber: number
  ) => Promise<ReservationMemberData[]>;
  //#endregion

  //#region Extra - View Allotment
  loadRoomType: () => Promise<RoomType[]>;
  viewAllotment: (body: ReqViewAllotment) => Promise<ViewAllotment[]>;
  //#endregion
}

/**
 * DEFAULT REQUEST BODY
 *
 * Place all variables that related to the default request body
 */
const permissionReqBody = () => ({
  inpResname: '',
  userInit: store.state.auth.user.userInit,
});

/**
 * ENDPOINT METHODS
 *
 * Define endpoint methods. Make sure to create the contract first!
 */
export default (doFetch: DoRequest): FrontOfficeReceptionEndpoints => ({
  //#region Reservation
  prepareReservation: () =>
    doFetch({ url: `${FR_URL}/arlInitialIt`, body: permissionReqBody() }).then(
      ([, res]) => res
    ),

  searchReservation: (body) =>
    doFetch({ url: `${FR_URL}/arlDisp1`, body }).then(
      ([, res]) => res?.arlList?.['arl-list']
    ),

  reservationRemark: (body) =>
    doFetch({ url: `${FR_URL}/rcommentChg`, body }).then(([, res]) => res),

  searchByVoucher: (body) =>
    doFetch({ url: `${FR_URL}/searchByVoucher`, body }).then(([, res]) => ({
      mainReservations: res?.tResVoucherNo?.['t-res-voucherNo'],
      reservationMembers: res?.rList?.['r-list'],
    })),

  getVoucherSorttype: (reservationNumber) =>
    doFetch({
      url: `${FR_URL}/arlListAskVoucher`,
      body: { lresnr: reservationNumber },
    }).then(([, res]) => res?.sorttype),

  arlBlockRoom: (reservationId, reason) =>
    doFetch({
      url: `${FR_URL}/arlBlockRoom`,
      body: {
        pvILanguage: 1,
        recId: reservationId,
        cReason: reason,
        bedienerNr: '01',
      },
    }).then(([, res]) => res?.msgStr),

  arlReleaseRoom: (reservationId) =>
    doFetch({
      url: `${FR_URL}/arlReleaseRoom`,
      body: { recId: reservationId, userInit: store.state.auth.user.userInit },
    }).then(([, res]) => res?.flError),

  arlAddQueueRoom: (roomNumber) =>
    doFetch({
      url: `${FR_URL}/arlAddQueueRoom`,
      body: { roomno: roomNumber, userInit: store.state.auth.user.userInit },
    }),

  incognitoGuest: (resnr, reslinnr) =>
    doFetch({
      url: `vhpTO/incognitoGuest`,
      body: {
        tResnr: resnr,
        tReslinnr: reslinnr,
        userInit: store.state.auth.user.userInit,
      },
    }),

  refreshRoom: ({ path, ciDate, data }) =>
    doFetch({
      url: `${FR_URL}/${path}`,
      body: { ciDate, naList: { 'na-list': [data] } },
    }).then(([, res]) => res?.naList?.['na-list']?.[0]),
  //#endregion

  searchGuestProfile: (body) =>
    doFetch({ url: `${FR_URL}/gcfList`, body }).then(([, res]) => ({
      data: res?.tGuest?.['t-guest'],
      currLname: res?.currLname,
      totalRecord: res?.totalRecord,
    })),

  deleteGuestProfile: (guestNumber, totalRecord) =>
    doFetch({
      url: `${FR_URL}/gcfListDelGCF`,
      body: {
        iCase: totalRecord,
        pvILanguage: 0,
        gastno: guestNumber,
        userInit: store.state.auth.user.userInit,
      },
    }).then(([, res]) => res?.msgStr),

  searchGuestInformation: (body) =>
    doFetch({ url: `${FR_URL}/gcfInfoPrepare`, body }).then(([, res]) => ({
      guestInformation: {
        payment: res.payment,
        ...res?.tGuest?.['t-guest'][0],
      },
      revenueBreakdown: res?.outputList1?.['output-list1'],
    })),

  searchOutletBill: (body) =>
    doFetch({ url: `${COMMON_URL}/readHJournal`, body }).then(
      ([, res]) => res?.tHJournal?.['t-h-journal']
    ),

  cleanUp: (body) =>
    doFetch({ url: `${FR_URL}/gcfsDelete`, body }).then(([, res]) => res),

  mergeGuestProfile: (guestNumber, mergeGuestNumber, type) =>
    doFetch({
      url: `${FR_URL}/guestMerge`,
      body: {
        tGastnr: guestNumber,
        sGastnr: mergeGuestNumber,
        tgKarteityp: type,
        userInit: permissionReqBody().userInit,
      },
    }).then(([, res]) => res?.messStr),

  prepareReservationByCreationDate: () =>
    doFetch({ url: `${FR_URL}/resListPrepare` }).then(([, res]) => res),

  searchMainReservation: (body) =>
    doFetch({ url: `${FR_URL}/resList`, body }).then(
      ([, res]) => res?.resListmain?.['res-listmain']
    ),

  searchReservationMember: (body) =>
    doFetch({ url: `${FR_URL}/resList1`, body }).then(
      ([, res]) => res?.resListmember?.['res-listmember']
    ),

  changeGuestProfileType: (guestNumber, type) =>
    doFetch({
      url: `${FR_URL}/guestTypeChg`,
      body: {
        gastno: guestNumber,
        newType: type,
        userInit: store.state.auth.user.userInit,
      },
    }).then(([, res]) => res?.messStr),

  searchMemoRoomNumber: (body) =>
    doFetch({ url: `${FR_URL}/resMemozinr`, body }).then(
      ([, res]) => res?.tMemozinr?.['t-memozinr']
    ),

  getGroupCheckIn: (body) =>
    doFetch({ url: `${FR_URL}/checkinGroup`, body }).then(
      ([, res]) => res?.mainresList?.['mainres-list']
    ),

  searchReinstateCancelledReservation: (body) =>
    doFetch({ url: `${FR_URL}/reactivate1`, body }).then(
      ([, res]) => res?.tReactivate?.['t-reactivate']
    ),

  searchConfirmationLetter: (lname, fdate) =>
    doFetch({
      url: `${FR_URL}/printLetterPrepare`,
      body: {
        lname,
        fdate,
        lastSort: 1,
      },
    }).then(([, res]) => res?.q1List?.['q1-list']),

  prepareCreateAllotment: (guestNumber) =>
    doFetch({
      url: `${FR_URL}/allotmentList`,
      body: {
        caseType: 1,
        gastnr: guestNumber,
        'kon-gastnr': 0,
        kontcode: ' ',
        ankunft: null,
        abreise: null,
        zimmeranz: 0,
      },
    }).then(([, res]) => res?.allotmentList?.['allotment-list']),

  getRoomType: () =>
    doFetch({
      url: `${COMMON_URL}/readZimkateg`,
      body: {
        caseType: 4,
        zikatNo: 0,
        shortBez: '',
      },
    }).then(([, res]) => res?.tZimkateg?.['t-zimkateg']),

  getArrangement: () =>
    doFetch({
      url: `vhpSS/resArrangement`,
      body: {
        pax: 0,
        nightstay: 0,
      },
    }).then(([, res]) => res?.b1List?.['b1-list']),

  createAllotment: (body) =>
    doFetch({
      url: `${FR_URL}/allotmentCreateAll`,
      body: {
        userInit: permissionReqBody().userInit,
        ...body,
      },
    }),

  readKontline: (guestNumber, code) =>
    doFetch({
      url: `${COMMON_URL}/readKontline`,
      body: {
        'case-type': 8,
        kontigNr: 0,
        konstat: 0,
        gastNo: guestNumber,
        kontcode: code,
        datum: null,
      },
    }).then(([, res]) => res?.tKontline?.['t-kontline']),

  checkResline: (allotmentCode, allotmentNumber) =>
    doFetch({
      url: `${FR_URL}/allotmentCheckResline`,
      body: {
        userInit: permissionReqBody().userInit,
        kontcode: allotmentCode,
        kontignr: allotmentNumber,
      },
    }).then(([, res]) => res),

  deleteAllotment: (allotmentCode, allotmentNumber, guestNumber) =>
    doFetch({
      url: `${COMMON_URL}/delKontline`,
      body: {
        caseType: 1,
        kontignr: allotmentNumber,
        kontcode: allotmentCode,
        gastNo: guestNumber,
      },
    }).then(([, res]) => res),

  getGlobalAllotment: (body) =>
    doFetch({
      url: `${FR_URL}/globalAllotment`,
      body,
    }).then(([, res]) => res?.gList?.['g-list']),

  saveGlobalAllotment: (body) =>
    doFetch({ url: `${FR_URL}/globalAllotmentUpdate`, body }),

  deleteCheckGlobalAllotment: (guestNumber, code) =>
    doFetch({
      url: `${FR_URL}/globalAllotmentCheck`,
      body: {
        pvILanguage: 1,
        gastno: guestNumber,
        inpKontcode: code,
      },
    }).then(([, res]) => ({
      errorFlag: toBoolean(res?.errorFlag ?? ''),
      msgStr: res?.msgStr ?? '',
    })),

  readGuest: (guestNumber) =>
    doFetch({
      url: `${COMMON_URL}/readGuest`,
      body: { caseType: 1, gastNo: guestNumber, gname: ' ', fname: ' ' },
    }).then(([, res]) => res?.tGuest?.['t-guest']?.[0]),

  getHTParam0: (body) =>
    doFetch({ url: `${COMMON_URL}/getHTParam0`, body }).then(([, res]) => res),

  readHtparam: (body) =>
    doFetch({ url: `${COMMON_URL}/readHtparam`, body }).then(
      ([, res]) => res?.tHtparam?.['t-htparam']?.[0]
    ),

  readQueasy: (key) =>
    doFetch({
      url: `${COMMON_URL}/readQueasy`,
      body: { caseType: 3, intkey: key, inpInt1: 0, inpChar1: '' },
    }).then(([, res]) => res?.tQueasy?.['t-queasy']),

  getGCFNation: (code) =>
    doFetch({
      url: `${COMMON_URL}/getGCFNation`,
      body: { inpNatcode: code },
    }).then(([, res]) => res?.nationList?.['nation-list']),

  loadArtikel: (body) =>
    doFetch({ url: `${COMMON_URL}/loadArtikel`, body }).then(
      ([, res]) => res?.artikelList?.['artikel-list']
    ),

  getVIPSegment: (guestNumber) =>
    doFetch({
      url: `${FR_URL}/getVipSegment`,
      body: { inpGastnr: guestNumber },
    }).then(([, res]) => ({
      options: res?.tSegment?.['t-segment'],
      current: res?.segmBez,
    })),

  getBookSource: () =>
    doFetch({
      url: 'vhpSS/readSourccod',
      body: { caseType: '8', sourceNo: ' ' },
    }).then(([, res]) => res?.tSourccod?.['t-sourccod']),

  getMainSegment: (guestNumber) =>
    doFetch({
      url: `${FR_URL}/segmentMkPrepare`,
      body: { gastnr: guestNumber ?? 0 },
    }).then(([, res]) => ({
      config: {
        vipFlag1: toBoolean(res?.vipFlag1),
        mainscode: res?.mainscode,
        mainseg: res?.mainseg,
      },
      options: res?.hsegmList?.['hsegm-list'],
      current: res?.gsegmList?.['gsegm-list'],
    })),

  async getSalesId() {
    const { fint } = await this.getHTParam0({ casetype: 4, inpParam: 547 });
    return doFetch({
      url: `${COMMON_URL}/getBediener`,
      body: { userNo: fint, userInit: '&Sales Group' },
    }).then(([, res]) => res?.tBediener?.['t-bediener']);
  },

  createGuestNumber: async (type) => {
    let url: string;
    switch (type) {
      case GuestProfileType.Individual:
        url = 'vhpFOC/gcf0CreatePrepare';
        break;
      case GuestProfileType.Company:
        url = `${FR_URL}/gcf1CreatePrepare`;
        break;
      case GuestProfileType.TravelAgent:
        url = `${FR_URL}/gcf2CreatePrepare`;
        break;
    }

    return doFetch({ url, body: { lastname: ' ', firstname: ' ' } }).then(
      ([, res]) => res?.tGuest?.['t-guest'][0]?.gastnr
    );
  },

  saveGuestProfile: (data) =>
    doFetch({
      url: `${FR_URL}/gcfBtnGo`,
      body: {
        icase: 3,
        pvILanguage: 1,
        userInit: store.state.auth.user.userInit,
        tGuest: { 't-guest': [data] },
      },
    }),

  saveVipSegment: (guestNumber, segmentCode) =>
    doFetch({
      url: `${FR_URL}/updateVipSegment`,
      body: { inpGastnr: guestNumber, inpSegmcode: segmentCode },
    }),

  uploadIdCard: ({ type, guestNumber, data }) =>
    doFetch({
      url: `${FR_URL}/idcardUpload`,
      body: {
        icase: type,
        inpResnr: 0,
        InpReslinnr: 0,
        guestno: guestNumber,
        imagedata: data,
        userinit: store.state.auth.user.userInit,
      },
    }),

  saveMainSegment: ({ guestNumber, vipFlag1, mainscode, mainseg, data }) =>
    doFetch({
      url: `${FR_URL}/segmentMk`,
      body: {
        gastnr: guestNumber,
        done: true,
        flag: true,
        changeIt: true,
        vipFlag1,
        mainscode,
        mainseg,
        gsegmList: { 'gsegm-list': data },
      },
    }),

  prepareModifyGuestProfile: async (req) => {
    let url: string;
    if (req.type === GuestProfileType.Individual)
      url = `${FR_URL}/prepareModifyGCFIndividual`;
    else url = `${FR_URL}/gcf1ModifyPrepare`;

    return doFetch({
      url,
      body: { gastnr: req.guestNumber, chgGcf: req.change },
    }).then(([, res]) => ({
      modifyConfig: mapModifyConfig(res),
      data: {
        base64ImageFile: res?.base64ImageFile,
        contractRate: res?.pricecode,
        ...res?.tGuest?.['t-guest']?.[0],
      },
      history: res?.q2History?.['q2-history'],
      guestContact: res?.q1AktKont?.['q1-akt-kont'],
      forecast: res?.forecast?.forecast,
    }));
  },

  checkTime: (body) =>
    doFetch({ url: `${COMMON_URL}/checkTime`, body }).then(([, res]) =>
      toBoolean(res?.flagOk)
    ),

  getAttachContractRate: (guestNumber) =>
    doFetch({ url: 'vhpSM/prCodeChg', body: { gastnr: guestNumber } }).then(
      ([, res]) => ({
        existing: res?.q1List?.['q1-list'],
        selected: res?.q2List?.['q2-list'],
      })
    ),

  checkAccessContractRate: (guestNumber) =>
    doFetch({
      url: 'vhpSM/slsCheckAccRight',
      body: { gastnr: guestNumber, userInit: store.state.auth.user.userInit },
    }).then(([, res]) => toBoolean(res?.restriction)),

  readResLine: (guestNumber) =>
    doFetch({
      url: `${COMMON_URL}/readResLine`,
      body: {
        caseType: 18,
        resNo: 0,
        reslinNo: 0,
        resstat: 0,
        actFlag: 0,
        rmNo: ' ',
        arrive: '',
        depart: '',
        gastNo: guestNumber,
        kontigNo: 0,
        kontcode: ' ',
      },
    }).then(([, res]) => res?.tResLine?.['t-res-line']?.[0]),

  saveContractRate: (guestNumber, data) =>
    doFetch({
      url: 'vhpSM/prCodeUpdate',
      body: { gastnr: guestNumber, q2List: { 'q2-list': data } },
    }),

  saveCreditCard: (guestNumber, data) =>
    doFetch({
      url: 'vhpFOC/ccBtnExit',
      body: { gastnr: guestNumber, ausweisNr2: data },
    }),

  prepareContactPerson: (guestNumber) =>
    doFetch({
      url: `${FR_URL}/gcf0ContactPrepare`,
      body: { gastnr: guestNumber },
    }).then(([, res]) => {
      return {
        fTitle: res?.fTitle,
        guestContact: res?.tAktKont?.['t-akt-kont'],
        relationOptions: res?.tQueasy13?.['t-queasy13'],
      };
    }),

  gcf0Contact: (formData, guestNumber, caseType) =>
    doFetch({
      url: `${FR_URL}/gcf0Contact`,
      body: {
        aktkontList: { 'aktkont-list': [formData] },
        caseType: caseType,
        gastnr: guestNumber,
      },
    }),

  deleteContactPerson: (guestNumber, contactNumber) =>
    doFetch({
      url: `${FR_URL}/gcf0ContactBtnDelname`,
      body: { gastnr: guestNumber, kontnr: contactNumber },
    }),

  setMainContact: (guestNumber, recId) =>
    doFetch({
      url: `${FR_URL}/gcf0ContactBtnMainkont`,
      body: { recId, gastnr: guestNumber },
    }),

  soaReadAktKont: (guestNumber, caseType) =>
    doFetch({
      url: `vhpAR/soaReadAktKont`,
      body: {
        caseType: caseType,
        gastNo: guestNumber,
        userNo: 0,
        gname: ' ',
      },
    }).then(([, res]) => res?.tAktKont?.['t-akt-kont']),

  selectGuest: (type, name) =>
    doFetch({
      url: `${FR_URL}/selectGuest`,
      body: { sorttype: type, currName: name },
    }).then(([, res]) => res?.tGuest?.['t-guest']),

  gcfContactBtnExit: (guestNumber, formData, caseType) =>
    doFetch({
      url: `${FR_URL}/gcfContactBtnExit`,
      body: {
        caseType: caseType,
        gastnr: guestNumber,
        aktkontList: {
          'aktkont-list': [formData],
        },
      },
    }),

  aktKontSave: (formData, caseType) =>
    doFetch({
      url: `${FR_URL}/aktKontSave`,
      body: {
        caseType: caseType,
        tAktKont: {
          't-akt-kont': [formData],
        },
      },
    }),

  readGuestPr: (guestNumber) =>
    doFetch({
      url: `${COMMON_URL}/readGuestPr`,
      body: { caseType: 1, guestNo: guestNumber, rateCode: '' },
    }).then(([, res]) => res?.tGuestPr?.['t-guest-pr']?.[0]?.code),

  viewRateCode: (body) =>
    doFetch({ url: 'vhpFOC/viewRatecode', body }).then(([, res]) => ({
      remark: res?.comments,
      viewRates: res?.tViewrates?.['t-viewrates'],
      viewRatesDetail: res?.tViewratesLine?.['t-viewrates-line'],
    })),

  //#region Extra - Guest Profile History
  prepareGuestProfileHistory: (guestNumber) =>
    doFetch({
      url: `${FR_URL}/gcfHistoryPrepare`,
      body: { gastnr: guestNumber },
    }).then(([, res]) => res),

  searchGuestProfileHistory: (body) =>
    doFetch({ url: `${FR_URL}/gcfHistory1`, body }).then(
      ([, res]) => res?.ghistory?.ghistory
    ),

  readSegment: async (guestNumber) => {
    const data = await doFetch({
      url: `${COMMON_URL}/readGuestSegment`,
      body: {
        caseType: 3,
        gastNo: guestNumber,
        segmCode: 0,
      },
    });
    const segment = await doFetch({
      url: `${COMMON_URL}/readSegment`,
      body: {
        caseType: 1,
        segmentNo: data.tGuestseg['t-guestseg'][0].segmentcode,
        segmName: ' ',
      },
    });
    return segment?.tSegment?.['t-segment'];
  },

  selectSegment: () =>
    doFetch({ url: 'vhpSS/selectSegment' }).then(
      ([, res]) => res?.segmList?.['segm-list']
    ),

  createGuestProfileHistory: (body) =>
    doFetch({
      url: 'vhpSS/writeHistory',
      body: {
        sRecid: 0,
        tHistory: {
          't-history': [body],
        },
      },
    }),

  editGuestProfileHistory: (recidNumber, body) =>
    doFetch({
      url: `${FR_URL}/historyChg`,
      body: {
        sRecid: recidNumber,
        tHistory: {
          't-history': [body],
        },
      },
    }),

  guestReservationList: (guestNumber) =>
    doFetch({
      url: `${FR_URL}/gcfRsvList`,
      body: {
        gastnr: guestNumber,
      },
    }).then(([, res]) => res?.rlineList?.['rline-list']),

  readHistoryList: (body) =>
    doFetch({ url: 'vhpAR/getReadHistoryList', body }).then(
      ([, res]) => res?.tHistory?.['t-history'][0]
    ),

  getViewHistory: (reservationNumber, body) =>
    doFetch({
      url: 'vhpAR/getViewHistory',
      body: {
        resnr: reservationNumber,
        hist1: { hist1: [body] },
      },
    }).then(([, res]) => res?.tHistory?.['t-history']),

  getGuestBill: (reservationNumber, reslinnr) =>
    doFetch({
      url: 'vhpAR/getViewHistory2',
      body: {
        resnr: reservationNumber,
        reslinnr: reslinnr,
      },
    }).then(([, res]) => res?.billList?.['bill-list']),

  getBillDetail: (reservationNumber, body) =>
    doFetch({
      url: 'vhpAR/getViewHistory3',
      body: {
        rechnr: reservationNumber,
        tHistory: {
          't-history': [body],
        },
      },
    }).then(([, res]) => res?.blineList?.['bline-list']),
  //#endregion

  //#region Room Plan
  prepareRoomPlan: () =>
    doFetch({
      url: `${FR_URL}/roomplanPrepare2`,
      body: { fromRoom: ' ' },
    }).then(([, res]) => ({
      currDate: res?.currDate,
      ciDate: res?.ciDate,
      roomList: res?.roomList?.['room-list'],
      reservations: res?.tResLine?.['t-res-line'],
      outOfOrders: res?.tOutorder?.['t-outorder'],
    })),

  roomPlan: (currDate, ciDate) =>
    doFetch({
      url: `${FR_URL}/roomplan21`,
      body: { fromRoom: ' ', currDate, ciDate },
    }).then(([, res]) => ({
      roomList: res?.roomList?.['room-list'],
      reservations: res?.tResLine?.['t-res-line'],
      outOfOrders: res?.tOutorder?.['t-outorder'],
    })),

  roomReservation: (body) =>
    doFetch({ url: `${FR_URL}/roomplanResdataDisp`, body }).then(([, res]) => ({
      cEdit: res?.cEdit,
      nEdit: res?.nEdit,
      flagOutorder: toBoolean(res?.flagOutorder),
      reservation: res?.bufResLine?.['buf-res-line']?.[0],
    })),

  changeRoomCheck: (body) =>
    doFetch({ url: `${FR_URL}/roomplanRoomCheck`, body }).then(
      ([, res]) => res?.msgStr
    ),

  changeRoom: (body) =>
    doFetch({ url: `${FR_URL}/roomplanRoomMove`, body }).then(
      ([, res]) => res?.msgStr
    ),
  //#endregion

  //#region Extra - Manage Reservation
  prepareManageReservation: (guestNumber) =>
    doFetch({
      url: `${FR_URL}/reservationPrepare`,
      body: { gastno: guestNumber },
    }).then(([, res]) => res?.tGuest?.['t-guest'][0]),

  reservationList: (guestNumber) =>
    doFetch({
      url: `${FR_URL}/reservation`,
      body: { gastNo: guestNumber, caseType: 1, resNo: 0 },
    }).then(([, res]) => res?.mainresList?.['mainres-list']),

  reservationMember: (guestNumber, reservationNumber) =>
    doFetch({
      url: `${FR_URL}/reservation`,
      body: { gastNo: guestNumber, caseType: 2, resNo: reservationNumber },
    }).then(([, res]) => res?.resList?.['res-list']),
  //#endregion

  //#region Extra - View Allotment
  loadRoomType: () =>
    doFetch({
      url: `${FR_URL}/loadRoomType`,
      body: { roomExistOnly: false, sleepingOnly: true },
    }).then(([, res]) => res?.tZimkateg?.['t-zimkateg']),

  viewAllotment: (body) =>
    doFetch({ url: `${FR_URL}/viewAllotmentReview`, body }).then(
      ([, res]) => res?.outputList?.['output-list']
    ),
  //#endregion
});
