import type { Context } from 'koa';
import type { IRouterParamContext } from 'koa-router';

import type { SocialUserInfo } from '#src/connectors/types.js';

import type { WithGuardedIdentifierPayloadContext } from '../middleware/koa-interaction-body-guard.js';

export type Identifier =
  | AccountIdIdentifier
  | VerifiedEmailIdentifier
  | VerifiedPhoneIdentifier
  | SocialIdentifier;

export type AccountIdIdentifier = { key: 'accountId'; value: string };

export type VerifiedEmailIdentifier = { key: 'emailVerified'; value: string };

export type VerifiedPhoneIdentifier = { key: 'phoneVerified'; value: string };

export type SocialIdentifier = { key: 'social'; connectorId: string; value: UseInfo };

type UseInfo = {
  email?: string;
  phone?: string;
  name?: string;
  avatar?: string;
  id: string;
};

export type InteractionContext = WithGuardedIdentifierPayloadContext<IRouterParamContext & Context>;

export type UserIdentity =
  | { username: string }
  | { email: string }
  | { phone: string }
  | { connectorId: string; userInfo: SocialUserInfo };
