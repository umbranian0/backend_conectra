import type { Core } from '@strapi/strapi';

export default {
  register() {},

  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    strapi.log.info('ConnectTroca local API is ready.');
  },
};