export default async (ctx, next) => {
  await next();
  if (ctx.body && ctx.status === 200) {
    ctx.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    ctx.set('Pragma', 'no-cache');
    ctx.set('Expires', 0);
  }
}