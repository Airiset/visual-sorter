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
 * A sorter class that implements the Selection Sort algorithm.
 */
class SelectionSorter extends Sorter {
    /**
     * Returns a generator that produces the different stages of looking
     * for a minimum number in a sublist between indices
     * <firstIndex> and <lastIndex>. The generator stops at important
     * assignments in the iteration.
     *
     * @param firstIndex  the first index
     * @param lastIndex  the last index
     * @returns {Generator<*, *, *>}
     */
    *findIndexOfMinInRange(firstIndex, lastIndex) {
        let list = this.snapshot.list;
        let selection = this.snapshot.selection;
        let special = this.snapshot.special;

        let i, minIndex;
        for (i = firstIndex + 1, minIndex = firstIndex; i <= lastIndex; i++) {
            selection.clear();
            special.clear();
            special.add(minIndex);
            selection.add(i);
            yield -1;

            if (list.get(i) < list.get(minIndex)) {
                special.clear();
                special.add(i);
                minIndex = i;
                yield -1;
            }
        }

        return minIndex;
    }

    *sort() {
        let list = this.snapshot.list;
        let swapped = this.snapshot.swapped;
        let special = this.snapshot.special;

        let start;
        let length = list.length();
        for (start = 0; start < length; start++) {
            let minFinder = this.findIndexOfMinInRange(start, length - 1);

            let next = minFinder.next();
            while (!next.done) {
                yield this.snapshot;
                next = minFinder.next();
            }

            let minIndex = next.value;
            if (minIndex !== start) {
                swapped.add(minIndex);
                swapped.add(start);
                yield this.snapshot;

                swap(list, start, minIndex);
                yield this.snapshot;

                swapped.clear();
            }

            special.clear();
        }

        this.snapshot.sorted = true;
        return this.snapshot;
    }
}

/**
 * A sorter class that implements the Insertion Sort algorithm.
 */
class InsertionSorter extends Sorter {
    *sort() {
        let list = this.snapshot.list;
        let selection = this.snapshot.selection;
        let swapped = this.snapshot.swapped;
        let special = this.snapshot.special;

        let i;
        for (i = 0; i < list.length(); i++) {
            special.clear();
            special.add(i);
            yield this.snapshot;

            let curr = i;
            while (curr > 0 && list.get(curr) < list.get(curr - 1)) {
                selection.clear();
                selection.add(curr);
                selection.add(curr - 1);
                yield this.snapshot;

                selection.clear();
                swapped.add(curr);
                swapped.add(curr - 1);
                yield this.snapshot;

                swap(list, curr, curr - 1);
                yield this.snapshot;

                swapped.clear();
                curr--;
            }
        }

        this.snapshot.sorted = true;
        return this.snapshot;
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

        case "Selection Sort": {
            return new SelectionSorter(snapshot);
        }

        case "Insertion Sort": {
            return new InsertionSorter(snapshot);
        }
    }
}

function getAlgorithmNames() {
    return ["Selection Sort", "Bubble Sort", "Insertion Sort"];
}