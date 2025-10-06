// Advanced News Fetching System
class NewsFetcher {
    constructor() {
        this.cache = new Map();
        this.isOnline = navigator.onLine;
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    }

    handleOnline() {
        this.isOnline = true;
        console.log('📡 Connection restored - resuming news updates');
        this.notifyUser('Connection restored', 'success');
    }

    handleOffline() {
        this.isOnline = false;
        console.log('⚠️ Connection lost - using cached news');
        this.notifyUser('Using cached news - offline mode', 'warning');
    }

    notifyUser(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 3000);
    }

    // Main news fetching function
    async fetchNews(category = 'all') {
        try {
            // Show loading state
            this.showLoading(true);

            // Check cache first
            const cached = this.getCachedNews(category);
            if (cached && this.shouldUseCache()) {
                console.log('📦 Using cached news data');
                return cached;
            }

            // Fetch fresh news
            const newsData = await this.fetchFromMultipleSources(category);
            
            // Cache the results
            this.cacheNews(category, newsData);
            
            // Update last updated time
            this.updateLastUpdated();
            
            return newsData;

        } catch (error) {
            console.error('❌ Error fetching news:', error);
            return this.getFallbackNews(category);
        } finally {
            this.showLoading(false);
        }
    }

    async fetchFromMultipleSources(category) {
        const sources = [
            this.fetchFromAPI(category),
            this.fetchFromRSS(category),
            this.fetchFromBackup(category)
        ];

        // Race between sources with timeout
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 10000)
        );

        try {
            const news = await Promise.race([
                Promise.any(sources),
                timeoutPromise
            ]);
            return news;
        } catch (error) {
            return this.generateDemoNews(category);
        }
    }

    async fetchFromAPI(category) {
        // In a real implementation, this would call actual news APIs
        // For demo, we'll use generated news
        return this.generateDemoNews(category);
    }

    generateDemoNews(category) {
        const categories = {
            tech: this.generateTechNews(),
            world: this.generateWorldNews(),
            movies: this.generateMovieNews(),
            all: [...this.generateTechNews(), ...this.generateWorldNews(), ...this.generateMovieNews()]
        };

        return categories[category] || categories.all;
    }

    generateTechNews() {
        return [
            {
                id: this.generateId(),
                title: "OpenAI Launches GPT-5 With Multimodal Capabilities",
                summary: "The new AI model can process text, images, and audio simultaneously, revolutionizing human-computer interaction.",
                content: "OpenAI has officially launched GPT-5, featuring advanced multimodal capabilities that allow it to understand and generate content across different media types.",
                category: "tech",
                source: "AI NewsMod",
                author: "AI Reporter",
                image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
                url: "#tech-1",
                publishedAt: new Date().toISOString(),
                readTime: "2 min",
                tags: ["AI", "OpenAI", "GPT-5", "Technology"],
                sentiment: "positive",
                isBreaking: true,
                isTrending: true
            },
            {
                id: this.generateId(),
                title: "Quantum Computer Breaks Encryption Record",
                summary: "Researchers achieve breakthrough in quantum computing, potentially transforming cybersecurity landscape.",
                content: "A team of scientists has demonstrated quantum supremacy in breaking traditional encryption methods faster than ever before.",
                category: "tech",
                source: "Tech Insights",
                author: "Dr. Sarah Chen",
                image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
                url: "#tech-2",
                publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                readTime: "3 min",
                tags: ["Quantum", "Security", "Encryption"],
                sentiment: "neutral",
                isBreaking: false,
                isTrending: true
            }
        ];
    }

    generateWorldNews() {
        return [
            {
                id: this.generateId(),
                title: "Global Climate Summit Reaches Historic Agreement",
                summary: "World leaders commit to ambitious carbon neutrality targets by 2040 in landmark environmental pact.",
                content: "The international community has united behind a comprehensive plan to combat climate change with binding commitments.",
                category: "world",
                source: "Global News Network",
                author: "Environmental Desk",
                image: "https://images.unsplash.com/photo-1569163139394-de44cb54d521?w=400",
                url: "#world-1",
                publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                readTime: "4 min",
                tags: ["Climate", "Politics", "Environment"],
                sentiment: "positive",
                isBreaking: true,
                isTrending: false
            }
        ];
    }

    generateMovieNews() {
        return [
            {
                id: this.generateId(),
                title: "Marvel Announces Phase 6 With AI-Generated Scripts",
                summary: "Studio reveals ambitious plan incorporating artificial intelligence in screenplay development process.",
                content: "Marvel Studios is pushing technological boundaries by integrating AI tools in their creative writing process.",
                category: "movies",
                source: "Entertainment Today",
                author: "Film Critic",
                image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400",
                url: "#movies-1",
                publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                readTime: "2 min",
                tags: ["Marvel", "AI", "Movies", "Innovation"],
                sentiment: "neutral",
                isBreaking: false,
                isTrending: true
            }
        ];
    }

    getCachedNews(category) {
        const cached = localStorage.getItem(`news_${category}`);
        if (cached) {
            const data = JSON.parse(cached);
            // Check if cache is still valid (15 minutes)
            if (Date.now() - data.timestamp < 15 * 60 * 1000) {
                return data.news;
            }
        }
        return null;
    }

    cacheNews(category, news) {
        const cacheData = {
            news,
            timestamp: Date.now()
        };
        localStorage.setItem(`news_${category}`, JSON.stringify(cacheData));
    }

    shouldUseCache() {
        return !this.isOnline || document.visibilityState === 'hidden';
    }

    getFallbackNews(category) {
        console.log('🔄 Using fallback news data');
        return this.generateDemoNews(category).slice(0, 5);
    }

    updateLastUpdated() {
        const now = new Date();
        document.getElementById('last-updated').textContent = 
            now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    showLoading(show) {
        const spinner = document.getElementById('loading-spinner');
        const container = document.getElementById('news-container');
        
        if (show) {
            spinner.classList.remove('hidden');
            container.classList.add('hidden');
        } else {
            spinner.classList.add('hidden');
            container.classList.remove('hidden');
        }
    }

    generateId() {
        return 'news_' + Math.random().toString(36).substr(2, 9);
    }
}

// Initialize news fetcher
const newsFetcher = new NewsFetcher();