# @convy/expo-app-icon-variations

Expo [config plugin](https://docs.expo.io/guides/config-plugins/)  to add new icon sets to the iOS bundle. For dynamically changing app icons, refer to [this package instead](https://github.com/expo/config-plugins/tree/main/packages/react-native-dynamic-app-icon).

## Motivation

Apple [allows you](https://developer.apple.com/documentation/xcode/configuring-your-app-icon) to add multiple icon variations into your app. It can be useful, for example, to A/B test different icons in your App Store listing. To make it possible, you should add your icons as `.appiconset` directories. This plugin does exactly that.

## Install

> This package cannot be used in the "Expo Go" app because [it requires custom native code](https://docs.expo.io/workflow/customizing/).

First install the package with [`npx expo install`](https://docs.expo.io/workflow/expo-cli/#expo-install).

```
npx expo install @convy/expo-app-icon-variations
```

After installing this npm package, add the [config plugin](https://docs.expo.io/guides/config-plugins/) to the [`plugins`](https://docs.expo.io/versions/latest/config/app/#plugins) array of your `app.json` or `app.config.js`. Then rebuild your app as described in the ["Adding custom native code"](https://docs.expo.io/workflow/customizing/) guide.

## Example

In your app.json `plugins` array:

```json
{
  "plugins": [
    "@convy/expo-app-icon-variations",
    ["./path/to/image.png", "https://mywebsite.com/my-icon.png"]
  ]
}
```

> Note: Icon URLs will be downloaded and embedded at build time, you cannot push new icons OTA.
