const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const glob = require('glob');
require('dotenv').config();

// 옵시디언 볼트 경로 설정
const OBSIDIAN_VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH;
const BLOG_PATH = path.join(__dirname, '..', 'blog');
const PUBLIC_PATH = path.join(__dirname, '..', 'public');

console.log('🚀 옵시디언과 vitepress 블로그를 연동합니다');

// 경로 확인
if (!OBSIDIAN_VAULT_PATH || !fs.existsSync(OBSIDIAN_VAULT_PATH)) {
    console.error('❌ 옵시디언 볼트 경로가 올바르지 않습니다');
    process.exit(1);
}

function getCategoryStructure(filePath) {
    // 옵시디언 볼트 경로를 제외한 상대 경로 구하기
    const relativePath = path.relative(OBSIDIAN_VAULT_PATH, filePath);
    console.log(`🔍 상대 경로: ${relativePath}`);

    // 폴더 구조를 옵시디언과 동일하게 그대로 유지
    const folders = path.dirname(relativePath).split(path.sep).filter(folder => folder !== '.');
    console.log(`📁 폴더 배열: ${JSON.stringify(folders)}`);

    return {
        categoryPath: folders.join(path.sep), // 실제 폴더 구조용
        categoryId: folders.join('-'), // URL/ID용
        folders: folders
    };
}

// 이미지 파일을 public 폴더로 복사
function copyImageToPublic(imagePath, categoryPath) {
    try {
        const fileName = path.basename(imagePath);
        const publicImageDir = path.join(PUBLIC_PATH, 'images', categoryPath);

        if (!fs.existsSync(publicImageDir)) {
            fs.mkdirSync(publicImageDir, { recursive: true });
        }

        const targetPath = path.join(publicImageDir, fileName);

        // 이미지 파일 복사
        if (fs.existsSync(imagePath)) {
            fs.copyFileSync(imagePath, targetPath);
            console.log(`📷 이미지 복사 완료: ${fileName} -> /images/${categoryPath}/${fileName}`);
            return `/images/${categoryPath.replace(/\\/g, '/')}/${fileName}`; // Windows 경로 처리
        }

        return null;
    } catch (error) {
        console.error(`❌ 이미지 복사 오류 ${imagePath}:`, error.message);
        return null;
    }
}

// 옵시디언 문법을 VitePress 호환 문법으로 변환
function convertObsidianToVitePress(content, filePath, categoryPath) {
    let convertedContent = content;

    // 1. 이미지 처리
    const imageRegex = /!\[\[(.*?)(?:\s*\|\s*(\d+))?\]\]|!\[([^\]]*)\]\(([^)]+)\)/g;
    convertedContent = convertedContent.replace(imageRegex, (
        match, obsidianImage, obsidianWidth, mdAlt, mdPath, mdWidth
    ) => {
        let imagePath, alt, imgWidth;

        if (obsidianImage) {
            imagePath = obsidianImage.trim();
            alt = path.parse(imagePath).name;
            imgWidth = obsidianWidth ? `${obsidianWidth}` : null;
        } else {
            imagePath = mdPath.trim();
            alt = mdAlt || path.parse(imagePath).name;
            imgWidth = mdWidth ? `${mdWidth}` : null;
        }

        let fullImagePath;
        if (path.isAbsolute(imagePath)) {
            fullImagePath = imagePath;
        } else {
            const currentDir = path.dirname(filePath);
            fullImagePath = path.join(currentDir, imagePath);

            if (!fs.existsSync(fullImagePath)) {
                fullImagePath = path.join(OBSIDIAN_VAULT_PATH, imagePath);
            }
        }

        const publicImagePath = copyImageToPublic(fullImagePath, categoryPath);

        if (publicImagePath) {
            if (imgWidth) {
                return `<img src="${publicImagePath}" alt="${alt}" width="${imgWidth}">`;
            } else {
                return `![${alt}](${publicImagePath})`;
            }
        } else {
            console.warn(`⚠️이미지를 찾을 수 없습니다: ${imagePath}`);
            return match;
        }
    });


    // 2. 형광펜 ==텍스트== -> <mark>텍스트</mark>
    convertedContent = convertedContent.replace(/==(.*?)==/g, '<mark>$1</mark>');

    // 3. 줄바꿈 처리
    convertedContent = convertedContent.replace(/([^\n])\n([^\n])/g, '$1  \n$2');

    // 옵시디언 링크 [[링크]] -> [링크](링크.md)
    convertedContent = convertedContent.replace(/\[\[(.*?)\]\]/g, '[$1]($1.md)');

    return convertedContent;
}

function processMarkdownFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, { encoding: 'utf8' });
        const { data, content: markdownContent } = matter(content);

        // 카테고리 구조 정보 가져오기
        const categoryInfo = getCategoryStructure(filePath);
        const targetDir = path.join(BLOG_PATH, categoryInfo.categoryPath); // blog/til/2025年/6月

        console.log(`📂 타겟 디렉토리: ${targetDir}`);

        // 중첩된 폴더 구조 생성
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
            console.log(`📁 폴더 생성: ${targetDir}`);
        }

        const convertedContent = convertObsidianToVitePress(markdownContent, filePath, categoryInfo.categoryPath);

        // 파일명 생성
        const fileName = path.basename(filePath);
        const targetPath = path.join(targetDir, fileName);

        // 메타데이터 추가
        const frontMatter = {
            title: data.title || path.parse(fileName).name,
            category: categoryInfo.categoryId, // til-2025年-6月
            categoryPath: categoryInfo.categoryPath, // til/2025年/6月
            ...data
        };

        // 새 파일 생성
        const newContent = matter.stringify(convertedContent, frontMatter);
        fs.writeFileSync(targetPath, newContent, { encoding: 'utf8' });

        console.log(`✅ 파일 생성 완료: ${fileName} -> ${categoryInfo.categoryPath}/${fileName}`);
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