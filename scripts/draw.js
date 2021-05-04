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
    let unitHeight = canvas.height / maxValue
    let unitWidth = canvas.width / snapshot.list.length();

    let i;
    for (i = 0; i < snapshot.list.length(); i++) {
        let color = "white";
        if (snapshot.swapped.contains(i)) {
            color = "green";
        } else if (snapshot.special.contains(i)) {
            color = "yellow";
        } else if (snapshot.selection.contains(i)) {
            color = "red";
        } else {
            color = "blue";
        }

        let xPosition = i * unitWidth;
        let yPosition = unitHeight * (maxValue - snapshot.list.get(i));
        let height = unitHeight * snapshot.list.get(i);
        let width = unitWidth;

        drawRectangleWithColor(canvas, xPosition, yPosition, width, height, color);
    }
}

/**
 * Draw a sort snapshot on a partition of the canvas
 * @param partition  the partition
 * @param snapshot  the sort snapshot
 * @param maxValue  the max value in the list in sort snapshot
 */
function drawSnapshotOnPartition(partition, snapshot, maxValue) {
    let unitHeight = partition.height / maxValue
    let unitWidth = partition.width / snapshot.list.length();

    let i;
    for (i = 0; i < snapshot.list.length(); i++) {
        let color = "white";
        if (snapshot.swapped.contains(i)) {
            color = "green";
        } else if (snapshot.special.contains(i)) {
            color = "yellow";
        } else if (snapshot.selection.contains(i)) {
            color = "red";
        } else {
            color = "blue";
        }

        let xPosition = partition.startXCoordinate + (i * unitWidth);
        let yPosition = partition.startYCoordinate + (unitHeight * (maxValue - snapshot.list.get(i)));
        let height = unitHeight * snapshot.list.get(i);
        let width = unitWidth;

        drawRectangleWithColor(partition.canvas, xPosition, yPosition, width, height, color);
    }
}

class Partition {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.startXCoordinate = 0;
        this.startYCoordinate = 0;
    }

    getHeight() {
        return this.height;
    }

    getWidth() {
        return this.width;
    }

    getStartCoordinate() {
        let coordinatePair = new List();
        coordinatePair.add(this.startXCoordinate);
        coordinatePair.add(this.startYCoordinate);

        return coordinatePair;
    }
}

function splitPartitionVertically(partition, numberOfPartitions) {
    let newPartitions = new List();

    if (numberOfPartitions === 0) {
        return newPartitions;
    }

    let width = partition.width / numberOfPartitions;
    let height = partition.height;

    let parentCoordinate = partition.getStartCoordinate();
    let parentX = parentCoordinate.get(0);
    let parentY = parentCoordinate.get(1);

    for (let i = 0; i < numberOfPartitions; i++) {
        let newPartition = new Partition(partition.canvas);

        newPartition.width = width;
        newPartition.height = height;
        newPartition.startXCoordinate = parentX + (i * width);
        newPartition.startYCoordinate = parentY;

        newPartitions.add(newPartition);
    }

    return newPartitions;
}

function splitPartitionHorizontally(partition, numberOfPartitions) {
    let newPartitions = new List();

    if (numberOfPartitions === 0) {
        return newPartitions;
    }

    let width = partition.width;
    let height = partition.height  / numberOfPartitions;

    let parentCoordinate = partition.getStartCoordinate();
    let parentX = parentCoordinate.get(0);
    let parentY = parentCoordinate.get(1);

    for (let i = 0; i < numberOfPartitions; i++) {
        let newPartition = new Partition(partition.canvas);

        newPartition.width = width;
        newPartition.height = height;
        newPartition.startXCoordinate = parentX;
        newPartition.startYCoordinate = parentY + (i * height);

        newPartitions.add(newPartition);
    }

    return newPartitions;
}