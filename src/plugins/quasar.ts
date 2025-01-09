// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css';
// Import Quasar css
import 'quasar/src/css/index.sass';

import { Notify, Quasar } from 'quasar';
import { App } from 'vue';

import { appThemeConfig } from '@/constants/appTheme';

const useQuasar = (app: App): void => {
  app.use(Quasar, {
    config: {
      brand: {
        ...appThemeConfig,
        negative: appThemeConfig.error,
        positive: appThemeConfig.success,
      },
    },
    plugins: { Notify },
    // screen: {
    //   lg: '1024px',
    //   md: '768px',
    //   sm: '640px',
    //   xl: '1280px',
    //   // '2xl': '1536px',
    // },
  });
};

export default useQuasar;
