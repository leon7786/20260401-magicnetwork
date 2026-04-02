import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: '代理客户端导航 / Proxy Client Guide',
  tagline: 'Proxy client docs by platform',

  url: 'https://leon7786.github.io',
  baseUrl: '/20260401-magicnetwork/',

  organizationName: 'leon7786',
  projectName: '20260401-magicnetwork',

  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  scripts: ['/js/download-latest.js', '/js/i18n-render.js'],

  themeConfig: {
    navbar: {
      title: '代理客户端导航',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'platformSidebar',
          position: 'left',
          label: '文档',
        },
        {
          href: 'https://github.com/leon7786/20260401-magicnetwork',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    docs: {
      sidebar: {
        hideable: false,
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
