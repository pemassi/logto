const connectors = {
  title: 'Connectorlar',
  subtitle:
    'Şifresiz ve sosyal oturum açma deneyimini etkinleştirmek için connectorları ayarlayınız.',
  create: 'Social Connector ekle',
  config_sie_notice: 'You’ve set up connectors. Make sure to configure it in <a>{{link}}</a>.', // UNTRANSLATED
  config_sie_link_text: 'sign in experience', // UNTRANSLATED
  tab_email_sms: 'E-posta ve SMS connectorları',
  tab_social: 'Social connectorlar',
  connector_name: 'Connector adı',
  connector_type: 'Tip',
  connector_status: 'Oturum açma deneyimi',
  connector_status_in_use: 'Kullanımda',
  connector_status_not_in_use: 'Kullanımda değil',
  not_in_use_tip: {
    content:
      'Not in use means your sign in experience hasn’t used this sign in method. <a>{{link}}</a> to add this sign in method. ', // UNTRANSLATED
    go_to_sie: 'Go to sign in experience', // UNTRANSLATED
  },
  social_connector_eg: 'Örneğin, Google, Facebook, Github',
  save_and_done: 'Kaydet ve bitir',
  type: {
    email: 'Eposta connectorı',
    sms: 'SMS connectorı',
    social: 'Social connector',
  },
  setup_title: {
    email: 'Eposta connectorı ayarla',
    sms: 'SMS connectorı ayarla',
    social: 'Social Connector ekle',
  },
  guide: {
    subtitle: 'Connectorı yapılandırmak için adım adım kılavuz',
    connector_setting: 'Connector setting', // UNTRANSLATED
    name: 'Connector name', // UNTRANSLATED
    name_tip: 'Connector button’s name will display as "Continue with {{Connector Name}}".', // UNTRANSLATED
    logo: 'Connector logo URL', // UNTRANSLATED
    logo_placelholder: 'https://your.cdn.domain/logo.png', // UNTRANSLATED
    logo_tip: 'The logo image will also display on the connector button.', // UNTRANSLATED
    logo_dark: 'Connector logo URL (Dark mode)', // UNTRANSLATED
    logo_dark_placelholder: 'https://your.cdn.domain/logo.png', // UNTRANSLATED
    logo_dark_tip:
      'This will be used when opening “Enable dark mode” in the setting of sign in experience.', // UNTRANSLATED
    logo_dark_collapse: 'Collapse', // UNTRANSLATED
    logo_dark_show: 'Show "Logo for dark mode"', // UNTRANSLATED
    target: 'Connector identity target', // UNTRANSLATED
    target_tip: 'A unique identifier for the connector.', // UNTRANSLATED
    config: 'Enter your JSON here', // UNTRANSLATED
  },
  platform: {
    universal: 'Evrensel',
    web: 'Web',
    native: 'Native',
  },
  add_multi_platform: ' birden fazla platformu destekler, devam etmek için bir platform seçin',
  drawer_title: 'Connector Kılavuzu',
  drawer_subtitle: 'Connectorı entegre etmek için yönergeleri izleyin',
};

export default connectors;
