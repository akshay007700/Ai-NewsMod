// Advanced News Fetching System
class NewsFetcher {
    constructor() {
        this.cache = new Map();
        this.isOnline = navigator.onLine;
    }

    async fetchNews(category = 'all') {
        try {
            this.showLoading(true);
            
            // Demo news data - real implementation mein API se aayega
            const newsData = this.generateDemoNews(category);
            
            this.updateLastUpdated();
            return newsData;

        } catch (error) {
            console.error('Error fetching news:', error);
            return this.getFallbackNews(category);
        } finally {
            this.showLoading(false);
        }
    }

    generateDemoNews(category) {
        const allNews = [
            {
                id: '1',
                title: "OpenAI Launches GPT-5 With Multimodal Capabilities",
                summary: "The new AI model can process text, images, and audio simultaneously, revolutionizing human-computer interaction.",
                content: "OpenAI has officially launched GPT-5, featuring advanced multimodal capabilities that allow it to understand and generate content across different media types. This breakthrough represents a significant leap in artificial intelligence technology.",
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
                id: '2',
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
            },
            {
                id: '3',
                title: "Global Climate Summit Reaches Historic Agreement",
                summary: "World leaders commit to ambitious carbon neutrality targets by 2040 in landmark environmental pact.",
                content: "The international community has united behind a comprehensive plan to combat climate change with binding commitments.",
                category: "world",
                source: "Global News Network",
                author: "Environmental Desk",
                image: "https://images.unsplash.com/photo-1569163139394-de44e2b6e7b1?w=400",
                url: "#world-1",
                publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                readTime: "4 min",
                tags: ["Climate", "Politics", "Environment"],
                sentiment: "positive",
                isBreaking: true,
                isTrending: false
            },
            {
                id: '4',
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
            },
            {
                id: '5',
                title: "Breakthrough in Renewable Energy Storage",
                summary: "New battery technology promises to solve renewable energy storage challenges.",
                content: "Scientists develop innovative battery design that could revolutionize how we store solar and wind energy.",
                category: "tech",
                source: "Science Daily",
                author: "Research Team",
                image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400",
                url: "#tech-3",
                publishedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
                readTime: "3 min",
                tags: ["Energy", "Innovation", "Environment"],
                sentiment: "positive",
                isBreaking: false,
                isTrending: true
            }
        ];

        if (category === 'all') return allNews;
        return allNews.filter(item => item.category === category);
    }

    getFallbackNews(category) {
        return this.generateDemoNews(category).slice(0, 3);
    }

    updateLastUpdated() {
        const now = new Date();
        const element = document.getElementById('last-updated');
        if (element) {
            element.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    }

    showLoading(show) {
        const spinner = document.getElementById('loading-spinner');
        const container = document.getElementById('news-container');
        
        if (spinner && container) {
            spinner.classList.toggle('hidden', !show);
            container.classList.toggle('hidden', show);
        }
    }
}

// Initialize news fetcher
const newsFetcher = new NewsFetcher();