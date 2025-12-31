import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type SdkName = 'swift' | 'android' | 'reactNative' | 'javascript' | 'flutter' | 'capacitor';

export default function SdkVersion({ sdk }: { sdk: SdkName }): string {
  const { siteConfig } = useDocusaurusContext();
  const versions = siteConfig.customFields?.sdkVersions as Record<SdkName, string>;
  return versions?.[sdk] ?? '0.0.0';
}
