
// ============================================
// BFT Workshop - Attack Implementations
// ============================================

const { sign } = require("./crypto");

// ============================================
// Restore Honest Node Behaviour
// ============================================

function resetNode(node) {
    // Remove any instance-level vote override.
    // This restores the Node class's original vote method.
    delete node.vote;
    delete node.voteForPeer;
}

// ============================================
// Byzantine Node
// Always votes for a malicious value
// ============================================

function makeByzantine(node, maliciousValue) {
    node.vote = function (_) {
        return {
            nodeId: this.id,
            value: maliciousValue,
            signature: sign(
                this.id,
                maliciousValue,
                this.secret
            )
        };
    };
}

// ============================================
// Equivocation Attack
// Sends different values to different peers
// ============================================

function makeEquivocator(node, valuesPerPeer) {
    node.voteForPeer = function (peerId, round = 0) {
        const value = valuesPerPeer[peerId];

        if (value === undefined) {
            throw new Error(
                `No vote value configured for peer ${peerId}`
            );
        }

        // Use the Node class's vote method so conflicting
        // values in the same round trigger detection.
        return this.vote(value, round);
    };
}

// ============================================
// Key Theft
// Returns the node's secret
// ============================================

function stealKey(node) {
    return node.secret;
}

// ============================================
// Forge a Vote Using a Stolen Secret
// ============================================

function forgeVote(victimNodeId, stolenSecret, value) {
    return {
        nodeId: victimNodeId,
        value: value,
        signature: sign(
            victimNodeId,
            value,
            stolenSecret
        )
    };
}

// ============================================
// Export Attack Functions
// ============================================

module.exports = {
    resetNode,
    makeByzantine,
    makeEquivocator,
    stealKey,
    forgeVote
};
