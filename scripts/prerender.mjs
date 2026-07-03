/* Post-build prerender: serve dist, render the page in headless Chromium
   (reduced motion so every reveal is at end state), and bake the full HTML
   into dist/index.html + dist/404.html. Crawlers then get complete content
   without executing JS; the client bundle re-renders on load as usual. */
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

const { chromium } = await import(
  pathToFileURL(path.join(process.cwd(), "node_modules", "playwright", "index.mjs")).href
);

// derive the deployed base path from the built asset URLs
const built = fs.readFileSync("dist/index.html", "utf8");
const m = built.match(/src="(.*?)assets\//);
const base = m ? m[1] : "/";
const port = Number(process.env.PRERENDER_PORT || 4561);
const url = `http://localhost:${port}${base}`;

const server = spawn("npx", ["vite", "preview", "--port", String(port), "--strictPort"], {
  stdio: "ignore",
  shell: process.platform === "win32",
});

try {
  let up = false;
  for (let i = 0; i < 60 && !up; i++) {
    try {
      const r = await fetch(url);
      up = r.ok;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  if (!up) throw new Error(`preview server never came up at ${url}`);

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
  });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const html = await page.content();
  await browser.close();

  const rootContent = html.match(/<div id="root">([\s\S]*)<\/div>\s*<\/body>/);
  if (!rootContent || rootContent[1].length < 2000) {
    throw new Error("prerender produced an empty or suspiciously small #root - failing the build");
  }

  const doc = html.startsWith("<!DOCTYPE") || html.startsWith("<!doctype") ? html : "<!doctype html>\n" + html;
  fs.writeFileSync("dist/index.html", doc);
  fs.writeFileSync("dist/404.html", doc);
  console.log(`prerender ok: base ${base}, #root ${rootContent[1].length} chars`);
} finally {
  // shell-spawned npx leaves a child node process holding the port on
  // Windows; kill the whole tree
  if (process.platform === "win32") {
    const { spawnSync } = await import("node:child_process");
    spawnSync("taskkill", ["/PID", String(server.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    server.kill();
  }
}
