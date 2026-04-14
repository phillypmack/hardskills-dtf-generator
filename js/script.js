// HardSkills DTF UV - Main Application Script
// Dependencies: languages-data.js, colors.js, svg-generator.js (loaded before this file)

// =====================================================
// UTILITIES
// =====================================================
function debounce(fn, ms = 250) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

function showToast(message, type = 'success', duration = 5000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('show'));
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// =====================================================
// STATE
// =====================================================
let currentView = 'grouped';
let selectedLanguages = new Map();
let iconCustomSettings = new Map();
let localModels = [];
let localModelsLoaded = false;

const svgCache = new Map();
let cachedMagnifierSvgUrl = null;

// DOM cache (filled in init)
const DOM = {};

// =====================================================
// ICON URL RESOLUTION
// =====================================================
function getIconUrl(lang) {
    if (lang.customSvg) {
        return `data:image/svg+xml;base64,${btoa(lang.customSvg)}`;
    }
    if (lang.customUrl) return lang.customUrl;
    if (lang.isLocal) return lang.path;

    const iconName = lang.devicon || lang.icon;
    const variant = lang.variant || 'original';
    if (lang.source === 'simpleicons') {
        const color = lang.color ? lang.color.replace('#', '') : '';
        return `https://cdn.simpleicons.org/${lang.icon}/${color}`;
    }
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${iconName}/${iconName}-${variant}.svg`;
}

// =====================================================
// CARD CREATION (single source of truth)
// =====================================================
function createCardHTML(langId, lang, iconUrl) {
    return `
        <img src="${iconUrl}" alt="${lang.name}" loading="lazy" decoding="async" onerror="this.parentElement.querySelector('.icon-fallback')?.classList.remove('hidden');this.style.display='none'">
        <div class="icon-fallback hidden text-xs text-gray-300 w-12 h-12 flex items-center justify-content-center text-center leading-tight opacity-50">${lang.name.substring(0, 3)}</div>
        <p class="text-white text-xs font-semibold text-center leading-tight">${lang.name}</p>
        <div class="quantity-input w-full">
            <label class="text-xs text-gray-300" for="qty-${langId}">Qtd:</label>
            <input type="number" id="qty-${langId}" min="1" max="500" value="1"
                data-setting="quantity">
        </div>
        <div class="individual-settings w-full">
            <label class="text-xs text-gray-300" for="bg-${langId}">Fundo:</label>
            <select id="bg-${langId}" data-setting="background" class="text-xs">
                <option value="global">Global</option>
                <option value="transparent">Transparente</option>
                <option value="icon_color">Cor do Icone</option>
                <option value="white">Branco</option>
                <option value="black">Preto</option>
                <option value="auto_contrast">Contraste Auto</option>
                <option value="complementary">Complementar</option>
                <option value="light_pastel">Pastel</option>
                <option value="dark_vibrant">Escuro</option>
            </select>
            <label class="text-xs text-gray-300 mt-1" for="outline-${langId}">Contorno:</label>
            <select id="outline-${langId}" data-setting="outline" class="text-xs">
                <option value="global">Global</option>
                <option value="none">Sem Contorno</option>
                <option value="auto">Automatico</option>
                <option value="double">Duplo</option>
                <option value="white">Branco</option>
                <option value="black">Preto</option>
                <option value="complementary">Complementar</option>
            </select>
        </div>
    `;
}

function createIconCard(langId, lang, iconUrl, category) {
    const card = document.createElement('div');
    card.className = 'icon-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-pressed', 'false');
    card.dataset.name = lang.name.toLowerCase();
    card.dataset.category = category || '';
    card.dataset.langid = langId;
    card.dataset.langData = JSON.stringify(lang);
    card.innerHTML = createCardHTML(langId, lang, iconUrl);
    return card;
}

// =====================================================
// LOCAL MODELS
// =====================================================
async function loadLocalModels() {
    if (localModelsLoaded) return;
    try {
        const response = await fetch('svg-list.json');
        if (!response.ok) throw new Error('svg-list.json not found. Run: npm run update-svg-list');
        const data = await response.json();

        localModels = data.files.map(filename => ({
            name: filename.replace('.svg', '').replace(/-/g, ' ').replace(/\(/g, ' ').replace(/\)/g, ''),
            filename,
            path: `svg/${filename}`,
            isLocal: true,
            color: '#000000'
        }));
        localModelsLoaded = true;
    } catch (error) {
        console.error('Erro ao carregar modelos locais:', error);
    }
}

function renderLocalModels(container) {
    if (!localModelsLoaded) {
        loadLocalModels();
    }

    const localDiv = document.createElement('div');
    localDiv.className = 'mb-6';

    if (window.location.protocol === 'file:') {
        localDiv.innerHTML = `
            <div class="bg-[#ff6b6b] border-2 border-[#ff5252] rounded-lg p-6 mb-4">
                <div class="flex items-start gap-3 mb-3">
                    <span class="text-4xl" aria-hidden="true">&#9888;&#65039;</span>
                    <div>
                        <h3 class="text-lg font-bold text-white mb-2">Servidor HTTP Necessario!</h3>
                        <p class="text-sm text-white leading-relaxed mb-3">
                            Para usar Modelos Locais, voce precisa executar um servidor HTTP local.
                        </p>
                    </div>
                </div>
                <div class="bg-[#1e1933] rounded-lg p-4 mb-3">
                    <p class="text-xs font-bold text-white mb-2">Solucoes Rapidas:</p>
                    <div class="space-y-2 text-xs text-gray-300">
                        <p><strong class="text-white">Opcao 1:</strong> Duplo clique em <code class="bg-[#2a2440] px-2 py-1 rounded text-primary">start-server.bat</code></p>
                        <p><strong class="text-white">Opcao 2:</strong> <code class="bg-[#2a2440] px-2 py-1 rounded text-primary">python -m http.server 5173</code></p>
                        <p><strong class="text-white">Opcao 3:</strong> <code class="bg-[#2a2440] px-2 py-1 rounded text-primary">npm run dev</code></p>
                    </div>
                </div>
                <p class="text-xs text-white">Depois acesse: <strong class="text-yellow-300">http://localhost:5173</strong></p>
            </div>
        `;
        container.appendChild(localDiv);
        return;
    }

    localDiv.innerHTML = `
        <div class="category-header mb-4">
            <h3 class="text-sm font-bold text-white"><span aria-hidden="true">&#128194;</span> Modelos Locais</h3>
            <span class="text-xs text-gray-300">${localModels.length} icones</span>
        </div>
    `;

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2';

    const fragment = document.createDocumentFragment();
    localModels.forEach((model, index) => {
        const langId = `local-${index}`;
        fragment.appendChild(createIconCard(langId, model, model.path, 'Modelos Locais'));
    });
    grid.appendChild(fragment);

    localDiv.appendChild(grid);
    container.appendChild(localDiv);
}

// =====================================================
// RENDERING
// =====================================================
function renderLanguages() {
    const container = DOM.languagesContainer || document.getElementById('languagesContainer');
    if (!container) return;
    container.innerHTML = '';

    if (currentView === 'local') {
        renderLocalModels(container);
    } else if (currentView === 'grouped') {
        for (const [category, languages] of Object.entries(languagesData)) {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'mb-6';

            const emojiMatch = category.match(/^(\S+)\s/);
            const emoji = emojiMatch ? `<span aria-hidden="true">${emojiMatch[1]}</span> ` : '';
            const categoryName = emojiMatch ? category.slice(emojiMatch[0].length) : category;

            const allCatSelected = languages.every((_, i) => {
                const id = `${category.replace(/\s/g, '-')}-${i}`;
                return selectedLanguages.has(id);
            });

            categoryDiv.innerHTML = `
                <div class="category-header">
                    <h3 class="text-sm font-bold text-white">${emoji}${categoryName}</h3>
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-gray-300">${languages.length}</span>
                        <button class="btn btn-secondary text-xs py-1 px-3 category-select-btn" data-category="${category}">${allCatSelected ? 'Desmarcar' : 'Selecionar'}</button>
                    </div>
                </div>
            `;

            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2';

            const fragment = document.createDocumentFragment();
            languages.forEach((lang, index) => {
                const langId = `${category.replace(/\s/g, '-')}-${index}`;
                fragment.appendChild(createIconCard(langId, lang, getIconUrl(lang), category));
            });
            grid.appendChild(fragment);

            categoryDiv.appendChild(grid);
            container.appendChild(categoryDiv);
        }
    } else {
        const allDiv = document.createElement('div');
        allDiv.className = 'mb-6';
        const totalIcons = Object.values(languagesData).reduce((sum, langs) => sum + langs.length, 0);

        allDiv.innerHTML = `
            <div class="category-header mb-4">
                <h3 class="text-sm font-bold text-white">Todos os Modelos</h3>
                <span class="text-xs text-gray-300">${totalIcons} icones</span>
            </div>
        `;

        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2';

        const fragment = document.createDocumentFragment();
        for (const [category, languages] of Object.entries(languagesData)) {
            languages.forEach((lang, index) => {
                const langId = `${category.replace(/\s/g, '-')}-${index}`;
                fragment.appendChild(createIconCard(langId, lang, getIconUrl(lang), category));
            });
        }
        grid.appendChild(fragment);

        allDiv.appendChild(grid);
        container.appendChild(allDiv);
    }

    restoreSelections();
    updateStats();
    debouncedPreview();
}

function restoreSelections() {
    for (const [langId, quantity] of selectedLanguages.entries()) {
        const card = document.querySelector(`[data-langid="${langId}"]`);
        if (!card) continue;
        card.classList.add('selected');
        card.setAttribute('aria-pressed', 'true');
        const qtyInput = card.querySelector(`#qty-${langId}`);
        if (qtyInput) qtyInput.value = quantity;

        const settings = iconCustomSettings.get(langId);
        if (settings) {
            const bgSelect = card.querySelector(`#bg-${langId}`);
            const outlineSelect = card.querySelector(`#outline-${langId}`);
            if (bgSelect) bgSelect.value = settings.background || 'global';
            if (outlineSelect) outlineSelect.value = settings.outline || 'global';
        }
    }
}

// =====================================================
// SELECTION & INTERACTION
// =====================================================
function toggleSelection(card, lang) {
    const langId = card.dataset.langid;
    const qtyInput = card.querySelector(`#qty-${langId}`);

    if (selectedLanguages.has(langId)) {
        selectedLanguages.delete(langId);
        card.classList.remove('selected');
        card.setAttribute('aria-pressed', 'false');
        if (qtyInput) qtyInput.value = 1;
    } else {
        selectedLanguages.set(langId, 1);
        card.classList.add('selected');
        card.setAttribute('aria-pressed', 'true');
        if (qtyInput) qtyInput.value = 1;
    }

    updateStats();
    debouncedPreview();
}

function updateIconQuantity(langId, quantity) {
    if (selectedLanguages.has(langId)) {
        const qty = Math.min(Math.max(parseInt(quantity) || 1, 1), 500);
        selectedLanguages.set(langId, qty);
        const input = document.getElementById(`qty-${langId}`);
        if (input) input.value = qty;
    }
    updateStats();
    debouncedPreview();
}

function updateIconSettings(langId, settingType, value) {
    if (!iconCustomSettings.has(langId)) {
        iconCustomSettings.set(langId, { background: 'global', outline: 'global' });
    }
    const settings = iconCustomSettings.get(langId);
    settings[settingType] = value;
    iconCustomSettings.set(langId, settings);
    debouncedPreview();
}

function selectCategory(category) {
    const cards = document.querySelectorAll(`[data-category="${category}"]`);
    const allSelected = Array.from(cards).every(card => selectedLanguages.has(card.dataset.langid));

    cards.forEach(card => {
        const langId = card.dataset.langid;
        const qtyInput = card.querySelector(`#qty-${langId}`);

        if (allSelected) {
            selectedLanguages.delete(langId);
            card.classList.remove('selected');
            card.setAttribute('aria-pressed', 'false');
            if (qtyInput) qtyInput.value = 1;
        } else {
            selectedLanguages.set(langId, 1);
            card.classList.add('selected');
            card.setAttribute('aria-pressed', 'true');
            if (qtyInput) qtyInput.value = 1;
        }
    });

    updateStats();
    debouncedPreview();
}

function clearSelection() {
    selectedLanguages.clear();
    iconCustomSettings.clear();
    document.querySelectorAll('[data-langid]').forEach(card => {
        card.classList.remove('selected');
        card.setAttribute('aria-pressed', 'false');
        const qtyInput = card.querySelector('input[type="number"]');
        if (qtyInput) qtyInput.value = 1;
        const langId = card.dataset.langid;
        const bgSelect = card.querySelector(`#bg-${langId}`);
        const outlineSelect = card.querySelector(`#outline-${langId}`);
        if (bgSelect) bgSelect.value = 'global';
        if (outlineSelect) outlineSelect.value = 'global';
    });
    updateStats();
    updatePreview();
}

function toggleView(view) {
    currentView = view;
    const buttons = { grouped: 'viewGrouped', all: 'viewAll', local: 'viewLocal' };

    Object.entries(buttons).forEach(([key, id]) => {
        const btn = document.getElementById(id);
        if (!btn) return;
        const isActive = key === view;
        btn.classList.toggle('bg-primary', isActive);
        btn.classList.toggle('text-white', isActive);
        btn.classList.toggle('text-gray-400', !isActive);
        btn.setAttribute('aria-selected', isActive);
    });

    if (view === 'local' && !localModelsLoaded) {
        loadLocalModels();
    }

    renderLanguages();
}

// =====================================================
// STATS & PAPER
// =====================================================
function updateStatsAndPreview() {
    updateStats();
    debouncedPreview();
}

function updateStats() {
    const count = selectedLanguages.size;
    let totalStickers = 0;
    selectedLanguages.forEach(qty => { totalStickers += qty; });

    const el = (id) => document.getElementById(id);
    el('selectedCount').textContent = count;
    el('selectedIcons').textContent = count;
    el('totalStickers').textContent = totalStickers;

    const stickerSize = parseInt(el('stickerSize').value);
    const spacing = parseInt(el('spacing').value);
    const maxFit = calculateMaxFit(stickerSize, spacing);
    el('maxFit').textContent = maxFit;

    const sheetsNeeded = Math.ceil(totalStickers / maxFit);
    el('sheetsNeeded').textContent = totalStickers > 0 ? sheetsNeeded : 0;

    el('generateBtn').disabled = count === 0;
}

function getPaperDimensions() {
    const paperFormat = document.getElementById('paperFormat').value;
    if (paperFormat === 'custom') {
        const width = Math.min(Math.max(parseInt(document.getElementById('customWidth').value) || 210, 50), 1000);
        const height = Math.min(Math.max(parseInt(document.getElementById('customHeight').value) || 297, 50), 1000);
        return { width, height };
    }
    const [width, height] = paperFormat.split(',').map(Number);
    return { width, height };
}

function handlePaperFormatChange() {
    const paperFormat = document.getElementById('paperFormat').value;
    document.getElementById('customPaperSize').style.display = paperFormat === 'custom' ? 'block' : 'none';

    // Update preview aspect-ratio dynamically
    const { width, height } = getPaperDimensions();
    const previewBox = document.getElementById('previewContainer');
    if (previewBox) {
        previewBox.style.aspectRatio = `${width} / ${height}`;
    }

    updateStatsAndPreview();
}

function calculateMaxFit(stickerSize, spacing) {
    const { width, height } = getPaperDimensions();
    const margin = 10;
    const cellSize = stickerSize + spacing;
    const cols = Math.floor((width - 2 * margin) / cellSize);
    const rows = Math.floor((height - 2 * margin) / cellSize);
    return cols * rows;
}

// =====================================================
// SEARCH (debounced via event binding)
// =====================================================
function filterLanguages() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    let visibleCount = 0;
    const totalCount = document.querySelectorAll('[data-langid]').length;

    document.querySelectorAll('[data-langid]').forEach(card => {
        const visible = card.dataset.name.includes(searchTerm);
        card.style.display = visible ? 'flex' : 'none';
        if (visible) visibleCount++;
    });

    // Hide category headers with no visible cards
    document.querySelectorAll('.category-header').forEach(header => {
        const section = header.closest('.mb-6');
        if (!section) return;
        const cards = section.querySelectorAll('[data-langid]');
        const anyVisible = Array.from(cards).some(c => c.style.display !== 'none');
        header.style.display = anyVisible ? 'flex' : 'none';
    });

    // Show/hide "no results" message
    let noResults = document.getElementById('noSearchResults');
    if (searchTerm && visibleCount === 0) {
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.id = 'noSearchResults';
            noResults.className = 'text-center py-8';
            noResults.innerHTML = `
                <p class="text-gray-300 text-sm mb-2">Nenhum icone encontrado para "<strong class="text-white">${searchTerm}</strong>"</p>
                <p class="text-xs text-gray-400">Tente outro termo ou navegue pelas categorias</p>
            `;
            document.getElementById('languagesContainer').appendChild(noResults);
        }
    } else if (noResults) {
        noResults.remove();
    }

    // Show result count while searching
    let searchCount = document.getElementById('searchResultCount');
    if (searchTerm) {
        if (!searchCount) {
            searchCount = document.createElement('div');
            searchCount.id = 'searchResultCount';
            searchCount.className = 'text-xs text-gray-400 mb-2';
            const searchBar = document.getElementById('searchInput').parentElement;
            searchBar.parentElement.insertBefore(searchCount, searchBar.nextSibling);
        }
        searchCount.textContent = `${visibleCount} de ${totalCount} icones`;
    } else if (searchCount) {
        searchCount.remove();
    }
}

// =====================================================
// PREVIEW (with debounce)
// =====================================================
const debouncedPreview = debounce(updatePreview, 300);

async function updatePreview() {
    const previewContainer = document.getElementById('previewContainer');
    const magnifier = document.getElementById('magnifier');

    while (previewContainer.firstChild && previewContainer.firstChild !== magnifier) {
        previewContainer.removeChild(previewContainer.firstChild);
    }

    if (selectedLanguages.size === 0) {
        const placeholder = document.createElement('div');
        placeholder.className = 'text-gray-300 text-xs text-center italic';
        placeholder.innerHTML = 'Clique nos icones ao lado<br>para comecar sua cartela';
        previewContainer.prepend(placeholder);
        cachedMagnifierSvgUrl = null;
        return;
    }

    const generatingText = document.createElement('div');
    generatingText.className = 'text-gray-300 text-xs text-center italic';
    generatingText.textContent = 'Gerando...';
    previewContainer.prepend(generatingText);

    try {
        const stickerSize = parseInt(document.getElementById('stickerSize').value);
        const spacing = parseInt(document.getElementById('spacing').value);
        const shape = document.getElementById('stickerShape').value;
        const maxFit = calculateMaxFit(stickerSize, spacing);

        const uniqueSelectedLangIds = Array.from(selectedLanguages.keys());
        const iconsData = await fetchAllIcons(uniqueSelectedLangIds, false);

        const expandedArray = [];
        selectedLanguages.forEach((quantity, langId) => {
            for (let i = 0; i < quantity; i++) expandedArray.push(langId);
        });

        const svgPreview = generateSheetSVG(0, stickerSize, spacing, shape, maxFit, iconsData, 'cores', expandedArray);

        if (previewContainer.firstChild && previewContainer.firstChild !== magnifier) {
            previewContainer.removeChild(previewContainer.firstChild);
        }
        previewContainer.insertAdjacentHTML('afterbegin', svgPreview);

        const svgElement = previewContainer.querySelector('svg');
        cachedMagnifierSvgUrl = svgElement
            ? `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgElement.outerHTML)}")`
            : null;

        // Show sheet indicator if multiple sheets
        const totalSheets = Math.ceil(expandedArray.length / maxFit);
        if (totalSheets > 1) {
            let indicator = previewContainer.querySelector('.sheet-indicator');
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.className = 'sheet-indicator';
                previewContainer.appendChild(indicator);
            }
            indicator.textContent = `Folha 1 de ${totalSheets}`;
        } else {
            const existing = previewContainer.querySelector('.sheet-indicator');
            if (existing) existing.remove();
        }
    } catch (error) {
        console.error('Erro ao gerar preview:', error);
        if (previewContainer.firstChild && previewContainer.firstChild !== magnifier) {
            previewContainer.removeChild(previewContainer.firstChild);
        }
        const errDiv = document.createElement('div');
        errDiv.className = 'text-red-400 text-xs text-center';
        errDiv.textContent = 'Erro ao gerar preview';
        previewContainer.prepend(errDiv);
        cachedMagnifierSvgUrl = null;
    }
}

// =====================================================
// FILE GENERATION
// =====================================================
async function generateFiles() {
    // Calculate totals for confirmation
    const stickerSize = parseInt(document.getElementById('stickerSize').value);
    const spacing = parseInt(document.getElementById('spacing').value);
    const shape = document.getElementById('stickerShape').value;
    const maxFit = calculateMaxFit(stickerSize, spacing);

    let totalStickers = 0;
    selectedLanguages.forEach(qty => { totalStickers += qty; });
    const totalSheets = Math.ceil(totalStickers / maxFit);
    const totalFiles = totalSheets * 3;

    // Confirmation for bulk downloads (>3 files)
    if (totalFiles > 3) {
        const proceed = confirm(
            `Serao baixados ${totalFiles} arquivos SVG:\n` +
            `${totalSheets} folha(s) x 3 camadas (CORES + BRANCO + VERNIZ)\n\n` +
            `${selectedLanguages.size} icone(s) unico(s) = ${totalStickers} adesivo(s)\n\n` +
            `Deseja continuar?`
        );
        if (!proceed) return;
    }

    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.add('active');

    try {
        const uniqueSelectedLangIds = Array.from(selectedLanguages.keys());
        const iconsData = await fetchAllIcons(uniqueSelectedLangIds, true);

        const expandedArray = [];
        selectedLanguages.forEach((quantity, langId) => {
            for (let i = 0; i < quantity; i++) expandedArray.push(langId);
        });

        document.getElementById('loadingText').textContent = 'Gerando arquivos DTF UV...';

        for (let sheet = 0; sheet < totalSheets; sheet++) {
            for (const layer of ['cores', 'branco', 'verniz']) {
                const svgContent = generateSheetSVG(sheet, stickerSize, spacing, shape, maxFit, iconsData, layer, expandedArray);
                const layerName = layer.toUpperCase();
                downloadFile(`adesivos-${layerName}-sheet${sheet + 1}-de-${totalSheets}.svg`, svgContent, 'image/svg+xml');
            }
        }

        const totalFiles = totalSheets * 3;
        showToast(
            `${totalFiles} arquivo(s) SVG gerado(s)!\n` +
            `${selectedLanguages.size} icone(s) unico(s) = ${expandedArray.length} adesivo(s)\n` +
            `CORES + BRANCO + VERNIZ\n` +
            `Envie os 3 arquivos para grafica!`,
            'success',
            8000
        );
    } catch (error) {
        console.error('Erro ao gerar arquivos:', error);
        showToast('Erro ao gerar arquivos. Tente novamente.', 'error');
    } finally {
        overlay.classList.remove('active');
    }
}

// =====================================================
// ICON FETCHING (with cache + parallel batches)
// =====================================================
const FETCH_BATCH_SIZE = 5;

async function fetchSingleIcon(langId, showLoading, index, total) {
    const card = document.querySelector(`[data-langid="${langId}"]`);
    if (!card) return { lang: {}, svgText: null };

    const lang = JSON.parse(card.dataset.langData || '{}');

    if (showLoading) {
        document.getElementById('loadingProgress').textContent = `${lang.name} (${index + 1}/${total})`;
    }

    if (lang.isLocal) {
        try {
            const response = await fetch(lang.path);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return { lang, svgText: await response.text(), keepOriginalColors: true };
        } catch {
            return { lang, svgText: null };
        }
    }

    if (lang.customSvg) return { lang, svgText: lang.customSvg };

    if (lang.customUrl) {
        try {
            const response = await fetch(lang.customUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return { lang, svgText: await response.text() };
        } catch {
            return { lang, svgText: null };
        }
    }

    if (!lang.devicon && !lang.icon) return { lang, svgText: null };

    const iconName = lang.devicon || lang.icon;
    const variant = lang.variant || 'original';
    let iconUrl;
    if (lang.source === 'simpleicons') {
        iconUrl = `https://cdn.simpleicons.org/${lang.icon}`;
    } else {
        iconUrl = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${iconName}/${iconName}-${variant}.svg`;
    }

    try {
        const response = await fetch(iconUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        let svgText = await response.text();

        if (lang.source === 'simpleicons' && lang.color) {
            svgText = svgText.replace(/currentColor/g, lang.color);
            svgText = svgText.replace(/fill="#000"/g, `fill="${lang.color}"`);
            svgText = svgText.replace(/fill="#000000"/g, `fill="${lang.color}"`);
            svgText = svgText.replace(/fill="black"/g, `fill="${lang.color}"`);
            svgText = svgText.replace(/<path /g, `<path fill="${lang.color}" `);
        }

        return { lang, svgText };
    } catch {
        return { lang, svgText: null };
    }
}

async function fetchAllIcons(selectedArray, showLoading) {
    const iconsData = {};
    const total = selectedArray.length;

    if (showLoading) {
        document.getElementById('loadingText').textContent = 'Baixando icones...';
    }

    const uncached = [];
    selectedArray.forEach((langId, i) => {
        if (svgCache.has(langId)) {
            iconsData[langId] = svgCache.get(langId);
        } else {
            uncached.push({ langId, index: i });
        }
    });

    for (let i = 0; i < uncached.length; i += FETCH_BATCH_SIZE) {
        const batch = uncached.slice(i, i + FETCH_BATCH_SIZE);
        const promises = batch.map(({ langId, index }) =>
            fetchSingleIcon(langId, showLoading, index, total)
        );
        const results = await Promise.allSettled(promises);

        results.forEach((result, idx) => {
            const { langId } = batch[idx];
            const data = result.status === 'fulfilled' ? result.value : { lang: {}, svgText: null };
            svgCache.set(langId, data);
            iconsData[langId] = data;
        });
    }

    if (showLoading) {
        document.getElementById('loadingText').textContent = 'Gerando SVG...';
        document.getElementById('loadingProgress').textContent = '';
    }

    return iconsData;
}

// =====================================================
// DOWNLOAD
// =====================================================
function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// =====================================================
// MAGNIFIER (uses cached SVG)
// =====================================================
function setupMagnifier() {
    const previewContainer = document.getElementById('previewContainer');
    const magnifier = document.getElementById('magnifier');

    document.addEventListener('mousemove', (e) => {
        if (selectedLanguages.size === 0 || !cachedMagnifierSvgUrl) {
            magnifier.style.display = 'none';
            return;
        }

        const rect = previewContainer.getBoundingClientRect();
        const isOver = e.clientX >= rect.left && e.clientX <= rect.right &&
                       e.clientY >= rect.top && e.clientY <= rect.bottom;

        if (!isOver) {
            magnifier.style.display = 'none';
            previewContainer.classList.remove('zooming');
            return;
        }

        magnifier.style.display = 'block';
        previewContainer.classList.add('zooming');

        const stickerSize = parseInt(document.getElementById('stickerSize').value);
        const zoomLevel = 4.5 - ((stickerSize - 10) * (4.5 - 1.5)) / (40 - 10);

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        magnifier.style.left = `${x - magnifier.offsetWidth / 2}px`;
        magnifier.style.top = `${y - magnifier.offsetHeight / 2}px`;
        magnifier.style.backgroundImage = cachedMagnifierSvgUrl;
        magnifier.style.backgroundSize = `${rect.width * zoomLevel}px ${rect.height * zoomLevel}px`;
        magnifier.style.backgroundPosition = `-${(x * zoomLevel) - magnifier.offsetWidth / 2}px -${(y * zoomLevel) - magnifier.offsetHeight / 2}px`;
    });
}

// =====================================================
// SIDEBAR TOGGLE (MOBILE)
// =====================================================
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const toggle = document.getElementById('sidebarToggle');

    if (!sidebar) return;

    const isOpen = sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active', isOpen);
    if (toggle) toggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu de configuracoes');
}

// =====================================================
// EVENT BINDING (replaces all inline handlers)
// =====================================================
function bindEvents() {
    const debouncedFilter = debounce(filterLanguages, 200);

    // Search
    document.getElementById('searchInput').addEventListener('input', debouncedFilter);

    // View toggle
    document.getElementById('viewGrouped').addEventListener('click', () => toggleView('grouped'));
    document.getElementById('viewAll').addEventListener('click', () => toggleView('all'));
    document.getElementById('viewLocal').addEventListener('click', () => toggleView('local'));

    // Sidebar config controls
    document.getElementById('paperFormat').addEventListener('change', handlePaperFormatChange);
    document.getElementById('stickerSize').addEventListener('change', updateStatsAndPreview);
    document.getElementById('spacing').addEventListener('change', updateStatsAndPreview);
    document.getElementById('stickerShape').addEventListener('change', () => debouncedPreview());
    document.getElementById('stickerBackground').addEventListener('change', updateStatsAndPreview);
    document.getElementById('outlineStyle').addEventListener('change', () => debouncedPreview());

    const customWidth = document.getElementById('customWidth');
    const customHeight = document.getElementById('customHeight');
    if (customWidth) customWidth.addEventListener('change', updateStatsAndPreview);
    if (customHeight) customHeight.addEventListener('change', updateStatsAndPreview);

    // Action buttons
    document.getElementById('generateBtn').addEventListener('click', generateFiles);
    document.getElementById('clearBtn').addEventListener('click', clearSelection);

    // Card event delegation (click)
    const container = document.getElementById('languagesContainer');

    container.addEventListener('click', (e) => {
        // Ignore clicks on inputs and selects
        if (e.target.matches('input, select, option')) return;

        // Category "Selecionar" button
        const catBtn = e.target.closest('.category-select-btn');
        if (catBtn) {
            e.stopPropagation();
            selectCategory(catBtn.dataset.category);
            return;
        }

        // Card click
        const card = e.target.closest('[data-langid]');
        if (!card) return;
        const lang = JSON.parse(card.dataset.langData);
        toggleSelection(card, lang);
    });

    // Card event delegation (change - qty/settings inputs inside cards)
    container.addEventListener('change', (e) => {
        const card = e.target.closest('[data-langid]');
        if (!card) return;
        const langId = card.dataset.langid;
        const setting = e.target.dataset.setting;

        if (setting === 'quantity') {
            updateIconQuantity(langId, e.target.value);
        } else if (setting === 'background') {
            updateIconSettings(langId, 'background', e.target.value);
        } else if (setting === 'outline') {
            updateIconSettings(langId, 'outline', e.target.value);
        }
    });

    // Keyboard navigation on cards
    container.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const card = e.target.closest('[data-langid]');
            if (card && e.target === card) {
                e.preventDefault();
                const lang = JSON.parse(card.dataset.langData);
                toggleSelection(card, lang);
            }
        }
    });

    // Sidebar toggle (mobile)
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);

    // Close sidebar on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && sidebar.classList.contains('open')) {
                toggleSidebar();
            }
        }
    });
}

// =====================================================
// INIT
// =====================================================
function init() {
    bindEvents();
    renderLanguages();
    updateStats();
    setupMagnifier();
}

window.addEventListener('DOMContentLoaded', init);
