import DefaultTheme from "vitepress/theme";
import "./custom.css";
import giscusTalk from "vitepress-plugin-comment-with-giscus";
import { useData, useRoute } from "vitepress";
import { h, toRefs } from "vue";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout);
  },
  setup() {
    // Get frontmatter and route
    const { frontmatter } = toRefs(useData());
    const route = useRoute();

    // Obtain configuration from: https://giscus.app/
    giscusTalk(
      {
        repo: "dpwls02142/growth-log",
        repoId: "R_kgDOO0CaVw",
        category: "Comment", // default: `General`
        categoryId: "DIC_kwDOO0CaV84CrAo0",
        mapping: "title", // default: `pathname`
        inputPosition: "bottom", // default: `top`
        lang: "ko", // default: `zh-CN`
        // i18n setting (Note: This configuration will override the default language set by lang)
        // Configured as an object with key-value pairs inside:
        // [your i18n configuration name]: [corresponds to the language pack name in Giscus]
        locales: {
          "zh-Hans": "zh-CN",
          "en-US": "en",
          "ko-KR": "ko",
        },
        homePageShowComment: false, // Whether to display the comment area on the homepage, the default is false
        lightTheme: "light", // default: `light`
        darkTheme: "transparent_dark", // default: `transparent_dark`
        // ...
      },
      {
        frontmatter,
        route,
      },
      // Whether to activate the comment area on all pages.
      // The default is true, which means enabled, this parameter can be ignored;
      // If it is false, it means it is not enabled.
      // You can use `comment: true` preface to enable it separately on the page.
      true
    );
  },
};
