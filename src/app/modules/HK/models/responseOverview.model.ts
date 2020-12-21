interface ResQueueRoomList {
  key: number;
  number1: number;
  number2: number;
  number3: number;
  date1: string | null;
  date2: string;
  date3: string;
  char1: string;
  char2: string;
  char3: string;
  deci1: number;
  deci2: number;
  deci3: number;
  logi1: boolean;
  logi2: boolean;
  logi3: boolean;
  betriebsnr: number;
}

export interface ResGetOverview {
  departed1: number;
  departed2: number;
  departing1: number;
  departing2: number;
  totDepart1: number;
  totDepart2: number;
  arrived1: number;
  arrived2: number;
  arriving1: number;
  arriving2: number;
  totArrive1: number;
  totArrive2: number;
  vclean: number;
  vuncheck: number;
  oclean: number;
  totClean: number;
  odirty: number;
  vdirty: number;
  atoday: number;
  totDirty: number;
  oroom1: number;
  oroom2: number;
  omroom1: number;
  omroom2: number;
  oooroom1: number;
  oooroom2: number;
  compRoom1: number;
  compRoom2: number;
  houseRoom1: number;
  houseRoom2: number;
  iroom1: number;
  iroom2: number;
  eocc1: number;
  eocc2: number;
  proz1: number;
  proz2: number;
  proz3: number;
  proz4: number;
  proz5: number;
  queueRoomList: {
    'queue-room-list': ResQueueRoomList[];
  };
}
