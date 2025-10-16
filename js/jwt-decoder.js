// DevFusion - JWT Decoder Module

class JWTDecoderModule {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('decodeJWT').addEventListener('click', () => this.decodeJWT());
        
        // Auto-decode on paste
        document.getElementById('jwtInput').addEventListener('paste', (e) => {
            setTimeout(() => this.decodeJWT(), 100);
        });
    }

    decodeJWT() {
        const token = document.getElementById('jwtInput').value.trim();

        if (!token) {
            DevFusionUtils.showToast('Enter a JWT token', 'info');
            return;
        }

        try {
            const decoded = DevFusionUtils.parseJWT(token);

            document.getElementById('jwtHeader').textContent = JSON.stringify(decoded.header, null, 2);
            document.getElementById('jwtPayload').textContent = JSON.stringify(decoded.payload, null, 2);
            document.getElementById('jwtSignature').textContent = decoded.signature;

            this.displayJWTInfo(decoded.payload);
            DevFusionUtils.showToast('JWT decoded successfully', 'success');

        } catch (error) {
            DevFusionUtils.showToast('Invalid JWT: ' + error.message, 'error');
            document.getElementById('jwtHeader').textContent = '';
            document.getElementById('jwtPayload').textContent = '';
            document.getElementById('jwtSignature').textContent = '';
        }
    }

    displayJWTInfo(payload) {
        // Check expiration if present
        if (payload.exp) {
            const expDate = new Date(payload.exp * 1000);
            const now = new Date();
            const isExpired = expDate < now;

            const expirationDiv = document.createElement('div');
            expirationDiv.style.cssText = `
                padding: 1rem;
                margin-top: 1rem;
                background-color: ${isExpired ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'};
                border-left: 3px solid ${isExpired ? 'var(--danger-color)' : 'var(--success-color)'};
                border-radius: var(--radius-md);
                color: ${isExpired ? 'var(--danger-color)' : 'var(--success-color)'};
            `;

            expirationDiv.innerHTML = `
                <strong>${isExpired ? 'EXPIRED' : 'VALID'}</strong><br>
                Expires: ${expDate.toLocaleString()}
            `;

            const payloadElement = document.getElementById('jwtPayload').parentElement;
            const existingInfo = payloadElement.querySelector('[data-jwt-info]');
            if (existingInfo) existingInfo.remove();
            
            expirationDiv.setAttribute('data-jwt-info', 'true');
            payloadElement.appendChild(expirationDiv);
        }
    }
}

// Initialize module
document.addEventListener('DOMContentLoaded', () => {
    window.jwtDecoderModule = new JWTDecoderModule();
});