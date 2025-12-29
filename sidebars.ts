import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'SDKs',
      collapsed: false,
      items: [
        'sdks/swift',
        'sdks/android',
        'sdks/react-native',
        'sdks/javascript',
        'sdks/flutter',
        'sdks/capacitor',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/tracking-events',
        'guides/identifying-users',
        'guides/reserved-events',
      ],
    },
    'api',
  ],
};

export default sidebars;
