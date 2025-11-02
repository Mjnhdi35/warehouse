import { Injectable } from '@nestjs/common';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

interface FileInfo {
  name: string;
  type: 'directory' | 'file';
  size: number | null;
  modified: string;
  path: string;
}

interface ListFilesResponse {
  path: string;
  currentDir: string;
  files: FileInfo[];
}

interface ListFilesErrorResponse {
  error: string;
  path: string;
}

type ListFilesResult = ListFilesResponse | ListFilesErrorResponse;

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getInfo() {
    return {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime: Math.floor(process.uptime()),
      memory: {
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
      },
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV!,
    };
  }

  async listFiles(path: string = '.'): Promise<ListFilesResult> {
    try {
      // Giới hạn trong workspace để bảo mật
      const normalizedPath = path.replace(/\.\./g, '');
      const safePath = join(process.cwd(), normalizedPath);
      const resolvedPath = safePath.replace(/\\/g, '/');
      const cwd = process.cwd().replace(/\\/g, '/');

      // Đảm bảo không vượt quá workspace root
      if (!resolvedPath.startsWith(cwd)) {
        throw new Error('Path outside workspace is not allowed');
      }

      const entries = await readdir(resolvedPath, { withFileTypes: true });
      const files: FileInfo[] = await Promise.all(
        entries.map(async (entry) => {
          const fullPath = join(resolvedPath, entry.name);
          const stats = await stat(fullPath);
          return {
            name: entry.name,
            type: entry.isDirectory() ? 'directory' : 'file',
            size: entry.isFile() ? stats.size : null,
            modified: stats.mtime.toISOString(),
            path: fullPath.replace(process.cwd(), '.').replace(/\\/g, '/'),
          };
        }),
      );

      return {
        path: resolvedPath.replace(process.cwd(), '.').replace(/\\/g, '/'),
        currentDir: process.cwd(),
        files: files.sort((a, b) => {
          // Directories first, then files, both alphabetically
          if (a.type !== b.type) {
            return a.type === 'directory' ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        }),
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        path,
      };
    }
  }
}
