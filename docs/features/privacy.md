---
sidebar_position: 5
---

# Privacy & Data Controls

MGM is built to run useful product analytics on the minimum data possible. This page covers project-level controls; each SDK page has a Privacy section covering the client-side controls in detail.

## Apple privacy manifests and App Store labels

Apple uses a `PrivacyInfo.xcprivacy` file to describe collected data, tracking, and use of required-reason APIs. App developers also answer [App Privacy Details](https://developer.apple.com/app-store/app-privacy-details/) questions in App Store Connect for the whole app, including third-party SDKs. See Apple's [privacy manifest documentation](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files) for how to add the file to an app target.

### Data MGM collects

These are MGM's Apple data categories. Every listed type is **linked to the user** and **not used for tracking**. The Swift SDK's manifest declares `NSPrivacyTracking` as `false` and has no tracking domains. MGM does not use IDFA, IDFV, App Tracking Transparency, or cross-app tracking.

| Apple data type | Purpose | When MGM collects it |
| --- | --- | --- |
| User ID | Analytics, App Functionality | The app's user ID or an SDK-generated anonymous ID |
| Name | Analytics | Only when your app supplies it in a user profile |
| Email Address | Analytics | Only when your app supplies it |
| Product Interaction | Analytics, App Functionality | Tracked events and product interactions |
| Other Usage Data | Analytics, App Functionality | Experiment assignments and exposures |
| Other Data Types | Analytics | OS, device model, app version, locale, session, and event context |
| Coarse Location | Analytics | Country, region, and city derived server-side from the request IP, according to [`geo_mode`](#ip-geolocation-geo_mode) |

MGM holds the raw request IP briefly in the ingest buffer; it is not stored durably. Events store the derived country, region, and city fields according to the project's geolocation setting. The SDKs do not read the device's location.

### SDK setup

**Swift:** Upgrade to the next Swift SDK release containing `PrivacyInfo.xcprivacy`. The SDK bundles its own manifest, including a UserDefaults required-reason declaration (`CA92.1`); no separate MGM manifest setup is needed. Still include MGM's data in your app's App Store privacy label.

**React Native:** Use `@react-native-async-storage/async-storage` **1.23.1 or later** on iOS.

**Flutter:** Use `shared_preferences` **^2.2.3**, `path_provider` **^2.1.3**, and `device_info_plus` **^11.1.1** or compatible newer versions on iOS.

**Capacitor:** The core `Capacitor` pod includes a manifest from **5.7.3** onward. The official `@capacitor/app`, `@capacitor/device`, and `@capacitor/preferences` plugins still do not include manifests, including their latest 8.x releases. Add the UserDefaults reason `CA92.1` to your app manifest for Preferences, as [Ionic instructs](https://github.com/ionic-team/capacitor-plugins/blob/main/preferences/README.md#apple-privacy-manifest-requirements). If you use `@capacitor/device` before version 7, also check its disk-space API use and declare the applicable required reason for your app. Check your other plugins and native code for additional declarations.

The React Native, Flutter, and Capacitor MGM SDKs contain no native Apple code of their own and cannot bundle an Apple manifest. Their native dependencies provide their own manifests where available. Add MGM's data collection to your **app-level** `PrivacyInfo.xcprivacy` and App Store privacy label. Add the file to your Xcode app target's resources so it appears in the privacy report.

### App-level manifest for hybrid apps

Copy this into your app target's `PrivacyInfo.xcprivacy`. It contains the same MGM data categories and purposes as the Swift SDK manifest. The UserDefaults block is for Capacitor Preferences; remove `NSPrivacyAccessedAPITypes` for React Native or Flutter unless your app itself uses UserDefaults under this reason. Add other data or required-reason APIs used by your own app and dependencies. If your project uses [`geo_mode: off`](#ip-geolocation-geo_mode), you can remove the Coarse Location entry.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyTracking</key>
    <false/>
    <key>NSPrivacyCollectedDataTypes</key>
    <array>
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeCoarseLocation</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <true/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <false/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeAnalytics</string>
            </array>
        </dict>
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeUserID</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <true/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <false/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeAnalytics</string>
                <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
            </array>
        </dict>
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeName</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <true/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <false/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeAnalytics</string>
            </array>
        </dict>
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeEmailAddress</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <true/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <false/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeAnalytics</string>
            </array>
        </dict>
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeProductInteraction</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <true/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <false/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeAnalytics</string>
                <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
            </array>
        </dict>
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeOtherUsageData</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <true/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <false/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeAnalytics</string>
                <string>NSPrivacyCollectedDataTypePurposeAppFunctionality</string>
            </array>
        </dict>
        <dict>
            <key>NSPrivacyCollectedDataType</key>
            <string>NSPrivacyCollectedDataTypeOtherDataTypes</string>
            <key>NSPrivacyCollectedDataTypeLinked</key>
            <true/>
            <key>NSPrivacyCollectedDataTypeTracking</key>
            <false/>
            <key>NSPrivacyCollectedDataTypePurposes</key>
            <array>
                <string>NSPrivacyCollectedDataTypePurposeAnalytics</string>
            </array>
        </dict>
    </array>
    <key>NSPrivacyAccessedAPITypes</key>
    <array>
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>CA92.1</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
```

### App Store Connect privacy-label answers

In **App Store Connect → App Privacy**, answer **Yes** to data collection when MGM is active. For each applicable type in the [table above](#data-mgm-collects), select **Data Linked to You: Yes**, **Used for Tracking: No**, and the listed purposes. Include Name and Email Address only if your app passes those values to MGM. Include Coarse Location for the default `geo_mode: full` and for `country_only`; a project using `geo_mode: off` may omit it for MGM. Review the rest of your app and its other SDKs before submitting the label.

The JavaScript/web and Android SDKs are unaffected by Apple's privacy manifest requirement.

## What the SDKs collect

The SDKs never collect advertising identifiers (IDFA/GAID), precise client location, or contacts. `identify()` is optional — without it, users are tracked under a random, resettable anonymous ID (`$anon_...`) generated by the SDK, not derived from the device.

Every event automatically includes platform, OS version, app version, environment, and a session ID, plus — unless disabled — device model/type, manufacturer, locale, and timezone.

The JavaScript SDK also includes browser name/version, screen and viewport size,
and user agent unless `collectDeviceProperties` is disabled. URL, page title,
referrer, and UTM parameters are collected only when the site explicitly enables
`trackPageViews`.

### The opt-out story

All six SDKs ship the same controls:

- `optOut()` / `optIn()` / `isOptedOut` — while opted out, tracking calls are no-ops, queued (unsent) events are purged, and the choice persists across launches.
- `optedOutByDefault` — start opted out for consent-first (e.g. GDPR) flows; call `optIn()` after consent. A persisted opt-in/opt-out choice always wins on later launches.
- `collectDeviceProperties: false` — omit device model/type, manufacturer, locale, and timezone.
- `resetAnonymousId()` — rotate the anonymous ID so future events can't be linked to earlier activity.
- A "forget me" reset that clears the user ID, rotates the anonymous ID, purges pending events and super properties, and starts a new session.

See the Privacy section of each SDK page: [Swift](/sdks/swift#privacy), [Android](/sdks/android#privacy), [React Native](/sdks/react-native#privacy), [JavaScript](/sdks/javascript#privacy), [Flutter](/sdks/flutter#privacy), [Capacitor](/sdks/capacitor#privacy). The JavaScript SDK additionally respects browser Do Not Track / Global Privacy Control signals and supports memory-only persistence.

## IP geolocation (`geo_mode`)

Country, region, and city are derived from the request IP at ingestion — the SDKs never collect location. A per-project **Geolocation** setting governs how much is derived:

| Mode | Behavior |
|------|----------|
| `full` (default) | Country, region, and city derived from the request IP |
| `country_only` | Country only — region and city are dropped, including any client-supplied values |
| `off` | No IP lookup at all; the IP is not used |

Change it in your project's settings; it takes effect for new events.

## Per-user data erasure

To honor a deletion request (GDPR/CCPA), open the user's page in the dashboard and use the **erase user data** action (admin only). It resolves all aliased IDs for the user, then deletes their events, daily activity rows, profile, and ID aliases from Postgres, and their events from ClickHouse.

Pre-computed historical aggregates (e.g. past chart totals) are not recomputed, and events sent before the user was ever identified under a never-linked anonymous ID can't be attributed to them.

Pair this with the SDK-side "forget me" reset so the device stops sending linkable events.

## Data preservation and analytics history

MGM does not currently run automatic raw-data deletion. Permanent lifecycle
deletion is not scheduled for free or paid organizations.

Active paid subscriptions include preservation of raw event history for the
subscription lifetime, including any billing grace period. Preserved paid data
may be moved to verified archival storage in the future if needed, but MGM will
not remove primary rows through an automatic storage lifecycle until a
recoverable archived copy and restoration path exist.

PostgreSQL holds the recovery copy of accepted events and user profiles.
ClickHouse holds event-level analytics without an automatic TTL, and historical
daily aggregates preserve long-term event totals. Organization owners and
admins can open **Organization Settings → Data storage** to review this policy.

This lifecycle policy does not prevent intentional deletion. Per-user privacy
erasure and account deletion continue to remove the data in their documented
scope and override preservation. The paid preservation commitment ends when the
subscription and any billing grace period end; no automatic post-termination
deletion is currently scheduled. If MGM introduces one later, we will provide
notice before enabling it and document its safety controls here.

## Environment tagging

`environment` is a per-event property set by the SDK configuration (default `"production"`). Use it to keep different sources separable on the same project dashboard — for example, tag your marketing site's events with `environment: "marketing"` and your app's with `"production"`, then use the dashboard's Environment filter to look at either in isolation. Values are free-form strings.

## Private experiment enrollment

With [local experiment enrollment](/features/experiments#local-experiment-enrollment), variant assignment happens on device and no user identifier is sent to the server for bucketing.
