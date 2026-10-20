

// ============================================
// BFT Workshop - Node Implementation
// Tasks 8.1 and 8.2:
// Equivocation Detection and Key Rotation
// ============================================

const {
    sign,
    verify,
    rotateKey,
    isRevoked
} = require("./crypto");

// ============================================
// Node Class
// ============================================

class Node {

    constructor(id, honest = true) {
        this.id = id;
        this.honest = honest;

        // Initial key for this node
        this.secret = "secret-" + id;

        this.publicInfo = {
            id: this.id
        };

        // Track votes by consensus round
        this.votesByRound = new Map();

        // Record equivocation incidents
        this.equivocations = [];
    }

    // ============================================
    // Cast a Signed Vote
    // ============================================

    vote(value, round = 0) {
        if (isRevoked(this.secret)) {
            throw new Error(
                `Node ${this.id} cannot vote: its key is revoked`
            );
        }

        const roundKey = String(round);
        const valueKey = String(value);

        if (!this.votesByRound.has(roundKey)) {
            this.votesByRound.set(
                roundKey,
                new Set()
            );
        }

        const previousVotes =
            this.votesByRound.get(roundKey);

        // Detect conflicting values in the same round
        if (
            previousVotes.size > 0 &&
            !previousVotes.has(valueKey)
        ) {
            const incident = {
                nodeId: this.id,
                round: round,
                previousValues: [...previousVotes],
                conflictingValue: valueKey
            };

            this.equivocations.push(incident);

            console.warn(
                "\n*** EQUIVOCATION DETECTED ***"
            );

            console.warn(
                JSON.stringify(incident, null, 2)
            );
        }

        previousVotes.add(valueKey);

        return {
            nodeId: this.id,
            value: value,
            round: round,
            signature: sign(
                this.id,
                value,
                this.secret
            )
        };
    }

    // ============================================
    // Verify a Vote
    // ============================================

    verifyVote(vote, secretLookup) {
        const secret = secretLookup(vote.nodeId);

        if (!secret || isRevoked(secret)) {
            return false;
        }

        return verify(
            vote.nodeId,
            vote.value,
            secret,
            vote.signature
        );
    }

    // ============================================
    // Rotate This Node's Key
    // ============================================

    rotateOwnKey() {
        this.secret = rotateKey(this.secret);

        console.log(
            `Node ${this.id} rotated its key successfully.`
        );

        return this.secret;
    }

    // ============================================
    // Get Equivocation Incidents
    // ============================================

    getEquivocations() {
        return [...this.equivocations];
    }
}

// ============================================
// Export Node Class
// ============================================

module.exports = Node;
