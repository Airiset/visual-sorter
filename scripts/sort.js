/**
 * This module contains sorting algorithm utilities.
 */

/**
 * A sorter class.
 */
class Sorter {
    constructor(snapshot) {
        this.snapshot = snapshot;
    }

    /**
     * Returns a sort snapshot generator.
     * The generator sorts the list in the snapshot.
     * Yields the snapshot at each important step of the sort.
     */
    *sort() {
        yield this.snapshot;
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
            for (i = 0; i < this.snapshot.list.length() - 1; i++) {
                this.snapshot.selection.clear();
                this.snapshot.swapped.clear();

                this.snapshot.selection.add(i);
                this.snapshot.selection.add(i + 1);
                yield this.snapshot;

                if (this.snapshot.list.get(i) > this.snapshot.list.get(i + 1)) {
                    sorted = false;
                    this.snapshot.swapped.add(i);
                    this.snapshot.swapped.add(i + 1);
                    yield this.snapshot;

                    swap(this.snapshot.list, i, i + 1);
                    yield this.snapshot;
                }
            }
        }

        this.snapshot.sorted = true;
        yield this.snapshot;
    }
}

/**
 * A sorter class that implements an optimized version of the
 * Bubble Sort algorithm.
 */
class OptimizedBubbleSorter extends BubbleSorter {
    *sort() {
        let sorted = false;
        let last = this.snapshot.list.length();

        while (!sorted) {
            sorted = true;
            let i;
            for (i = 0; i < last - 1; i++) {
                this.snapshot.selection.clear();
                this.snapshot.swapped.clear();

                this.snapshot.selection.add(i);
                this.snapshot.selection.add(i + 1);
                yield this.snapshot;

                if (this.snapshot.list.get(i) > this.snapshot.list.get(i + 1)) {
                    sorted = false;
                    this.snapshot.swapped.add(i);
                    this.snapshot.swapped.add(i + 1);
                    yield this.snapshot;

                    swap(this.snapshot.list, i, i + 1);
                    yield this.snapshot;
                }
            }
            last--;
        }

        this.snapshot.sorted = true;
        yield this.snapshot;
    }
}

/**
 * A factory function that produces a sorter object.
 * @param snapshot  the object with which to create
 *                   the sorter
 * @param sortID  the id of the sort
 * @returns {Sorter}
 */
function createSort(snapshot, sortID) {
    switch (sortID) {
        case "Bubble Sort": {
            return new BubbleSorter(snapshot);
        }

        case "Optimized Bubble Sort": {
            return new OptimizedBubbleSorter(snapshot);
        }
    }
}