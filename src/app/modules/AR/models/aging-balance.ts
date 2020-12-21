export type AgingBalance = {
  articleNumber?: number;
  number?: number;
  billReceiver?: string;
  beginningBalance?: number;
  debit?: number;
  age?: number;
  guestGroupName?: string;
  credit?: number;
  endingBalance: number;
  oneToThirty: number;
  thirtyoneToSixty: number;
  sixtyoneToNinety: number;
  overNinety: number;
  guestNumber?: number;
  billNumber: number;
  billDate?: string;
  currency: number;
  creditLimit?: number;
};

export type Bill = {
  reservationNumber: number;
  guestName: string;
  roomType: number;
  roomNumber: number;
  arrival: string;
  departure: string;
  adult: number;
  child1: number;
  child2: number;
  compliment: number;
  arrangement: number;
};

export type AgingBalanceTable = AgingBalance & { key: number };
export type ReservationTable = Bill & { key: number };
