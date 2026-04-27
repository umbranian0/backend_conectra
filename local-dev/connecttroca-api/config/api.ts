import type { Core } from '@strapi/strapi';

const apiConfig = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Api => ({
  rest: {
    defaultLimit: env.int('API_DEFAULT_LIMIT', 25),
    maxLimit: env.int('API_MAX_LIMIT', 100),
    withCount: env.bool('API_WITH_COUNT', true),
  },
});

export default apiConfig;
