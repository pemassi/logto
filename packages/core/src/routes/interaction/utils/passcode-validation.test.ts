import { PasscodeType, Event } from '@logto/schemas';

import { createPasscode, sendPasscode } from '#src/lib/passcode.js';

import type { SendPasscodePayload } from '../types/guard.js';
import { sendPasscodeToIdentifier } from './passcode-validation.js';

jest.mock('#src/lib/passcode.js', () => ({
  createPasscode: jest.fn(() => ({})),
  sendPasscode: jest.fn().mockResolvedValue({ dbEntry: { id: 'foo' } }),
}));

const sendPasscodeTestCase = [
  {
    payload: { email: 'email', event: Event.SignIn },
    createPasscodeParams: [PasscodeType.SignIn, { email: 'email' }],
  },
  {
    payload: { email: 'email', event: Event.Register },
    createPasscodeParams: [PasscodeType.Register, { email: 'email' }],
  },
  {
    payload: { email: 'email', event: Event.ForgotPassword },
    createPasscodeParams: [PasscodeType.ForgotPassword, { email: 'email' }],
  },
  {
    payload: { phone: 'phone', event: Event.SignIn },
    createPasscodeParams: [PasscodeType.SignIn, { phone: 'phone' }],
  },
  {
    payload: { phone: 'phone', event: Event.Register },
    createPasscodeParams: [PasscodeType.Register, { phone: 'phone' }],
  },
  {
    payload: { phone: 'phone', event: Event.ForgotPassword },
    createPasscodeParams: [PasscodeType.ForgotPassword, { phone: 'phone' }],
  },
];

describe('passcode-validation utils', () => {
  const createPasscodeMock = createPasscode as jest.Mock;
  const sendPasscodeMock = sendPasscode as jest.Mock;
  const log = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each(sendPasscodeTestCase)(
    'send passcode successfully',
    async ({ payload, createPasscodeParams }) => {
      await sendPasscodeToIdentifier(payload as SendPasscodePayload, 'jti', log);
      expect(createPasscodeMock).toBeCalledWith('jti', ...createPasscodeParams);
      expect(sendPasscodeMock).toBeCalled();
    }
  );
});
