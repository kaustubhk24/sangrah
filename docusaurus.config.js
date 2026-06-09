// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'संपूर्ण संग्रह',
  tagline: '',
  favicon: 'img/ico.png',

  // Set the production url of your site here
  url: 'https://sangrah.justinclicks.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'kaustubhk24', // Usually your GitHub org/user name.
  projectName: 'sangrah', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'throw',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'mr',
    locales: ['mr'],
    localeConfigs: {
      mr: {
        label: 'देवनागरी',
        direction: 'ltr',
        htmlLang: 'mr-IN',
        path: 'mr',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      require.resolve('docusaurus-lunr-search'),
      {
        languages: ['en'] // language codes
      }
    ],
    [
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-BDZNJ51SEP',
        anonymizeIP: true,
      },
    ],
    [
      '@docusaurus/plugin-pwa',
      {
        debug: false, // Changed to false for production
        offlineModeActivationStrategies: ['always'],
        injectManifestConfig: {
          globPatterns: [
            '**/*.{js,json,css,html,jpg,jpeg,png,svg,ico,txt,md,mdx,webp}',

          ],
          globIgnores: ['**/*.mp3', '**/*.ogg', '**/*.wav'],
          maximumFileSizeToCacheInBytes: 52428800
        },
        pwaHead: [
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#bf43bb',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-status-bar-style',
            content: '#bf43bb',
          },
        ],
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',

      navbar: {
        style: 'primary',
        title: 'संपूर्ण संग्रह',
        logo: {
          alt: 'संपूर्ण संग्रह',
          src: 'img/favicon.ico',
        },
        items: [
          {
            to: '/bookmarks',
            label: 'चिन्हांकित पाने',
            position: 'right',
          },
          {
            to:'/counter',
            label:'जप',
            position: 'right',
          }
          ,
          {
            to:'/project-information',
            label:'प्रकल्प माहिती',
            position: 'right',
          }
        ],
      },

      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },

      colorMode: {
        defaultMode: 'light',
      },
    }),
};

module.exports = config;
