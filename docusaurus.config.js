// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Resilient React",
  tagline: "Reactive, Predictable, Maintainable",
  url: "https://nervestaple.github.io",
  baseUrl: "/resilient-react/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon-32x32.png",
  organizationName: "nervestaple", // Usually your GitHub org/user name.
  projectName: "resilient-react", // Usually your repo name.
  trailingSlash: true,
  deploymentBranch: "gh-pages",

  themes: ["@docusaurus/theme-live-codeblock"],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/nervestaple/resilient-react/tree/main/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Resilient React",
        logo: {
          alt: "React Logo",
          src: "img/react.png",
        },
        items: [
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Guide",
          },
        ],
      },
      footer: {
        style: "dark",
        copyright: `Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
