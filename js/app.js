// Main Application Controller
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 AI NewsMod Starting...');
    
    // Load news automatically
    try {
        const news = await newsFetcher.fetchNews('all');
        await newsRenderer.renderNews(news);
        console.log('✅ News loaded successfully');
    } catch (error) {
        console.error('❌ Error loading news:', error);
    }

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
            
            // Update icon
            const icon = this.querySelector('i');
            icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
        });
    }

    // Refresh Button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            window.location.reload();
        });
    }

    // Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.category;
            newsRenderer.updateNewsFilter(filter);
            
            // Reload news with new filter
            newsFetcher.fetchNews('all').then(news => {
                newsRenderer.renderNews(news);
            });
        });
    });
});

// Auto refresh every 5 minutes
setInterval(() => {
    newsFetcher.fetchNews('all').then(news => {
        newsRenderer.renderNews(news);
    });
}, 300000);