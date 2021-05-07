/**
 * This module contains the main snapshots and functions.
 */

const startX = 0;
const startY = 0;

let currentAnimationInterval;

/**
 * Returns the canvas element.
 * @returns {HTMLElement}
 */
function initializeCanvas() {
    return document.getElementById("canvas");
}

function initializeStartSortingButton() {
    return document.getElementById("big-sort-button");
}

/**
 * Sets size of canvas to the whole window.
 * @param canvas  the canvas
 */
function setCanvasSizeToWholeWindow(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

/**
 * Scales the canvas on based on the size of the window.
 * @param canvas  the canvas
 * @param scaleFactor  the scale factor
 */
function setCanvasSizeToScaledWindow(canvas, scaleFactor) {
    canvas.width = (window.innerWidth * scaleFactor);
    canvas.height = (window.innerHeight * scaleFactor);
}

function setCanvasSizeToContainer(canvas) {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

function beginSort(sorter, maxValue) {
    let begun = false, sort;
    let snapshot = sorter.snapshot;
    let multipleSnapshots = null;

    currentAnimationInterval = window.setInterval(function () {
        clear(canvas);

        if (!begun) {
            sort = sorter.sort();
            begun = true;
        } else {
            let ret = sort.next().value;
            if (Array.isArray(ret)) {
                partitions = splitPartitionHorizontally(partition, ret.length);
                multipleSnapshots = ret;
            } else {
                partitions = splitPartitionHorizontally(partition, 1);
                multipleSnapshots = null;
                snapshot = ret;
            }
        }
        if (multipleSnapshots != null) {
            for (let i = 0; i < partitions.length(); i++) {
                drawSnapshotOnPartition(partitions.get(i), multipleSnapshots[i], maxValue);
            }
        } else {
            drawSnapshotOnPartition(partition, snapshot, maxValue)
        }

        if (snapshot.sorted) {
            clearInterval(currentAnimationInterval);
        }
    }, getDelay());
}

/*
 MAIN:
 */

let canvas = initializeCanvas();
setCanvasSizeToContainer(canvas);

let partition = new Partition(canvas);
let partitions = splitPartitionHorizontally(partition, 1);

let startButton = initializeStartSortingButton();

startButton.onclick = function () {
    let maxValue = getListSize();

    let sortName = getSelectedAlgorithmName();
    let listType = getSelectedListType();

    let createList = getListCreatorFunction(listType);
    let list = createList(maxValue);

    let sorter = createSort(list, sortName);

    clearInterval(currentAnimationInterval);
    beginSort(sorter, maxValue);
}