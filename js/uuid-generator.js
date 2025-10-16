// DevFusion - UUID Generator Module

class UUIDGeneratorModule {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('generateUUIDs').addEventListener('click', () => this.generateUUIDs());
        document.getElementById('copyAllUUIDs').addEventListener('click', () => this.copyAllUUIDs());
    }

    generateUUIDs() {
        const version = document.getElementById('uuidVersion').value;
        const quantity = parseInt(document.getElementById('uuidQuantity').value) || 10;
        const uppercase = document.getElementById('uuidUppercase').checked;

        if (quantity < 1 || quantity > 1000) {
            DevFusionUtils.showToast('Quantity must be between 1 and 1000', 'warning');
            return;
        }

        const uuids = [];
        for (let i = 0; i < quantity; i++) {
            let uuid = DevFusionUtils.generateUUID(version);
            if (uppercase) {
                uuid = uuid.toUpperCase();
            }
            uuids.push(uuid);
        }

        this.displayUUIDs(uuids);
        DevFusionUtils.showToast(`Generated ${quantity} UUIDs`, 'success');
    }

    displayUUIDs(uuids) {
        let html = '';

        uuids.forEach((uuid, idx) => {
            html += `
                <div class="uuid-item" onclick="DevFusionUtils.copyToClipboard('${uuid}')">
                    <span class="uuid-text">${uuid}</span>
                    <i class="fas fa-copy copy-icon"></i>
                </div>
            `;
        });

        document.getElementById('uuidList').innerHTML = html;
    }

    copyAllUUIDs() {
        const uuids = Array.from(document.querySelectorAll('.uuid-item .uuid-text'))
            .map(el => el.textContent)
            .join('\n');

        if (!uuids) {
            DevFusionUtils.showToast('Generate UUIDs first', 'info');
            return;
        }

        DevFusionUtils.copyToClipboard(uuids);
    }
}

// Initialize module
document.addEventListener('DOMContentLoaded', () => {
    window.uuidGeneratorModule = new UUIDGeneratorModule();
});