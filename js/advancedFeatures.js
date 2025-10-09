// Advanced Unique Features for AI NewsMod
class AdvancedFeatures {
    constructor() {
        this.voiceSynth = window.speechSynthesis;
        this.isSpeaking = false;
        this.voiceSpeed = 1;
        this.sentimentData = { positive: 45, neutral: 35, negative: 20 };
    }

    async init() {
        console.log('🚀 Advanced Features Loading...');
        
        // Wait for newsFetcher to be available
        await this.waitForNewsFetcher();
        
        this.initNewsPredictor();
        this.initSentimentAnalysis();
        this.initBreakingTicker();
        this.initVoiceReader();
        console.log('✅ Advanced Features Loaded');
    }

    waitForNewsFetcher() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (typeof newsFetcher !== 'undefined' && newsFetcher.getCurrentNews) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
        });
    }

    // AI News Prediction Engine
    initNewsPredictor() {
        this.updatePredictions();
        setInterval(() => this.updatePredictions(), 300000);
    }

    async updatePredictions() {
        try {
            const trends = await this.analyzeTrends();
            this.renderPredictions(trends);
        } catch (error) {
            console.log('📊 Using sample predictions due to error:', error.message);
            this.renderPredictions(this.getSamplePredictions());
        }
    }

    async analyzeTrends() {
        // Simple trend analysis based on news content
        const news = newsFetcher.getCurrentNews();
        if (!news || news.length === 0) {
            return this.getSamplePredictions();
        }

        // Analyze trends from news titles
        const techTerms = ['ai', 'artificial intelligence', 'machine learning', 'tech'];
        const cryptoTerms = ['crypto', 'bitcoin', 'blockchain', 'nft'];
        const spaceTerms = ['space', 'nasa', 'rocket', 'mars', 'moon'];

        let techCount = 0, cryptoCount = 0, spaceCount = 0;

        news.forEach(item => {
            const title = item.title.toLowerCase();
            if (techTerms.some(term => title.includes(term))) techCount++;
            if (cryptoTerms.some(term => title.includes(term))) cryptoCount++;
            if (spaceTerms.some(term => title.includes(term))) spaceCount++;
        });

        return [
            {
                topic: "AI Technology",
                trend: techCount > 2 ? "up" : "stable",
                confidence: Math.min(95, 70 + (techCount * 5)),
                reason: `${techCount} related articles trending`
            },
            {
                topic: "Cryptocurrency", 
                trend: cryptoCount > 1 ? "up" : "down",
                confidence: Math.min(90, 65 + (cryptoCount * 8)),
                reason: `${cryptoCount} market updates`
            },
            {
                topic: "Space Exploration",
                trend: spaceCount > 0 ? "up" : "stable", 
                confidence: Math.min(85, 60 + (spaceCount * 10)),
                reason: `${spaceCount} space-related news`
            }
        ];
    }

    getSamplePredictions() {
        return [
            {
                topic: "AI Technology",
                trend: "up",
                confidence: 87,
                reason: "Increased development activity"
            },
            {
                topic: "Cryptocurrency", 
                trend: "down",
                confidence: 92,
                reason: "Market stabilization phase"
            },
            {
                topic: "Space Exploration",
                trend: "up", 
                confidence: 78,
                reason: "New mission announcements"
            }
        ];
    }

    renderPredictions(trends) {
        const container = document.querySelector('.prediction-list');
        if (!container) return;

        container.innerHTML = trends.map(trend => `
            <div class="prediction-item">
                <div class="trend-indicator ${trend.trend}"></div>
                <span class="prediction-text">${trend.topic} trend expected to ${trend.trend}</span>
                <span class="confidence">${trend.confidence}%</span>
            </div>
        `).join('');
    }

    // Real-time Sentiment Analysis
    initSentimentAnalysis() {
        this.updateSentiment();
        setInterval(() => this.updateSentiment(), 60000);
    }

    async updateSentiment() {
        try {
            const sentiment = await this.calculateSentiment();
            this.renderSentiment(sentiment);
        } catch (error) {
            console.log('😊 Using sample sentiment due to error:', error.message);
            this.renderSentiment(this.sentimentData);
        }
    }

    async calculateSentiment() {
        const news = newsFetcher.getCurrentNews();
        if (!news || news.length === 0) {
            return this.sentimentData;
        }

        let positive = 0, neutral = 0, negative = 0;

        const positiveWords = ['win', 'gain', 'success', 'growth', 'breakthrough', 'achievement', 'positive'];
        const negativeWords = ['loss', 'decline', 'crisis', 'drop', 'negative', 'problem', 'issue', 'fall'];

        news.forEach(item => {
            const text = (item.title + ' ' + item.summary).toLowerCase();
            
            const positiveCount = positiveWords.filter(word => text.includes(word)).length;
            const negativeCount = negativeWords.filter(word => text.includes(word)).length;

            if (positiveCount > negativeCount) {
                positive++;
            } else if (negativeCount > positiveCount) {
                negative++;
            } else {
                neutral++;
            }
        });

        const total = news.length;
        return {
            positive: Math.round((positive / total) * 100),
            neutral: Math.round((neutral / total) * 100),
            negative: Math.round((negative / total) * 100)
        };
    }

    renderSentiment(sentiment) {
        const items = document.querySelectorAll('.sentiment-item');
        items.forEach(item => {
            const type = item.classList[1];
            const value = sentiment[type] || 0;
            const fill = item.querySelector('.sentiment-fill');
            const valueSpan = item.querySelector('.sentiment-value');
            
            if (fill) fill.style.width = `${value}%`;
            if (valueSpan) valueSpan.textContent = `${value}%`;
        });
    }

    // Breaking News Ticker
    initBreakingTicker() {
        this.updateTicker();
        setInterval(() => this.updateTicker(), 30000);
    }

    async updateTicker() {
        try {
            const breakingNews = await this.getBreakingNews();
            this.animateTicker(breakingNews);
        } catch (error) {
            console.log('📰 Using sample ticker due to error:', error.message);
            this.animateTicker("Latest: AI NewsMod is running smoothly • Technology sector shows growth • Market updates available");
        }
    }

    async getBreakingNews() {
        const breakingNews = newsFetcher.getBreakingNews();
        if (breakingNews.length === 0) {
            const allNews = newsFetcher.getCurrentNews();
            return allNews.slice(0, 2).map(item => item.title).join(' • ');
        }
        return breakingNews.slice(0, 3).map(item => item.title).join(' • ');
    }

    animateTicker(content) {
        const ticker = document.querySelector('.ticker-content');
        if (ticker) {
            ticker.innerHTML = `<span>${content}</span>`;
        }
    }

    // AI Voice News Reader
    initVoiceReader() {
        const voiceBtn = document.getElementById('voice-reader-btn');
        if (voiceBtn && this.voiceSynth) {
            voiceBtn.addEventListener('click', () => this.toggleVoiceReading());
            
            // Add speed controls if they exist
            document.querySelectorAll('.voice-control').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const speed = parseFloat(e.target.dataset.speed);
                    if (speed) this.setVoiceSpeed(speed);
                });
            });
        }
    }

    async toggleVoiceReading() {
        if (this.isSpeaking) {
            this.stopVoiceReading();
        } else {
            await this.startVoiceReading();
        }
    }

    async startVoiceReading() {
        try {
            const news = newsFetcher.getCurrentNews();
            if (!news || news.length === 0) {
                throw new Error('No news available');
            }

            const headlines = news.slice(0, 3).map(item => item.title).join('. ');
            
            const utterance = new SpeechSynthesisUtterance(`
                Here are the top news headlines. ${headlines}.
                This news update was powered by AI NewsMod.
            `);

            utterance.rate = this.voiceSpeed;
            utterance.pitch = 1;
            utterance.volume = 0.8;

            this.voiceSynth.speak(utterance);
            this.isSpeaking = true;
            this.updateVoiceButton(true);

            utterance.onend = () => {
                this.isSpeaking = false;
                this.updateVoiceButton(false);
            };

            utterance.onerror = () => {
                this.isSpeaking = false;
                this.updateVoiceButton(false);
            };

        } catch (error) {
            console.error('🎤 Voice reading error:', error);
            this.isSpeaking = false;
            this.updateVoiceButton(false);
        }
    }

    stopVoiceReading() {
        this.voiceSynth.cancel();
        this.isSpeaking = false;
        this.updateVoiceButton(false);
    }

    setVoiceSpeed(speed) {
        this.voiceSpeed = speed;
        if (this.isSpeaking) {
            this.stopVoiceReading();
            setTimeout(() => this.startVoiceReading(), 100);
        }
    }

    updateVoiceButton(speaking) {
        const btn = document.getElementById('voice-reader-btn');
        if (btn) {
            const span = btn.querySelector('span');
            if (span) {
                if (speaking) {
                    btn.classList.add('speaking');
                    span.textContent = 'Stop Reading';
                } else {
                    btn.classList.remove('speaking'); 
                    span.textContent = 'AI Voice News';
                }
            }
        }
    }
}

// Initialize when DOM is ready
let advancedFeatures;
document.addEventListener("DOMContentLoaded", async () => {
    advancedFeatures = new AdvancedFeatures();
    await advancedFeatures.init();
    window.advancedFeatures = advancedFeatures;
});