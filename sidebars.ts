import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Quickstart',
      collapsed: false,
      items: [
        'quickstart/javascript',
        'quickstart/swift',
        'quickstart/android',
        'quickstart/react-native',
        'quickstart/flutter',
        'quickstart/capacitor',
      ],
    },
    'concepts',
    {
      type: 'category',
      label: 'Features',
      items: [
        'features/insights',
        'features/funnels',
        'features/retention',
        'features/experiments',
        'features/privacy',
      ],
    },
    {
      type: 'category',
      label: 'SDKs',
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
        'guides/using-a-proxy',
      ],
    },
    'cli',
    {
      type: 'category',
      label: 'Integrations',
      items: [
        'integrations/revenuecat',
        'integrations/agent-skills',
        'integrations/claude-code-plugin',
        'integrations/mcp-server',
      ],
    },
    {
      type: 'category',
      label: 'HTTP API',
      items: ['api/index', 'api/events', 'api/experiments'],
    },
  ],
};

export default sidebars;
