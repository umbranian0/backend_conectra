import type { Context } from 'koa';

const healthController = {
  async index(ctx: Context) {
    ctx.set('Cache-Control', 'no-store');
    ctx.body = {
      data: {
        status: 'ok',
        service: 'connecttroca-api',
        timestamp: new Date().toISOString(),
      },
      meta: {},
    };
  },
};

export default healthController;
