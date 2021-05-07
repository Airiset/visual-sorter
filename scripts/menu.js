/**
 * This module contains all the menu interaction functionality.
 */

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

/**
 * Adds list types as options on the given selection dialog.
 * @param listTypeDialog  the HTML DOM object representing the
 *                         selection dialog
 */
function addListTypeOptions(listTypeDialog) {
    let listTypeNames = getListTypeNames();

    for (let i = 0; i < listTypeNames.length; i++) {
        let optionObject = document.createElement("OPTION");
        let listType = listTypeNames[i];

        // set default creator to be the first in the list
        if (i === 0) {
            optionObject.selected = true;
        }

        optionObject.label = listType;
        optionObject.value = listType;

        listTypeDialog.add(optionObject);
    }
}

/**
 * Return the name ID of the currently selected algorithm.
 * @returns {string}
 */
function getSelectedListType() {
    let index = listTypeSelectionDialog.selectedIndex;
    return listTypeSelectionDialog.options[index].label;
}

/**
 * Sets default attributes for given input size number dialog
 * @param inputSizeDialog
 */
function setDefaultListSizeDialog(inputSizeDialog) {
    inputSizeDialog.min = 1
    inputSizeDialog.max = 2500
    inputSizeDialog.value = 10
    inputSizeDialog.oninput = function () {
        if (parseInt(this.max) < parseInt(this.value)) {
            this.value = this.min;
        }

        if (parseInt(this.min) > parseInt(this.value)) {
            this.value = this.max;
        }
    }

    inputSizeDialog.onchange = inputSizeDialog.oninput
}

/**
 * Returns the list size value from the list size dialog.
 */
function getListSize() {
    return parseInt(listInputSizeDialog.value);
}

/**
 * Sets default attributes for given input size number dialog
 * @param delayDialog
 */
function setDefaultDelayDialog(delayDialog) {
    delayDialog.min = 10;
    delayDialog.max = 500;
    delayDialog.value = 50;
}

/**
 * Returns the delay value from the delay range dialog.
 */
function getDelay() {
    return parseInt(delayRangeDialog.value);
}

let selectionDialog = document.getElementById("algorithm-selector");
let listTypeSelectionDialog = document.getElementById("list-type-selector");

addListTypeOptions(listTypeSelectionDialog);
addAlgorithmOptions(selectionDialog);

let listInputSizeDialog = document.getElementById("list-size-input-field");
setDefaultListSizeDialog(listInputSizeDialog);

let delayRangeDialog = document.getElementById("delay-range-field");
setDefaultDelayDialog(delayRangeDialog);