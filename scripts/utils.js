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
    constructor(list) {
        this.list = list;
        this.selection = new List();
        this.swapped = new List();
        this.special = new List();
        this.sorted = false;
    }

    select(from, to) {
        for (let i = from; i <= to; i++) {
            this.selection.add(i);
        }
    }
}

/**
 * A prototype for a List.
 */
class List {
    constructor(elements) {
        if (elements === undefined) {
            this.elements = [];
        } else {
            this.elements = elements;
        }
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
     * Removes all occurrences of <element> in the list
     * @param element  the element to be removed
     */
    removeAll(element) {
        let newElements = [];

        for (let i = 0; i < this.length(); i++) {
            let item = this.elements[i];
            if (item !== element) newElements.push(item);
        }

        this.elements = newElements;
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
    if (maxValue === undefined) {
        maxValue = length;
    }

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
 * Creates a new list with values from 1 to <length>, in reverse
 * order.
 *
 * @param length  the length of the list
 * @returns {List}
 */
function createReversedRangeList(length) {
    let list = new List();

    let i;
    for (i = length; i > 0; i--) {
        list.add(i - 1);
    }

    return list;
}

/**
 * Creates a new list with values from 1 to <length> inclusive,
 * in random order.
 *
 * @param length  the length of the list
 * @returns {List}
 */
function createScrambledRangeList(length) {
    /*
     * This new algorithm for range list scrambling should be much faster
     * than the previous algorithm. Rather than doing swaps, we use a
     * randomized algorithm that builds a list from an ever decreasing
     * range of values. It has much better performance than some of the
     * previous algorithms, one of which required around O(n^2) performance.
     */
    let start = 1, end = length;
    let list = new List();
    let map = {};

    while (start !== end) {
        let value = Math.floor(Math.random() * (end - start + 1)) + start;
        if (!(value in map)) {
            map[value] = true;
            list.add(value);

            // decrease the range from where we get our values if
            // either of the ends is already in the range until
            // the range does not contain either endpoint
            while (start in map) start++;
            while (end in map) end--;
        }
    }

    // include the last value at the endpoint when range has been compressed
    // to a single value
    list.add(start);

    return list;
}

listCreators = {
    "Shuffled Range List": createScrambledRangeList,
    "Descending Range List": createReversedRangeList,
    "Ascending Range List": createRangeList,
    "Random List": createRandomList
}

function getListTypeNames() {
    return Object.keys(listCreators);
}

function getListCreatorFunction(listTypeName) {
    return listCreators[listTypeName];
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

/**
 * Returns a soft copy of the given list. All elements in the
 * new list have the same references to the corresponding
 * element in the given list. However, both lists objects are
 * stored as different references.
 *
 * @param list  the list to copy
 * @returns {List}  a new list with the same elements but
 *                  different reference
 */
function copyList(list) {
    let newList = new List();
    for (let i = 0; i < list.length(); i++) {
        newList.add(list.get(i));
    }
    return newList;
}

/**
 * A prototype for a two pointer Node
 */
class Node {
    constructor(value) {
        this.value = value;
        this.nextNode = null;
    }
}

/**
 * A prototype for a LinkedList.
 */
class LinkedList extends List {
    constructor() {
        super();
        this.first = null;
        this.last = null;
    }

    add(element) {
        let newNode = new Node(element);

        if (this.first == null) {
            this.first = new Node(element);
            this.first.nextNode = this.first;
            this.last = this.first;
        } else {
            this.last.nextNode = newNode;
            newNode.nextNode = this.first;
            this.last = newNode;
        }
    }

    get(index) {
        let curr = this.first;

        let i = 0;
        while (i < index && curr != null) {
            curr = curr.nextNode;
            i++;
        }

        if (curr == null) {
            return null;
        } else {
            return curr.value;
        }
    }

    set(element, index) {
        let curr = this.first;

        let i = 0;
        while (i < index && curr != null) {
            curr = curr.nextNode;
            i++;
        }

        if (curr != null) {
            curr.value = element;
        }
    }

    contains(element) {
        let curr = this.first;

        while (curr != null && curr.value !== element) {
            curr = curr.nextNode;
        }

        return curr != null;
    }

    clear() {
        this.first = null;
        this.last = null;
    }

    length() {
        let curr = this.first;

        let i = 0;
        while (curr != null) {
            curr = curr.nextNode;
            i++;
        }

        return i;
    }
}

/**
 * A prototype for a Queue.
 */
class Queue {
    constructor() {
        this.list = new LinkedList();
    }

    /**
     * Returns True iff the stack is empty.
     * @returns {boolean}
     */
    isEmpty() {
        return this.list.length() === 0;
    }

    /**
     * Adds a new item to the end of the queue.
     * @param item  the item to be added
     */
    enqueue(item) {
        this.list.add(item);
    }

    /**
     * Returns the value at the beginning of the queue.
     */
    dequeue() {
        let value = this.list.first.value;
        this.list.last.nextNode = this.list.first.nextNode;
        this.list.first = this.list.first.nextNode;
        return value;
    }
}