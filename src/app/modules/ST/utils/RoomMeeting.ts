export const data_table = (data) => {
    return data['tBkRaum']['t-bk-raum'].map(items => ({
        Code : items['raum'],
        Description : items['bezeich'],
        Area: items['department'],
        Size : items['groesse'],
        Ext: items['nebenstelle'],
        Persons: items['personen'],
        DailyRate: items['preis'],
        Prepare: items['vorbereit'],
        PictureName: items['vname'],
        ChangeDescription: items['flag-desc']? '1': '0',
        'rec-id': items['rec-id'],
        selected: false
    }))
}

export const parentRoom = (data) => {
    return data.tBkRaum['t-bk-raum'].map(items => ({
        label: `${items['raum']} - ${items['bezeich']}`,
        value: items['raum']
    }))
}

export const sinput = [
    {
        labelText : 'Room',
        value: '',
        disable: true
    },
    {
        labelText : 'Description',
        value: '',
        disable: true
    },
    {
        labelText : 'Size (m2)',
        value: '',
        disable: true
    },
    {
        labelText : 'Extension',
        value: '',
        disable: true
    },
    {
        labelText : 'Max Person',
        value: '',
        disable: true
    },
    {
        labelText : 'Daily Rate',
        value: '',
        disable: true
    },
    {
        labelText : 'Prepare',
        value: '',
        disable: true
    },
    {
        labelText : 'Parent Room',
        value: '',
        options: [],
        disable: true
    },
    {
        labelText : 'Picture Name',
        value: '',
        disable: true
    },
    {
        labelText : 'Toggle',
        value: false,
        disable: true
    },
]