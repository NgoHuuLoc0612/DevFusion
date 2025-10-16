// DevFusion - Text Analyzer Module

class TextAnalyzerModule {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('analyzeText').addEventListener('click', () => this.analyzeText());
        
        // Auto-analyze on input (debounced)
        const debouncedAnalyze = DevFusionUtils.debounce(() => this.analyzeText(), 500);
        document.getElementById('analyzerInput').addEventListener('input', debouncedAnalyze);
    }

    analyzeText() {
        const text = document.getElementById('analyzerInput').value;

        if (!text) {
            DevFusionUtils.showToast('Enter text to analyze', 'info');
            return;
        }

        const analysis = this.performAnalysis(text);
        this.displayAnalysis(analysis);
    }

    performAnalysis(text) {
        const lines = text.split('\n');
        const words = text.trim().split(/\s+/).filter(w => w.length > 0);
        const characters = text.length;
        const nonWhitespaceChars = text.replace(/\s/g, '').length;
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

        // Find duplicates
        const lineMap = new Map();
        const duplicates = [];
        lines.forEach((line, idx) => {
            if (line.trim()) {
                if (lineMap.has(line)) {
                    duplicates.push({
                        line: line.substring(0, 100),
                        count: 2
                    });
                } else {
                    lineMap.set(line, idx);
                }
            }
        });

        // Word frequency
        const wordFrequency = new Map();
        words.forEach(word => {
            const lower = word.toLowerCase();
            wordFrequency.set(lower, (wordFrequency.get(lower) || 0) + 1);
        });

        // Sort by frequency
        const sortedWords = Array.from(wordFrequency.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        // Find longest and shortest words
        const sortedByLength = words.sort((a, b) => b.length - a.length);
        const longestWord = sortedByLength[0];
        const shortestWord = sortedByLength[sortedByLength.length - 1];

        return {
            lines: lines.length,
            words: words.length,
            characters,
            nonWhitespaceChars,
            paragraphs,
            duplicateCount: duplicates.length,
            wordFrequency: sortedWords,
            longestWord,
            shortestWord,
            avgWordLength: words.length > 0 ? (characters / words.length).toFixed(2) : 0
        };
    }

    displayAnalysis(analysis) {
        // Update stats
        document.getElementById('statLines').textContent = analysis.lines;
        document.getElementById('statWords').textContent = analysis.words;
        document.getElementById('statChars').textContent = analysis.characters;
        document.getElementById('statNonWhitespace').textContent = analysis.nonWhitespaceChars;
        document.getElementById('statDuplicates').textContent = analysis.duplicateCount;
        document.getElementById('statParagraphs').textContent = analysis.paragraphs;

        // Word statistics
        let wordStatsHtml = `
            <div class="item">
                <span>Average word length:</span>
                <span class="value">${analysis.avgWordLength} characters</span>
            </div>
            <div class="item">
                <span>Longest word:</span>
                <span class="value">${analysis.longestWord} (${analysis.longestWord.length} chars)</span>
            </div>
            <div class="item">
                <span>Shortest word:</span>
                <span class="value">${analysis.shortestWord} (${analysis.shortestWord.length} chars)</span>
            </div>
        `;
        document.getElementById('wordStats').innerHTML = wordStatsHtml;

        // Frequency statistics
        let freqHtml = '';
        analysis.wordFrequency.forEach(([word, count]) => {
            freqHtml += `
                <div class="item">
                    <span>${DevFusionUtils.escapeHtml(word)}</span>
                    <span class="value">${count}x</span>
                </div>
            `;
        });
        document.getElementById('frequencyStats').innerHTML = freqHtml;

        // Duplicate lines
        let dupHtml = analysis.duplicateCount > 0 
            ? '<div class="item"><span>Found ' + analysis.duplicateCount + ' duplicate lines</span></div>'
            : '<div class="item" style="color: var(--success-color);"><span>No duplicate lines found</span></div>';
        document.getElementById('duplicateLines').innerHTML = dupHtml;
    }
}

// Initialize module
document.addEventListener('DOMContentLoaded', () => {
    window.textAnalyzerModule = new TextAnalyzerModule();
});