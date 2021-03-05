let selectionDialog = document.getElementById("algorithm-selector");

function addAlgorithmOptions(selectionDialog) {
    let sortNames = getAlgorithmNames();

    let i;
    for (i = 0; i < sortNames.length; i++) {
        let optionObject = document.createElement("OPTION");
        let sortName = sortNames[i];

        optionObject.name = sortName;
        optionObject.value = sortName;

        selectionDialog.add(optionObject);
    }
}

addAlgorithmOptions(selectionDialog);