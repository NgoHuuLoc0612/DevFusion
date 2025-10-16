// DevFusion - File Comparator Module

class FileComparatorModule {
    constructor() {
        this.fileA = null;
        this.fileB = null;
        this.dmp = new diff_match_patch();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragDrop();
    }

    setupEventListeners() {
        document.getElementById('compareFiles').addEventListener('click', () => this.compareFiles());
        document.getElementById('clearFiles').addEventListener('click', () => this.clearFiles());
    }

    setupDragDrop() {
        const uploadZones = document.querySelectorAll('.upload-zone');

        uploadZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('dragover');
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('dragover');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('dragover');

                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    const target = zone.dataset.target;
                    this.handleFileUpload(files[0], target);
                }
            });

            zone.addEventListener('click', (e) => {
                if (e.target.tagName !== 'INPUT') {
                    const input = zone.querySelector('input[type="file"]');
                    if (input) input.click();
                }
            });
        });

        // File input change handlers
        document.getElementById('fileAInput').addEventListener('change', (e) => {
            if (e.target.files[0]) this.handleFileUpload(e.target.files[0], 'fileA');
        });

        document.getElementById('fileBInput').addEventListener('change', (e) => {
            if (e.target.files[0]) this.handleFileUpload(e.target.files[0], 'fileB');
        });
    }

    handleFileUpload(file, target) {
        DevFusionUtils.readFile(file).then(content => {
            if (target === 'fileA') {
                this.fileA = { name: file.name, content };
                this.displayFileInfo('fileAInfo', file.name, content.length);
            } else {
                this.fileB = { name: file.name, content };
                this.displayFileInfo('fileBInfo', file.name, content.length);
            }

            this.updateCompareButton();
            DevFusionUtils.showToast(`${file.name} loaded`, 'success');
        }).catch(error => {
            DevFusionUtils.showToast('Error reading file', 'error');
        });
    }

    displayFileInfo(elementId, filename, size) {
        document.getElementById(elementId).innerHTML = `
            <div class="filename"><i class="fas fa-file"></i> ${filename}</div>
            <div style="font-size: 0.8125rem;">Size: ${DevFusionUtils.formatBytes(size)}</div>
        `;
    }

    updateCompareButton() {
        const btn = document.getElementById('compareFiles');
        btn.disabled = !this.fileA || !this.fileB;
    }

    compareFiles() {
        if (!this.fileA || !this.fileB) {
            DevFusionUtils.showToast('Upload both files to compare', 'info');
            return;
        }

        const diffs = this.dmp.diff_main(this.fileA.content, this.fileB.content);
        this.dmp.diff_cleanupSemantic(diffs);

        this.displayComparison(diffs);
        this.calculateComparationStats(diffs);
    }

    displayComparison(diffs) {
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
            }

            if (className) {
                const escapedText = DevFusionUtils.escapeHtml(text);
                const lines = escapedText.split('\n');

                lines.forEach(line => {
                    if (line) {
                        html += `<div class="diff-line ${className}">${emoji} ${line}</div>`;
                    }
                });
            }
        });

        document.getElementById('fileCompareResult').innerHTML = html || '<p>Files are identical</p>';
    }

    calculateComparationStats(diffs) {
        let added = 0, removed = 0;

        diffs.forEach(([type, text]) => {
            if (type === 1) added += text.length;
            else if (type === -1) removed += text.length;
        });

        const similarity = DevFusionUtils.calculateSimilarity(this.fileA.content, this.fileB.content);
        const totalChars = Math.max(this.fileA.content.length, this.fileB.content.length);
        const changedChars = added + removed;
        const changePercentage = totalChars > 0 ? ((changedChars / totalChars) * 100).toFixed(2) : 0;

        const summary = `
            <div class="summary-item">
                <div class="label">File A</div>
                <div class="value">${this.fileA.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${this.fileA.content.length} chars</div>
            </div>
            <div class="summary-item">
                <div class="label">File B</div>
                <div class="value">${this.fileB.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${this.fileB.content.length} chars</div>
            </div>
            <div class="summary-item">
                <div class="label">Similarity</div>
                <div class="value">${similarity.toFixed(2)}%</div>
            </div>
            <div class="summary-item">
                <div class="label">Changes</div>
                <div class="value">${changePercentage}%</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">+${added} -${removed}</div>
            </div>
        `;

        document.getElementById('fileSummary').innerHTML = summary;
    }

    clearFiles() {
        this.fileA = null;
        this.fileB = null;
        document.getElementById('fileAInfo').innerHTML = '';
        document.getElementById('fileBInfo').innerHTML = '';
        document.getElementById('fileCompareResult').innerHTML = '';
        document.getElementById('fileSummary').innerHTML = '';
        document.getElementById('fileAInput').value = '';
        document.getElementById('fileBInput').value = '';
        this.updateCompareButton();
    }
}

// Initialize module
document.addEventListener('DOMContentLoaded', () => {
    window.fileComparatorModule = new FileComparatorModule();
});