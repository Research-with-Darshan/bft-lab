
// ============================================
// BFT Workshop - Task 8.5
// Commit Certificate Validation Tests
// ============================================

const Node = require("../node");
const Simulator = require("../simulator");
const crypto = require("../crypto");

// ============================================
// Test 1: Reject a forged vote
// ============================================

console.log("\n===== TEST 1: Reject Forged Vote =====");

const nodes1 = [
    new Node("A"),
    new Node("B"),
    new Node("C"),
    new Node("D")
];

// Replace D's vote with one signed using the wrong secret
nodes1[3].vote = function (value) {
    return {
        nodeId: this.id,
        value: value,
        round: 0,
        signature: crypto.sign(
            this.id,
            value,
            "incorrect-secret"
        )
    };
};

const sim1 = new Simulator(nodes1);
const result1 = sim1.runConsensus(100);

console.log(
    "Forged vote rejected:",
    result1.invalidVotes.some(vote => vote.nodeId === "D")
);

console.log(
    "Certificate has three valid votes:",
    result1.certificate !== null &&
    result1.certificate.votes.length === 3
);

console.log(
    "Consensus committed:",
    result1.certificate !== null
);

// ============================================
// Test 2: Reject certificate below quorum
// ============================================

console.log("\n===== TEST 2: Quorum Enforcement =====");

const nodes2 = [
    new Node("A"),
    new Node("B"),
    new Node("C"),
    new Node("D")
];

// C and D produce invalid signatures
for (const node of [nodes2[2], nodes2[3]]) {
    node.vote = function (value) {
        return {
            nodeId: this.id,
            value: value,
            round: 0,
            signature: crypto.sign(
                this.id,
                value,
                "incorrect-secret-" + this.id
            )
        };
    };
}

const sim2 = new Simulator(nodes2);
const result2 = sim2.runConsensus(100);

console.log(
    "Two invalid votes rejected:",
    result2.invalidVotes.length === 2
);

console.log(
    "No certificate below quorum:",
    result2.certificate === null
);

// ============================================
// Test 3: Verify every certificate signature
// ============================================

console.log("\n===== TEST 3: Certificate Verification =====");

const nodes3 = [
    new Node("A"),
    new Node("B"),
    new Node("C"),
    new Node("D")
];

const sim3 = new Simulator(nodes3);
const result3 = sim3.runConsensus(100);

const certificate = result3.certificate;

const certificateValid =
    certificate !== null &&
    certificate.votes.length >= certificate.quorum &&
    certificate.votes.every(vote => {
        const node = nodes3.find(
            item => item.id === vote.nodeId
        );

        return (
            node !== undefined &&
            sim3.registry.isAdmitted(vote.nodeId) &&
            !crypto.isRevoked(node.secret) &&
            crypto.verify(
                vote.nodeId,
                vote.value,
                node.secret,
                vote.signature
            ) &&
            String(vote.value) === certificate.value
        );
    });

console.log(
    "All certificate signatures valid:",
    certificateValid
);
