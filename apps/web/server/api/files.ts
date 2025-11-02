// @ts-ignore - Node.js modules are available in Nuxt server routes
import { readdir, stat } from 'fs/promises';
// @ts-ignore
import { join } from 'path';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const pathParam = (query.path as string) || '.';

  try {
    // Giới hạn trong workspace để bảo mật
    const normalizedPath = pathParam.replace(/\.\./g, '');
    // @ts-ignore
    const safePath = join(process.cwd(), normalizedPath);
    const resolvedPath = safePath.replace(/\\/g, '/');
    // @ts-ignore
    const cwd = process.cwd().replace(/\\/g, '/');

    // Đảm bảo không vượt quá workspace root
    if (!resolvedPath.startsWith(cwd)) {
      throw new Error('Path outside workspace is not allowed');
    }

    const entries = await readdir(resolvedPath, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(
        async (entry: {
          name: string;
          isDirectory: () => boolean;
          isFile: () => boolean;
        }) => {
          const fullPath = join(resolvedPath, entry.name);
          const stats = await stat(fullPath);
          return {
            name: entry.name,
            type: entry.isDirectory() ? 'directory' : 'file',
            size: entry.isFile() ? stats.size : null,
            modified: stats.mtime.toISOString(),
            // @ts-ignore
            path: fullPath.replace(process.cwd(), '.').replace(/\\/g, '/'),
          };
        },
      ),
    );

    return {
      // @ts-ignore
      path: resolvedPath.replace(process.cwd(), '.').replace(/\\/g, '/'),
      // @ts-ignore
      currentDir: process.cwd(),
      files: files.sort(
        (
          a: { type: string; name: string },
          b: { type: string; name: string },
        ) => {
          // Directories first, then files, both alphabetically
          if (a.type !== b.type) {
            return a.type === 'directory' ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        },
      ),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
      path: pathParam,
    };
  }
});
