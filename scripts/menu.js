let selectionDialog = document.getElementById("algorithm-selector");

/**
 * Adds algorithm name as options on the given selection dialog.
 * @param selectionDialog  the HTML DOM object representing the
 *                         selection dialog
 */
function addAlgorithmOptions(selectionDialog) {
    let sortNames = getAlgorithmNames();

    let i;
    for (i = 0; i < sortNames.length; i++) {
        let optionObject = document.createElement("OPTION");
        let sortName = sortNames[i];

        // set default sorting algorithm to be the first in the list
        if (i === 0) {
            optionObject.selected = true;
        }

        optionObject.label = sortName;
        optionObject.value = sortName;

        selectionDialog.add(optionObject);
    }
}

/**
 * Return the name ID of the currently selected algorithm.
 * @returns {string}
 */
function getSelectedAlgorithmName() {
    let index = selectionDialog.selectedIndex;
    return selectionDialog.options[index].label;
}

addAlgorithmOptions(selectionDialog);