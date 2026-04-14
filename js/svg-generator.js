// HardSkills DTF UV - SVG Generation & Sanitization

/**
 * Sanitizes SVG content: renames IDs/classes to avoid collisions,
 * removes dangerous elements (XSS prevention), optionally replaces colors.
 */
function getSanitizedSvgContent(svgText, uniquePrefix, replaceColor) {
    if (!svgText) return '';
    try {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');
        if (!svgElement) return '';

        // Security: remove dangerous elements
        const dangerousTags = ['script', 'foreignObject', 'iframe', 'object', 'embed'];
        dangerousTags.forEach(tag => {
            svgElement.querySelectorAll(tag).forEach(el => el.remove());
        });

        // Security: remove event handlers and javascript: hrefs from ALL elements
        const eventAttrs = [
            'onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout',
            'onfocus', 'onblur', 'onanimationend', 'onanimationstart'
        ];
        svgElement.querySelectorAll('*').forEach(el => {
            eventAttrs.forEach(attr => el.removeAttribute(attr));
            ['href', 'xlink:href'].forEach(attr => {
                const val = el.getAttribute(attr);
                if (val && val.trim().toLowerCase().startsWith('javascript:')) {
                    el.removeAttribute(attr);
                }
            });
        });

        const prefix = uniquePrefix || `icon-${Math.random().toString(36).substring(2, 11)}-`;

        // Rename IDs and all references to them
        svgElement.querySelectorAll('[id]').forEach(el => {
            const oldId = el.id;
            const newId = prefix + oldId;
            el.id = newId;
            svgElement.querySelectorAll(`[fill="url(#${oldId})"]`).forEach(ref => ref.setAttribute('fill', `url(#${newId})`));
            svgElement.querySelectorAll(`[stroke="url(#${oldId})"]`).forEach(ref => ref.setAttribute('stroke', `url(#${newId})`));
            svgElement.querySelectorAll(`[href="#${oldId}"]`).forEach(ref => ref.setAttribute('href', `#${newId}`));
            svgElement.querySelectorAll(`[xlink\\:href="#${oldId}"]`).forEach(ref => ref.setAttribute('xlink:href', `#${newId}`));
        });

        // Rename CSS classes in <style> and class attributes
        svgElement.querySelectorAll('style').forEach(style => {
            style.textContent = style.textContent.replace(/\.([a-zA-Z0-9_-]+)/g, `.${prefix}$1`);
        });
        svgElement.querySelectorAll('[class]').forEach(el => {
            const oldClass = el.getAttribute('class');
            const newClass = oldClass.split(' ').map(c => prefix + c).join(' ');
            el.setAttribute('class', newClass);
        });

        // Color replacement
        if (replaceColor) {
            svgElement.querySelectorAll('[fill]').forEach(el => {
                const fillValue = el.getAttribute('fill');
                if (fillValue === 'currentColor' || fillValue === '#000' || fillValue === '#000000' || fillValue === 'black') {
                    el.setAttribute('fill', replaceColor);
                }
            });
            svgElement.querySelectorAll('path:not([fill]), circle:not([fill]), rect:not([fill]), polygon:not([fill])').forEach(el => {
                el.setAttribute('fill', replaceColor);
            });
        }

        return svgElement.innerHTML;
    } catch (e) {
        return '';
    }
}

/**
 * Generates a single sheet SVG for a given layer type (cores/branco/verniz).
 */
function generateSheetSVG(sheetIndex, stickerSize, spacing, shape, maxFit, iconsData, layerType, expandedArray) {
    const start = sheetIndex * maxFit;
    const end = Math.min(start + maxFit, expandedArray.length);
    const sheetLanguages = expandedArray.slice(start, end);

    const { width: paperWidth, height: paperHeight } = getPaperDimensions();
    const margin = 10;
    const cellSize = stickerSize + spacing;
    const cols = Math.floor((paperWidth - 2 * margin) / cellSize);

    const layerConfig = {
        cores: { title: `Adesivos CORES (CMYK) - Folha ${sheetIndex + 1}`, bgColor: 'white', description: 'Camada de impressao colorida - Enviar para impressora CMYK' },
        branco: { title: `Adesivos BRANCO (White Layer) - Folha ${sheetIndex + 1}`, bgColor: 'black', description: 'Camada de tinta branca - Define base opaca para cores' },
        verniz: { title: `Adesivos VERNIZ (UV Relief) - Folha ${sheetIndex + 1}`, bgColor: 'black', description: 'Camada de verniz UV - Define areas com efeito 3D em alto relevo' }
    };
    const config = layerConfig[layerType];

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${paperWidth}mm" height="${paperHeight}mm" viewBox="0 0 ${paperWidth} ${paperHeight}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <title>${config.title}</title>
  <desc>${config.description}</desc>
  <rect width="${paperWidth}" height="${paperHeight}" fill="${config.bgColor}"/>
`;

    let defs = '\n  <defs>';

    // Outline filters for cores layer
    const outlineStyle = document.getElementById('outlineStyle')?.value || 'none';
    if (layerType === 'cores' && outlineStyle !== 'none') {
        defs += `
    <filter id="outline-auto">
      <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="1"/>
      <feFlood flood-color="black" flood-opacity="0.8" result="flood"/>
      <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
      <feMerge><feMergeNode in="outline"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="outline-double">
      <feMorphology in="SourceAlpha" result="dilated1" operator="dilate" radius="2"/>
      <feFlood flood-color="black" flood-opacity="0.8" result="black"/>
      <feComposite in="black" in2="dilated1" operator="in" result="outline1"/>
      <feMorphology in="SourceAlpha" result="dilated2" operator="dilate" radius="1"/>
      <feFlood flood-color="white" flood-opacity="0.9" result="white"/>
      <feComposite in="white" in2="dilated2" operator="in" result="outline2"/>
      <feMerge><feMergeNode in="outline1"/><feMergeNode in="outline2"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="outline-white">
      <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="1"/>
      <feFlood flood-color="white" flood-opacity="0.9" result="flood"/>
      <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
      <feMerge><feMergeNode in="outline"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="outline-black">
      <feMorphology in="SourceAlpha" result="dilated" operator="dilate" radius="1"/>
      <feFlood flood-color="black" flood-opacity="0.9" result="flood"/>
      <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
      <feMerge><feMergeNode in="outline"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>`;
    }

    // Create symbols with unique prefixes
    const symbolPrefixes = new Map();
    sheetLanguages.forEach((langId, index) => {
        const iconData = iconsData[langId];
        if (!iconData || !iconData.svgText) return;

        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(iconData.svgText, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');

        if (svgElement) {
            const viewBox = svgElement.getAttribute('viewBox') || '0 0 128 128';
            const iconId = langId.replace(/[^a-zA-Z0-9]/g, '-');
            const uniquePrefix = `${iconId}-${sheetIndex}-${index}-`;
            symbolPrefixes.set(langId + '-' + index, uniquePrefix);

            const lang = iconData.lang;
            const iconColor = (layerType === 'cores') ? (lang.color || '#cccccc') : 'white';
            const isLocalModel = iconData.keepOriginalColors === true;

            const usesCurrentColor = iconData.svgText.includes('currentColor');
            const hasOnlyBlack = /fill="(#000|#000000|black|currentColor)"/.test(iconData.svgText) &&
                                 !/fill="#(?!000$|000000$)[0-9a-fA-F]{3,6}"/.test(iconData.svgText);

            let shouldReplaceColor;
            if (isLocalModel && layerType === 'cores') {
                shouldReplaceColor = false;
            } else if (layerType === 'branco' || layerType === 'verniz') {
                shouldReplaceColor = true;
            } else {
                shouldReplaceColor = (usesCurrentColor || hasOnlyBlack);
            }

            const innerHTML = getSanitizedSvgContent(iconData.svgText, uniquePrefix, shouldReplaceColor ? iconColor : null);
            defs += `\n    <symbol id="icon-${uniquePrefix}" viewBox="${viewBox}">${innerHTML.trim()}</symbol>`;
        }
    });
    defs += '\n  </defs>';
    svg += defs;

    // Render stickers
    sheetLanguages.forEach((langId, index) => {
        const iconData = iconsData[langId];
        if (!iconData) return;
        const lang = iconData.lang;
        if (!lang) return;

        const row = Math.floor(index / cols);
        const col = index % cols;
        const x = margin + (col * cellSize) + (cellSize / 2);
        const y = margin + (row * cellSize) + (cellSize / 2);

        const iconSize = stickerSize;
        const uniquePrefix = symbolPrefixes.get(langId + '-' + index);
        const iconId = `icon-${uniquePrefix}`;

        svg += `\n  <g transform="translate(${x}, ${y})">`;

        // Per-icon or global settings
        const customSettings = iconCustomSettings.get(langId);
        const stickerBackground = (customSettings && customSettings.background !== 'global')
            ? customSettings.background
            : document.getElementById('stickerBackground').value;
        const outlineStyleForIcon = (customSettings && customSettings.outline !== 'global')
            ? customSettings.outline
            : document.getElementById('outlineStyle')?.value || 'none';

        const iconColor = lang.color || '#cccccc';

        if (layerType === 'cores' && stickerBackground !== 'transparent') {
            const bgColor = getBackgroundColor(iconColor, stickerBackground);
            const bgSize = stickerSize;
            const borderRadius = (shape === 'rounded') ? bgSize * 0.15 : 0;

            if (shape === 'circle') {
                svg += `\n    <circle cx="0" cy="0" r="${bgSize / 2}" fill="${bgColor}" />`;
            } else {
                svg += `\n    <rect x="${-bgSize / 2}" y="${-bgSize / 2}" width="${bgSize}" height="${bgSize}" rx="${borderRadius}" ry="${borderRadius}" fill="${bgColor}" />`;
            }
        }

        if (iconData.svgText) {
            let filterAttr = '';
            if (layerType === 'cores' && outlineStyleForIcon !== 'none' && outlineStyleForIcon !== 'complementary') {
                filterAttr = `filter="url(#outline-${outlineStyleForIcon})"`;
            }
            svg += `\n    <svg x="${-iconSize / 2}" y="${-iconSize / 2}" width="${iconSize}" height="${iconSize}" preserveAspectRatio="xMidYMid meet">`;
            svg += `\n      <use href="#${iconId}" width="100%" height="100%" ${filterAttr}/>`;
            svg += `\n    </svg>`;
        } else {
            const fontSize = stickerSize / 8;
            svg += `\n    <text x="0" y="${fontSize / 3}" text-anchor="middle" font-size="${fontSize}" font-weight="bold" fill="${(layerType === 'cores') ? (lang.color || '#666') : 'white'}">${lang.name}</text>`;
        }

        svg += `\n  </g>`;
    });

    svg += `\n</svg>`;
    return svg;
}
