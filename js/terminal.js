// DevFusion - Terminal Module

class TerminalModule {
    constructor() {
        this.history = [];
        this.historyIndex = -1;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadHistory();
    }

    setupEventListeners() {
        const input = document.getElementById('terminalInput');
        input.addEventListener('keydown', (e) => this.handleKeydown(e));
        input.addEventListener('keyup', (e) => this.handleKeyup(e));
    }

    handleKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = e.target.value.trim();
            if (command) {
                this.executeCommand(command);
                e.target.value = '';
                this.historyIndex = -1;
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateHistory(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateHistory(1);
        }
    }

    handleKeyup(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
        }
    }

    navigateHistory(direction) {
        const input = document.getElementById('terminalInput');
        if (direction === -1 && this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
        } else if (direction === 1 && this.historyIndex > 0) {
            this.historyIndex--;
        }

        if (this.historyIndex >= 0 && this.historyIndex < this.history.length) {
            input.value = this.history[this.historyIndex];
        } else {
            input.value = '';
        }
    }

    executeCommand(command) {
        this.addToOutput(`<div class="terminal-command">${DevFusionUtils.escapeHtml(command)}</div>`);
        this.history.unshift(command);
        this.saveHistory();

        const parts = command.split(/\s+/);
        const cmd = parts[0].toLowerCase();

        try {
            switch (cmd) {
                case 'help':
                    this.showHelp();
                    break;
                case 'clear':
                    this.clearOutput();
                    break;
                case 'diff':
                    this.executeDiff(parts);
                    break;
                case 'hash':
                    this.executeHash(parts);
                    break;
                case 'regex':
                    this.executeRegex(parts);
                    break;
                case 'encode':
                    this.executeEncode(parts);
                    break;
                case 'decode':
                    this.executeDecode(parts);
                    break;
                case 'analyze':
                    this.executeAnalyze(parts);
                    break;
                case 'uuid':
                    this.executeUUID(parts);
                    break;
                case 'timestamp':
                    this.executeTimestamp(parts);
                    break;
                case 'jwt':
                    this.executeJWT(parts);
                    break;
                case 'info':
                    this.showInfo();
                    break;
                case 'exit':
                    window.app.toggleTerminal();
                    break;
                default:
                    this.addToOutput(`<div class="terminal-error">Unknown command: ${cmd}. Type 'help' for available commands.</div>`);
            }
        } catch (error) {
            this.addToOutput(`<div class="terminal-error">${error.message}</div>`);
        }
    }

    executeDiff(parts) {
        if (parts.length < 3) {
            this.addToOutput(`<div class="terminal-error">Usage: diff <text1> <text2></div>`);
            return;
        }

        const text1 = parts.slice(1, Math.ceil(parts.length / 2)).join(' ');
        const text2 = parts.slice(Math.ceil(parts.length / 2)).join(' ');

        const dmp = new diff_match_patch();
        const diffs = dmp.diff_main(text1, text2);
        dmp.diff_cleanupSemantic(diffs);

        let result = '<div class="terminal-code-block">';
        diffs.forEach(([type, text]) => {
            const color = type === 1 ? 'var(--success-color)' : type === -1 ? 'var(--danger-color)' : 'inherit';
            result += `<div style="color: ${color};">${type === 1 ? '+ ' : type === -1 ? '- ' : '  '}${DevFusionUtils.escapeHtml(text)}</div>`;
        });
        result += '</div>';

        this.addToOutput(result);
    }

    executeHash(parts) {
        if (parts.length < 2) {
            this.addToOutput(`<div class="terminal-error">Usage: hash "text to hash"</div>`);
            return;
        }

        const text = parts.slice(1).join(' ').replace(/^["']|["']$/g, '');
        const md5 = CryptoJS.MD5(text).toString();
        const sha256 = CryptoJS.SHA256(text).toString();

        const result = `
            <div class="terminal-code-block">
                MD5: ${md5}<br>
                SHA-256: ${sha256}
            </div>
        `;

        this.addToOutput(result);
    }

    executeRegex(parts) {
        if (parts.length < 3) {
            this.addToOutput(`<div class="terminal-error">Usage: regex "pattern" "text"</div>`);
            return;
        }

        const pattern = parts[1].replace(/^["']|["']$/g, '');
        const text = parts.slice(2).join(' ').replace(/^["']|["']$/g, '');

        try {
            const regex = new RegExp(pattern, 'g');
            const matches = [];
            let match;

            while ((match = regex.exec(text)) !== null) {
                matches.push(match[0]);
            }

            const result = `
                <div class="terminal-code-block">
                    Found ${matches.length} matches:<br>
                    ${matches.map(m => DevFusionUtils.escapeHtml(m)).join('<br>')}
                </div>
            `;

            this.addToOutput(result);
        } catch (error) {
            this.addToOutput(`<div class="terminal-error">Regex error: ${error.message}</div>`);
        }
    }

    executeEncode(parts) {
        if (parts.length < 3) {
            this.addToOutput(`<div class="terminal-error">Usage: encode <base64|url|html> "text"</div>`);
            return;
        }

        const type = parts[1].toLowerCase();
        const text = parts.slice(2).join(' ').replace(/^["']|["']$/g, '');
        let result;

        try {
            switch (type) {
                case 'base64':
                    result = DevFusionUtils.base64Encode(text);
                    break;
                case 'url':
                    result = DevFusionUtils.urlEncode(text);
                    break;
                case 'html':
                    result = DevFusionUtils.escapeHtml(text);
                    break;
                default:
                    throw new Error(`Unknown encoding: ${type}`);
            }

            this.addToOutput(`<div class="terminal-result">${DevFusionUtils.escapeHtml(result)}</div>`);
        } catch (error) {
            this.addToOutput(`<div class="terminal-error">${error.message}</div>`);
        }
    }

    executeDecode(parts) {
        if (parts.length < 3) {
            this.addToOutput(`<div class="terminal-error">Usage: decode <base64|url|html> "text"</div>`);
            return;
        }

        const type = parts[1].toLowerCase();
        const text = parts.slice(2).join(' ').replace(/^["']|["']$/g, '');
        let result;

        try {
            switch (type) {
                case 'base64':
                    result = DevFusionUtils.base64Decode(text);
                    break;
                case 'url':
                    result = DevFusionUtils.urlDecode(text);
                    break;
                case 'html':
                    result = DevFusionUtils.unescapeHtml(text);
                    break;
                default:
                    throw new Error(`Unknown encoding: ${type}`);
            }

            this.addToOutput(`<div class="terminal-result">${DevFusionUtils.escapeHtml(result)}</div>`);
        } catch (error) {
            this.addToOutput(`<div class="terminal-error">${error.message}</div>`);
        }
    }

    executeAnalyze(parts) {
        if (parts.length < 2) {
            this.addToOutput(`<div class="terminal-error">Usage: analyze "text"</div>`);
            return;
        }

        const text = parts.slice(1).join(' ').replace(/^["']|["']$/g, '');
        const words = text.trim().split(/\s+/).length;
        const chars = text.length;
        const lines = text.split('\n').length;

        const result = `
            <div class="terminal-code-block">
                Lines: ${lines}<br>
                Words: ${words}<br>
                Characters: ${chars}<br>
                Non-whitespace: ${text.replace(/\s/g, '').length}
            </div>
        `;

        this.addToOutput(result);
    }

    executeUUID(parts) {
        const count = parseInt(parts[1]) || 1;
        const version = parts[2] || 'v4';

        const uuids = [];
        for (let i = 0; i < Math.min(count, 100); i++) {
            uuids.push(DevFusionUtils.generateUUID(version));
        }

        const result = `
            <div class="terminal-code-block">
                ${uuids.map(u => DevFusionUtils.escapeHtml(u)).join('<br>')}
            </div>
        `;

        this.addToOutput(result);
    }

    executeTimestamp(parts) {
        const now = Math.floor(Date.now() / 1000);
        const result = `
            <div class="terminal-code-block">
                Current Unix Timestamp: ${now}<br>
                Milliseconds: ${Date.now()}
            </div>
        `;

        this.addToOutput(result);
    }

    executeJWT(parts) {
        if (parts.length < 2) {
            this.addToOutput(`<div class="terminal-error">Usage: jwt "token"</div>`);
            return;
        }

        const token = parts.slice(1).join(' ').replace(/^["']|["']$/g, '');

        try {
            const decoded = DevFusionUtils.parseJWT(token);
            const result = `
                <div class="terminal-code-block">
                    <strong>Header:</strong> ${JSON.stringify(decoded.header)}<br>
                    <strong>Payload:</strong> ${JSON.stringify(decoded.payload)}<br>
                    <strong>Signature:</strong> ${decoded.signature.substring(0, 20)}...
                </div>
            `;

            this.addToOutput(result);
        } catch (error) {
            this.addToOutput(`<div class="terminal-error">Invalid JWT: ${error.message}</div>`);
        }
    }

    showHelp() {
        const help = `
            <div class="terminal-help-section">
                <h4>DevFusion Terminal Commands</h4>
                <div class="terminal-help-item">
                    <span class="terminal-help-command">help</span>
                    <span class="terminal-help-description">Show this help message</span>
                </div>
                <div class="terminal-help-item">
                    <span class="terminal-help-command">diff &lt;text1&gt; &lt;text2&gt;</span>
                    <span class="terminal-help-description">Compare two text strings</span>
                </div>
                <div class="terminal-help-item">
                    <span class="terminal-help-command">hash "text"</span>
                    <span class="terminal-help-description">Generate MD5 and SHA-256 hashes</span>
                </div>
                <div class="terminal-help-item">
                    <span class="terminal-help-command">regex "pattern" "text"</span>
                    <span class="terminal-help-description">Test regular expression</span>
                </div>
                <div class="terminal-help-item">
                    <span class="terminal-help-command">encode &lt;base64|url|html&gt; "text"</span>
                    <span class="terminal-help-description">Encode text</span>
                </div>
                <div class="terminal-help-item">
                    <span class="terminal-help-command">decode &lt;base64|url|html&gt; "text"</span>
                    <span class="terminal-help-description">Decode text</span>
                </div>
                <div class="terminal-help-item">
                    <span class="terminal-help-command">analyze "text"</span>
                    <span class="terminal-help-description">Analyze text statistics</span>
                </div>
                <div class="terminal-help-item">
                    <span class="terminal-help-command">uuid [count] [version]</span>
                    <span class="terminal-help-description">Generate UUIDs (v4 or v1)</span>
                </div>
                <div class="terminal-help-item">
                    <span class="terminal-help-command">timestamp</span>
                    <span class="terminal-help-description">Show current Unix timestamp</span>
                </div>
                <div class="terminal-help-item">
                    <span class="terminal-help-command">jwt "token"</span>
                    <span class="terminal-help-description">Decode and show JWT</span>
                </div>
                <div class="terminal-help-item">
                    <span class="terminal-help-command">clear</span>
                    <span class="terminal-help-description">Clear terminal output</span>
                </div>
                <div class="terminal-help-item">
                    <span class="terminal-help-command">info</span>
                    <span class="terminal-help-description">Show DevFusion information</span>
                </div>
                <div class="terminal-help-item">
                    <span class="terminal-help-command">exit</span>
                    <span class="terminal-help-description">Close terminal (or press Ctrl+~)</span>
                </div>
            </div>
        `;

        this.addToOutput(help);
    }

    showInfo() {
        const info = `
            <div class="terminal-code-block">
                <strong>DevFusion v2.1.0</strong><br>
                Professional Developer Toolkit<br>
                <br>
                Features:<br>
                • Advanced Diff Viewer with Myers algorithm<br>
                • JSON Beautifier & Comparator<br>
                • Real-time Regex Tester<br>
                • String & Hash Utility<br>
                • Text Analyzer<br>
                • File Comparator<br>
                • Color Picker<br>
                • UUID Generator<br>
                • Timestamp Converter<br>
                • JWT Decoder<br>
                • Terminal Interface<br>
                <br>
                Press Ctrl+~ to toggle terminal
            </div>
        `;

        this.addToOutput(info);
    }

    addToOutput(html) {
        const output = document.getElementById('terminalOutput');
        const line = document.createElement('div');
        line.innerHTML = html;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    clearOutput() {
        document.getElementById('terminalOutput').innerHTML = '';
        this.addToOutput('<div class="terminal-success">Terminal cleared</div>');
    }

    saveHistory() {
        try {
            const historyData = JSON.stringify(this.history.slice(0, 100));
            // Store in memory since localStorage isn't available
            this.terminalHistory = this.history.slice(0, 100);
        } catch (e) {
            console.error('Failed to save history', e);
        }
    }

    loadHistory() {
        // Load from memory if available
        if (window.terminalHistory) {
            this.history = window.terminalHistory;
        }
    }
}

// Initialize module
document.addEventListener('DOMContentLoaded', () => {
    window.terminalModule = new TerminalModule();
});