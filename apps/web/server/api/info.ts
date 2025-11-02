export default defineEventHandler(async () => {
  const memUsage = process.memoryUsage();

  return {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    uptime: Math.floor(process.uptime()),
    memory: {
      total: Math.round(memUsage.heapTotal / 1024 / 1024),
      used: Math.round(memUsage.heapUsed / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024),
    },
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV!,
    nuxt: {
      version: '3.x',
    },
  };
});
