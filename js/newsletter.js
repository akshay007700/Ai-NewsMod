// Advanced Newsletter Management System
class NewsletterManager {
    constructor() {
        this.subscribers = this.loadSubscribers();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateSubscriberCount();
        this.loadNewsletterStats();
    }

    setupEventListeners() {
        // Newsletter form submission
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleSubscription(e));
        }

        // Preference changes
        document.querySelectorAll('input[name="categories"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updatePreferences());
        });

        // Frequency changes
        document.querySelectorAll('input[name="frequency"]').forEach(radio => {
            radio.addEventListener('change', () => this.updateFrequency());
        });
    }

    handleSubscription(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const name = formData.get('name') || 'Subscriber';
        const categories = this.getSelectedCategories();
        const frequency = formData.get('frequency');

        if (this.validateEmail(email)) {
            this.addSubscriber(email, name, categories, frequency);
            this.showSuccess('Successfully subscribed to newsletter!');
            event.target.reset();
            
            // Simulate sending welcome email
            this.sendWelcomeEmail(email, name);
        } else {
            this.showError('Please enter a valid email address.');
        }
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    getSelectedCategories() {
        const checkboxes = document.querySelectorAll('input[name="categories"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    addSubscriber(email, name, categories, frequency) {
        const subscriber = {
            id: this.generateId(),
            email: email,
            name: name,
            categories: categories,
            frequency: frequency,
            subscribedAt: new Date().toISOString(),
            isActive: true,
            lastSent: null,
            openRate: 0,
            clickRate: 0
        };

        // Check if already subscribed
        const existingIndex = this.subscribers.findIndex(sub => sub.email === email);
        if (existingIndex !== -1) {
            this.subscribers[existingIndex] = subscriber;
        } else {
            this.subscribers.push(subscriber);
        }

        this.saveSubscribers();
        this.updateSubscriberCount();
        
        // Trigger welcome sequence
        this.triggerWelcomeSequence(subscriber);
    }

    removeSubscriber(email) {
        this.subscribers = this.subscribers.filter(sub => sub.email !== email);
        this.saveSubscribers();
        this.updateSubscriberCount();
    }

    loadSubscribers() {
        const stored = localStorage.getItem('newsletter_subscribers');
        return stored ? JSON.parse(stored) : [];
    }

    saveSubscribers() {
        localStorage.setItem('newsletter_subscribers', JSON.stringify(this.subscribers));
    }

    updateSubscriberCount() {
        const countElement = document.getElementById('subscriber-count');
        if (countElement) {
            countElement.textContent = this.subscribers.length.toLocaleString();
        }
    }

    generateId() {
        return 'sub_' + Math.random().toString(36).substr(2, 9);
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove
        setTimeout(() => {
            toast.classList.add('toast-hiding');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    async sendWelcomeEmail(email, name) {
        // Simulate email sending
        console.log(`📧 Welcome email sent to: ${email}`);
        
        // In real implementation, integrate with email service
        // like SendGrid, Mailchimp, or AWS SES
    }

    triggerWelcomeSequence(subscriber) {
        // Schedule welcome emails
        setTimeout(() => {
            this.sendPersonalizedNewsletter(subscriber, 'welcome');
        }, 1000);
    }

    // AI-Powered Newsletter Generation
    async generateNewsletterContent(categories, frequency) {
        try {
            // Fetch relevant news based on categories
            const news = await this.fetchNewsForCategories(categories);
            
            // Generate AI summary
            const summary = await this.generateAISummary(news, frequency);
            
            // Create newsletter structure
            const newsletter = {
                subject: this.generateSubject(categories, frequency),
                preview: summary.substring(0, 150) + '...',
                content: this.formatNewsletterContent(news, summary),
                sentAt: new Date().toISOString(),
                category: categories.join(', '),
                frequency: frequency
            };
            
            return newsletter;
        } catch (error) {
            console.error('Error generating newsletter:', error);
            return this.getFallbackNewsletter();
        }
    }

    async fetchNewsForCategories(categories) {
        // Use existing news fetcher
        const allNews = [];
        
        for (const category of categories) {
            const news = await newsFetcher.fetchNews(category);
            allNews.push(...news.slice(0, 3)); // Top 3 from each category
        }
        
        return allNews.sort(() => Math.random() - 0.5).slice(0, 5); // Shuffle and take 5
    }

    async generateAISummary(news, frequency) {
        const newsText = news.map(item => 
            `${item.title}: ${item.summary}`
        ).join('\n\n');

        // Use AI summarizer
        return await aiSummarizer.summarizeContent(newsText, 'Newsletter Summary');
    }

    generateSubject(categories, frequency) {
        const timeMap = {
            daily: "Morning Brief",
            weekly: "Weekly Roundup", 
            breaking: "Breaking News"
        };
        
        const categoryStr = categories.length === 1 ? categories[0] : 'Multi-Category';
        return `🗞️ ${timeMap[frequency]} - ${categoryStr} News`;
    }

    formatNewsletterContent(news, summary) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #2563eb;">📰 Your AI NewsMod Digest</h1>
                <p style="color: #6b7280; font-size: 16px;">${summary}</p>
                
                ${news.map(item => `
                    <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #2563eb; background: #f8fafc;">
                        <h3 style="margin: 0 0 10px 0; color: #1f2937;">${item.title}</h3>
                        <p style="margin: 0; color: #6b7280;">${item.summary}</p>
                        <div style="margin-top: 10px; font-size: 12px; color: #9ca3af;">
                            📍 ${item.category} • ⏰ ${newsRenderer.getTimeAgo(item.publishedAt)}
                        </div>
                    </div>
                `).join('')}
                
                <div style="margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 8px;">
                    <p style="margin: 0; color: #0369a1;">
                        <strong>AI Analysis:</strong> This newsletter was automatically generated and curated by AI algorithms.
                    </p>
                </div>
                
                <div style="margin-top: 20px; text-align: center; color: #6b7280; font-size: 12px;">
                    <p>You received this email because you subscribed to AI NewsMod newsletter.</p>
                    <p>
                        <a href="#" style="color: #2563eb;">Update Preferences</a> | 
                        <a href="#" style="color: #2563eb;">Unsubscribe</a>
                    </p>
                </div>
            </div>
        `;
    }

    getFallbackNewsletter() {
        return {
            subject: "🗞️ Your AI NewsMod Update",
            preview: "Latest news curated by AI...",
            content: "<p>Unable to generate newsletter content at the moment.</p>"
        };
    }

    // Automated Newsletter Sending
    startNewsletterScheduler() {
        // Check every hour if it's time to send newsletters
        setInterval(() => {
            this.sendScheduledNewsletters();
        }, 60 * 60 * 1000); // 1 hour
    }

    async sendScheduledNewsletters() {
        const now = new Date();
        const currentHour = now.getHours();
        
        // Send daily newsletters at 8 AM
        if (currentHour === 8) {
            const dailySubscribers = this.subscribers.filter(sub => 
                sub.frequency === 'daily' && sub.isActive
            );
            
            for (const subscriber of dailySubscribers) {
                await this.sendPersonalizedNewsletter(subscriber, 'daily');
            }
        }
        
        // Send weekly newsletters on Monday at 9 AM
        if (now.getDay() === 1 && currentHour === 9) {
            const weeklySubscribers = this.subscribers.filter(sub => 
                sub.frequency === 'weekly' && sub.isActive
            );
            
            for (const subscriber of weeklySubscribers) {
                await this.sendPersonalizedNewsletter(subscriber, 'weekly');
            }
        }
    }

    async sendPersonalizedNewsletter(subscriber, type) {
        try {
            const newsletter = await this.generateNewsletterContent(
                subscriber.categories, 
                subscriber.frequency
            );
            
            // Simulate sending email
            console.log(`📧 Sending ${type} newsletter to: ${subscriber.email}`);
            console.log('Subject:', newsletter.subject);
            console.log('Content length:', newsletter.content.length);
            
            // Update subscriber stats
            subscriber.lastSent = new Date().toISOString();
            this.saveSubscribers();
            
            return true;
        } catch (error) {
            console.error('Failed to send newsletter:', error);
            return false;
        }
    }

    loadNewsletterStats() {
        // Load and display newsletter statistics
        const stats = this.calculateStats();
        this.displayStats(stats);
    }

    calculateStats() {
        const totalSubscribers = this.subscribers.length;
        const activeSubscribers = this.subscribers.filter(sub => sub.isActive).length;
        const dailySubscribers = this.subscribers.filter(sub => sub.frequency === 'daily').length;
        
        return {
            total: totalSubscribers,
            active: activeSubscribers,
            daily: dailySubscribers,
            weekly: this.subscribers.filter(sub => sub.frequency === 'weekly').length,
            breaking: this.subscribers.filter(sub => sub.frequency === 'breaking').length
        };
    }

    displayStats(stats) {
        // Update stats in UI if needed
        console.log('Newsletter Stats:', stats);
    }
}

// Initialize Newsletter Manager
const newsletterManager = new NewsletterManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NewsletterManager;
}