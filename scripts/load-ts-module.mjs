// Loads a src/api/*.ts module in Node for tests: transpiles it with TypeScript,
// pins the API base URL, and inlines relative imports (e.g. "./client") as data URLs.
import { readFile } from "node:fs/promises";
import ts from "typescript";

const cache = new Map();

export async function loadTsModule(relativePath) {
  const url = new URL(`../${relativePath}`, import.meta.url);
  if (cache.has(url.href)) return cache.get(url.href);

  let source = await readFile(url, "utf8");
  source = source
    .replace("import.meta.env.VITE_API_BASE_URL", '"http://localhost:5000/api/"')
    .replace("import.meta.env.DEV", "true");

  for (const [, specifier] of source.matchAll(/from "(\.\/[^"]+)"/g)) {
    const dependency = new URL(`${specifier}.ts`, url).pathname.replace(/^.*?\/src\//, "src/");
    const dataUrl = await loadTsModule(dependency);
    source = source.replaceAll(`from "${specifier}"`, `from "${dataUrl}"`);
  }

  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const dataUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`;
  cache.set(url.href, dataUrl);
  return dataUrl;
}
