import { connect } from 'react-redux';
import OHIF from '@ohif/core';
import ViewerRetrieveStudyData from './ViewerRetrieveStudyData.js';

const { clearViewportSpecificData, setStudyData } = OHIF.redux.actions;
const isActive = a => a.active === true;

const mapStateToProps = (state, ownProps) => {
  return {
    server: {
      name: 'DCM4CHEE',
      wadoUriRoot: 'https://dev.radassist.net/dcm4chee-arc/aets/DCM4CHEE/wado',
      qidoRoot: 'https://dev.radassist.net/dcm4chee-arc/aets/DCM4CHEE/rs',
      wadoRoot: 'https://dev.radassist.net/dcm4chee-arc/aets/DCM4CHEE/rs',
      qidoSupportsIncludeField: true,
      imageRendering: 'wadors',
      thumbnailRendering: 'wadors',
      enableStudyLazyLoad: true,
      supportsFuzzyMatching: true,
    },

    // server: {
    // 	name: 'DCM4CHEE',
    // 	wadoUriRoot: 'https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/wado',
    // 	qidoRoot: 'https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/rs',
    // 	wadoRoot: 'https://server.dcmjs.org/dcm4chee-arc/aets/DCM4CHEE/rs',
    // 	qidoSupportsIncludeField: true,
    // 	imageRendering: 'wadors',
    // 	thumbnailRendering: 'wadors',
    // 	enableStudyLazyLoad: true,
    // 	supportsFuzzyMatching: true
    // }
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setStudyData: (StudyInstanceUID, data) => {
      dispatch(setStudyData(StudyInstanceUID, data));
    },
    clearViewportSpecificData: () => {
      dispatch(clearViewportSpecificData());
    },
  };
};

const ConnectedViewerRetrieveStudyData = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewerRetrieveStudyData);

export default ConnectedViewerRetrieveStudyData;
