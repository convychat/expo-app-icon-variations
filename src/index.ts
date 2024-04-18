// heavily inspired by https://github.com/expo/expo/blob/934ce48bd4c152e99479e83451c0f4ed70a31d63/packages/%40expo/prebuild-config/src/plugins/icons/withIosIcons.ts
// IT SHOULD BE COMPILED WITH TSC BEFORE RUNNING `expo prebuild` COMMAND
import { ConfigPlugin, IOSConfig, withDangerousMod } from "@expo/config-plugins"
import { ExpoConfig } from "@expo/config-types"
import { generateImageAsync } from "@expo/image-utils"
import * as fs from "fs"
import { join } from "path"

const { getProjectName } = IOSConfig.XcodeUtils

const IMAGE_CACHE_NAME = "icons"

export const withIosIconsets: ConfigPlugin<string[]> = (
  config,
  fileNames: string[],
) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      await setIconsAsync(config, config.modRequest.projectRoot, fileNames)
      return config
    },
  ])
}

export default withIosIconsets

export async function setIconsAsync(
  config: ExpoConfig,
  projectRoot: string,
  fileNames: string[],
) {
  // Something like projectRoot/ios/MyApp/
  const iosNamedProjectRoot = getIosNamedProjectPath(projectRoot)

  fileNames.forEach(async (filename, index) => {
    const cacheKey = `universal-icon-${index}`
    const size = 1024
    const postfix = String(index + 1)
    const name = getAppleIconName(postfix, size, 1)

    const { source } = await generateImageAsync(
      { projectRoot, cacheType: IMAGE_CACHE_NAME + cacheKey },
      {
        src: filename,
        name,
        width: size,
        height: size,
        removeTransparency: true,
        // The icon should be square, but if it's not then it will be cropped.
        resizeMode: "cover",
        // Force the background color to solid white to prevent any transparency.
        // TODO: Maybe use a more adaptive option based on the icon color?
        backgroundColor: "#ffffff",
      },
    )

    const dirname = join(iosNamedProjectRoot, getImagesetPath(postfix))

    // Create
    fs.mkdirSync(dirname)

    // Write image to the file system.
    const assetPath = join(dirname, name)
    fs.writeFileSync(assetPath, source)

    // Write Contents.json
    const contentsJsonPath = join(dirname, "Contents.json")
    fs.writeFileSync(
      contentsJsonPath,
      JSON.stringify(
        {
          images: [
            {
              filename: name,
              idiom: "universal",
              platform: "ios",
              size: "1024x1024",
            },
          ],
          info: {
            version: 1,
            author: "expo",
          },
        },
        null,
        2,
      ),
    )
  })
}

/**
 * Return the project's named iOS path: ios/MyProject/
 *
 * @param projectRoot Expo project root path.
 */
function getIosNamedProjectPath(projectRoot: string): string {
  const projectName = getProjectName(projectRoot)
  return join(projectRoot, "ios", projectName)
}

function getAppleIconName(
  postfix: string,
  size: number,
  scale: number,
): string {
  return `App-Icon-${postfix}-${size}x${size}@${scale}x.png`
}

function getImagesetPath(postfix: string) {
  return `Images.xcassets/AppIcon-${postfix}.appiconset`
}
