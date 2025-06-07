export const folderMeta = {
  projects: { icon: "🦭" },
  til: { icon: "📝" },
  realworld: {
    icon: "🌍",
    externalLink: "https://github.com/dpwls02142/next-realworld-example-app",
  },
};

export function getIcon(name) {
  return folderMeta[name]?.icon ?? "";
}

export function getExternalLink(name) {
  return folderMeta[name]?.externalLink;
}
