/**
 * Entry point for development and production PWA builds.
 * Packaged (NPM) builds go through `index-umd.js`
 */
import React, { Component } from 'react';

import Superman from '@ohif/viewer';

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

class Demo extends Component {
  render() {
    return (
      <div>
        <p>Loading from Demo</p>
        <Superman />
      </div>
    );
  }
}

export default Demo;
