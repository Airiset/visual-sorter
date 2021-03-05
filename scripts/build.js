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

/*
https://stackoverflow.com/questions/10214873/make-canvas-as-wide-and-as-high-as-parent
 */

function setCanvasSizeToContainer(canvas) {
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

/**
 * Draws a blue rectangle on canvas.
 * @param canvas  the canvas
 * @param startX  the starting horizontal position
 * @param startY  the starting vertical position
 * @param width  the width of the rectangle
 * @param height  the height of the rectangle
 */
function drawRectangle(canvas, startX, startY, width, height) {
    let context = canvas.getContext('2d');
    context.fillStyle = "blue";
    context.fillRect(startX, startY, width, height);
}

/**
 * Draws a rectangle on canvas.
 * @param canvas  the canvas
 * @param startX  the starting horizontal position
 * @param startY  the starting vertical position
 * @param width  the width of the rectangle
 * @param height  the height of the rectangle
 * @param color  the color of the rectangle
 */
function drawRectangleWithColor(canvas, startX, startY, width, height, color) {
    let context = canvas.getContext('2d');
    context.fillStyle = color;
    context.fillRect(startX, startY, width, height);
}

/**
 * Colour whole canvas.
 * @param canvas  the canvas
 * @param colour  the colour
 */
function colorWholeCanvas(canvas, colour) {
    let context = canvas.getContext('2d');
    context.fillStyle = colour;
    context.fillRect(startX, startY, canvas.width, canvas.height);
}

/**
 * Clear the canvas.
 * @param canvas  the canvas
 */
function clear(canvas) {
    let context = canvas.getContext('2d');
    context.clearRect(0,0, canvas.width, canvas.height);
}

/**
 * Draw a list of numbers using rectangles.
 * @param canvas  the canvas
 * @param list  the list of numbers
 * @param maxValue  the maximum value in the list
 */
function drawNumberList(canvas, list, maxValue) {
    let unitHeight = canvas.height / maxValue;
    let unitWidth = canvas.width / (list.length() * 1.2);

    let i;
    for (i = 0; i < list.length(); i++) {
        drawRectangle(
            canvas,
             (i + 1) * unitWidth,
            0,
            unitWidth,
            unitHeight * list.get(i)
        );
    }
}

/**
 * Draw a sort snapshot.
 * @param canvas  the canvas
 * @param snapshot  the sort snapshot
 * @param maxValue  the max value in the list in sort snapshot
 */
function drawSnapshot(canvas, snapshot, maxValue) {
    let unitHeight = canvas.height / maxValue;
    let unitWidth = canvas.width / (snapshot.list.length() * 1.2);

    let i;
    for (i = 0; i < snapshot.list.length(); i++) {
        if (snapshot.swapped.contains(i)) {
            drawRectangleWithColor(
                canvas,
                (i + 1) * unitWidth,
                unitHeight * (maxValue - snapshot.list.get(i)),
                unitWidth,
                unitHeight * snapshot.list.get(i),
                "green"
            );
        } else if (snapshot.special.contains(i)) {
            drawRectangleWithColor(
                canvas,
                (i + 1) * unitWidth,
                unitHeight * (maxValue - snapshot.list.get(i)),
                unitWidth,
                unitHeight * snapshot.list.get(i),
                "yellow"
            );
        } else if (snapshot.selection.contains(i)) {
            drawRectangleWithColor(
                canvas,
                (i + 1) * unitWidth,
                unitHeight * (maxValue - snapshot.list.get(i)),
                unitWidth,
                unitHeight * snapshot.list.get(i),
                "red"
            );
        } else {
            drawRectangleWithColor(
                canvas,
                (i + 1) * unitWidth,
                unitHeight * (maxValue - snapshot.list.get(i)),
                unitWidth,
                unitHeight * snapshot.list.get(i),
                "blue"
            );
        }
    }
}

function beginSort() {
    let maxValue = 50;
    let snapshot = new Snapshot();
    snapshot.list = createScrambledRangeList(maxValue);

    let sorter = new SelectionSorter(snapshot);
    let begun = false, sort;

    currentAnimationInterval = window.setInterval(function () {
        clear(canvas);

        if (!begun) {
            sort = sorter.sort();
            begun = true;
        } else {
            snapshot = sort.next().value;
        }

        drawSnapshot(canvas, snapshot, maxValue);

        if (snapshot.sorted) {
            clearInterval(interval);
        }
    }, 100);
}

/*
 MAIN:
 */

let canvas = initializeCanvas();
let startButton = initializeStartSortingButton();


setCanvasSizeToContainer(canvas);

startButton.onclick = function () {
    clearInterval(currentAnimationInterval);
    beginSort();
}



