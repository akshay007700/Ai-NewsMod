// Advanced News Rendering System
class NewsRenderer {
    constructor() {
        this.currentFilter = 'all';
        this.renderedNews = new Set();
    }

    // Main rendering function
    async renderNews(newsArray, containerId = 'news-container') {
        const container = document.getElementById(containerId);
        if (!container) return;

        try {
            // Clear existing content
            container.innerHTML = '';

            // Filter news based on current selection
            const filteredNews = this.filterNews(newsArray, this.currentFilter);
            
            // Update news count
            this.updateNewsCount(filteredNews.length);

            // Render each news item
            for (const newsItem of filteredNews) {
                if (!this.renderedNews.has(newsItem.id)) {
                    const newsElement = await this.createNewsElement(newsItem);
                    container.appendChild(newsElement);
                    this.renderedNews.add(newsItem.id);
                    
                    // Add animation delay for staggered effect
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }

            // Add fade-in animation
            this.animateNewsItems();

        } catch (error) {
            console.error('❌ Error rendering news:', error);
            this.showErrorMessage(container);
        }
    }

    filterNews(newsArray, filter) {
        switch (filter) {
            case 'breaking':
                return newsArray.filter(item => item.isBreaking);
            case 'trending':
                return newsArray.filter(item => item.isTrending);
            case 'featured':
                return newsArray.filter(item => item.sentiment === 'positive');
            default:
                return newsArray;
        }
    }

    async createNewsElement(newsItem) {
        const article = document.createElement('article');
        article.className = `news-card fade-in ${newsItem.isBreaking ? 'breaking' : ''} ${newsItem.isTrending ? 'trending' : ''}`;
        article.dataset.id = newsItem.id;
        article.dataset.category = newsItem.category;
        article.dataset.sentiment = newsItem.sentiment;

        // Generate AI-enhanced summary if needed
        let summary = newsItem.summary;
        if (!summary && newsItem.content) {
            summary = await aiSummarizer.summarizeContent(newsItem.content, newsItem.title);
        }

        // Generate tags if not provided
        const tags = newsItem.tags || aiSummarizer.generateTags(newsItem.title, newsItem.content);

        article.innerHTML = this.generateNewsHTML(newsItem, summary, tags);
        
        // Add click handler
        article.addEventListener('click', () => this.handleNewsClick(newsItem));
        
        return article;
    }

    generateNewsHTML(newsItem, summary, tags) {
        const timeAgo = this.getTimeAgo(newsItem.publishedAt);
        const categoryConfig = CONFIG.CATEGORIES[newsItem.category.toUpperCase()] || CONFIG.CATEGORIES.WORLD;

        return `
            <div class="news-header">
                <span class="news-category" style="background: ${categoryConfig.color}">
                    <i class="${categoryConfig.icon}"></i> ${categoryConfig.name}
                </span>
                <img src="${newsItem.image}" alt="${newsItem.title}" class="news-image" onerror="this.src='https://images.unsplash.com/photo-1586339949216-35c2747cc36d?w=400'">
            </div>
            
            <h3 class="news-title">${this.escapeHTML(newsItem.title)}</h3>
            
            <div class="news-summary">
                ${this.escapeHTML(summary)}
            </div>

            ${tags.length > 0 ? `
                <div class="news-tags">
                    ${tags.slice(0, 3).map(tag => 
                        `<span class="news-tag">#${tag}</span>`
                    ).join('')}
                </div>
            ` : ''}

            <div class="news-meta">
                <div class="meta-left">
                    <span class="meta-item">
                        <i class="fas fa-clock"></i> ${timeAgo}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-newspaper"></i> ${newsItem.source}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-stopwatch"></i> ${newsItem.readTime}
                    </span>
                </div>
                <div class="meta-right">
                    <span class="ai-badge">
                        <i class="fas fa-robot"></i> AI Generated
                    </span>
                    <div class="news-actions">
                        <button class="action-btn" onclick="event.stopPropagation(); newsRenderer.shareNews('${newsItem.id}')">
                            <i class="fas fa-share-alt"></i>
                        </button>
                        <button class="action-btn" onclick="event.stopPropagation(); newsRenderer.bookmarkNews('${newsItem.id}')">
                            <i class="far fa-bookmark"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString();
    }

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    handleNewsClick(newsItem) {
        // Create news detail modal
        this.showNewsDetail(newsItem);
    }

    showNewsDetail(newsItem) {
        const modal = document.createElement('div');
        modal.className = 'news-modal';
        modal.innerHTML = this.generateModalHTML(newsItem);
        document.body.appendChild(modal);

        // Add event listeners
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', function closeModal(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeModal);
            }
        });
    }

    generateModalHTML(newsItem) {
        return `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-header">
                    <span class="news-category">${newsItem.category}</span>
                    <h2>${newsItem.title}</h2>
                    <div class="modal-meta">
                        <span>By ${newsItem.author}</span>
                        <span>•</span>
                        <span>${this.getTimeAgo(newsItem.publishedAt)}</span>
                        <span>•</span>
                        <span>${newsItem.readTime} read</span>
                    </div>
                </div>
                <div class="modal-body">
                    <img src="${newsItem.image}" alt="${newsItem.title}" class="modal-image">
                    <div class="modal-summary">
                        <h3>AI Summary</h3>
                        <p>${newsItem.summary}</p>
                    </div>
                    <div class="modal-full-content">
                        <p>${newsItem.content}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="newsRenderer.shareNews('${newsItem.id}')">
                            <i class="fas fa-share"></i> Share
                        </button>
                        <button class="btn btn-secondary" onclick="newsRenderer.bookmarkNews('${newsItem.id}')">
                            <i class="far fa-bookmark"></i> Save
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    shareNews(newsId) {
        const newsItem = this.findNewsById(newsId);
        if (newsItem && navigator.share) {
            navigator.share({
                title: newsItem.title,
                text: newsItem.summary,
                url: window.location.href + newsItem.url
            });
        } else {
            // Fallback copy to clipboard
            navigator.clipboard.writeText(newsItem.title + '\n\n' + newsItem.summary);
            this.showToast('Link copied to clipboard!', 'success');
        }
    }

    bookmarkNews(newsId) {
        const newsItem = this.findNewsById(newsId);
        const bookmarks = JSON.parse(localStorage.getItem('news_bookmarks') || '[]');
        
        if (!bookmarks.find(bm => bm.id === newsId)) {
            bookmarks.push(newsItem);
            localStorage.setItem('news_bookmarks', JSON.stringify(bookmarks));
            this.showToast('News saved to bookmarks!', 'success');
        } else {
            this.showToast('Already bookmarked!', 'info');
        }
    }

    findNewsById(newsId) {
        // This would typically search through current news array
        // For demo, return a mock item
        return {
            id: newsId,
            title: 'Sample News',
            summary: 'This is a sample news item.',
            content: 'Full content of the sample news item.'
        };
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 3000);
    }

    updateNewsFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === filter);
        });

        // Re-render news with new filter
        this.rerenderNews();
    }

    async rerenderNews() {
        const currentNews = Array.from(document.querySelectorAll('.news-card'))
            .map(card => this.findNewsById(card.dataset.id))
            .filter(Boolean);

        if (currentNews.length > 0) {
            await this.renderNews(currentNews);
        }
    }

    animateNewsItems() {
        const items = document.querySelectorAll('.news-card');
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }

    updateNewsCount(count) {
        const countElement = document.getElementById('news-count');
        if (countElement) {
            countElement.textContent = count;
        }
    }

    showErrorMessage(container) {
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Unable to load news</h3>
                <p>Please check your connection and try again</p>
                <button onclick="window.location.reload()" class="retry-btn">
                    <i class="fas fa-redo"></i> Try Again
                </button>
            </div>
        `;
    }
}

// Initialize news renderer
const newsRenderer = new NewsRenderer();