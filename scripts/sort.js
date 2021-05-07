/**
 * This module contains sorting algorithm utilities.
 */

/**
 * A sorter class.
 */
class Sorter {
    constructor(list) {
        this.snapshot = new Snapshot(list);
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
 * A sorter class that implements the glorius Merge Sort algorithm.
 */
class MergeSorter extends Sorter {
    /*
    Implementing MergeSort on this design is quite difficult... Actually
    it is not. I could simply hide all the extra space creation and the
    recursion from the viewer...

    However, I am not satisfied with that. This is the VISUAL SORTER
    after all. I want the viewer to visualize the sort in all of its
    glory!! The splitting, the merging, the RECURSION. But how??!!!!!!!!

    yield * will be our silver bullet. By calling yield * on some other
    generator, we delegate the work to that generator, so we can recursively
    call a sort function on a smaller list with yield * and delegate the
    return of snapshots to that child generator, until its done.
     */
    constructor(list) {
        super(list);
        this.isChild = false;
    }

    /**
     * Generates snapshots for the given lists and their merging onto
     * the resulting merged list. Returns a list composed of merging
     * listA and listB in order.
     *
     * @param listA  the first list to be merged
     * @param listB  the second list to be merged
     */
    *merge(listA, listB) {
        let snapshotA = new Snapshot(listA);
        let snapshotB = new Snapshot(listB);

        let mergedList = new List();
        let mergedSnapshot = new Snapshot(mergedList);

        let indexA = 0, indexB = 0;
        while (listA.length() - indexA > 0 && listB.length() - indexB > 0) {
            snapshotA.selection.clear();
            snapshotB.selection.clear();
            snapshotA.selection.add(indexA);
            snapshotB.selection.add(indexB);
            yield [snapshotA, snapshotB, mergedSnapshot];

            if (listA.get(indexA) <= listB.get(indexB)) {
                mergedList.add(listA.get(indexA));
                indexA++;
            } else {
                mergedList.add(listB.get(indexB));
                indexB++;
            }
        }

        snapshotA.selection.clear();
        snapshotB.selection.clear();

        let remainingList, index, snapshot;
        if (listA.length() - indexA > 0) {
            remainingList = listA;
            index = indexA;
            snapshot = snapshotA;
        } else {
            remainingList = listB;
            index = indexB;
            snapshot = snapshotB
        }

        while (remainingList.length() - index > 0) {
            snapshot.selection.clear();
            snapshot.selection.add(index);
            yield [snapshotA, snapshotB, mergedSnapshot];

            mergedList.add(remainingList.get(index));
            index++;
        }

        snapshot.selection.clear();
        snapshot.selection.add(index);
        yield [snapshotA, snapshotB, mergedSnapshot];

        return mergedSnapshot;
    }

    /**
     * Splits the given list into two halves.
     * @param list  the list to be split
     */
    split(list) {
        let firstHalf = new List();
        let secondHalf = new List();
        let middle = Math.floor(list.length() / 2);

        for (let i = 0; i < list.length(); i++) {
            if (i < middle) {
                firstHalf.add(list.get(i));
            } else {
                secondHalf.add(list.get(i));
            }
        }

        return [firstHalf, secondHalf];
    }

    *sort() {
        let list = this.snapshot.list;

        if (list.length() === 1) {
            return this.snapshot;
        } else {
            let halves = this.split(list);

            let firstSorter = new MergeSorter(halves[0]);
            let secondSorter = new MergeSorter(halves[1]);
            firstSorter.isChild = true;
            secondSorter.isChild = true;

            let firstSnapshot = yield * firstSorter.sort();
            let secondSnapshot = yield * secondSorter.sort();

            let finalSnapshot = yield * this.merge(firstSnapshot.list, secondSnapshot.list);

            if (!this.isChild) {
                finalSnapshot.sorted = true;
                yield finalSnapshot;
            } else {
                return finalSnapshot;
            }
        }
    }
}

/**
 * A sorter class that implements the Merge Sort algorithm, without
 * the
 */
class SimplifiedMergeSorter extends MergeSorter {
    /**
     * Merges the sublist contained between ranges firstIndexA
     * and secondIndexA and sublist contained in the range firstIndexB
     * and secondIndexB. Returns the resulting list
     *
     * @param firstIndexA  the first index for the range of the first list
     * @param secondIndexA  the last index for the range of the first list
     * @param firstIndexB  the first index for the range of the second list
     * @param secondIndexB  the last index for the range of the second lst
     */
    *merge(firstIndexA, secondIndexA, firstIndexB, secondIndexB) {
        let mergedList = new List();
        let list = this.snapshot.list;

        let indexA = firstIndexA, indexB = firstIndexB;

        this.snapshot.special.add(indexA);
        this.snapshot.special.add(indexB);
        yield this.snapshot;

        while (secondIndexA - indexA >= 0 && secondIndexB - indexB >= 0) {
            if (list.get(indexA) <= list.get(indexB)) {
                mergedList.add(list.get(indexA));
                indexA++;

                this.snapshot.special.clear();
                this.snapshot.special.add(indexA);
            } else {
                mergedList.add(list.get(indexB));
                indexB++;

                this.snapshot.special.clear();
                this.snapshot.special.add(indexB);
            }

            yield this.snapshot;
        }

        let remainingList, index, finalIndex;
        if (secondIndexA - indexA >= 0) {
            remainingList = list;
            index = indexA;
            finalIndex = secondIndexA;
        } else {
            remainingList = list;
            index = indexB;
            finalIndex = secondIndexB;
        }

        while (finalIndex - index >= 0) {
            mergedList.add(remainingList.get(index));
            index++;

            this.snapshot.special.clear();
            this.snapshot.special.add(index);
            yield this.snapshot;
        }

        return mergedList;
    }

    /**
     * Returns an array of indices. The first two values (at indices 0-1)
     * contain the range for the first half of the range and the last two
     * values represent the range for the last half of the range.
     *
     * @param firstIndex  the first index for the range of the sublist
     * @param secondIndex  the last index for the range of the sublist
     * @returns {(*)[]}
     */
    split(firstIndex, secondIndex) {
        let half = (secondIndex - firstIndex) / 2;
        return [firstIndex,
            firstIndex + Math.floor(half),
            firstIndex + Math.floor(half) + 1,
            secondIndex];
    }

    /**
     * Returns a generator that produces snapshots of a sorting sequence.
     * Sorts a sublist over a range using the Merge Sort algorithm.
     * @param firstIndex  the first index over the range
     * @param lastIndex  the last index over the range
     */
    *mergeSort(firstIndex, lastIndex) {
        let list = this.snapshot.list;

        if (lastIndex - firstIndex === 0) {
            this.snapshot.selection.add(firstIndex);
            yield this.snapshot;
        } else {
            let indices = this.split(firstIndex, lastIndex);
            let firstIndexA = indices[0];
            let secondIndexA = indices[1];
            let firstIndexB = indices[2];
            let secondIndexB = indices[3];

            yield * this.mergeSort(firstIndexA, secondIndexA);
            yield * this.mergeSort(firstIndexB, secondIndexB);

            this.snapshot.special.clear();
            this.snapshot.selection.clear();
            this.snapshot.select(firstIndex, lastIndex);
            let mergedList = yield * this.merge(firstIndexA, secondIndexA, firstIndexB, secondIndexB);

            for (let i = 0; i < mergedList.length(); i++) {
                list.set(mergedList.get(i), i + firstIndex);
                yield this.snapshot;
            }
        }
    }

    *sort() {
        yield * this.mergeSort(0, this.snapshot.list.length() - 1);

        this.snapshot.sorted = true;
        this.snapshot.selection.clear();
        this.snapshot.special.clear();
        yield this.snapshot;
    }
}

/**
 * A sorter class that implements the classic in-place Quicksort algorithm.
 */
class QuickSorter extends Sorter {
    constructor(list) {
        super(list);
        this.recursiveStepCalled = false;
    }

    /**
     * Returns the index for the pivot around which the sublist contained
     * between indices firstIndex and lastIndex will be partitioned.
     * @param firstIndex
     * @param lastIndex
     * @returns {number}
     */
    getPivotIndex(firstIndex, lastIndex) {
        return Math.floor((firstIndex + lastIndex) / 2);
    }

    /**
     * Generates a snapshot generator that partitions the sublist contained
     * between indices firstIndex and lastIndex. The left sublist contains
     * all elements less than the pivot, the right partition all items greater
     * than or equal to the pivot. Returns the index where both lists are split.
     * The classic partition algorithm is the one developed by Tony Hoare.
     *
     * @param firstIndex  the first index of the range
     * @param lastIndex  the last index of the range
     */
    *partition(firstIndex, lastIndex) {
        let pivotIndex = this.getPivotIndex(firstIndex, lastIndex);
        let pivot = this.snapshot.list.get(pivotIndex);

        let i = firstIndex - 1;
        let j = lastIndex + 1;

        this.snapshot.selection.clear();
        this.snapshot.special.clear();

        this.snapshot.select(firstIndex, lastIndex);

        while (true) {

            // find index of first item less than pivot
            do {
                this.snapshot.special.removeAll(i);
                i++;
                this.snapshot.special.add(i);
                yield this.snapshot;
            } while (this.snapshot.list.get(i) < pivot);

            // find index of item greater than pivot
            do {
                this.snapshot.special.removeAll(j);
                j--;
                this.snapshot.special.add(j);
                yield this.snapshot;
            } while (this.snapshot.list.get(j) > pivot);

            if (i >= j) {
                return j;
            }

            this.snapshot.swapped.add(i);
            this.snapshot.swapped.add(j);

            yield this.snapshot;
            swap(this.snapshot.list, i, j);
            yield this.snapshot;

            this.snapshot.swapped.clear();
        }
    }

    *sort(firstIndex = 0, lastIndex = (this.snapshot.list.length() - 1)) {
        let isChild = this.recursiveStepCalled;

        if (firstIndex < lastIndex) {
            let splitIndex = yield* this.partition(firstIndex, lastIndex);

            this.recursiveStepCalled = true;
            yield* this.sort(firstIndex, splitIndex);
            yield* this.sort(splitIndex + 1, lastIndex);
        }

        if (!isChild) {
            this.snapshot.sorted = true;
            this.snapshot.selection.clear();
            this.snapshot.special.clear()
            yield this.snapshot;
        }
    }
}

let sorterAlgorithms = {
    "Bubble Sort": BubbleSorter,
    "Optimized Bubble Sort": OptimizedBubbleSorter,
    "Insertion Sort": InsertionSorter,
    "Selection Sort": SelectionSorter,
    "Merge Sort": SimplifiedMergeSorter,
    "Quicksort": QuickSorter
}

/**
 * Returns a sorter object for the given list that matches
 * the ID sortID.
 *
 * @param list  the list to be sorted by the sorter algorithm
 * @param sortID  the id of the sort
 * @returns {Sorter}
 */
function createSort(list, sortID) {
    let Sorter = sorterAlgorithms[sortID];
    return new Sorter(list);
}

/**
 * Returns all allowed sorting algorithms name IDs.
 * @returns {string[]}
 */
function getAlgorithmNames() {
    return Object.keys(sorterAlgorithms);
}