
// ============================================
// BFT Workshop - Consensus Simulator
// Task 8.5: Verified Commit Certificates
// Includes Tasks 8.3 and 8.4
// ============================================

const Network = require("./network");
const QuorumEngine = require("./quorum");
const ValidatorRegistry = require("./validator_registry");
const { verify, isRevoked } = require("./crypto");

class Simulator {
    constructor(nodes, customQuorumEngine = null, validatorRegistry = null) {
        if (!Array.isArray(nodes)) {
            throw new Error("Nodes must be an array");
        }

        const ids = nodes.map(node => node.id);

        if (new Set(ids).size !== ids.length) {
            throw new Error("Duplicate validator IDs are not allowed");
        }

        this.registry = validatorRegistry ||
            new ValidatorRegistry(ids);

        this.nodes = nodes.filter(node =>
            this.registry.isAdmitted(node.id)
        );

        this.rejectedNodes = nodes.filter(node =>
            !this.registry.isAdmitted(node.id)
        );

        if (this.nodes.length === 0) {
            throw new Error("No admitted validators");
        }

        this.network = new Network();
        this.quorum = customQuorumEngine ||
            new QuorumEngine(this.nodes.length);

        const minimum = Math.floor(
            (2 * this.nodes.length) / 3
        ) + 1;

        if (
            this.quorum.size() < minimum ||
            this.quorum.size() > this.nodes.length
        ) {
            throw new Error(
                `Unsafe quorum: ${this.quorum.size()}. ` +
                `Required range: ${minimum} to ${this.nodes.length}`
            );
        }

        if (
            typeof this.quorum.isSafeQuorum === "function" &&
            !this.quorum.isSafeQuorum(this.quorum.size())
        ) {
            throw new Error("Unsafe quorum configuration");
        }

        console.log(
            `Admitted validators: ${this.nodes.map(n => n.id).join(", ")}`
        );

        if (this.rejectedNodes.length) {
            console.log(
                "Rejected unapproved validators: " +
                this.rejectedNodes.map(n => n.id).join(", ")
            );
        }
    }

    // Verify identity, admission status, key status and signature
    validateVote(vote, node) {
        if (!vote || typeof vote !== "object") return false;
        if (vote.nodeId !== node.id) return false;
        if (!this.registry.isAdmitted(vote.nodeId)) return false;
        if (!node.secret || isRevoked(node.secret)) return false;

        try {
            return verify(
                node.id,
                vote.value,
                node.secret,
                vote.signature
            );
        } catch (error) {
            return false;
        }
    }

    runConsensus(value) {
        console.log("\n====================");
        console.log(`Proposal: ${value}`);
        console.log("====================");

        const votes = [];
        const invalidVotes = [];

        for (const node of this.nodes) {
            try {
                const vote = node.vote(value);

                if (!this.validateVote(vote, node)) {
                    console.warn(`Rejected invalid vote from ${node.id}`);
                    invalidVotes.push({
                        nodeId: node.id,
                        reason: "Invalid signature, identity, or key status"
                    });
                    continue;
                }

                votes.push(vote);
                console.log(`${node.id} voted ${vote.value} (verified)`);
            } catch (error) {
                console.warn(
                    `Rejected vote from ${node.id}: ${error.message}`
                );

                invalidVotes.push({
                    nodeId: node.id,
                    reason: error.message
                });
            }
        }

        // Count verified votes only
        const tally = {};

        for (const vote of votes) {
            const key = String(vote.value);
            tally[key] = (tally[key] || 0) + 1;
        }

        console.log("\nVerified Vote Tally");
        console.table(tally);
        console.log(`Required Quorum = ${this.quorum.size()}`);

        const winners = [];

        for (const candidate of Object.keys(tally)) {
            if (this.quorum.reached(tally[candidate])) {
                winners.push({
                    value: candidate,
                    votes: tally[candidate]
                });
            }
        }

        let certificate = null;

        if (winners.length === 0) {
            console.log("\nNO CONSENSUS");
        } else if (winners.length > 1) {
            console.log("\nSAFETY VIOLATION!");
            console.table(winners);
        } else {
            const winner = winners[0];

            const certificateVotes = votes.filter(
                vote => String(vote.value) === winner.value
            );

            if (certificateVotes.length >= this.quorum.size()) {
                certificate = {
                    value: winner.value,
                    quorum: this.quorum.size(),
                    votes: certificateVotes
                };

                console.log(`\nCOMMITTED: ${winner.value}`);
                console.log("\nVerified Commit Certificate");
                console.log(JSON.stringify(certificate, null, 2));
            }
        }

        return {
            proposal: value,
            votes,
            invalidVotes,
            tally,
            winners,
            certificate
        };
    }
}

module.exports = Simulator;
