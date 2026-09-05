export function renderManifest(template, rawBaseUrl) {
  const baseUrl = rawBaseUrl.replace(/\/$/, "");
  if (!baseUrl.startsWith("https://") || (baseUrl.includes("localhost") && baseUrl !== "https://localhost:3000")) throw new Error("Base URL must use HTTPS");
  const rendered = template.replaceAll("{{BASE_URL}}", baseUrl);
  if (rendered.includes("{{BASE_URL}}")) throw new Error("Manifest contains an unresolved BASE_URL token");
  return rendered;
}
