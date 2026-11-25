import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Entry program for the make.fun "Promote make.fun's make-your-own-bounty
// post on X" bounty. The entry itself is a post on X; this program simply
// hands the grader the post's address by copying POST.json to the output dir.

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// A valid entry address is a single post (status) URL on X.
const statusUrl = /^https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/\d+$/;

try {
  const post = JSON.parse(readFileSync(join(botDir, "POST.json"), "utf8")) as unknown;
  const url =
    typeof post === "object" && post !== null
      ? (post as { url?: unknown }).url
      : undefined;
  if (typeof url !== "string" || !statusUrl.test(url)) {
    console.error(
      "POST.json is invalid: expected a url string matching https://(x.com|twitter.com)/<handle>/status/<digits>",
    );
    process.exit(1);
  }
  mkdirSync(outputDir, { recursive: true });
  copyFileSync(join(botDir, "POST.json"), join(outputDir, "POST.json"));
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(`Failed to copy POST.json: ${detail}`);
  process.exit(1);
}
