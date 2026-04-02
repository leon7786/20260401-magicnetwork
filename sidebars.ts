import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  platformSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Windows / Desktop',
      items: [
        'windows/intro',
        'windows/clash-verge/clash-verge',
        'windows/mihomo-party/mihomo-party',
        'windows/flclash/flclash',
        'windows/clash-nyanpasu/clash-nyanpasu',
        'windows/hiddifynext/hiddifynext',
        'windows/nekoray/nekoray',
        'windows/karing/karing',
        'windows/v2rayn/v2rayn',
      ],
    },
    {
      type: 'category',
      label: 'Android',
      items: [
        'android/intro',
        'android/v2rayng/v2rayng',
        'android/clash-meta-for-android/clash-meta-for-android',
        'android/nekobox-for-android/nekobox-for-android',
        'android/hiddifynext/hiddifynext',
        'android/karing/karing',
        'android/surfboard/surfboard',
      ],
    },
    {
      type: 'category',
      label: 'macOS',
      items: [
        'macos/intro',
        'macos/mihomo-party/mihomo-party',
        'macos/flclash/flclash',
        'macos/clash-nyanpasu/clash-nyanpasu',
        'macos/clashx/clashx',
        'macos/hiddifynext/hiddifynext',
        'macos/nekoray/nekoray',
      ],
    },
    {
      type: 'category',
      label: 'iOS / iPadOS',
      items: [
        'ios/intro',
        'ios/shadowrocket/shadowrocket',
        'ios/quantumult-x/quantumult-x',
        'ios/stash/stash',
        'ios/hiddifynext/hiddifynext',
        'ios/sing-box/sing-box',
      ],
    },
  ],
};

export default sidebars;
