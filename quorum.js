
class QuorumEngine {

    constructor(totalNodes) {
        this.totalNodes = totalNodes;
    }

    size() {
        return Math.floor(
            (2 * this.totalNodes) / 3
        ) + 1;
    }

    reached(voteCount) {
        return voteCount >= this.size();
    }

    // NEW: Check whether a quorum setting is safe
    isSafeQuorum(quorum) {
        return Number.isInteger(quorum) &&
               quorum >= this.size() &&
               quorum <= this.totalNodes;
    }
}

module.exports = QuorumEngine;
