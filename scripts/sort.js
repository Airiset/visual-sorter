/**
 * This module contains sorting algorithm utilities.
 */

/**
 * A sorter class.
 */
class Sorter {
    constructor(component) {
        this.component = component;
    }

    /**
     * Returns a sort component generator.
     * The generator sorts the list in the component.
     * Yields the component at each important step of the sort.
     */
    *sort() {
        yield component;
    }
}

/**
 * A sorter class that implements the Bubble Sort algorithm.
 */
class BubbleSorter extends Sorter {
    *sort() {
        let sorted = false;

        while (!sorted) {
            sorted = true;
            let i;
            for (i = 0; i < this.component.list.length() - 1; i++) {
                this.component.selection.clear();
                this.component.swapped.clear();

                this.component.selection.add(i);
                this.component.selection.add(i + 1);
                yield this.component;

                if (this.component.list.get(i) > this.component.list.get(i + 1)) {
                    sorted = false;
                    this.component.swapped.add(i);
                    this.component.swapped.add(i + 1);
                    yield this.component;

                    swap(this.component.list, i, i + 1);
                    yield this.component;
                }
            }
        }

        this.component.sorted = true;
        yield this.component;
    }
}

/**
 * A sorter class that implements an optimized version of the
 * Bubble Sort algorithm.
 */
class OptimizedBubbleSorter extends BubbleSorter {
    *sort() {
        let sorted = false;
        let last = this.component.list.length();

        while (!sorted) {
            sorted = true;
            let i;
            for (i = 0; i < last - 1; i++) {
                this.component.selection.clear();
                this.component.swapped.clear();

                this.component.selection.add(i);
                this.component.selection.add(i + 1);
                yield this.component;

                if (this.component.list.get(i) > this.component.list.get(i + 1)) {
                    sorted = false;
                    this.component.swapped.add(i);
                    this.component.swapped.add(i + 1);
                    yield this.component;

                    swap(this.component.list, i, i + 1);
                    yield this.component;
                }
            }
            last--;
        }

        this.component.sorted = true;
        yield this.component;
    }
}

/**
 * A factory function that produces a sorter object.
 * @param component  the object with which to create
 *                   the sorter
 * @param sortID  the id of the sort
 * @returns {Sorter}
 */
function createSort(component, sortID) {
    switch (sortID) {
        case "Bubble Sort": {
            return new BubbleSorter(component);
        }

        case "Optimized Bubble Sort": {
            return new OptimizedBubbleSorter(component);
        }
    }
}