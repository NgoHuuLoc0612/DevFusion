// DevFusion - JSON Tools Module

class JSONToolsModule {
    constructor() {
        this.editor = null;
        this.treeEditor = null;
        this.currentMode = 'single';
        this.init();
    }

    init() {
        this.setupModeToggle();
        this.setupEventListeners();
        this.initializeEditors();
    }

    setupModeToggle() {
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.switchMode(mode);
            });
        });
    }

    switchMode(mode) {
        this.currentMode = mode;

        // Update button states
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.mode-btn[data-mode="${mode}"]`).classList.add('active');

        // Update visibility
        document.getElementById('jsonSingleMode').classList.toggle('hidden', mode !== 'single');
        document.getElementById('jsonCompareMode').classList.toggle('hidden', mode !== 'compare');
        document.getElementById('jsonTreeMode').classList.toggle('hidden', mode !== 'tree');

        if (mode === 'single' && !this.editor) {
            this.initializeSingleEditor();
        } else if (mode === 'tree' && !this.treeEditor) {
            this.initializeTreeEditor();
        }
    }

    initializeEditors() {
        this.initializeSingleEditor();
    }

    initializeSingleEditor() {
        const container = document.getElementById('jsonEditor');
        if (!container.hasChildNodes()) {
            this.editor = new JSONEditor(container, {
                mode: 'code',
                indentation: 2,
                theme: 'dark',
                onChangeText: (text) => this.validateJSON(text)
            });
        }
    }

    initializeTreeEditor() {
        const container = document.getElementById('jsonTreeEditor');
        if (!container.hasChildNodes()) {
            this.treeEditor = new JSONEditor(container, {
                mode: 'tree',
                indentation: 2,
                theme: 'dark'
            });
        }
    }

    setupEventListeners() {
        document.getElementById('jsonFormat').addEventListener('click', () => this.formatJSON());
        document.getElementById('jsonMinify').addEventListener('click', () => this.minifyJSON());
        document.getElementById('jsonCompare').addEventListener('click', () => this.compareJSON());
    }

    formatJSON() {
        if (this.currentMode === 'single' && this.editor) {
            try {
                const current = this.editor.getText();
                const formatted = DevFusionUtils.formatJSON(current, 2);
                this.editor.setText(formatted);
                DevFusionUtils.showToast('JSON formatted', 'success');
            } catch (error) {
                DevFusionUtils.showToast('Invalid JSON', 'error');
            }
        }
    }

    minifyJSON() {
        if (this.currentMode === 'single' && this.editor) {
            try {
                const current = this.editor.getText();
                const minified = DevFusionUtils.minifyJSON(current);
                this.editor.setText(minified);
                DevFusionUtils.showToast('JSON minified', 'success');
            } catch (error) {
                DevFusionUtils.showToast('Invalid JSON', 'error');
            }
        }
    }

    compareJSON() {
        if (this.currentMode !== 'compare') {
            DevFusionUtils.showToast('Switch to Compare mode first', 'info');
            return;
        }

        const jsonAText = document.getElementById('jsonA').value;
        const jsonBText = document.getElementById('jsonB').value;

        const validationA = DevFusionUtils.validateJSON(jsonAText);
        const validationB = DevFusionUtils.validateJSON(jsonBText);

        if (!validationA.valid) {
            DevFusionUtils.showToast('Invalid JSON A: ' + validationA.error, 'error');
            return;
        }

        if (!validationB.valid) {
            DevFusionUtils.showToast('Invalid JSON B: ' + validationB.error, 'error');
            return;
        }

        const objA = JSON.parse(jsonAText);
        const objB = JSON.parse(jsonBText);
        const differences = DevFusionUtils.compareJSONObjects(objA, objB);

        this.displayJSONDifferences(differences);
    }

    displayJSONDifferences(differences) {
        let html = '';

        if (differences.length === 0) {
            html = '<div style="padding: 1.5rem; text-align: center; color: var(--success-color);"><i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 1rem;"></i><p>JSON objects are identical</p></div>';
        } else {
            differences.forEach(diff => {
                const typeClass = diff.type === 'added' ? 'added' : diff.type === 'removed' ? 'removed' : 'modified';
                const typeIcon = diff.type === 'added' ? '➕' : diff.type === 'removed' ? '➖' : '✏️';
                
                const oldValue = diff.oldValue !== undefined ? JSON.stringify(diff.oldValue) : 'undefined';
                const newValue = diff.newValue !== undefined ? JSON.stringify(diff.newValue) : 'undefined';

                html += `
                    <div class="json-diff-item ${typeClass}">
                        <div style="margin-bottom: 0.5rem; font-weight: 700;">${typeIcon} ${diff.path}</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.875rem;">
                            <div>
                                <span style="color: var(--text-muted);">Old:</span>
                                <code style="color: var(--text-primary);">${DevFusionUtils.escapeHtml(oldValue)}</code>
                            </div>
                            <div>
                                <span style="color: var(--text-muted);">New:</span>
                                <code style="color: var(--text-primary);">${DevFusionUtils.escapeHtml(newValue)}</code>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        document.getElementById('jsonDiffResult').innerHTML = html;
    }

    validateJSON(text) {
        const validation = DevFusionUtils.validateJSON(text);
        if (!validation.valid) {
            // Show error indicator
        }
        return validation.valid;
    }
}

// Initialize module
document.addEventListener('DOMContentLoaded', () => {
    window.jsonToolsModule = new JSONToolsModule();
});