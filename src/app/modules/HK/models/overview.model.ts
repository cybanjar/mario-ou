interface CardInfo {
  title: string;
  totalRooms: number;
  totalPax?: number | null;
}

export interface CardItems {
  icon: string;
  header: CardInfo;
  data: CardInfo[];
}
