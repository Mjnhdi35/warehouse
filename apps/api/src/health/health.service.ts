import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { join, resolve } from 'path';
import { opendir, stat } from 'fs/promises';
import { Dirent } from 'fs';
import { DataSource } from 'typeorm';

interface FileInfo {
  name: string;
  type: 'directory' | 'file';
  size?: number;
  modified?: string;
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
export class HealthService {
  constructor(
    private readonly ds: DataSource,
    private readonly redis: RedisService,
  ) {}

  async check() {
    const dbStatus = await this.pingDb();
    const redisStatus = (await this.redis.ping()) ? 'up' : 'down';

    return {
      app: { status: 'up' },
      db: dbStatus,
      redis: { status: redisStatus },
    };
  }

  getInfo() {
    const mem = process.memoryUsage();
    const MB = 1024 * 1024;

    return {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime: Math.floor(process.uptime()),
      memory: {
        total: Math.round(mem.heapTotal / MB),
        used: Math.round(mem.heapUsed / MB),
        external: Math.round(mem.external / MB),
      },
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
    };
  }

  private validatePath(targetPath: string): string {
    const safePath = resolve(process.cwd(), targetPath.replace(/\.\./g, ''));
    const cwd = process.cwd();
    if (!safePath.startsWith(cwd)) {
      throw new Error('Access outside workspace is not allowed');
    }
    return safePath;
  }

  async listFiles(path = '.'): Promise<ListFilesResult> {
    try {
      const safePath = this.validatePath(path);
      const dir = await opendir(safePath);

      const files: FileInfo[] = [];
      for await (const entry of dir) {
        files.push(await this.mapEntry(entry, safePath));
      }

      const collator = new Intl.Collator(undefined, { sensitivity: 'base' });
      files.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
        return collator.compare(a.name, b.name);
      });

      return {
        path: safePath.replace(process.cwd(), '.').replace(/\\/g, '/'),
        currentDir: process.cwd(),
        files,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        path,
      };
    }
  }

  private async mapEntry(entry: Dirent, basePath: string): Promise<FileInfo> {
    const fullPath = join(basePath, entry.name);
    const info: FileInfo = {
      name: entry.name,
      type: entry.isDirectory() ? 'directory' : 'file',
      path: fullPath.replace(process.cwd(), '.').replace(/\\/g, '/'),
    };

    // Lazy stat: chỉ cần khi là file (hoặc config để lấy tất)
    if (entry.isFile()) {
      const stats = await stat(fullPath);
      info.size = stats.size;
      info.modified = stats.mtime.toISOString();
    }

    return info;
  }

  private async pingDb() {
    try {
      await this.ds.query('SELECT 1');
      return { status: 'up' };
    } catch {
      return { status: 'down' };
    }
  }
}
