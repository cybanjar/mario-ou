const credentials = JSON.parse(localStorage.getItem('credentials')!);
const labels = credentials.languagesList['languages-list'];

export function getLabels(nameKey){
    for (var i=0; i < labels.length; i++) {
        if (labels[i]['lang-variable'] === nameKey) {
            return labels[i]['lang-value'];
        }
    }
}
