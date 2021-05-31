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
function getSelectedAlgorithmName(selectionDialog) {
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
function getSelectedListType(listTypeDialog) {
    let index = listTypeDialog.selectedIndex;
    return listTypeDialog.options[index].label;
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
function getListSize(listInputSizeDialog) {
    return parseInt(listInputSizeDialog.value);
}

/**
 * Sets default attributes for given input size number dialog
 * @param delayDialog
 */
function setDefaultDelayDialog(delayDialog) {
    delayDialog.min = 1;
    delayDialog.max = 16;
    delayDialog.value = 8;
}

/**
 * Returns the delay value from the delay range dialog.
 */
function getDelayRegular() {
    let value = parseInt(delayRangeDialog.value);
    return Math.pow(value, 2);
}

function getDelayCompare() {
    return parseInt(delayRangeDialogCompare.value);
}

function showCompareMenu() {
    menuContainer.hidden = true;
    compareMenuContainer.hidden = false;
    getDelay = getDelayCompare;
}

function showRegularMenu() {
    menuContainer.hidden = false;
    compareMenuContainer.hidden = true;
    getDelay = getDelayRegular;
}

let selectionDialog = document.getElementById("algorithm-selector");
let listTypeSelectionDialog = document.getElementById("list-type-selector");
let listInputSizeDialog = document.getElementById("list-size-input-field");
let delayRangeDialog = document.getElementById("delay-range-field");

addListTypeOptions(listTypeSelectionDialog);
addAlgorithmOptions(selectionDialog);
setDefaultListSizeDialog(listInputSizeDialog);
setDefaultDelayDialog(delayRangeDialog);

const selectionDialogCompareFirst = document.getElementById("algorithm-selector-compare-1");
const selectionDialogCompareSecond = document.getElementById("algorithm-selector-compare-2");
const listTypeSelectionDialogCompare = document.getElementById("list-type-selector-compare");
const listInputSizeDialogCompare = document.getElementById("list-size-input-field-compare");
const delayRangeDialogCompare = document.getElementById("delay-range-field-compare");

addListTypeOptions(listTypeSelectionDialogCompare);
addAlgorithmOptions(selectionDialogCompareFirst);
addAlgorithmOptions(selectionDialogCompareSecond);
setDefaultListSizeDialog(listInputSizeDialogCompare);
setDefaultDelayDialog(delayRangeDialogCompare);

let menuContainer = document.getElementById("menu-container");
let compareMenuContainer = document.getElementById("compare-menu-container");

let getDelay;

showRegularMenu();