/**
 * Entry point for development and production PWA builds.
 * Packaged (NPM) builds go through `index-umd.js`
 */

import 'regenerator-runtime/runtime';

import Demo from './demo';
import ReportList from './ReportList';
import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-poppins';
import './i18n';
import App from 'app/App';
import './react-chartjs-2-defaults';
import './styles/app-base.css';
import './styles/app-components.css';
import './styles/app-utilities.css';
// test

/**
 * EXTENSIONS
 * =================
 *
 * Importing and modifying the extensions our app uses HERE allows us to leverage
 * tree shaking and a few other niceties. However, by including them here they become
 * "baked in" to the published application.
 *
 * Depending on your use case/needs, you may want to consider not adding any extensions
 * by default HERE, and instead provide them via the extensions configuration key or
 * by using the exported `App` component, and passing in your extensions as props using
 * the defaultExtensions property.
 */

//import OHIFDicomTagBrowserExtension from '@ohif/extension-dicom-tag-browser';
// Add this for Debugging purposes:
//import OHIFDebuggingExtension from '@ohif/extension-debugging';

/*
 * Default Settings
 */

const appProps = {
  name: 'radassist',
};

/** Create App */
const app = React.createElement(App, appProps, null);

/** Render */
ReactDOM.render(app, document.getElementById('root'));
