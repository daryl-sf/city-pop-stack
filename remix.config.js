import path from "node:path";
import fs from 'fs';

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.test.{js,jsx,ts,tsx}"],
  publicPath: "/_static/build/",
  server: "server.ts",
  serverBuildPath: "server/index.mjs",
  serverModuleFormat: "esm",
  routes: (defineRoutes) =>
    defineRoutes((route) => {
      if (process.env.NODE_ENV === "production") return;

      console.log("⚠️  Test routes enabled.");

      const appDir = path.join(process.cwd(), "app");
      const testRoutesDir = path.join(process.cwd(), "test/e2e/routes");

      findTestRoutes(appDir, testRoutesDir, testRoutesDir, route);
    }),
};

/**
  * @param {string} appDir
  * @param {string} baseDir
  * @param {string} dir
  * @param {import('@remix-run/dev/dist/config/routes').DefineRouteFunction} route
  */
function findTestRoutes(appDir, baseDir, dir, route) {
  for (const routeFile of fs.readdirSync(dir)) {
    if (routeFile.startsWith("_")) {
      continue;
    }
    const fullPath = path.join(dir, routeFile);
    if (fs.statSync(fullPath).isDirectory()) {
      findTestRoutes(appDir, baseDir, fullPath, route);
    } else if (fullPath.match(/\.tsx?$/)) {
      route(
        `__tests/${path.relative(baseDir, fullPath).replace(/\.tsx?$/, "")}`,
        path.relative(appDir, fullPath)
      );
    }
  }
}
