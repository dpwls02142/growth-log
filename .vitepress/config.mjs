import { defineConfig } from "vitepress";
import { readdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { getIcon, getExternalLink } from "./icons";

function buildSidebarFromDirectory(dir, basePath = "/blog", depth = 0) {
  const items = [];

  try {
    const entries = readdirSync(dir, { withFileTypes: true });

    // 폴더들 처리
    const folders = entries
      .filter((entry) => entry.isDirectory())
      .map((folder) => {
        const folderPath = join(dir, folder.name);
        return {
          name: folder.name,
          path: folderPath,
        };
      });

    for (const folder of folders) {
      const folderName = folder.name;
      const externalLink = getExternalLink(folderName);
      const urlPath = `${basePath}/${folder.name}`;
      const subItems = buildSidebarFromDirectory(folder.path, urlPath, depth + 1);

      if (subItems.length > 0) {
        items.push({
          text: `${getIcon(folderName)} ${folderName}`,
          collapsed: folderName === "projects"
            ? true
            : basePath.startsWith("/blog/til")
              ? depth >= 3
              : (depth === 0 ? false : depth === 1 ? false : true),
          items: subItems,
          link: externalLink ?? undefined,
        });

      }
    }

    // 마크다운 파일들 처리
    const mdFiles = entries
      .filter(
        (entry) =>
          entry.isFile() &&
          entry.name.endsWith(".md") &&
          entry.name !== "index.md"
      )
      .map((file) => {
        const filePath = join(dir, file.name);
        let date = new Date(0);

        try {
          const content = readFileSync(filePath, "utf-8");
          const parsed = matter(content);

          if (parsed.data && parsed.data.date) {
            date = new Date(parsed.data.date);
            console.log(`날짜: ${file.name} - ${parsed.data.date}`);
          } else {
            console.log(`날짜 없음: ${file.name}`);
          }
        } catch (error) {
          console.warn(`frontmatter 읽기 실패: ${file.name}`, error.message);
        }

        return {
          name: file.name,
          date: date,
        };
      })
      .sort((a, b) => a.date - b.date)
      .map((file) => ({
        text: `${getIcon("file")} ${file.name.replace(".md", "")}`,
        link: `${basePath}/${file.name.replace(".md", "")}`,
      }));

    items.push(...mdFiles);
  } catch (error) {
    console.warn(`폴더 읽기 실패 ${dir}:`, error);
  }

  return items;
}

const sidebar = (() => {
  try {
    const blogDir = join(process.cwd(), "blog");
    if (!existsSync(blogDir)) return {};

    const sidebarItems = buildSidebarFromDirectory(blogDir);

    return {
      "/blog/": sidebarItems,
    };
  } catch (error) {
    console.warn("사이드바 생성 실패:", error);
    return {};
  }
})();

export default defineConfig({
  base: "/",
  cleanUrls: true,
  title: "Growth Log : by dpwls",
  description: "dpwls의 성장 일지",
  themeConfig: {
    outline: {
      level: "deep",
    },
    outlineTitle: "목차",
    nav: [
      { text: "홈", link: "/" },
      { text: "기술 블로그", link: "https://dpwls02142.github.io/" },
    ],
    sidebar: sidebar,
    socialLinks: [{ icon: "github", link: "https://github.com/dpwls02142/" }],
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "검색",
            buttonAriaLabel: "검색",
          },
          modal: {
            noResultsText: "검색 결과가 없습니다",
            resetButtonTitle: "검색 초기화",
            footer: {
              selectText: "선택",
              navigateText: "이동",
              closeText: "닫기",
            },
          },
        },
      },
    },
    // breadcrumb 추가
    docFooter: {
      prev: "이전 페이지",
      next: "다음 페이지",
    },
  },
  head: [
    ["link", { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    ["link", { rel: "apple-touch-icon", href: "/favicon.ico" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "Growth Log" }],
    ["meta", { property: "og:description", content: "dpwls의 성장 일지" }],
    ["meta", { property: "og:image", content: "/images/og-image.jpg" }],
    [
      "meta",
      { property: "og:url", content: "https://growth-log-kappa.vercel.app/" },
    ],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: "Growth Log" }],
    ["meta", { name: "twitter:description", content: "dpwls의 성장 일지" }],
    ["meta", { name: "twitter:image", content: "/images/og-image.jpg" }],
  ],
});
