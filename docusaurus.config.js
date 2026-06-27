// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'संपूर्ण संग्रह',
  tagline: '',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  //url: 'https://sangrah.justinclicks.com',
  url:'https://stage-sangrah.netlify.app',
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
          async sidebarItemsGenerator({defaultSidebarItemsGenerator, ...args}) {
            const sidebarItems = await defaultSidebarItemsGenerator(args);
            const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
            const toDevanagari = (num) => num.toString().replace(/[0-9]/g, (digit) => devanagariDigits[parseInt(digit, 10)]);

            // Helper to recursively count all doc children (documents) in a category
            function countDocs(item) {
              if (item.type === 'doc') {
                return 1;
              }
              if (item.type === 'category' && Array.isArray(item.items)) {
                return item.items.reduce((sum, child) => sum + countDocs(child), 0);
              }
              return 0;
            }

            // Helper to recursively map categories and append counts
            function processItems(items) {
              return items.map((item) => {
                if (item.type === 'category') {
                  const count = countDocs(item);
                  const originalLabel = item.label;
                  const updatedItem = {
                    ...item,
                    label: `${originalLabel} (${toDevanagari(count)})`,
                    items: processItems(item.items),
                  };
                  // Keep the original slug based on original label to prevent broken links
                  if (item.link && item.link.type === 'generated-index') {
                    const slugMap = {
                      "आरती संग्रह": "आरती-संग्रह",
                      "स्तोत्र / श्लोक संग्रह": "स्तोत्र--श्लोक-संग्रह",
                      "कथा संग्रह": "कथा-संग्रह",
                      "पोथी": "पोथी",
                      "सूक्त संग्रह": "सूक्त-संग्रह",
                      "चालीसा संग्रह": "चालीसा-संग्रह",
                      "पूजा / व्रत": "पूजा-व्रत",
                      "नामावली": "नामावली",
                      "पाळणा संग्रह": "पाळणा-संग्रह",
                      "मंगलाष्टका": "मंगलाष्टका",
                      "ऑडियो भजन": "ऑडियो-भजन"
                    };
                    const slugPart = slugMap[originalLabel] || originalLabel.trim().replace(/[^a-zA-Z0-9\u0900-\u097F]+/g, '-').replace(/-+/g, '-');
                    updatedItem.link.slug = `/category/${slugPart}`;
                  }
                  return updatedItem;
                }
                return item;
              });
            }

            return processItems(sidebarItems);
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
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
        debug: false,
        offlineModeActivationStrategies: ['appInstalled'],
        swCustom: require.resolve('./src/sw.js'),
        injectManifestConfig: {
          manifestTransforms: [
            (manifestEntries) => {
              const keepPatterns = [
                /^index\.html$/,
                /^offline\.html$/,
                /^manifest\.json$/,
                /^assets\/css\/.*\.css$/,
                /^assets\/js\/main\..*\.js$/,
                /^assets\/js\/runtime~main\..*\.js$/,
                /^img\/favicon\.ico$/,
                /^img\/logo\.svg$/,
                /^img\/pwa\/.*\.png$/,
                /\.sw\.js$/,
              ];
              const manifest = manifestEntries.filter((entry) =>
                keepPatterns.some((pattern) => pattern.test(entry.url))
              );
              return { manifest, warnings: [] };
            },
          ],
          globIgnores: ['**/*.mp3', '**/*.ogg', '**/*.wav', '**/search-index.json', '**/*.json'],
          maximumFileSizeToCacheInBytes: 52428800,
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
            to: '/history',
            label: 'इतिहास',
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
        disableSwitch: true,
      },
    }),
};

module.exports = config;
