// DevFusion - String & Hash Utility Module

class StringUtilsModule {
    constructor() {
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.setupEventListeners();
    }

    setupTabNavigation() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        
        // Remove active from buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

        // Show selected tab
        const tabContent = document.getElementById(`${tabName}-tab`);
        if (tabContent) {
            tabContent.classList.add('active');
        }

        // Mark button as active
        document.querySelector(`.tab-btn[data-tab="${tabName}"]`).classList.add('active');
    }

    setupEventListeners() {
        // Encode/Decode buttons
        document.querySelectorAll('.util-btn[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.performAction(action);
            });
        });

        // Copy buttons
        document.getElementById('copyEncodeOutput').addEventListener('click', () => {
            const text = document.getElementById('encodeOutput').value;
            if (text) DevFusionUtils.copyToClipboard(text);
        });

        document.getElementById('copyTransformOutput').addEventListener('click', () => {
            const text = document.getElementById('transformOutput').value;
            if (text) DevFusionUtils.copyToClipboard(text);
        });

        // Hash generation
        document.getElementById('generateHashes').addEventListener('click', () => this.generateHashes());
    }

    performAction(action) {
        let input, output, result;

        switch(action) {
            case 'base64-encode':
                input = document.getElementById('encodeInput').value;
                result = DevFusionUtils.base64Encode(input);
                document.getElementById('encodeOutput').value = result;
                break;
            
            case 'base64-decode':
                input = document.getElementById('encodeInput').value;
                try {
                    result = DevFusionUtils.base64Decode(input);
                    document.getElementById('encodeOutput').value = result;
                } catch (e) {
                    DevFusionUtils.showToast('Invalid Base64 input', 'error');
                }
                break;
            
            case 'url-encode':
                input = document.getElementById('encodeInput').value;
                result = DevFusionUtils.urlEncode(input);
                document.getElementById('encodeOutput').value = result;
                break;
            
            case 'url-decode':
                input = document.getElementById('encodeInput').value;
                try {
                    result = DevFusionUtils.urlDecode(input);
                    document.getElementById('encodeOutput').value = result;
                } catch (e) {
                    DevFusionUtils.showToast('Invalid URL encoding', 'error');
                }
                break;
            
            case 'html-encode':
                input = document.getElementById('encodeInput').value;
                result = DevFusionUtils.escapeHtml(input);
                document.getElementById('encodeOutput').value = result;
                break;
            
            case 'html-decode':
                input = document.getElementById('encodeInput').value;
                result = DevFusionUtils.unescapeHtml(input);
                document.getElementById('encodeOutput').value = result;
                break;
            
            case 'uppercase':
                input = document.getElementById('transformInput').value;
                result = input.toUpperCase();
                document.getElementById('transformOutput').value = result;
                break;
            
            case 'lowercase':
                input = document.getElementById('transformInput').value;
                result = input.toLowerCase();
                document.getElementById('transformOutput').value = result;
                break;
            
            case 'capitalize':
                input = document.getElementById('transformInput').value;
                result = input.replace(/\b\w/g, char => char.toUpperCase());
                document.getElementById('transformOutput').value = result;
                break;
            
            case 'reverse':
                input = document.getElementById('transformInput').value;
                result = input.split('').reverse().join('');
                document.getElementById('transformOutput').value = result;
                break;
            
            case 'remove-spaces':
                input = document.getElementById('transformInput').value;
                result = input.replace(/\s+/g, '');
                document.getElementById('transformOutput').value = result;
                break;
            
            case 'trim':
                input = document.getElementById('transformInput').value;
                result = input.trim();
                document.getElementById('transformOutput').value = result;
                break;
        }

        DevFusionUtils.showToast('Operation completed', 'success');
    }

    generateHashes() {
        const input = document.getElementById('hashInput').value;

        if (!input) {
            DevFusionUtils.showToast('Enter text to hash', 'info');
            return;
        }

        try {
            // MD5
            document.getElementById('md5Output').value = CryptoJS.MD5(input).toString();

            // SHA-1
            document.getElementById('sha1Output').value = CryptoJS.SHA1(input).toString();

            // SHA-256
            document.getElementById('sha256Output').value = CryptoJS.SHA256(input).toString();

            // SHA-512
            document.getElementById('sha512Output').value = CryptoJS.SHA512(input).toString();

            DevFusionUtils.showToast('Hashes generated', 'success');
        } catch (error) {
            DevFusionUtils.showToast('Error generating hashes', 'error');
            console.error(error);
        }
    }
}

// Initialize module
document.addEventListener('DOMContentLoaded', () => {
    window.stringUtilsModule = new StringUtilsModule();
});