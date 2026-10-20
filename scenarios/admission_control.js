// ============================================
// BFT Workshop - Admission Control Scenario
// Task 8.3
// ============================================

const Node = require("../node");
const Simulator = require("../simulator");
const ValidatorRegistry = require("../validator_registry");

// Only A, B, C and D are approved
const registry = new ValidatorRegistry([
    "A",
    "B",
    "C",
    "D"
]);

// E is present but has not been approved
const nodes = [
    new Node("A"),
    new Node("B"),
    new Node("C"),
    new Node("D"),
    new Node("E")
];

console.log("Initial approved validators:", registry.list());

const sim = new Simulator(
    nodes,
    null,
    registry
);

const result = sim.runConsensus(100);

console.log("\nAdmission Control Checks");
console.log(
    "Unapproved E rejected:",
    !sim.nodes.some(node => node.id === "E")
);
console.log(
    "Four admitted validators:",
    sim.nodes.length === 4
);
console.log(
    "Unapproved E did not vote:",
    !result.votes.some(vote => vote.nodeId === "E")
);
console.log(
    "Consensus committed:",
    result.certificate !== null
);