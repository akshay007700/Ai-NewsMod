// Main Application Controller
class AINewsModApp {
    constructor() {
        this.newsFetcher = newsFetcher;
        this.newsRenderer = newsRenderer;
        this.currentCategory = 'all';
        this.isDarkMode = false;
        this.init();
    }

    async init() {
        try {
            console.log('🚀 AI NewsMod Initializing...');
            
            // Initialize components
            await this.initializeApp();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Load initial news
            await this.loadNews();
            
            // Start auto-refresh
            this.startAutoRefresh();
            
            console.log('✅ AI NewsMod Ready!');
            
        } catch (error) {
            console.error('❌ App initialization failed:', error);
            this.handleFatalError(error);
        }
    }

    async initializeApp() {
        // Load saved settings
        this.loadSettings();
        
        // Apply theme
        this.applyTheme();
        
        // Check service worker for PWA capabilities
        this.registerServiceWorker();
        
        // Initialize UI components
        this.initializeUI();
    }

    loadSettings() {
        const savedSettings = localStorage.getItem(CONFIG.STORAGE_KEYS.SETTINGS);
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            this.isDarkMode = settings.darkMode || false;
            this.currentCategory = settings.category || 'all';
        }
    }

    saveSettings() {
        const settings = {
            darkMode: this.isDarkMode,
            category: this.currentCategory,
            lastUpdated: Date.now()
        };
        localStorage.setItem(CONFIG.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }

    applyTheme() {
        const theme = this.isDarkMode ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme button icon
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = this.isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
        this.saveSettings();
        
        // Show theme change notification
        this.showNotification(
            `Switched to ${this.isDarkMode ? 'dark' : 'light'} mode`,
            'success'
        );
    }

    async loadNews(category = this.currentCategory) {
        try {
            // Show loading state
            this.showMainLoading(true);
            
            // Fetch news data
            const newsData = await this.newsFetcher.fetchNews(category);
            
            // Render news
            await this.newsRenderer.renderNews(newsData);
            
            // Update UI state
            this.updateUIAfterLoad();
            
        } catch (error) {
            console.error('❌ Failed to load news:', error);
            this.showNotification('Failed to load news. Please try again.', 'error');
        } finally {
            this.showMainLoading(false);
        }
    }

    showMainLoading(show) {
        const loader = document.getElementById('loading-spinner');
        const container = document.getElementById('news-container');
        
        if (loader && container) {
            loader.classList.toggle('hidden', !show);
            container.classList.toggle('hidden', show);
        }
    }

    updateUIAfterLoad() {
        // Update active nav link
        this.updateActiveNav();
        
        // Update page title
        this.updatePageTitle();
        
        // Show success message
        this.showNotification('News updated successfully!', 'success');
    }

    updateActiveNav() {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current category
        const currentNavLink = document.querySelector(`[href="${this.currentCategory}.html"]`);
        if (currentNavLink) {
            currentNavLink.classList.add('active');
        }
    }

    updatePageTitle() {
        const categoryName = CONFIG.CATEGORIES[this.currentCategory.toUpperCase()]?.name || 'All News';
        document.title = `${categoryName} - ${CONFIG.APP.NAME}`;
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.handleManualRefresh());
        }

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.category;
                this.newsRenderer.updateNewsFilter(filter);
            });
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.getAttribute('href').replace('.html', '');
                this.handleCategoryChange(category);
            });
        });

        // Retry button
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.loadNews());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Visibility change (tab switch)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.handleTabFocus();
            }
        });

        // Online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + R - Refresh
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            this.handleManualRefresh();
        }
        
        // Ctrl/Cmd + D - Toggle dark mode
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            this.toggleTheme();
        }
        
        // Escape - Close modals
        if (e.key === 'Escape') {
            this.closeModals();
        }
    }

    handleManualRefresh() {
        this.loadNews();
        
        // Add spinning animation to refresh button
        const refreshIcon = document.querySelector('#refresh-btn i');
        if (refreshIcon) {
            refreshIcon.style.animation = 'spin 1s linear';
            setTimeout(() => {
                refreshIcon.style.animation = '';
            }, 1000);
        }
    }

    handleCategoryChange(category) {
        this.currentCategory = category;
        this.saveSettings();
        this.loadNews(category);
    }

    handleTabFocus() {
        // Refresh news if it's been a while
        const lastUpdated = localStorage.getItem(CONFIG.STORAGE_KEYS.LAST_UPDATED);
        if (lastUpdated && Date.now() - parseInt(lastUpdated) > 10 * 60 * 1000) {
            this.loadNews();
        }
    }

    handleOnline() {
        this.showNotification('Connection restored. Updating news...', 'success');
        this.loadNews();
    }

    handleOffline() {
        this.showNotification('You are currently offline. Showing cached news.', 'warning');
    }

    startAutoRefresh() {
        if (CONFIG.APP.AUTO_REFRESH) {
            setInterval(() => {
                if (document.visibilityState === 'visible') {
                    this.loadNews();
                }
            }, CONFIG.APP.REFRESH_INTERVAL);
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.app-notification');
        existingNotifications.forEach(notif => notif.remove());

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `app-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('notification-hiding');
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-triangle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    closeModals() {
        const modals = document.querySelectorAll('.news-modal');
        modals.forEach(modal => modal.remove());
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('❌ Service Worker registration failed:', error);
                });
        }
    }

    initializeUI() {
        // Add notification styles
        this.injectNotificationStyles();
        
        // Initialize any third-party libraries
        this.initializeLibraries();
    }

    injectNotificationStyles() {
        const styles = `
            .app-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--bg-card);
                border: 1px solid var(--border-color);
                border-radius: var(--radius);
                padding: 1rem;
                box-shadow: var(--shadow);
                z-index: 10000;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
            }
            
            .notification-success { border-left: 4px solid var(--accent-color); }
            .notification-error { border-left: 4px solid #ef4444; }
            .notification-warning { border-left: 4px solid #f59e0b; }
            .notification-info { border-left: 4px solid var(--primary-color); }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .notification-hiding {
                animation: slideOutRight 0.3s ease;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    initializeLibraries() {
        // Initialize any third-party libraries here
        // Example: analytics, error tracking, etc.
    }

    handleFatalError(error) {
        // Show user-friendly error message
        const errorElement = document.createElement('div');
        errorElement.className = 'fatal-error';
        errorElement.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Something went wrong</h2>
                <p>Please refresh the page or try again later.</p>
                <button onclick="window.location.reload()" class="btn btn-primary">
                    <i class="fas fa-redo"></i> Reload Page
                </button>
            </div>
        `;
        
        document.body.innerHTML = '';
        document.body.appendChild(errorElement);
    }
}

// Additional CSS for notifications and modals
const additionalCSS = `
    .news-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    .modal-content {
        background: var(--bg-card);
        border-radius: var(--radius);
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        animation: scaleIn 0.3s ease;
    }
    
    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-secondary);
    }
    
    .modal-header {
        padding: 2rem 2rem 1rem;
        border-bottom: 1px solid var(--border-color);
    }
    
    .modal-body {
        padding: 1rem 2rem;
    }
    
    .modal-image {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: var(--radius);
        margin-bottom: 1rem;
    }
    
    .modal-footer {
        padding: 1rem 2rem;
        border-top: 1px solid var(--border-color);
        text-align: right;
    }
    
    .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: var(--radius);
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    
    .btn-primary {
        background: var(--primary-color);
        color: white;
    }
    
    .btn-secondary {
        background: var(--bg-secondary);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
    }
    
    .news-tags {
        display: flex;
        gap: 0.5rem;
        margin: 1rem 0;
        flex-wrap: wrap;
    }
    
    .news-tag {
        background: var(--bg-secondary);
        color: var(--text-secondary);
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.75rem;
    }
    
    .news-actions {
        display: flex;
        gap: 0.5rem;
    }
    
    .action-btn {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: all 0.3s ease;
    }
    
    .action-btn:hover {
        color: var(--primary-color);
        background: var(--bg-secondary);
    }
    
    .fatal-error {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: var(--bg-primary);
    }
    
    .error-content {
        text-align: center;
        max-width: 400px;
        padding: 2rem;
    }
    
    .error-content i {
        font-size: 3rem;
        color: #ef4444;
        margin-bottom: 1rem;
    }
    
    @keyframes scaleIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.newsApp = new AINewsModApp();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AINewsModApp;
}