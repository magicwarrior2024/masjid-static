/**
 * Search Logic for SS WP Masjid Integration
 * 
 * Supports both Modal and Page modes with FlexSearch/Fuse.js integration.
 * 
 * @version 2.0.0
 */

class SimplyStaticSearch {
    constructor(config) {
        // Configuration
        this.config = {
            jsonUrl: config.jsonUrl || './search-index.json',
            mode: config.mode || 'modal', // 'modal' or 'page'
            library: config.library || 'flexsearch', // 'flexsearch', 'fuse', or 'custom'
            resultsPerPage: config.resultsPerPage || 10,
            minQueryLength: config.minQueryLength || 2,
            searchDelay: config.searchDelay || 300,
            ...config
        };

        // Elements
        this.modal = config.modal || document.getElementById('ss-wpm-search-modal');
        this.searchInput = config.searchInput || document.getElementById('ss-wpm-search-input') || document.getElementById('ss-search-input');
        this.searchResults = config.resultsContainer || document.getElementById('ss-wpm-search-results') || document.getElementById('ss-search-results');
        this.closeButton = config.closeButton || document.querySelector('.ss-wpm-close-button');
        this.statusContainer = config.statusContainer || document.getElementById('ss-search-status');
        this.paginationContainer = config.paginationContainer || document.getElementById('ss-search-pagination');

        // State
        this.searchData = [];
        this.searchIndex = null;
        this.isLoading = false;
        this.searchTimeout = null;
        this.currentQuery = '';
        this.currentPage = 1;
        this.totalPages = 1;
        this.currentResults = [];

        // Initialize
        this.init();
    }

    async init() {
        try {
            this.showStatus('Memuat data pencarian...', 'loading');
            await this.loadSearchData();
            this.setupSearchLibrary();
            this.bindEvents();
            this.hideStatus();

            // If page mode, check URL for query
            if (this.config.mode === 'page') {
                this.parseUrlQuery();
            }

            console.log('SS_WPM: Search initialized successfully');
        } catch (error) {
            console.error('SS_WPM: Failed to initialize search:', error);
            this.showStatus('Gagal memuat pencarian: ' + error.message, 'error');
        }
    }

    async loadSearchData() {
        try {
            this.isLoading = true;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const response = await fetch(this.config.jsonUrl, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error('Format data tidak valid');
            }

            this.searchData = data.filter(item => item && item.title && item.url);
            console.log(`SS_WPM: Loaded ${this.searchData.length} entries`);

        } catch (error) {
            this.isLoading = false;
            if (error.name === 'AbortError') {
                throw new Error('Koneksi timeout');
            }
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    setupSearchLibrary() {
        if (this.config.library === 'flexsearch' && typeof FlexSearch !== 'undefined') {
            this.setupFlexSearch();
        } else if (this.config.library === 'fuse' && typeof Fuse !== 'undefined') {
            this.setupFuse();
        } else {
            console.log('SS_WPM: Using custom search (no library detected)');
        }
    }

    setupFlexSearch() {
        this.searchIndex = new FlexSearch.Document({
            document: {
                id: 'id',
                index: ['title', 'content', 'excerpt'],
                store: true
            },
            tokenize: 'forward',
            cache: true
        });

        this.searchData.forEach(item => {
            this.searchIndex.add(item);
        });

        console.log('SS_WPM: FlexSearch initialized');
    }

    setupFuse() {
        this.searchIndex = new Fuse(this.searchData, {
            keys: [
                { name: 'title', weight: 0.4 },
                { name: 'excerpt', weight: 0.3 },
                { name: 'content', weight: 0.2 },
                { name: 'categories.name', weight: 0.1 }
            ],
            includeScore: true,
            threshold: 0.4,
            ignoreLocation: true
        });

        console.log('SS_WPM: Fuse.js initialized');
    }

    bindEvents() {
        if (!this.searchInput) return;

        // Search input
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();

            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }

            this.searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, this.config.searchDelay);
        });

        // Enter key
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = this.searchInput.value.trim();
                this.performSearch(query);

                // Update URL for page mode
                if (this.config.mode === 'page' && query) {
                    this.updateUrl(query);
                }
            }

            // Keyboard navigation
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                this.handleKeyboardNavigation(e);
            }
        });

        // Modal specific events
        if (this.config.mode === 'modal') {
            if (this.closeButton) {
                this.closeButton.addEventListener('click', () => this.closeModal());
            }

            if (this.modal) {
                this.modal.addEventListener('click', (e) => {
                    if (e.target === this.modal) this.closeModal();
                });
            }

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isModalOpen()) {
                    this.closeModal();
                }
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    this.openModal();
                }
            });
        }
    }

    performSearch(query) {
        this.currentQuery = query;
        this.currentPage = 1;

        if (!query || query.length < this.config.minQueryLength) {
            this.clearResults();
            if (this.config.mode === 'page' && query.length > 0) {
                this.showStatus(`Ketik minimal ${this.config.minQueryLength} karakter`, 'info');
            }
            return;
        }

        this.showStatus('Mencari...', 'loading');

        let results;

        if (this.config.library === 'flexsearch' && this.searchIndex) {
            results = this.searchWithFlexSearch(query);
        } else if (this.config.library === 'fuse' && this.searchIndex) {
            results = this.searchWithFuse(query);
        } else {
            results = this.searchWithCustom(query);
        }

        this.currentResults = results;
        this.totalPages = Math.ceil(results.length / this.config.resultsPerPage);

        this.displayResults(results, query);
    }

    searchWithFlexSearch(query) {
        const searchResults = this.searchIndex.search(query, { limit: 100, enrich: true });
        const ids = new Set();
        const results = [];

        searchResults.forEach(fieldResult => {
            fieldResult.result.forEach(item => {
                if (!ids.has(item.id)) {
                    ids.add(item.id);
                    const doc = item.doc || this.searchData.find(d => d.id === item.id);
                    if (doc) results.push(doc);
                }
            });
        });

        return results;
    }

    searchWithFuse(query) {
        const searchResults = this.searchIndex.search(query);
        return searchResults.map(r => r.item);
    }

    searchWithCustom(query) {
        const queryLower = query.toLowerCase();
        const queryWords = queryLower.split(/\s+/).filter(w => w.length > 1);

        return this.searchData
            .map(item => {
                let score = 0;
                const title = (item.title || '').toLowerCase();
                const content = (item.content || '').toLowerCase();
                const excerpt = (item.excerpt || '').toLowerCase();

                if (title.includes(queryLower)) score += 100;
                if (excerpt.includes(queryLower)) score += 75;
                if (content.includes(queryLower)) score += 50;

                queryWords.forEach(word => {
                    if (title.includes(word)) score += 25;
                    if (excerpt.includes(word)) score += 15;
                    if (content.includes(word)) score += 8;
                });

                return { ...item, score };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score);
    }

    displayResults(results, query) {
        this.hideStatus();

        if (results.length === 0) {
            this.showNoResults(query);
            return;
        }

        // Show status
        this.showStatus(`Ditemukan <strong>${results.length}</strong> hasil untuk "<strong>${this.escapeHtml(query)}</strong>"`, 'success');

        // Get current page results
        const start = (this.currentPage - 1) * this.config.resultsPerPage;
        const end = start + this.config.resultsPerPage;
        const pageResults = results.slice(start, end);

        // Render results based on mode
        if (this.config.mode === 'page') {
            this.renderPageResults(pageResults, query);
        } else {
            this.renderModalResults(pageResults, query);
        }

        // Render pagination
        if (this.config.mode === 'page' && this.totalPages > 1) {
            this.renderPagination();
        }
    }

    renderModalResults(results, query) {
        const html = results.map((result, index) => `
            <li>
                <a href="${this.escapeHtml(result.url)}" tabindex="${index === 0 ? '0' : '-1'}">
                    <h3>${this.highlightText(this.escapeHtml(result.title || 'Untitled'), query)}</h3>
                    <p>${this.createExcerpt(result.excerpt || result.content || '', query, 120)}</p>
                </a>
            </li>
        `).join('');

        this.searchResults.innerHTML = `<ul role="list">${html}</ul>`;
    }

    renderPageResults(results, query) {
        const html = results.map(result => {
            const thumbnail = result.thumbnail
                ? `<img src="${this.escapeHtml(result.thumbnail)}" alt="" loading="lazy">`
                : `<div class="ss-result-thumbnail-placeholder">📄</div>`;

            const categories = (result.categories || [])
                .map(c => c.name || c)
                .join(', ');

            return `
                <a href="${this.escapeHtml(result.url)}" class="ss-result-card">
                    <div class="ss-result-thumbnail">
                        ${thumbnail}
                    </div>
                    <div class="ss-result-content">
                        <span class="ss-result-type">${this.escapeHtml(result.type_label || result.type || 'Post')}</span>
                        <h3 class="ss-result-title">${this.highlightText(this.escapeHtml(result.title || 'Untitled'), query)}</h3>
                        <div class="ss-result-meta">
                            ${result.date_formatted ? `<span class="ss-result-meta-item">📅 ${this.escapeHtml(result.date_formatted)}</span>` : ''}
                            ${result.author ? `<span class="ss-result-meta-item">✍️ ${this.escapeHtml(result.author)}</span>` : ''}
                            ${categories ? `<span class="ss-result-meta-item">📁 ${this.escapeHtml(categories)}</span>` : ''}
                        </div>
                        <p class="ss-result-excerpt">${this.createExcerpt(result.excerpt || result.content || '', query, 150)}</p>
                    </div>
                </a>
            `;
        }).join('');

        this.searchResults.innerHTML = html;
    }

    renderPagination() {
        if (!this.paginationContainer) return;

        let html = '';

        // Previous button
        html += `<button class="ss-page-btn" onclick="window.ssSearch.goToPage(${this.currentPage - 1})" ${this.currentPage === 1 ? 'disabled' : ''}>◀ Prev</button>`;

        // Page numbers
        const maxVisible = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            html += `<button class="ss-page-btn" onclick="window.ssSearch.goToPage(1)">1</button>`;
            if (startPage > 2) html += `<span class="ss-page-info">...</span>`;
        }

        for (let i = startPage; i <= endPage; i++) {
            html += `<button class="ss-page-btn ${i === this.currentPage ? 'active' : ''}" onclick="window.ssSearch.goToPage(${i})">${i}</button>`;
        }

        if (endPage < this.totalPages) {
            if (endPage < this.totalPages - 1) html += `<span class="ss-page-info">...</span>`;
            html += `<button class="ss-page-btn" onclick="window.ssSearch.goToPage(${this.totalPages})">${this.totalPages}</button>`;
        }

        // Next button
        html += `<button class="ss-page-btn" onclick="window.ssSearch.goToPage(${this.currentPage + 1})" ${this.currentPage === this.totalPages ? 'disabled' : ''}>Next ▶</button>`;

        this.paginationContainer.innerHTML = html;
    }

    goToPage(page) {
        if (page < 1 || page > this.totalPages) return;

        this.currentPage = page;
        this.displayResults(this.currentResults, this.currentQuery);

        // Scroll to top of results
        if (this.searchResults) {
            this.searchResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    showNoResults(query) {
        const html = `
            <div class="ss-no-results">
                <div class="ss-no-results-icon">🔍</div>
                <h3>Tidak ada hasil untuk "${this.escapeHtml(query)}"</h3>
                <p>Coba kata kunci lain atau periksa ejaan Anda.</p>
            </div>
        `;

        this.searchResults.innerHTML = html;
        this.hideStatus();

        if (this.paginationContainer) {
            this.paginationContainer.innerHTML = '';
        }
    }

    showStatus(message, type = 'info') {
        if (!this.statusContainer) return;

        this.statusContainer.innerHTML = message;
        this.statusContainer.className = 'ss-search-status ' + type;
    }

    hideStatus() {
        if (!this.statusContainer) return;
        this.statusContainer.innerHTML = '';
        this.statusContainer.className = 'ss-search-status';
    }

    clearResults() {
        if (this.searchResults) {
            this.searchResults.innerHTML = '';
        }
        if (this.paginationContainer) {
            this.paginationContainer.innerHTML = '';
        }
        this.hideStatus();
    }

    // Modal methods
    openModal() {
        if (!this.modal || this.config.mode !== 'modal') return;

        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            this.modal.classList.add('show');
            if (this.searchInput) this.searchInput.focus();
        }, 10);
    }

    closeModal() {
        if (!this.modal) return;

        this.modal.classList.remove('show');

        setTimeout(() => {
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);

        if (this.searchInput) this.searchInput.value = '';
        this.clearResults();
    }

    isModalOpen() {
        return this.modal && this.modal.style.display === 'flex';
    }

    // URL handling for page mode
    parseUrlQuery() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');

        if (query && this.searchInput) {
            this.searchInput.value = query;
            // Wait for data to load
            setTimeout(() => this.performSearch(query), 100);
        }
    }

    updateUrl(query) {
        const url = new URL(window.location);
        if (query) {
            url.searchParams.set('q', query);
        } else {
            url.searchParams.delete('q');
        }
        window.history.pushState({}, '', url);
    }

    // Utility methods
    highlightText(text, query) {
        if (!text || !query) return text;

        const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 1);
        let result = text;

        words.forEach(word => {
            const regex = new RegExp(`(${this.escapeRegex(word)})`, 'gi');
            result = result.replace(regex, '<mark>$1</mark>');
        });

        return result;
    }

    createExcerpt(content, query, maxLength = 120) {
        if (!content) return '';

        const queryLower = query.toLowerCase();
        const contentLower = content.toLowerCase();
        const queryIndex = contentLower.indexOf(queryLower);

        let start = 0;
        if (queryIndex !== -1) {
            start = Math.max(0, queryIndex - Math.floor(maxLength / 3));
        }

        let excerpt = content.substring(start, start + maxLength);

        if (start > 0) {
            const spaceIndex = excerpt.indexOf(' ');
            if (spaceIndex > 0 && spaceIndex < 20) {
                excerpt = excerpt.substring(spaceIndex + 1);
            }
            excerpt = '...' + excerpt;
        }

        if (start + maxLength < content.length) {
            const lastSpaceIndex = excerpt.lastIndexOf(' ');
            if (lastSpaceIndex > excerpt.length - 20) {
                excerpt = excerpt.substring(0, lastSpaceIndex);
            }
            excerpt = excerpt + '...';
        }

        return this.highlightText(this.escapeHtml(excerpt), query);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    handleKeyboardNavigation(e) {
        const results = this.searchResults.querySelectorAll('a');
        if (!results.length) return;

        const currentFocus = document.activeElement;
        let currentIndex = Array.from(results).indexOf(currentFocus);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentIndex = currentIndex < results.length - 1 ? currentIndex + 1 : 0;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentIndex = currentIndex > 0 ? currentIndex - 1 : results.length - 1;
        }

        if (results[currentIndex]) {
            results[currentIndex].focus();
        }
    }
}

// Auto-initialize for page mode
document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on search page
    const searchPageContainer = document.getElementById('ss-search-main');

    if (searchPageContainer) {
        // Detect available library
        let library = 'custom';
        if (typeof FlexSearch !== 'undefined') library = 'flexsearch';
        else if (typeof Fuse !== 'undefined') library = 'fuse';

        window.ssSearch = new SimplyStaticSearch({
            jsonUrl: './search-index.json',
            mode: 'page',
            library: library,
            searchInput: document.getElementById('ss-search-input'),
            resultsContainer: document.getElementById('ss-search-results'),
            statusContainer: document.getElementById('ss-search-status'),
            paginationContainer: document.getElementById('ss-search-pagination')
        });

        // Update library info
        const libraryName = document.getElementById('ss-library-name');
        if (libraryName) {
            libraryName.textContent = library === 'flexsearch' ? 'FlexSearch' :
                library === 'fuse' ? 'Fuse.js' : 'Custom';
        }
    }
});