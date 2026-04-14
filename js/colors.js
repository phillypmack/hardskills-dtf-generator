// HardSkills DTF UV - Color Utility Functions

function getColorLuminance(hexColor) {
    if (!hexColor || hexColor === 'transparent') return 0.5;
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function getContrastColor(hexColor) {
    return getColorLuminance(hexColor) > 0.5 ? '#000000' : '#FFFFFF';
}

function getComplementaryColor(hexColor) {
    if (!hexColor || hexColor === 'transparent') return '#FFFFFF';
    const hex = hexColor.replace('#', '');
    const r = (255 - parseInt(hex.substring(0, 2), 16)).toString(16).padStart(2, '0');
    const g = (255 - parseInt(hex.substring(2, 4), 16)).toString(16).padStart(2, '0');
    const b = (255 - parseInt(hex.substring(4, 6), 16)).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}

function getPastelColor(hexColor) {
    if (!hexColor || hexColor === 'transparent') return '#F0F0F0';
    const hex = hexColor.replace('#', '');
    const r = Math.round(parseInt(hex.substring(0, 2), 16) * 0.6 + 255 * 0.4).toString(16).padStart(2, '0');
    const g = Math.round(parseInt(hex.substring(2, 4), 16) * 0.6 + 255 * 0.4).toString(16).padStart(2, '0');
    const b = Math.round(parseInt(hex.substring(4, 6), 16) * 0.6 + 255 * 0.4).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}

function getDarkVibrantColor(hexColor) {
    if (!hexColor || hexColor === 'transparent') return '#1A1A1A';
    const hex = hexColor.replace('#', '');
    const r = Math.round(parseInt(hex.substring(0, 2), 16) * 0.4).toString(16).padStart(2, '0');
    const g = Math.round(parseInt(hex.substring(2, 4), 16) * 0.4).toString(16).padStart(2, '0');
    const b = Math.round(parseInt(hex.substring(4, 6), 16) * 0.4).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}

function getBackgroundColor(iconColor, strategy) {
    switch (strategy) {
        case 'transparent': return 'transparent';
        case 'icon_color': return iconColor;
        case 'white': return '#FFFFFF';
        case 'black': return '#000000';
        case 'auto_contrast': return getContrastColor(iconColor);
        case 'complementary': return getComplementaryColor(iconColor);
        case 'light_pastel': return getPastelColor(iconColor);
        case 'dark_vibrant': return getDarkVibrantColor(iconColor);
        default: return 'transparent';
    }
}

function getOutlineFilter(iconColor, outlineStyle) {
    switch (outlineStyle) {
        case 'none': return '';
        case 'auto': {
            const contrastColor = getContrastColor(iconColor);
            const rgb = contrastColor === '#FFFFFF' ? '255, 255, 255' : '0, 0, 0';
            return `drop-shadow(0 0 2px rgba(${rgb}, 0.8))`;
        }
        case 'double':
            return `drop-shadow(0 0 3px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 1px rgba(255, 255, 255, 0.9))`;
        case 'white':
            return `drop-shadow(0 0 2px rgba(255, 255, 255, 0.9))`;
        case 'black':
            return `drop-shadow(0 0 2px rgba(0, 0, 0, 0.9))`;
        case 'complementary': {
            const compColor = getComplementaryColor(iconColor).replace('#', '');
            const r = parseInt(compColor.substring(0, 2), 16);
            const g = parseInt(compColor.substring(2, 4), 16);
            const b = parseInt(compColor.substring(4, 6), 16);
            return `drop-shadow(0 0 2px rgba(${r}, ${g}, ${b}, 0.8))`;
        }
        default: return '';
    }
}
