import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Mostly Good Metrics',
  tagline: 'Simple analytics for products that ship',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.mostlygoodmetrics.com',
  baseUrl: '/',

  organizationName: 'Mostly-Good-Metrics',
  projectName: 'docs',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/Mostly-Good-Metrics/docs/tree/main/',
          routeBasePath: '/', // Docs at root instead of /docs
        },
        blog: false, // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Mostly Good Metrics',
      logo: {
        alt: 'Mostly Good Metrics',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://app.mostlygoodmetrics.com',
          label: 'Dashboard',
          position: 'right',
        },
        {
          href: 'https://github.com/Mostly-Good-Metrics',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'SDKs',
          items: [
            {label: 'Swift', to: '/sdks/swift'},
            {label: 'Android', to: '/sdks/android'},
            {label: 'React Native', to: '/sdks/react-native'},
            {label: 'JavaScript', to: '/sdks/javascript'},
            {label: 'Flutter', to: '/sdks/flutter'},
          ],
        },
        {
          title: 'Resources',
          items: [
            {label: 'Getting Started', to: '/'},
            {label: 'API Reference', to: '/api'},
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/Mostly-Good-Metrics',
            },
            {
              label: 'Website',
              href: 'https://mostlygoodmetrics.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Mostly Good Metrics`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['swift', 'kotlin', 'dart', 'elixir', 'bash'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
