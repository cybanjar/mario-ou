interface UserAuth {
  coaFormat: string;
  htlAdr: string;
  htlCity: string;
  htlName: string;
  htlTel: string;
  htlUrl: string;
  licNr: string;
  permissions: string;
  priceDecimal: number;
  userCode: string;
  userInit: string;
  userKey: string;
  userToken: string;
  vhpLicensedate: string;
  vhpNewDB: string;
  userName: string;
}

export interface AuthState {
  user: UserAuth | null;
}
