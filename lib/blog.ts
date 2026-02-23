import fs from "fs";
import path from "path";

const postsDirectory = path.join(process.cwd(), "content/blog");

export async function getAllPosts() {
  const files = fs.readdirSync(postsDirectory);

  const posts = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");

      const module = await import(`@/content/blog/${file}`);

      return {
        slug,
        ...module.metadata,
      };
    }),
  );

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
