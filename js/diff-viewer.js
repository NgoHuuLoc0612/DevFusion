// DevFusion - Diff Viewer Module

class DiffViewerModule {
    constructor() {
        this.dmp = new diff_match_patch();
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('diffCompare').addEventListener('click', () => this.performDiff());
        document.getElementById('diffClear').addEventListener('click', () => this.clearDiff());
        document.getElementById('uploadOriginal').addEventListener('click', () => 
            document.querySelector('#diff-viewer input[type="file"]') || this.createFileInput('original')
        );
        document.getElementById('uploadModified').addEventListener('click', () => 
            document.querySelector('#diff-viewer input[type="file"]') || this.createFileInput('modified')
        );

        // File upload handlers
        this.setupFileUpload();

        // Real-time diff on input change (debounced)
        const debouncedDiff = DevFusionUtils.debounce(() => this.performDiff(), 500);
        document.getElementById('diffOriginal').addEventListener('input', debouncedDiff);
        document.getElementById('diffModified').addEventListener('input', debouncedDiff);
    }

    setupFileUpload() {
        // Create file input for original
        const uploadOrigBtn = document.getElementById('uploadOriginal');
        const fileInputOriginal = document.createElement('input');
        fileInputOriginal.type = 'file';
        fileInputOriginal.accept = '.txt,.js,.py,.json,.css,.html,.xml,.md,.java,.cpp,.c,.ts,.jsx,.tsx';
        fileInputOriginal.style.display = 'none';
        fileInputOriginal.addEventListener('change', (e) => this.handleFileUpload(e, 'original'));
        document.body.appendChild(fileInputOriginal);
        uploadOrigBtn.addEventListener('click', () => fileInputOriginal.click());

        // Create file input for modified
        const uploadModBtn = document.getElementById('uploadModified');
        const fileInputModified = document.createElement('input');
        fileInputModified.type = 'file';
        fileInputModified.accept = '.txt,.js,.py,.json,.css,.html,.xml,.md,.java,.cpp,.c,.ts,.jsx,.tsx';
        fileInputModified.style.display = 'none';
        fileInputModified.addEventListener('change', (e) => this.handleFileUpload(e, 'modified'));
        document.body.appendChild(fileInputModified);
        uploadModBtn.addEventListener('click', () => fileInputModified.click());
    }

    handleFileUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        DevFusionUtils.readFile(file).then(content => {
            const textAreaId = type === 'original' ? 'diffOriginal' : 'diffModified';
            document.getElementById(textAreaId).value = content;
            DevFusionUtils.showToast(`${type} file loaded`, 'success');
            this.performDiff();
        }).catch(error => {
            DevFusionUtils.showToast('Error reading file', 'error');
            console.error(error);
        });
    }

    performDiff() {
        const original = document.getElementById('diffOriginal').value;
        const modified = document.getElementById('diffModified').value;

        if (!original || !modified) {
            document.getElementById('diffResult').innerHTML = '<p style="color: var(--text-muted);">Enter both texts to compare</p>';
            return;
        }

        const ignoreWhitespace = document.getElementById('diffIgnoreWhitespace').checked;
        const ignoreCase = document.getElementById('diffIgnoreCase').checked;
        const mode = document.querySelector('input[name="diffMode"]:checked').value;

        let text1 = original;
        let text2 = modified;

        if (ignoreWhitespace) {
            text1 = text1.replace(/\s+/g, ' ').trim();
            text2 = text2.replace(/\s+/g, ' ').trim();
        }

        if (ignoreCase) {
            text1 = text1.toLowerCase();
            text2 = text2.toLowerCase();
        }

        let diffs;
        if (mode === 'line') {
            diffs = this.dmp.diff_linesToCharsMunge_(text1, text2);
            diffs = this.dmp.diff_main(diffs[0], diffs[1], false);
        } else if (mode === 'word') {
            diffs = this.dmp.diff_main(text1, text2, false);
        } else {
            diffs = this.dmp.diff_main(text1, text2, true);
        }

        this.dmp.diff_cleanupSemantic(diffs);
        this.displayDiff(diffs);
        this.calculateStats(diffs, original, modified);
    }

    displayDiff(diffs) {
        let html = '';
        
        diffs.forEach(([type, text]) => {
            let className = '';
            let emoji = '';
            
            if (type === 1) { // Added
                className = 'diff-added';
                emoji = '➕';
            } else if (type === -1) { // Removed
                className = 'diff-removed';
                emoji = '➖';
            } else { // Unchanged
                className = '';
                emoji = '⏹️';
            }

            if (className || true) {
                const escapedText = DevFusionUtils.escapeHtml(text);
                const lines = escapedText.split('\n');
                
                lines.forEach(line => {
                    if (line) {
                        html += `<div class="diff-line ${className}">${emoji} ${line}</div>`;
                    }
                });
            }
        });

        document.getElementById('diffResult').innerHTML = html || '<p>No differences found</p>';
    }

    calculateStats(diffs, original, modified) {
        let added = 0, removed = 0, unchanged = 0;

        diffs.forEach(([type, text]) => {
            const count = text.length;
            if (type === 1) added += count;
            else if (type === -1) removed += count;
            else unchanged += count;
        });

        const similarity = DevFusionUtils.calculateSimilarity(original, modified);

        const stats = `
            <div class="stat-item added"><i class="fas fa-plus"></i> Added: <strong>${added}</strong> chars</div>
            <div class="stat-item removed"><i class="fas fa-minus"></i> Removed: <strong>${removed}</strong> chars</div>
            <div class="stat-item modified"><i class="fas fa-edit"></i> Similarity: <strong>${similarity.toFixed(2)}%</strong></div>
            <div class="stat-item"><i class="fas fa-check"></i> Unchanged: <strong>${unchanged}</strong> chars</div>
        `;

        document.getElementById('diffStats').innerHTML = stats;
    }

    clearDiff() {
        document.getElementById('diffOriginal').value = '';
        document.getElementById('diffModified').value = '';
        document.getElementById('diffResult').innerHTML = '';
        document.getElementById('diffStats').innerHTML = '';
    }
}

// Initialize module
document.addEventListener('DOMContentLoaded', () => {
    window.diffViewerModule = new DiffViewerModule();
});