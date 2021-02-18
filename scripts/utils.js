/**
 * This module contains data structure utilities.
 */


/**
 * A prototype for a iteration snapshot.
 *
 * A snapshot consists of three lists and a flag:
 *  - list: a list of elements to be sorted
 *  - selection: a list of indices that are currently
 *      selected in a sort operation
 *  - swapped: a list of indices of items that
 *      are, or will soon be, swapped.
 *  - sorted: a flag, that should satisfy:
 *      if true, then list must be sorted
 */
class Snapshot {
    constructor() {
        this.list = new List();
        this.selection = new List();
        this.swapped = new List();
        this.special = new List();
        this.sorted = false;
    }
}

/**
 * A prototype for a List.
 */
class List {
    constructor() {
        this.elements = [];
    }

    /**
     * Adds an element to the list.
     * @param element  the number to be added
     */
    add(element) {
        this.elements.push(element);
    }

    /**
     * Returns the element at index <index>.
     * @param index  the index of the element
     * @returns {*}
     */
    get(index) {
        return this.elements[index];
    }

    /**
     * Sets the element at index <index> to <element>.
     * @param element  the element that replaces item at
     *                  <index>
     * @param index  the index of the element to be replaced
     */
    set(element, index) {
        this.elements[index] = element;
    }

    /**
     * Returns true iff <element> is in the list.
     * @param element  the element to be found
     * @returns {boolean}
     */
    contains(element) {
        let i;
        for (i = 0; i < this.elements.length; i++) {
            if (this.elements[i] === element) {
                return true;
            }
        }
        return false;
    }

    /**
     * Empties the list.
     */
    clear() {
        this.elements = [];
    }

    /**
     * Returns the number of elements in the list.
     * @returns {number}
     */
    length() {
        return this.elements.length;
    }
}

/**
 * Creates a new list of <length> random values between
 * 1 and <maxValue>.
 *
 * @param length  the length of the list
 * @param maxValue  the maximum value to be included in list
 * @returns {List}
 */
function createRandomList(length, maxValue) {
    let list = new List();
    let round = Math.round;
    let random = Math.random;

    let i;
    for (i = 0; i < length; i++) {
        list.add(round(random() * (maxValue - 1)) + 1);
    }

    return list;
}

/**
 * Creates a new list with values from 1 to <length>.
 * @param length  the length of the list
 * @returns {List}
 */
function createRangeList(length) {
    let list = new List();

    let i;
    for (i = 0; i < length; i++) {
        list.add(i + 1);
    }

    return list;
}

/**
 * Creates a new list with values from 1 to <length>,
 * in random order.
 *
 * @param length  the length of the list
 * @returns {List}
 */
function createScrambledRangeList(length) {
    let list = createRangeList(length);
    let randomTimes = Math.round((Math.random() * 1000));

    let i;
    for (i = 0; i < randomTimes; i++) {
        randomSwap(list);
    }

    return list;
}

/**
 * Swaps values at indices <indexI> and <indexJ>.
 * @param list  the list to be mutated
 * @param indexI  the first index to be swapped
 * @param indexJ  the second index to be swapped
 */
function swap(list, indexI, indexJ) {
    let temp = list.get(indexI);
    list.set(list.get(indexJ), indexI);
    list.set(temp, indexJ);
}

/**
 * Swaps two values at random indices in <list>.
 * @param list  the list to be mutated
 */
function randomSwap(list) {
    let indexI = Math.round(Math.random() * (list.length() - 1));
    let indexJ = Math.round(Math.random() * (list.length() - 1));

    console.log(indexI);
    console.log(indexJ);

    console.log(list.elements);
    swap(list, indexI, indexJ);
    console.log(list.elements);
}