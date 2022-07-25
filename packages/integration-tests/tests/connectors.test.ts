import { ConnectorType } from '@logto/schemas';
import { HTTPError } from 'got';

import {
  disableConnector,
  enableConnector,
  getConnector,
  listConnectors,
  updateConnectorConfig,
} from '@/connector-api';
import {
  facebookConnectorId,
  facebookConnectorConfig,
  aliyunSmsConnectorId,
  aliyunSmsConnectorConfig,
  twilioSmsConnectorId,
  twilioSmsConnectorConfig,
  aliyunEmailConnectorId,
  aliyunEmailConnectorConfig,
  sendgridEmailConnectorId,
  sendgridEmailConnectorConfig,
} from '@/connectors-mock';

test('connector flow', async () => {
  /*
   * List connectors after initializing a new Logto instance
   */
  const allConnectors = await listConnectors();

  // There should be no connectors, or all connectors should be disabled.
  for (const connectorDto of allConnectors) {
    expect(connectorDto.enabled).toBeFalsy();
  }

  /*
   * Set up a social connector
   */
  const updatedFacebookConnector = await updateConnectorConfig(
    facebookConnectorId,
    facebookConnectorConfig
  );
  expect(updatedFacebookConnector.config).toEqual(facebookConnectorConfig);
  const enabledFacebookConnector = await enableConnector(facebookConnectorId);
  expect(enabledFacebookConnector.enabled).toBeTruthy();

  // The result of getting a connector should be same as the result of updating a connector above.
  const facebookConnector = await getConnector(facebookConnectorId);
  expect(facebookConnector.enabled).toBeTruthy();
  expect(facebookConnector.config).toEqual(facebookConnectorConfig);

  /*
   * Set up an SMS connector
   */
  const updatedAliyunSmsConnector = await updateConnectorConfig(
    aliyunSmsConnectorId,
    aliyunSmsConnectorConfig
  );
  expect(updatedAliyunSmsConnector.config).toEqual(aliyunSmsConnectorConfig);
  const enabledAliyunSmsConnector = await enableConnector(aliyunSmsConnectorId);
  expect(enabledAliyunSmsConnector.enabled).toBeTruthy();

  /*
   * Change to another SMS connector
   */
  const updatedTwilioSmsConnector = await updateConnectorConfig(
    twilioSmsConnectorId,
    twilioSmsConnectorConfig
  );
  expect(updatedTwilioSmsConnector.config).toEqual(twilioSmsConnectorConfig);
  const enabledTwilioSmsConnector = await enableConnector(twilioSmsConnectorId);
  expect(enabledTwilioSmsConnector.enabled).toBeTruthy();

  // There should be exactly one enabled SMS connector after changing to another SMS connector.
  const connectorsAfterChangingSmsConnector = await listConnectors();
  const enabledSmsConnectors = connectorsAfterChangingSmsConnector.filter(
    (connector) => connector.type === ConnectorType.SMS && connector.enabled
  );
  expect(enabledSmsConnectors.length).toEqual(1);
  expect(enabledSmsConnectors[0]?.id).toEqual(twilioSmsConnectorId);

  /*
   * Set up an email connector
   */
  const updatedAliyunEmailConnector = await updateConnectorConfig(
    aliyunEmailConnectorId,
    aliyunEmailConnectorConfig
  );
  expect(updatedAliyunEmailConnector.config).toEqual(aliyunEmailConnectorConfig);
  const enabledAliyunEmailConnector = await enableConnector(aliyunEmailConnectorId);
  expect(enabledAliyunEmailConnector.enabled).toBeTruthy();

  /*
   * Change to another email connector
   */
  const updatedSendgridEmailConnector = await updateConnectorConfig(
    sendgridEmailConnectorId,
    sendgridEmailConnectorConfig
  );
  expect(updatedSendgridEmailConnector.config).toEqual(sendgridEmailConnectorConfig);
  const enabledSendgridEmailConnector = await enableConnector(sendgridEmailConnectorId);
  expect(enabledSendgridEmailConnector.enabled).toBeTruthy();

  // There should be exactly one enabled email connector after changing to another email connector.
  const connectorsAfterChangingEmailConnector = await listConnectors();
  const enabledEmailConnector = connectorsAfterChangingEmailConnector.filter(
    (connector) => connector.type === ConnectorType.Email && connector.enabled
  );
  expect(enabledEmailConnector.length).toEqual(1);
  expect(enabledEmailConnector[0]?.id).toEqual(sendgridEmailConnectorId);

  /*
   * It should update the connector config successfully when it is valid; otherwise, it should fail.
   * We will test updating to the invalid connector config, that is the case not covered above.
   */
  await expect(
    updateConnectorConfig(aliyunEmailConnectorId, sendgridEmailConnectorConfig)
  ).rejects.toThrow(HTTPError);
  // To confirm the failed updating request above did not modify the original config,
  // we check: the Aliyun email connector config should stay the same.
  const aliyunEmailConnector = await getConnector(aliyunEmailConnectorId);
  expect(aliyunEmailConnector.config).toEqual(aliyunEmailConnectorConfig);

  /*
   * Delete (i.e. disable) a connector
   *
   * We have not provided the API to delete a connector for now.
   * Deleting a connector using Admin Console means disabling a connector using Management API.
   */
  const disabledSendgridEmailConnector = await disableConnector(sendgridEmailConnectorId);
  expect(disabledSendgridEmailConnector.enabled).toBeFalsy();
  const sendgridEmailConnector = await getConnector(sendgridEmailConnectorId);
  expect(sendgridEmailConnector.enabled).toBeFalsy();

  /**
   * List connectors after manually setting up connectors.
   * The result of listing connectors should be same as the result of updating connectors above.
   */
  expect(await listConnectors()).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: facebookConnectorId,
        config: facebookConnectorConfig,
        enabled: true,
      }),
      expect.objectContaining({
        id: aliyunSmsConnectorId,
        config: aliyunSmsConnectorConfig,
        enabled: false,
      }),
      expect.objectContaining({
        id: twilioSmsConnectorId,
        config: twilioSmsConnectorConfig,
        enabled: true,
      }),
      expect.objectContaining({
        id: aliyunEmailConnectorId,
        config: aliyunEmailConnectorConfig,
        enabled: false,
      }),
      expect.objectContaining({
        id: sendgridEmailConnectorId,
        config: sendgridEmailConnectorConfig,
        enabled: false,
      }),
    ])
  );

  // Next up
  // - validate `config` parameter before sending
  // - send sms test message
  // - send email test message
});
