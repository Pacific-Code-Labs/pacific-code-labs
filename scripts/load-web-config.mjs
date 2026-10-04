import { execFileSync } from "node:child_process";
import { appendFileSync } from "node:fs";
const [site, environment = "prod", mode = "--print-exports"] =
  process.argv.slice(2);
if (
  !["landing", "admin"].includes(site) ||
  !["dev", "prod"].includes(environment)
)
  throw new Error(
    "Usage: load-web-config.mjs landing|admin dev|prod --github-env|--print-exports",
  );
const prefix = `/pacific-code-labs/${environment}/${site === "landing" ? "web" : "admin"}/`;
const data = JSON.parse(
  execFileSync(
    "aws",
    [
      "ssm",
      "get-parameters-by-path",
      "--path",
      prefix,
      "--recursive",
      "--output",
      "json",
    ],
    { encoding: "utf8" },
  ),
);
const keys =
  site === "landing"
    ? { "cdn-url": "VITE_CDN_URL" }
    : {
        "api-url": "VITE_ADMIN_API_URL",
        "pool-id": "VITE_ADMIN_USER_POOL_ID",
        "client-id": "VITE_ADMIN_CLIENT_ID",
        "landing-url": "VITE_LANDING_URL",
        bucket: "ADMIN_BUCKET",
        "distribution-id": "ADMIN_DISTRIBUTION_ID",
      };
for (const [key, name] of Object.entries(keys)) {
  const value = data.Parameters.find((p) => p.Name === prefix + key)?.Value;
  if (!value) throw new Error(`Missing SSM parameter ${prefix + key}`);
  if (/[\r\n]/.test(value)) throw new Error("SSM value must be one line");
  if (mode === "--github-env")
    appendFileSync(process.env.GITHUB_ENV, `${name}=${value}\n`);
  else
    process.stdout.write(`export ${name}='${value.replace(/'/g, "'\\''")}'\n`);
}
