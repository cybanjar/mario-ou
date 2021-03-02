export const data_Table = (data) => {
    const dataa = data.clList['cl-list'].map(items => ({
        'c-zipreis': items['c-zipreis'].trim(),
        'c-localrate': items['c-localrate'].trim(),
        'c-lodging': items['c-lodging'].trim(),
        'c-bfast': items['c-bfast'].trim(),
        'c-lunch': items['c-lunch'].trim(),
        'c-dinner': items['c-dinner'].trim(),
        'c-misc': items['c-misc'].trim(),
        'ct-rev': items['ct-rev'].trim(),
        zinr: items['zinr'],
        argt: items.argt,
        currency: items.currency,
        ratecode: items.ratecode,
        pax : items.pax,
        ankunft: items.ankunft,
        abreise : items.abreise,
        rechnr: items.rechnr ,
        name : items.name,
        'ex-rate': items['ex-rate'].trim(),
        'fix-rate': items['fix-rate'],
        selected: false
    }))
    return dataa
}