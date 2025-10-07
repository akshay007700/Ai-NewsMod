// 🌙 Universal Theme Loader for AI NewsMod
// ------------------------------------------
// ✅ Works automatically across ALL pages
// ✅ Keeps same theme even after refresh or navigation
// ✅ No layout, CSS or HTML change required

(function() {
    // Get saved theme (or auto by default)
    const savedTheme = localStorage.getItem('theme') || 'auto';

    // Apply theme to <html> root element
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Auto-detect system preference when theme = "auto"
    if (savedTheme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }

    // Monitor system theme change (optional future support)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        if (localStorage.getItem('theme') === 'auto') {
            document.documentElement.setAttribute('data-theme', event.matches ? 'dark' : 'light');
        }
    });

    // Debug message (optional)
    console.log(`🌓 Theme Applied: ${document.documentElement.getAttribute('data-theme')}`);
})();
