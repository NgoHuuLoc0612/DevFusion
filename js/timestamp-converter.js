// DevFusion - Timestamp Converter Module

class TimestampConverterModule {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 1000);
    }

    setupEventListeners() {
        document.getElementById('convertTimestamp').addEventListener('click', () => this.convertTimestamp());
        document.getElementById('convertDate').addEventListener('click', () => this.convertDate());
        
        // Enter key support
        document.getElementById('timestampInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.convertTimestamp();
        });
    }

    updateCurrentTime() {
        const now = new Date();
        const unixSeconds = Math.floor(now.getTime() / 1000);
        const unixMillis = now.getTime();

        document.getElementById('currentTimestamp').textContent = `${unixSeconds} (seconds) / ${unixMillis} (ms)`;
        document.getElementById('currentDate').textContent = now.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        });
    }

    convertTimestamp() {
        const input = document.getElementById('timestampInput').value.trim();

        if (!input) {
            DevFusionUtils.showToast('Enter a timestamp', 'info');
            return;
        }

        let timestamp = parseInt(input);
        if (isNaN(timestamp)) {
            DevFusionUtils.showToast('Invalid timestamp', 'error');
            return;
        }

        // Detect if milliseconds or seconds
        if (timestamp > 10000000000) {
            // Likely milliseconds
            timestamp = Math.floor(timestamp / 1000);
        }

        const date = new Date(timestamp * 1000);

        const result = `
            <div class="result-row">
                <span class="label">Date & Time:</span>
                <span class="value">${date.toLocaleString()}</span>
            </div>
            <div class="result-row">
                <span class="label">ISO 8601:</span>
                <span class="value">${date.toISOString()}</span>
            </div>
            <div class="result-row">
                <span class="label">UTC:</span>
                <span class="value">${date.toUTCString()}</span>
            </div>
            <div class="result-row">
                <span class="label">Locale:</span>
                <span class="value">${date.toLocaleString()}</span>
            </div>
            <div class="result-row">
                <span class="label">Seconds:</span>
                <span class="value">${timestamp}</span>
            </div>
            <div class="result-row">
                <span class="label">Milliseconds:</span>
                <span class="value">${timestamp * 1000}</span>
            </div>
        `;

        document.getElementById('timestampResult').innerHTML = result;
        DevFusionUtils.showToast('Timestamp converted', 'success');
    }

    convertDate() {
        const dateInput = document.getElementById('dateInput').value;

        if (!dateInput) {
            DevFusionUtils.showToast('Select a date', 'info');
            return;
        }

        const date = new Date(dateInput);
        const unixSeconds = Math.floor(date.getTime() / 1000);
        const unixMillis = date.getTime();

        const result = `
            <div class="result-row">
                <span class="label">Unix Timestamp (seconds):</span>
                <span class="value">${unixSeconds}</span>
            </div>
            <div class="result-row">
                <span class="label">Unix Timestamp (milliseconds):</span>
                <span class="value">${unixMillis}</span>
            </div>
            <div class="result-row">
                <span class="label">ISO 8601:</span>
                <span class="value">${date.toISOString()}</span>
            </div>
            <div class="result-row">
                <span class="label">UTC String:</span>
                <span class="value">${date.toUTCString()}</span>
            </div>
        `;

        document.getElementById('dateResult').innerHTML = result;
        DevFusionUtils.showToast('Date converted', 'success');
    }
}

// Initialize module
document.addEventListener('DOMContentLoaded', () => {
    window.timestampConverterModule = new TimestampConverterModule();
});