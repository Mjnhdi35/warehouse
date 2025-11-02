export default defineEventHandler(async () => {
  // @ts-ignore - process is available in Node.js runtime
  const memUsage = process.memoryUsage();

  return {
    // @ts-ignore
    nodeVersion: process.version,
    // @ts-ignore
    platform: process.platform,
    // @ts-ignore
    arch: process.arch,
    // @ts-ignore
    uptime: Math.floor(process.uptime()),
    memory: {
      total: Math.round(memUsage.heapTotal / 1024 / 1024),
      used: Math.round(memUsage.heapUsed / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024),
    },
    timestamp: new Date().toISOString(),
    // @ts-ignore
    env: process.env.NODE_ENV!,
    nuxt: {
      version: '3.x',
    },
  };
});
