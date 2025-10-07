// Settings Management System
class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.currentTab = 'appearance';
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.loadCurrentSettings();
        this.setupEventListeners();
        this.setupSaveReset();
    }

    setupTabNavigation() {
        // Tab switching
        document.querySelectorAll('.sidebar-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.sidebar-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Show selected tab content
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;
    }

    loadSettings() {
        const saved = localStorage.getItem('ainewsmod_settings');
        if (saved) {
            return JSON.parse(saved);
        }

        // Default settings
        return {
            appearance: {
                theme: 'auto',
                layout: 'grid',
                fontSize: 'medium',
                animations: true
            },
            content: {
                categories: ['technology', 'world', 'entertainment'],
                breakingNews: true,
                trendingTopics: true,
                aiSummaries: true,
                newsPerPage: 20,
                refreshInterval: 600000
            },
            notifications: {
                pushEnabled: false,
                breakingAlerts: true,
                trendingAlerts: false,
                personalizedAlerts: false,
                quietStart: '22:00',
                quietEnd: '07:00',
                sound: true,
                vibration: false
            },
            ai: {
                assistant: true,
                summarization: true,
                summaryLength: 'short',
                predictions: true,
                voiceNews: true,
                voiceSpeed: 1,
                language: 'en'
            },
            privacy: {
                analytics: true,
                personalized: true,
                searchHistory: true,
                analyticsCookies: true,
                marketingCookies: false
            },
            account: {
                displayName: '',
                email: ''
            },
            storage: {
                dataSaver: false,
                offlineReading: true,
                offlineLimit: 25,
                cacheClear: 'weekly'
            }
        };
    }

    loadCurrentSettings() {
        // Load all settings into UI
        this.loadAppearanceSettings();
        this.loadContentSettings();
        this.loadNotificationSettings();
        this.loadAISettings();
        this.loadPrivacySettings();
        this.loadAccountSettings();
        this.loadStorageSettings();
    }

    loadAppearanceSettings() {
        const { appearance } = this.settings;
        
        // Theme
        document.querySelector(`input[name="theme"][value="${appearance.theme}"]`).checked = true;
        
        // Layout
        document.querySelector(`input[name="layout"][value="${appearance.layout}"]`).checked = true;
        
        // Font size
        document.querySelector(`.font-btn[data-size="${appearance.fontSize}"]`).classList.add('active');
        
        // Animations
        document.getElementById('animations').checked = appearance.animations;
    }

    loadContentSettings() {
        const { content } = this.settings;
        
        // Categories
        document.querySelectorAll('input[name="categories"]').forEach(checkbox => {
            checkbox.checked = content.categories.includes(checkbox.value);
        });
        
        // Content filters
        document.getElementById('breaking-news').checked = content.breakingNews;
        document.getElementById('trending-topics').checked = content.trendingTopics;
        document.getElementById('ai-summaries').checked = content.aiSummaries;
        
        // Preferences
        document.getElementById('news-per-page').value = content.newsPerPage;
        document.getElementById('refresh-interval').value = content.refreshInterval;
    }

    loadNotificationSettings() {
        const { notifications } = this.settings;
        
        document.getElementById('push-notifications').checked = notifications.pushEnabled;
        document.getElementById('breaking-alerts').checked = notifications.breakingAlerts;
        document.getElementById('trending-alerts').checked = notifications.trendingAlerts;
        document.getElementById('personalized-alerts').checked = notifications.personalizedAlerts;
        document.getElementById('quiet-start').value = notifications.quietStart;
        document.getElementById('quiet-end').value = notifications.quietEnd;
        document.getElementById('notification-sound').checked = notifications.sound;
        document.getElementById('notification-vibration').checked = notifications.vibration;
    }

    loadAISettings() {
        const { ai } = this.settings;
        
        document.getElementById('ai-assistant').checked = ai.assistant;
        document.getElementById('ai-summarization').checked = ai.summarization;
        document.querySelector(`input[name="summary-length"][value="${ai.summaryLength}"]`).checked = true;
        document.getElementById('ai-predictions').checked = ai.predictions;
        document.getElementById('voice-news').checked = ai.voiceNews;
        document.getElementById('voice-speed').value = ai.voiceSpeed;
        document.getElementById('preferred-language').value = ai.language;
    }

    loadPrivacySettings() {
        const { privacy } = this.settings;
        
        document.getElementById('analytics-tracking').checked = privacy.analytics;
        document.getElementById('personalized-ads').checked = privacy.personalized;
        document.getElementById('save-search-history').checked = privacy.searchHistory;
        document.getElementById('analytics-cookies').checked = privacy.analyticsCookies;
        document.getElementById('marketing-cookies').checked = privacy.marketingCookies;
    }

    loadAccountSettings() {
        const { account } = this.settings;
        
        if (account.displayName) {
            document.getElementById('display-name').value = account.displayName;
        }
        if (account.email) {
            document.getElementById('email').value = account.email;
        }
    }

    loadStorageSettings() {
        const { storage } = this.settings;
        
        document.getElementById('data-saver').checked = storage.dataSaver;
        document.getElementById('offline-reading').checked = storage.offlineReading;
        document.getElementById('offline-limit').value = storage.offlineLimit;
        document.getElementById('cache-clear').value = storage.cacheClear;
    }

    setupEventListeners() {
        // Theme selection
        document.querySelectorAll('input[name="theme"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.settings.appearance.theme = e.target.value;
                this.applyTheme(e.target.value);
            });
        });

        // Font size selection
        document.querySelectorAll('.font-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.settings.appearance.fontSize = e.target.dataset.size;
                this.applyFontSize(e.target.dataset.size);
            });
        });

        // Category selection
        document.querySelectorAll('input[name="categories"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateCategories();
            });
        });

        // Real-time setting updates
        document.querySelectorAll('input[type="checkbox"], input[type="radio"], select').forEach(element => {
            element.addEventListener('change', () => {
                this.saveSettings();
            });
        });
    }

    setupSaveReset() {
        // Save all settings
        document.getElementById('save-settings').addEventListener('click', () => {
            this.saveAllSettings();
            this.showNotification('Settings saved successfully!', 'success');
        });

        // Reset to defaults
        document.getElementById('reset-settings').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all settings to default?')) {
                this.resetToDefaults();
                this.showNotification('Settings reset to defaults!', 'success');
            }
        });

        // Clear cache
        document.getElementById('clear-cache').addEventListener('click', () => {
            this.clearCache();
        });

        // Clear history
        document.getElementById('clear-history').addEventListener('click', () => {
            this.clearSearchHistory();
        });
    }

    saveAllSettings() {
        // Save appearance
        this.settings.appearance.theme = document.querySelector('input[name="theme"]:checked').value;
        this.settings.appearance.layout = document.querySelector('input[name="layout"]:checked').value;
        this.settings.appearance.fontSize = document.querySelector('.font-btn.active').dataset.size;
        this.settings.appearance.animations = document.getElementById('animations').checked;

        // Save content
        this.settings.content.breakingNews = document.getElementById('breaking-news').checked;
        this.settings.content.trendingTopics = document.getElementById('trending-topics').checked;
        this.settings.content.aiSummaries = document.getElementById('ai-summaries').checked;
        this.settings.content.newsPerPage = parseInt(document.getElementById('news-per-page').value);
        this.settings.content.refreshInterval = parseInt(document.getElementById('refresh-interval').value);

        // Save AI settings
        this.settings.ai.assistant = document.getElementById('ai-assistant').checked;
        this.settings.ai.summarization = document.getElementById('ai-summarization').checked;
        this.settings.ai.summaryLength = document.querySelector('input[name="summary-length"]:checked').value;
        this.settings.ai.predictions = document.getElementById('ai-predictions').checked;
        this.settings.ai.voiceNews = document.getElementById('voice-news').checked;
        this.settings.ai.voiceSpeed = parseFloat(document.getElementById('voice-speed').value);
        this.settings.ai.language = document.getElementById('preferred-language').value;

        this.saveSettings();
    }

    saveSettings() {
        localStorage.setItem('ainewsmod_settings', JSON.stringify(this.settings));
    }

    updateCategories() {
        const selectedCategories = Array.from(document.querySelectorAll('input[name="categories"]:checked'))
            .map(checkbox => checkbox.value);
        this.settings.content.categories = selectedCategories;
        this.saveSettings();
    }

    applyTheme(theme) {
        if (theme === 'auto') {
            // Use system preference
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }

    applyFontSize(size) {
        const sizes = {
            small: '14px',
            medium: '16px',
            large: '18px',
            xlarge: '20px'
        };
        document.documentElement.style.fontSize = sizes[size];
    }

    resetToDefaults() {
        localStorage.removeItem('ainewsmod_settings');
        this.settings = this.loadSettings();
        this.loadCurrentSettings();
        this.saveSettings();
    }

    clearCache() {
        // Clear various caches
        localStorage.removeItem('news_cache');
        localStorage.removeItem('image_cache');
        this.showNotification('Cache cleared successfully!', 'success');
    }

    clearSearchHistory() {
        localStorage.removeItem('search_history');
        this.showNotification('Search history cleared!', 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `settings-notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize Settings Manager
const settingsManager = new SettingsManager();