// ============================================
// BFT Workshop - Validator Admission Registry
// Task 8.3: Validator Admission Control
// ============================================

class ValidatorRegistry {

    constructor(initialValidatorIds = []) {
        this.validators = new Set();

        for (const id of initialValidatorIds) {
            this.admit(id);
        }
    }

    // Admit a validator into the trusted set
    admit(nodeId) {
        if (
            typeof nodeId !== "string" ||
            nodeId.trim() === ""
        ) {
            throw new Error(
                "Validator ID must be a non-empty string"
            );
        }

        this.validators.add(nodeId);
        return true;
    }

    // Remove a validator from the trusted set
    revoke(nodeId) {
        return this.validators.delete(nodeId);
    }

    // Check validator admission status
    isAdmitted(nodeId) {
        return this.validators.has(nodeId);
    }

    // Return a copy of the approved validator IDs
    list() {
        return [...this.validators];
    }

    // Return the number of approved validators
    size() {
        return this.validators.size;
    }
}

// ============================================
// Export Validator Registry
// ============================================

module.exports = ValidatorRegistry;