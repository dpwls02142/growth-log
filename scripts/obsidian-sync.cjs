const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const glob = require('glob');
require('dotenv').config();

// 옵시디언 볼트 경로 설정
const OBSIDIAN_VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH;
const BLOG_PATH = path.join(__dirname, '..', 'blog');

console.log('🚀 옵시디언과 vitepress 블로그를 연동합니다');

// 경로 확인
if (!OBSIDIAN_VAULT_PATH || !fs.existsSync(OBSIDIAN_VAULT_PATH)) {
    process.exit(1);
}

function getCategoryFromPath(filePath) {
    // 옵시디언 볼트 경로를 제외한 상대 경로 구하기
    const relativePath = path.relative(OBSIDIAN_VAULT_PATH, filePath);
    // 첫 번째 폴더를 카테고리로 사용
    const firstFolder = relativePath.split(path.sep)[0];
    return firstFolder || 'uncategorized';
}

// 옵시디언 문법을 VitePress 호환 문법으로 변환
function convertObsidianToVitePress(content) {
    let convertedContent = content;

    // 1. 형광펜 ==텍스트== -> <mark>텍스트</mark>
    convertedContent = convertedContent.replace(/==(.*?)==/g, '<mark>$1</mark>');

    // 2. 줄바꿈 처리 개선 - 옵시디언은 단일 줄바꿈도 처리하는데 일반 마크다운은 2개 필요
    // 단락 구분을 명확히 하기 위해 빈 줄이 없는 줄바꿈에 <br> 추가
    convertedContent = convertedContent.replace(/([^\n])\n([^\n])/g, '$1  \n$2');

    // 3. 옵시디언 링크 [[링크]] -> [링크](링크.md)
    convertedContent = convertedContent.replace(/\[\[(.*?)\]\]/g, '[$1]($1.md)');


    return convertedContent;
}

function processMarkdownFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, { encoding: 'utf8' });
        const { data, content: markdownContent } = matter(content);

        const convertedContent = convertObsidianToVitePress(markdownContent);

        // 카테고리 결정 (파일 경로의 첫 번째 폴더 사용)
        const category = getCategoryFromPath(filePath);
        const categoryPath = path.join(BLOG_PATH, category);

        // 파일명 생성
        const fileName = path.basename(filePath);
        const targetPath = path.join(categoryPath, fileName);

        // 메타데이터 추가
        const frontMatter = {
            title: data.title || path.parse(fileName).name, // 타이틀은 파일명과 동일하게
            date: data.date || new Date().toISOString().split('T')[0], // 날짜는 파일 생성 날짜
            category: category,
            ...data
        };

        // 새 파일 생성
        const newContent = matter.stringify(convertedContent, frontMatter);
        fs.writeFileSync(targetPath, newContent, { encoding: 'utf8' });

        console.log(`✅ 파일 생성 완료: ${fileName} -> ${category}/${fileName}`);
        return true;
    } catch (error) {
        console.error(`❌ 파일 생성 오류 ${filePath}:`, error.message);
        return false;
    }
}

// 모든 .md 파일 찾기
console.log('🔍 markdown 파일을 찾고 있습니다..');

const mdFiles = glob.sync('**/*.md', {
    cwd: OBSIDIAN_VAULT_PATH,
    ignore: [
        '**/.obsidian/**',
        '**/.trash/**',
        '**/node_modules/**'
    ]
});

console.log(`📄 ${mdFiles.length}개의 markdown 파일을 찾았습니다.`);

// 각 파일 처리
let processedCount = 0;
let errorCount = 0;

mdFiles.forEach(file => {
    const fullPath = path.join(OBSIDIAN_VAULT_PATH, file);
    if (processMarkdownFile(fullPath)) {
        processedCount++;
    } else {
        errorCount++;
    }
});

// 결과 출력
console.log(`✅ ${processedCount}개의 파일이 연동됐습니다.`);
if (errorCount > 0) {
    console.log(`❌${errorCount}개의 파일이 연동되지 않았습니다.`);
}
process.exit(0);