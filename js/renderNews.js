// Advanced News Rendering System
class NewsRenderer {
    constructor() {
        this.currentFilter = 'all';
    }

    async renderNews(newsArray, containerId = 'news-container') {
        const container = document.getElementById(containerId);
        if (!container) return;

        try {
            container.innerHTML = '';

            // Filter news based on current selection
            const filteredNews = this.filterNews(newsArray, this.currentFilter);
            
            // Update news count
            this.updateNewsCount(filteredNews.length);

            // Render each news item
            for (const newsItem of filteredNews) {
                const newsElement = await this.createNewsElement(newsItem);
                container.appendChild(newsElement);
            }

            this.animateNewsItems();

        } catch (error) {
            console.error('Error rendering news:', error);
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

        // Generate AI-enhanced summary
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
        const categoryConfig = {
            tech: { name: 'Technology', icon: 'fas fa-microchip', color: '#3b82f6' },
            world: { name: 'World News', icon: 'fas fa-globe', color: '#10b981' },
            movies: { name: 'Entertainment', icon: 'fas fa-film', color: '#8b5cf6' }
        }[newsItem.category] || { name: 'General', icon: 'fas fa-newspaper', color: '#6b7280' };

        return `
            <div class="news-header">
                <span class="news-category" style="background: ${categoryConfig.color}">
                    <i class="${categoryConfig.icon}"></i> ${categoryConfig.name}
                </span>
                <img src="${newsItem.image}" alt="${newsItem.title}" class="news-image" onerror="this.style.display='none'">
            </div>
            
            <h3 class="news-title">${this.escapeHTML(newsItem.title)}</h3>
            
            <div class="news-summary">
                ${this.escapeHTML(summary)}
            </div>

            ${tags.length > 0 ? `
                <div class="news-tags">
                    ${tags.map(tag => `<span class="news-tag">#${tag}</span>`).join('')}
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

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleDateString();
    }

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    handleNewsClick(newsItem) {
        // Show news detail
        this.showNewsDetail(newsItem);
    }

    showNewsDetail(newsItem) {
        const modal = document.createElement('div');
        modal.className = 'news-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.8); display: flex; justify-content: center; 
            align-items: center; z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 600px; max-height: 80vh; overflow-y: auto;">
                <h2>${newsItem.title}</h2>
                <p><strong>Summary:</strong> ${newsItem.summary}</p>
                <p><strong>Content:</strong> ${newsItem.content}</p>
                <button onclick="this.closest('.news-modal').remove()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer;">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    updateNewsCount(count) {
        const countElement = document.getElementById('news-count');
        if (countElement) {
            countElement.textContent = count;
        }
    }

    animateNewsItems() {
        const items = document.querySelectorAll('.news-card');
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }

    showErrorMessage(container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #6b7280;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
                <h3>Unable to load news</h3>
                <p>Please check your connection and try again</p>
                <button onclick="window.location.reload()" style="background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; margin-top: 1rem;">
                    <i class="fas fa-redo"></i> Try Again
                </button>
            </div>
        `;
    }

    updateNewsFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === filter);
        });
    }
}

// Initialize news renderer
const newsRenderer = new NewsRenderer();