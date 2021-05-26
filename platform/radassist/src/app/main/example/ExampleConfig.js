import i18next from 'i18next';
import homepage from './homepage';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';
import ReportViewer from '../../../component/report-viewer/ReportViewer';
import ReportList from '../../../ReportList';

i18next.addResourceBundle('en', 'homepage', en);
i18next.addResourceBundle('tr', 'homepage', tr);
i18next.addResourceBundle('ar', 'homepage', ar);

const ExampleConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    // {
    //   path: '/',
    //   component: homepage,
    // },
    {
      path: '/report/list',
      component: ReportList,
    },
    {
      path: '/report/:studyInstanceUIDs',
      component: ReportViewer,
    },
  ],
};

export default ExampleConfig;

/**
 * Lazy load Example
 */
/*
import React from 'react';

const ExampleConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/example',
            component: React.lazy(() => import('./Example'))
        }
    ]
};

export default ExampleConfig;

*/
