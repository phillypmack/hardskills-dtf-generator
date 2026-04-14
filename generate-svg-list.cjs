/**
 * Script Node.js para gerar lista de arquivos SVG
 * Execute: node generate-svg-list.js
 */

const fs = require('fs');
const path = require('path');

const svgDir = path.join(__dirname, 'svg');
const outputFile = path.join(__dirname, 'svg-list.json');

try {
    // Lê todos os arquivos da pasta svg/
    const files = fs.readdirSync(svgDir);

    // Filtra apenas arquivos .svg
    const svgFiles = files.filter(file => file.toLowerCase().endsWith('.svg'));

    // Ordena alfabeticamente
    svgFiles.sort();

    // Cria objeto com informações
    const svgList = {
        generated: new Date().toISOString(),
        count: svgFiles.length,
        files: svgFiles
    };

    // Salva no arquivo JSON
    fs.writeFileSync(outputFile, JSON.stringify(svgList, null, 2));

    console.log(`✅ Lista gerada com sucesso!`);
    console.log(`📁 Total de arquivos SVG: ${svgFiles.length}`);
    console.log(`💾 Arquivo salvo em: ${outputFile}`);

} catch (error) {
    console.error('❌ Erro ao gerar lista:', error.message);
    process.exit(1);
}
