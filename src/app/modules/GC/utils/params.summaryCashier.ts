import {formatterMoney} from '~/app/helpers/formatterMoney.helper'
export const data_table = (data) => {
   return data.clList['cl-list'].map(x => ({
        bezeich: `${x.bezeich}`,
        cash: formatterMoney(x.cash),
        room: formatterMoney(x.room),
        card: formatterMoney(x.card),
        cl: formatterMoney(x.cl),
        revenue: formatterMoney(x.revenue),
        compli: formatterMoney(x.compli),
        mcoupon: formatterMoney(x.mcoupon),
        gl: formatterMoney(x.gl),
        selected: false
    }))
}