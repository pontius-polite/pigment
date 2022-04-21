
/**
 * Double linked list implementation in Javascript, used for storing particles. 
 * Each node is linked to a next and previous node. 
 * Constant time retrieval of first and last elements thanks to sentinel node. 
 */



class Node {
    constructor() {
        this.item = null;
        this.next = this;
        this.prev = this;
    }
}

class DoubleLinkedList {
    constructor () {
        this.size = 0;
        this.sentinel = new Node();
    }

    isEmpty() {
        return this.size == 0;
    }

    addFirst(item) {
        let n = new Node();
        n.item = item;
        connectThreeNodes(this.sentinel, n, this.sentinel.next);
        this.size += 1;
    }

    addLast(item) {
        let n = new Node();
        n.item = item;
        connectThreeNodes(this.sentinel.prev, n, this.sentinel);
        this.size += 1;
    }

    getLast() {
        if (this.isEmpty()) {
            throw new ReferenceError("Cannot get item; list is empty.");
        }
        return this.sentinel.prev.item;
    }

    /** Returns the first item in the list, or null if empty. */
    getFirst() {
        if (this.isEmpty()) {
            throw new ReferenceError("Cannot get item; list is empty.");
        }
        return this.sentinel.next.item;
    }

    /** Removes and returns the last item in the list, or null if empty. */
    removeLast() {
        if (this.isEmpty()) {
            throw new ReferenceError("Cannot remove item; list is empty.");
        }

        let removed = this.sentinel.prev.item;
        connectTwoNodes(this.sentinel.prev.prev, this.sentinel);
        this.size -= 1;
        
        return removed;
    }

    /** Removes and returns the last item in the list, or null if empty. */
    removeFirst() {
        if (this.isEmpty()) {
            throw new ReferenceError("Cannot remove item; list is empty.");
        } 

        let removed = this.sentinel.next.item;
        connectTwoNodes(this.sentinel, this.sentinel.next.next);
        this.size -= 1;
        
        return removed;
    }

    /** Returns the item at the specified index. */
    get(index) {
        if (index < 0 || index >= this.size) {
            throw new RangeError("Index " + index + "is not in range of this list.");
        }

        n = this.sentinel.next;
        while (index != 0) {
            n = n.next;
            index -= 1;
        }
        return n.item;
    }
}

/** Connects the two nodes first and second such that first.next = second and second.prev = first. */
function connectTwoNodes(first, second) {
    first.next = second;
    second.prev = first;
}

/** Connects the three nodes to be sequentially linked. */
function connectThreeNodes(first, second, third) {
    connectTwoNodes(first, second);
    connectTwoNodes(second, third);
}