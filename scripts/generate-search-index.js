const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, '..', 'docs');
const outputDir = path.join(__dirname, '..', 'src', 'data');
const outputFile = path.join(outputDir, 'searchIndex.json');

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function getFiles(dir, files_ = []) {
  const files = fs.readdirSync(dir);
  for (const i in files) {
    const name = path.join(dir, files[i]);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      if (name.endsWith('.md') || name.endsWith('.mdx')) {
        files_.push(name);
      }
    }
  }
  return files_;
}

function parseMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(docsDir, filePath);
  
  let slug = '';
  let title = '';
  let fmKeywords = '';
  
  // 1. Parse Frontmatter
  const fmRegex = /^---([\s\S]*?)---/;
  const match = content.match(fmRegex);
  let mainContent = content;
  
  if (match) {
    const fmText = match[1];
    mainContent = content.substring(match[0].length);
    
    // Parse slug
    const slugMatch = fmText.match(/^slug:\s*(.+)$/m);
    if (slugMatch) {
      slug = slugMatch[1].trim();
    }
    
    // Parse title
    const titleMatch = fmText.match(/^title:\s*(.+)$/m);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }
    
    // Parse keywords in frontmatter if any
    const kwMatch = fmText.match(/^keywords:\s*(.+)$/m);
    if (kwMatch) {
      fmKeywords = kwMatch[1].trim();
    }
  }
  
  // 2. If no slug, generate from relative path
  if (!slug) {
    // Replace backslashes, remove extension
    const cleanRelPath = relativePath
      .replace(/\\/g, '/')
      .replace(/\.mdx?$/, '');
    slug = '/' + cleanRelPath;
  }
  
  // 3. If no title, find first H1
  if (!title) {
    const h1Regex = /^#\s+(.+)$/m;
    const h1Match = mainContent.match(h1Regex);
    if (h1Match) {
      title = h1Match[1].trim();
    } else {
      title = path.basename(filePath, path.extname(filePath));
    }
  }
  
  // 4. Extract keywords from index-text spans
  const indexTextRegex = /<span\s+class(?:Name)?=['"]index-text['"]\s*>([\s\S]*?)<\/span>/gi;
  let indexSpansText = [];
  let spanMatch;
  while ((spanMatch = indexTextRegex.exec(mainContent)) !== null) {
    indexSpansText.push(spanMatch[1].trim());
  }
  
  // 5. Extract headings (H2, H3)
  const headingRegex = /^##+\s+(.+)$/gm;
  let headings = [];
  let headingMatch;
  while ((headingMatch = headingRegex.exec(mainContent)) !== null) {
    headings.push(headingMatch[1].trim());
  }
  
  // Extract category from folder name
  const parentFolder = path.dirname(relativePath);
  let category = '';
  if (parentFolder !== '.') {
    category = parentFolder.replace(/\\/g, '/');
  }

  // Get English filename keywords
  const filenameBase = path.basename(filePath, path.extname(filePath));

  return {
    title,
    slug,
    category,
    filename: filenameBase,
    keywords: indexSpansText.join(' '),
    fmKeywords,
    headings: headings.join(' '),
  };
}

function generateIndex() {
  console.log('Generating search index...');
  const files = getFiles(docsDir);
  const indexData = [];
  
  for (const file of files) {
    // Skip index or readme files if they shouldn't be searched
    if (path.basename(file).toLowerCase() === 'readme.md') continue;
    
    try {
      const parsed = parseMarkdownFile(file);
      indexData.push(parsed);
    } catch (err) {
      console.error(`Error parsing file ${file}:`, err);
    }
  }
  
  ensureDirectoryExistence(outputFile);
  fs.writeFileSync(outputFile, JSON.stringify(indexData, null, 2), 'utf8');
  console.log(`Successfully generated search index at ${outputFile} with ${indexData.length} items.`);
}

generateIndex();
