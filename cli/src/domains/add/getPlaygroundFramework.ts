
import fs from "fs";

export function getPlaygroundFramework(playgroundPath: string) {
  const nextConfigPaths = [
    `${playgroundPath}/next.config.js`,
    `${playgroundPath}/next.config.ts`
  ]
  const nuxtConfigPaths = [
    `${playgroundPath}/nuxt.config.ts`,
    `${playgroundPath}/nuxt.config.js`
  ]

  for (let i = 0; i < nextConfigPaths.length; i++) {
    if (fs.existsSync(nextConfigPaths[i])) {
      return "next";
    }
  }

  for (let i = 0; i < nuxtConfigPaths.length; i++) {
    if (fs.existsSync(nuxtConfigPaths[i])) {
      return "nuxt";
    }
  }

  const noFramework = "Could not detect framework. No page will be generated.";

  console.warn(noFramework);

  return noFramework;
}
