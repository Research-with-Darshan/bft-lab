
// ============================================
// BFT Workshop - Cryptographic Utilities
// Task 8.2: Key Rotation and Revocation
// ============================================

const crypto = require("crypto");

// Store revoked keys for this running process
const revokedKeys = new Set();

// ============================================
// Sign a Vote
// ============================================

function sign(nodeId, value, secret) {
    if (revokedKeys.has(secret)) {
        throw new Error(
            `Cannot sign: key for ${nodeId} has been revoked`
        );
    }

    return crypto
        .createHash("sha256")
        .update(`${nodeId}:${value}:${secret}`)
        .digest("hex");
}

// ============================================
// Verify a Vote Signature
// ============================================

function verify(nodeId, value, secret, signature) {
    // Reject signatures made using revoked keys
    if (!secret || revokedKeys.has(secret)) {
        return false;
    }

    const expected = sign(nodeId, value, secret);

    // Compare signature strings safely
    const expectedBuffer = Buffer.from(expected, "hex");
    const signatureBuffer = Buffer.from(
        signature || "",
        "hex"
    );

    if (expectedBuffer.length !== signatureBuffer.length) {
        return false;
    }

    return crypto.timingSafeEqual(
        expectedBuffer,
        signatureBuffer
    );
}

// ============================================
// Revoke a Key
// ============================================

function revokeKey(secret) {
    if (!secret) {
        throw new Error("A valid secret is required");
    }

    revokedKeys.add(secret);

    return true;
}

// ============================================
// Generate a New Key
// ============================================

function generateKey() {
    return crypto.randomBytes(32).toString("hex");
}

// ============================================
// Rotate a Key
// Revoke the old key and create a new one
// ============================================

function rotateKey(oldSecret) {
    revokeKey(oldSecret);
    return generateKey();
}

// ============================================
// Check Whether a Key Is Revoked
// ============================================

function isRevoked(secret) {
    return revokedKeys.has(secret);
}

// ============================================
// Export Functions
// ============================================

module.exports = {
    sign,
    verify,
    revokeKey,
    generateKey,
    rotateKey,
    isRevoked
};
