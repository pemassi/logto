import { isLanguageTag } from '@logto/language-kit';
import type { ConnectorFactoryResponse, ConnectorResponse } from '@logto/schemas';
import { ConnectorType } from '@logto/schemas';
import { conditional } from '@silverhand/essentials';
import i18next from 'i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import Close from '@/assets/images/close.svg';
import Button from '@/components/Button';
import CardTitle from '@/components/CardTitle';
import DangerousRaw from '@/components/DangerousRaw';
import IconButton from '@/components/IconButton';
import Markdown from '@/components/Markdown';
import useApi from '@/hooks/use-api';
import useSettings from '@/hooks/use-settings';
import SenderTester from '@/pages/ConnectorDetails/components/SenderTester';
import { safeParseJson } from '@/utilities/json';

import Form from './Form';
import * as styles from './index.module.scss';
import type { CreateConnectorForm } from './types';

type Props = {
  connector: ConnectorFactoryResponse;
  onClose: () => void;
};

const Guide = ({ connector, onClose }: Props) => {
  const api = useApi();
  const { updateSettings } = useSettings();
  const { t } = useTranslation(undefined, { keyPrefix: 'admin_console' });
  const { id: connectorId, type: connectorType, name, readme, isStandard } = connector;
  const { language } = i18next;
  const connectorName = conditional(isLanguageTag(language) && name[language]) ?? name.en;
  const isSocialConnector =
    connectorType !== ConnectorType.Sms && connectorType !== ConnectorType.Email;
  const methods = useForm<CreateConnectorForm>({ reValidateMode: 'onBlur' });
  const {
    formState: { isSubmitting },
    handleSubmit,
    watch,
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    if (isSubmitting) {
      return;
    }

    const { config, name, ...otherData } = data;
    const result = safeParseJson(config);

    if (!result.success) {
      toast.error(result.error);

      return;
    }

    const { id: connectorId } = connector;

    await api
      .post('/api/connectors', {
        json: {
          config: result.data,
          connectorId,
          metadata: conditional(
            isStandard && {
              ...otherData,
              name: { en: name },
            }
          ),
        },
      })
      .json<ConnectorResponse>();

    await updateSettings({
      ...conditional(!isSocialConnector && { passwordlessConfigured: true }),
      ...conditional(isSocialConnector && { socialSignInConfigured: true }),
    });

    onClose();
    toast.success(t('general.saved'));
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <IconButton size="large" onClick={onClose}>
          <Close className={styles.closeIcon} />
        </IconButton>
        <div className={styles.separator} />
        <CardTitle
          size="small"
          title={<DangerousRaw>{connectorName}</DangerousRaw>}
          subtitle="connectors.guide.subtitle"
        />
      </div>
      <div className={styles.content}>
        <Markdown className={styles.readme}>{readme}</Markdown>
        <div className={styles.setup}>
          <div className={styles.title}>{t('connectors.guide.connector_setting')}</div>
          <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
              <Form connector={connector} />
              {!isSocialConnector && (
                <SenderTester
                  className={styles.tester}
                  connectorId={connectorId}
                  connectorType={connectorType}
                  config={watch('config')}
                />
              )}
              <div className={styles.footer}>
                <Button
                  title="connectors.save_and_done"
                  type="primary"
                  htmlType="submit"
                  isLoading={isSubmitting}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default Guide;
