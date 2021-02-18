/**
 * This module contains the main components and functions.
 */

const startX = 0;
const startY = 0;

/**
 * Returns the canvas element.
 * @returns {HTMLElement}
 */
function initializeCanvas() {
    return document.getElementById("canvas");
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
 * Draw a sort component.
 * @param canvas  the canvas
 * @param component  the sort component
 * @param maxValue  the max value in the list in sort component
 */
function drawComponent(canvas, component, maxValue) {
    let unitHeight = canvas.height / maxValue;
    let unitWidth = canvas.width / (component.list.length() * 1.2);

    let i;
    for (i = 0; i < component.list.length(); i++) {
        if (component.swapped.contains(i)) {
            drawRectangleWithColor(
                canvas,
                (i + 1) * unitWidth,
                0,
                unitWidth,
                unitHeight * component.list.get(i),
                "green"
            );
        } else if (component.selection.contains(i)) {
            drawRectangleWithColor(
                canvas,
                (i + 1) * unitWidth,
                0,
                unitWidth,
                unitHeight * component.list.get(i),
                "red"
            );
        } else {
            drawRectangleWithColor(
                canvas,
                (i + 1) * unitWidth,
                0,
                unitWidth,
                unitHeight * component.list.get(i),
                "blue"
            );
        }
    }
}

/*
 MAIN:
 */

let canvas = initializeCanvas();
setCanvasSizeToWholeWindow(canvas);

let maxValue = 50;
let component = new Component();
component.list = createScrambledRangeList(maxValue);

let sorter = new OptimizedBubbleSorter(component);
let begun = false, sort;

let interval = window.setInterval(function () {
    clear(canvas);

    if (!begun) {
        sort = sorter.sort();
        begun = true;
    } else {
        component = sort.next().value;
    }

    console.log(component.list.elements);
    drawComponent(canvas, component, maxValue);

    if (component.sorted) {
        clearInterval(interval);
    }
}, 50);

