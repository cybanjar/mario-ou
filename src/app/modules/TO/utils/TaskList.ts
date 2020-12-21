export const departementList = (data) => {
    return data.map((items) => ({
        label: `${items.deptnr} - ${items.bezeich}`,
        value: items.deptnr
    }))
}