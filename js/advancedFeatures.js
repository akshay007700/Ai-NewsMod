// Advanced Unique Features for AI NewsMod
class AdvancedFeatures {
    constructor() {
        this.voiceSynth = window.speechSynthesis;
        this.isSpeaking = false;
        this.voiceSpeed = 1;
        this.init();
    }

    init() {
        this.initNewsPredictor();
        this.initSentimentAnalysis();
        this.initBreakingTicker();
        this.initVoiceReader();
        console.log('🚀 Advanced Features Loaded');
    }

    // AI News Prediction Engine
    initNewsPredictor() {
        this.updatePredictions();
        setInterval(() => this.updatePredictions(), 300000);
    }

    async updatePredictions() {
        const trends = await this.analyzeTrends();
        this.renderPredictions(trends);
    }

    async analyzeTrends() {
        return [
            {
                topic: "AI Regulation",
                trend: "up",
                confidence: 87,
                reason: "Increased government discussions"
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
                <span class="confidence">${trend.confidence}% confidence</span>
            </div>
        `).join('');
    }

    // Real-time Sentiment Analysis
    initSentimentAnalysis() {
        this.updateSentiment();
        setInterval(() => this.updateSentiment(), 60000);
    }

    async updateSentiment() {
        const sentiment = await this.calculateSentiment();
        this.renderSentiment(sentiment);
    }

    async calculateSentiment() {
        const news = await newsFetcher.fetchNews('all');
        let positive = 0, neutral = 0, negative = 0;

        news.forEach(item => {
            const sentiment = aiSummarizer.analyzeSentiment(item.content);
            if (sentiment === 'positive') positive++;
            else if (sentiment === 'negative') negative++;
            else neutral++;
        });

        const total = news.length;
        return {
            positive: Math.round((positive / total) * 100),
            neutral: Math.round((neutral / total) * 100), 
            negative: Math.round((negative / total) * 100)
        };
    }

    renderSentiment(sentiment) {
        document.querySelectorAll('.sentiment-item').forEach(item => {
            const type = item.classList[1];
            const value = sentiment[type];
            const fill = item.querySelector('.sentiment-fill');
            const valueSpan = item.querySelector('.sentiment-value');
            
            if (fill && valueSpan) {
                fill.style.width = `${value}%`;
                valueSpan.textContent = `${value}%`;
            }
        });
    }

    // Breaking News Ticker
    initBreakingTicker() {
        this.updateTicker();
        setInterval(() => this.updateTicker(), 30000);
    }

    async updateTicker() {
        const breakingNews = await this.getBreakingNews();
        this.animateTicker(breakingNews);
    }

    async getBreakingNews() {
        const news = await newsFetcher.fetchNews('all');
        return news
            .filter(item => item.isBreaking)
            .slice(0, 3)
            .map(item => item.title)
            .join(' • ');
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
            
            document.querySelectorAll('.voice-control').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.setVoiceSpeed(parseFloat(e.target.dataset.speed));
                    e.stopPropagation();
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
        const news = await newsFetcher.fetchNews('all');
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
            if (speaking) {
                btn.classList.add('speaking');
                btn.querySelector('span').textContent = 'Stop Reading';
            } else {
                btn.classList.remove('speaking'); 
                btn.querySelector('span').textContent = 'AI Voice News';
            }
        }
    }
}

// Initialize Advanced Features
const advancedFeatures = new AdvancedFeatures();