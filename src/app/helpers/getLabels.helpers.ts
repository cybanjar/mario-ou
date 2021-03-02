const credentials = JSON.parse(localStorage.getItem('langs')!);
const labels = credentials;

export function getLabels(nameKey, used){
    /*for (var i=0; i < labels.length; i++) {
        if (labels[i]['lang-variable'] === nameKey) {
            return labels[i]['lang-value'];
        }
    }*/
    const label = labels.find(
        (element) => element["lang-variable"] == nameKey
      );
      let fixLabel = "";
      if (label["lang-id"] == "undefined") {
        fixLabel = "";
      } else {
        if (used === "titleCase") {
          fixLabel = setTitleCase(label["lang-value"]);
        } else if (used === "sentenceCase") {
          fixLabel =
            label["lang-value"].charAt(0).toUpperCase() +
            label["lang-value"].slice(1);
        } else {
          fixLabel = label["lang-value"];
        }
      }
      return fixLabel;
}
function setTitleCase(label) {
    return label.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
