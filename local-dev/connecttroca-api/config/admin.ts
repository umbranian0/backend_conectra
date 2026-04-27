import type { Core } from '@strapi/strapi';

const adminConfig = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  url: env('ADMIN_URL', '/admin'),
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'connecttroca-admin-secret'),
    sessions: {
      accessTokenLifespan: env.int('ADMIN_ACCESS_TOKEN_LIFESPAN', 30 * 60),
      maxRefreshTokenLifespan: env.int('ADMIN_REFRESH_TOKEN_MAX_LIFESPAN', 30 * 24 * 60 * 60),
      idleRefreshTokenLifespan: env.int('ADMIN_REFRESH_TOKEN_IDLE_LIFESPAN', 14 * 24 * 60 * 60),
      maxSessionLifespan: env.int('ADMIN_SESSION_MAX_LIFESPAN', 24 * 60 * 60),
      idleSessionLifespan: env.int('ADMIN_SESSION_IDLE_LIFESPAN', 2 * 60 * 60),
    },
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'connecttroca-api-token-salt'),
  },
  auditLogs: {
    enabled: env.bool('AUDIT_LOGS_ENABLED', true),
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY', 'connecttroca-encryption-key'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'connecttroca-transfer-token-salt'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', false),
    promoteEE: env.bool('FLAG_PROMOTE_EE', false),
  },
});

export default adminConfig;
