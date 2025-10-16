// DevFusion - Main Application Controller

class DevFusionApp {
    constructor() {
        this.currentTool = 'diff-viewer';
        this.isDarkMode = true;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadTheme();
        this.setupToolNavigation();
        this.setupCopyToClipboard();
        this.initializeTools();
    }

    setupEventListeners() {
        // Theme Toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // Terminal Toggle
        document.getElementById('terminalToggle').addEventListener('click', () => this.toggleTerminal());
        
        // Keyboard Shortcut for Terminal
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === '`') {
                e.preventDefault();
                this.toggleTerminal();
            }
        });

        // Terminal Close
        document.getElementById('terminalClose').addEventListener('click', () => this.toggleTerminal());
    }

    setupToolNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const tool = e.currentTarget.dataset.tool;
                this.switchTool(tool);
            });
        });
    }

    switchTool(toolName) {
        // Hide all tools
        document.querySelectorAll('.tool-container').forEach(container => {
            container.classList.remove('active');
        });

        // Remove active from nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Show selected tool
        const toolContainer = document.getElementById(toolName);
        if (toolContainer) {
            toolContainer.classList.add('active');
            this.currentTool = toolName;

            // Mark nav link as active
            document.querySelector(`[data-tool="${toolName}"]`).classList.add('active');

            // Trigger tool initialization if needed
            this.triggerToolInit(toolName);
        }
    }

    triggerToolInit(toolName) {
        // Tools will hook into this when they need to be initialized
        const event = new CustomEvent('toolInitialized', { detail: { tool: toolName } });
        document.dispatchEvent(event);
    }

    setupCopyToClipboard() {
        document.addEventListener('click', async (e) => {
            if (e.target.classList.contains('btn-icon') && e.target.dataset.copy) {
                const elementId = e.target.dataset.copy;
                const element = document.getElementById(elementId);
                if (element) {
                    const text = element.value || element.textContent;
                    await DevFusionUtils.copyToClipboard(text);
                }
            }
        });
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        const theme = this.isDarkMode ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('devfusion_theme', theme);
        
        const icon = document.getElementById('themeToggle').querySelector('i');
        icon.className = this.isDarkMode ? 'fas fa-moon' : 'fas fa-sun';
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('devfusion_theme') || 'dark';
        this.isDarkMode = savedTheme === 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const icon = document.getElementById('themeToggle').querySelector('i');
        icon.className = this.isDarkMode ? 'fas fa-moon' : 'fas fa-sun';
    }

    toggleTerminal() {
        const terminal = document.getElementById('terminalOverlay');
        terminal.classList.toggle('active');
        
        if (terminal.classList.contains('active')) {
            document.getElementById('terminalInput').focus();
        }
    }

    initializeTools() {
        // Initialize all tool modules
        // They will attach themselves to the window or document
        console.log('DevFusion v2.1.0 initialized');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DevFusionApp();
    console.log('DevFusion application started');
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('DevFusion Error:', event.error);
    DevFusionUtils.showToast('An error occurred', 'error');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    DevFusionUtils.showToast('An error occurred', 'error');
});