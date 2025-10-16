// DevFusion - Regex Tester Module

class RegexTesterModule {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const patternInput = document.getElementById('regexPattern');
        const testStringInput = document.getElementById('regexTestString');
        const flagCheckboxes = document.querySelectorAll('.flag-label input[type="checkbox"]');
        const presetBtns = document.querySelectorAll('.preset-btn');

        // Real-time regex testing
        const test = DevFusionUtils.debounce(() => this.testRegex(), 300);
        patternInput.addEventListener('input', test);
        testStringInput.addEventListener('input', test);
        flagCheckboxes.forEach(cb => cb.addEventListener('change', test));

        // Preset buttons
        presetBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pattern = e.target.dataset.pattern;
                patternInput.value = pattern;
                patternInput.select();
                this.testRegex();
            });
        });

        // Initial test
        this.testRegex();
    }

    getFlags() {
        let flags = '';
        document.querySelectorAll('.flag-label input[type="checkbox"]:checked').forEach(cb => {
            flags += cb.value;
        });
        return flags;
    }

    testRegex() {
        const pattern = document.getElementById('regexPattern').value;
        const testString = document.getElementById('regexTestString').value;
        const flags = this.getFlags();

        if (!pattern || !testString) {
            document.getElementById('matchesContainer').innerHTML = '';
            document.getElementById('matchCount').textContent = '0 matches';
            return;
        }

        try {
            const regex = new RegExp(pattern, flags);
            const matches = [];
            let match;

            if (flags.includes('g')) {
                while ((match = regex.exec(testString)) !== null) {
                    matches.push({
                        text: match[0],
                        index: match.index,
                        groups: match.slice(1)
                    });
                }
            } else {
                match = regex.exec(testString);
                if (match) {
                    matches.push({
                        text: match[0],
                        index: match.index,
                        groups: match.slice(1)
                    });
                }
            }

            this.displayMatches(matches, testString);
            document.getElementById('matchCount').textContent = `${matches.length} match${matches.length !== 1 ? 'es' : ''}`;

        } catch (error) {
            document.getElementById('matchesContainer').innerHTML = `
                <div style="padding: 1rem; background-color: rgba(239, 68, 68, 0.1); border-left: 3px solid var(--danger-color); border-radius: var(--radius-md); color: var(--danger-color);">
                    <strong>Regex Error:</strong> ${error.message}
                </div>
            `;
            document.getElementById('matchCount').textContent = 'Error';
        }
    }

    displayMatches(matches, testString) {
        const container = document.getElementById('matchesContainer');
        
        if (matches.length === 0) {
            container.innerHTML = '<div style="padding: 1rem; color: var(--text-muted); text-align: center;">No matches found</div>';
            return;
        }

        let html = '';

        matches.forEach((match, idx) => {
            const highlightedString = this.highlightMatch(testString, match.index, match.text.length);
            
            html += `
                <div class="match-item">
                    <div class="match-text">Match #${idx + 1}: "${match.text}"</div>
                    <div class="match-info">
                        <strong>Position:</strong> ${match.index}<br>
                        <strong>Length:</strong> ${match.text.length}
            `;

            if (match.groups.length > 0) {
                html += '<strong>Capture Groups:</strong><ul style="list-style: none; padding: 0.5rem 0 0 1rem;">';
                match.groups.forEach((group, gIdx) => {
                    html += `<li>Group ${gIdx + 1}: <code>${DevFusionUtils.escapeHtml(group || 'undefined')}</code></li>`;
                });
                html += '</ul>';
            }

            html += `</div><div style="margin-top: 0.75rem; font-size: 0.8125rem; background-color: var(--bg-tertiary); padding: 0.5rem; border-radius: var(--radius-sm); white-space: pre-wrap; word-break: break-all;">${highlightedString}</div></div>`;
        });

        container.innerHTML = html;
    }

    highlightMatch(text, startIdx, length) {
        const before = DevFusionUtils.escapeHtml(text.substring(0, startIdx));
        const match = DevFusionUtils.escapeHtml(text.substring(startIdx, startIdx + length));
        const after = DevFusionUtils.escapeHtml(text.substring(startIdx + length));

        return `${before}<span style="background-color: var(--primary-color); color: white; padding: 0.25rem 0.5rem; border-radius: 2px; font-weight: 700;">${match}</span>${after}`;
    }
}

// Initialize module
document.addEventListener('DOMContentLoaded', () => {
    window.regexTesterModule = new RegexTesterModule();
});