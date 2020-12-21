import {store} from '~/store'

export const users = {
    users : store.state.auth.user
}
export const store_req = {
    prepare : store.getters.inv
}

export const SET_DATA = (value) => {
    store.commit.inv.SET_PRICE(value)
}