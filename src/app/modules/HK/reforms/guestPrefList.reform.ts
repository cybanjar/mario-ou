import { date } from "quasar";

export function reformData(tempData) {
  // console.log(tempData);
  const data = tempData.map((data, index) => ({
    key: index,
    room_number: data.char1,
    date: date.extractDate(data.date1, 'YYYY-MM-DD'),
    time: data.number1,
    id: data.char2,
    guest_preference: data.char3,
    number3: data.number3,
  }));
  return data;
}
