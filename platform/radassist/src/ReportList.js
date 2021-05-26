// import { notification } from 'antd';
import React, { Component } from 'react';
import XRayApi from '../api/backend';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import history from '@history';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import { downloadReport } from '../api/utilities';
import draftToHtml from 'draftjs-to-html';
import FusePageSimpleForReportList from '@fuse/core/FusePageSimple/FusePageSimpleForReportList';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { flattenErrorMessages, formatDate } from '../api/utilities';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class ReportList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: {},
      reportsdcm4chee: {},
      startDate: undefined,
      endDate: undefined,
      name: '',
      reportId: undefined,
      showDate: false,
      patientID: undefined,
      studyInstanceID: undefined,
      showAlert: false,
    };
    this.widget = {
      title: 'Budget Details',
      table: {
        columns: [
          {
            id: 'patientName',
            title: 'Patient Name',
          },
          {
            id: 'patientID',
            title: 'patient ID',
          },
          {
            id: 'studyInstanceID',
            title: 'studyInstance ID',
          },
          {
            id: 'age',
            title: 'Age(Years)',
          },
          {
            id: 'gender',
            title: 'Gender',
          },
          {
            id: 'reviewers',
            title: 'Reviewers',
          },
          {
            id: 'created',
            title: 'Study Created at',
          },
          {
            id: 'createdBy',
            title: 'Created by',
          },
          {
            id: 'hospital',
            title: 'Hospital',
          },
          {
            id: 'reportStatus',
            title: 'Report Status',
          },
          {
            id: 'reportcreated',
            title: 'Report Created At',
          },
          {
            id: 'download',
            title: 'Download Source',
          },
          {
            id: 'download_report',
            title: 'Download Report',
          },
        ],
        rows: [],
      },
    };
  }

  componentDidMount() {
    // this.getUserInfo();
    // this.getReports();
    this.getDICOMfromDcmc4chee();
    this.getStudywithReportFromXraydb();

    // console.log(this.reportlist);
  }

  // apiResponse = apiResponse => {
  // 	const statusCode = apiResponse.response.status;
  // 	if (statusCode === 200) {
  // 		this.setState({ reports: apiResponse.response.data.result });
  // 		console.log('I am from previous api', this.state.reports);
  // 	} else {
  // 		this.setState({ error: true, errorMessage: '' });
  // 		this.openNotificationWithIcon('error', 'Login Failed', apiResponse.response.data.error.msg);
  // 	}
  // };

  apiResponsefromdcm4chee = apiResponse => {
    const statusCode = apiResponse.response.status;

    if (statusCode === 200) {
      this.setState({ reportsdcm4chee: apiResponse.response.data });
      console.log('I am from dcm4chee api', this.state.reportsdcm4chee);
    } else {
      // console('dcm4chee api issue');
      this.setState({ error: true, errorMessage: '' });
      this.openNotificationWithIcon(
        'error',
        'Login Failed',
        apiResponse.response.data.error.msg
      );
    }
  };

  apiResponsefromXRAYDB = apiResponse => {
    const statusCode = apiResponse.response.status;

    if (statusCode === 200) {
      this.setState({ reportsfromxrayb: apiResponse.response.data.result });
      console.log(
        'I am from xraydb, the studies already reported',
        this.state.reportsfromxrayb
      );
    } else {
      this.setState({ error: true, errorMessage: '' });
      this.openNotificationWithIcon(
        'error',
        'Login Failed',
        apiResponse.response.data
      );
    }
  };

  // getReports = () => {
  // 	XRayApi.getReport(this.apiResponse);
  // };

  getDICOMfromDcmc4chee = () => {
    XRayApi.getDICOMList(this.apiResponsefromdcm4chee);
  };

  getStudywithReportFromXraydb = () => {
    XRayApi.getStudywithReport(this.apiResponsefromXRAYDB);
  };

  onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo);
  };

  openNotificationWithIcon = (type, message, description) => {
    // notification[type]({
    //   message: message,
    //   description: description,
    // });
  };
  handleClick = item => {
    // {Opens report in the same window start}
    history.push(`/report/${item}`);
    // React.cloneElement(this.props, { reports: this.state.reports[item], setData: this.state.reports[item] });
    // {Opens report in the same window end}

    // {Opens report in the new window start}
    // window.open(`/report/${item}`, '_blank', `location,height=${window.screen.height},width=${ window.screen.width/2},scrollbars=yes,status=yes,left=${window.screen.width/2},top=0`);

    // setTimeout(() => {
    // 	window.open(`/xray/${item}`, '_blank', `location,height=${window.screen.height},width=${ window.screen.width/2},scrollbars=yes,status=yes,left=0,top=0`);
    // }, 1000);
    // {Opens report in the new window end}
  };
  handleAlertClose = () => {
    this.setState({
      showAlert: false,
    });
  };

  handleReportDownload = (reportData, status) => {
    var designation_list = this.state.designation;
    // console.log('REPORT DOWNLOAD CICK', status);

    if (
      designation_list.indexOf('Radiologist') > -1 &&
      designation_list.indexOf('Doctor') > -1
    ) {
      //checking if doctor and radiologist both exists in designation
      // console.log(' BOTH RADIOLOGIST AND DOCTOR');

      downloadReport(draftToHtml(reportData));
    } else if (
      !(designation_list.indexOf('Radiologist') > -1) &&
      designation_list.indexOf('Doctor') > -1
    ) {
      //checking if only doctor exists in designation
      // console.log(' NO RADIOLOGIST, ONLY DOCTOR');
      if (status == 'Signed off') {
        downloadReport(draftToHtml(reportData));
      } else {
        this.setState({
          showAlert: true,
        });
      }
    } else if (
      designation_list.indexOf('Radiologist') > -1 &&
      !(designation_list.indexOf('Doctor') > -1)
    ) {
      //checking if only radiologist exists in designation
      // console.log(' NO DOCTOR , ONLY RADIOLOGIST');
      downloadReport(draftToHtml(reportData));
    }
  };
  onNameFieldChange = e => {
    e.persist();
    const name = e.target.value;
    this.setState({ name });
  };
  onReportIdFieldChange = e => {
    e.persist();
    const reportId = e.target.value;
    this.setState({ reportId });
  };
  onStartDateFieldChange = startDate => {
    this.setState({ startDate });
  };
  onEndDateFieldChange = endDate => {
    this.setState({ endDate });
  };

  handleSearch = e => {
    const data = {
      // reviewers: [this.state.value],
      name: this.state.name,
      reportId: this.state.reportId,
      startDate: formatDate(new Date(this.state.startDate)),
      endDate: formatDate(new Date(this.state.endDate)),
    };
    // console.log(this.state.name);
    // console.log(this.state.reportId);
    // console.log(this.state.startDate);
    // console.log(this.state.endDate);
    XRayApi.searchReport(data, this.apiResponse);
    //XRayApi.getReport(this.apiResponse);
  };
  handleCheck = e => {
    e.persist();
    const { startDate, endDate } = e.target.value;
    this.setState(startDate);
    this.setState(endDate);
    this.state.showDate = true;
  };

  checkUserRole = () => {
    if (
      this.state.userInfo.role !== 'visitor' &&
      this.state.userInfo.role !== 'admin'
    ) {
      this.props.history.push('/home');
    }
  };
  getUserInfo() {
    XRayApi.userInfo(this.apiResponseUserInfoCallback);
  }

  apiResponseUserInfoCallback = apiResponse => {
    if (apiResponse.response.status === 200) {
      const userInfo = apiResponse.response.data.result;
      // console.log('I AM FROM USERINFO', userInfo);
      const userDesignation = userInfo.designation;
      this.setState({
        designation: userInfo.designation,
      });
      // console.log('I AM FROM USERINFO', this.state.designation);
      const userName = apiResponse.response.data.result.name;
      localStorage.setItem('userName', userName);
      this.setState({ userInfo });
      this.checkUserRole();
    } else {
      return this.props.history.push('/login');
    }
  };

  render() {
    //////////////////////radassist_api_call_start//////////////////////////////////////////////
    // if (!(JSON.stringify(this.state.reports) === JSON.stringify({}))) {
    // 	var rows = this.state.reports.map(report => {
    // 		let reviewersCount = report.report_feedback
    // 			.map(feedback => feedback.reviewer.name)
    // 			.filter((value, index, self) => self.indexOf(value) === index).length;
    // 		let reportStatusClass = reportStatus => {
    // 			switch (reportStatus) {
    // 				case 0:
    // 					return 'bg-red text-white';
    // 				case 1:
    // 					return 'bg-blue text-white';
    // 				default:
    // 					return 'bg-green text-white';
    // 			}
    // 		};

    // 		return {
    // 			id: report.id,
    // 			cells: [
    // 				{
    // 					id: 'patientName',
    // 					value: report.patient_info.name,
    // 					classes: reportStatusClass(reviewersCount),
    // 					icon: ''
    // 				},
    // 				{
    // 					id: 'uniqueID',
    // 					value: report.patient_info.unique_id,
    // 					classes: 'font-bold',
    // 					icon: ''
    // 				},
    // 				{
    // 					id: 'age',
    // 					value: report.patient_info.age,
    // 					classes: 'font-bold',
    // 					icon: ''
    // 				},
    // 				{
    // 					id: 'gender',
    // 					value: report.patient_info.gender,
    // 					classes: '',
    // 					icon: ''
    // 				},
    // 				{
    // 					id: 'reviewers',
    // 					value: reviewersCount,
    // 					classes: '',
    // 					icon: ''
    // 				},
    // 				{
    // 					id: 'created',
    // 					value: moment(report.created_at).format('YYYY-MM-DD HH:mm:ss'),
    // 					classes: '',
    // 					icon: ''
    // 				},
    // 				{
    // 					id: 'createdBy',
    // 					value: report.author.name,
    // 					classes: '',
    // 					icon: ''
    // 				},
    // 				{
    // 					id: 'hospital',
    // 					value: report.hospital.name,
    // 					classes: '',
    // 					icon: ''
    // 				},
    // 				{
    // 					id: 'reportStatus',
    // 					value: report.status,
    // 					classes: '',
    // 					icon: ''
    // 				},
    // 				{
    // 					id: 'download',
    // 					value: report.url,
    // 					values: report.urls,
    // 					classes: '',
    // 					icon: 'cloud_download'
    // 				},
    // 				{
    // 					id: 'download_report',
    // 					value: report.report,
    // 					classes: '',
    // 					icon: 'cloud_download',
    // 					status: report.status
    // 				}
    // 			]
    // 		};
    // 	});
    // 	this.widget.table.rows = rows;
    // }

    //////////////////////radassist_api_call_end//////////////////////////////////////////////

    //////////////////////dcm4chee_api_call_start//////////////////////////////////////////////
    if (!(JSON.stringify(this.state.reportsdcm4chee) === JSON.stringify({}))) {
      // var studyInstanceIDfromDCM4CHEE = [];
      var studyInstanceIDfromxrayDB = [];
      // this.state.reportsfromxrayb.map((singleReportedStudy, index) => {
      // 	var report_created_at = singleReportedStudy.created_at;
      // 	var report_status = singleReportedStudy.status;
      // 	var study_instance_id_from_xraydb = singleReportedStudy.study_instance_id;
      // 	studyInstanceIDfromxrayDB.push(study_instance_id_from_xraydb);
      // });

      var rows = this.state.reportsdcm4chee.map(report => {
        var patientName = report['00100010']['Value'][0]['Alphabetic']
          ? report['00100010']['Value'][0]['Alphabetic']
          : null;
        var patientID = report['00100020']['Value'][0]
          ? report['00100020']['Value'][0]
          : null;
        var studyInstanceID = report['0020000D']['Value'][0]
          ? report['0020000D']['Value'][0]
          : null;
        // studyInstanceIDfromDCM4CHEE.push(studyInstanceID);

        var age = null;
        var genderInitials = report['00100040']
          ? report['00100040']['Value']
          : null;
        if (genderInitials == 'O') {
          var gender = 'Other';
        } else if (genderInitials == 'M') {
          var gender = 'Male';
        } else if (genderInitials == 'F') {
          var gender = 'Female';
        } else {
          var gender = null;
        }
        // var reviewersCount = report['00080090'] ? report['00080090']['Value'].length : null;
        if (report['00080090']) {
          if (report['00080090']['Value']) {
            var reviewersCount = report['00080090']['Value'].length;
          } else {
            var reviewersCount = 0;
          }
        } else {
          var reviewersCount = 0;
        }
        // var createdAtString = report['00080020'] ? report['00080020']['Value'][0] : null;
        if (report['00080020']) {
          if (report['00080020']['Value']) {
            var createdAtString = report['00080020']['Value'][0];
          } else {
            var createdAtString = null;
          }
        } else {
          var createdAtString = null;
        }
        if (createdAtString) {
          var createdAtDate = createdAtString.replace(
            /(\d{4})(\d{2})(\d{2})/,
            '$1-$2-$3'
          );
        }
        // var createdTimeString = report['00080030']['Value'] ? report['00080030']['Value'][0] : null;
        if (report['00080030']) {
          if (report['00080030']['Value']) {
            var createdTimeString = report['00080030']['Value'][0];
          } else {
            var createdTimeString = null;
          }
        } else {
          var createdTimeString = null;
        }
        if (createdTimeString) {
          var createdAtTime = createdTimeString.replace(
            /(\d{2})(\d{2})(\d{2})/,
            '$1:$2:$3'
          );
        }
        var createdAt = createdAtDate + ' ' + createdAtTime;
        // var createdBy = report['00080090'] ? report['00080090']['Value'][0]['Alphabetic'] : null;
        if (report['00080090']) {
          if (report['00080090']['Value']) {
            var createdBy = report['00080090']['Value'][0]['Alphabetic'];
          } else {
            var createdBy = null;
          }
        } else {
          var createdBy = null;
        }
        var hospital = null;
        var reportStatus = null;
        var reportcreatedat = null;
        var downloadSource = report['00081190']['Value'][0]
          ? report['00081190']['Value'][0]
          : null;
        var downloadReport = null;

        // var intersections = studyInstanceIDfromDCM4CHEE.filter(
        // 	e => studyInstanceIDfromxrayDB.indexOf(e) !== -1
        // );

        if (studyInstanceIDfromxrayDB.length >= 1) {
          //check if the current study_uid from the api matched with the
          if (studyInstanceIDfromxrayDB.indexOf(studyInstanceID) !== -1) {
            //values stored in the DB or not.
            // console.log('match');                                                   //If the current study_uid matches with one of the db values,
            var matched_study_instance_uid = studyInstanceID; // if matches, then reassign the values with db's study value,

            var matched_study_from_DB = this.state.reportsfromxrayb.find(
              study => {
                if (study.study_instance_id == matched_study_instance_uid) {
                  return true;
                }
              }
            );

            reportcreatedat = matched_study_from_DB.created_at;
            downloadReport = null;
            reportStatus = matched_study_from_DB.status;
            reviewersCount = reviewersCount + 1;
          }
        }

        return {
          id: studyInstanceID,
          cells: [
            {
              id: 'patientName',
              value: patientName,
              classes: 'font-bold',
              icon: '',
            },
            {
              id: 'uniqueID',
              value: patientID,
              classes: '',
              icon: '',
            },
            {
              id: 'studyInstanceID',
              value: studyInstanceID,
              classes: '',
              icon: '',
            },
            {
              id: 'age',
              value: age,
              classes: '',
              icon: '',
            },
            {
              id: 'gender',
              value: gender,
              classes: '',
              icon: '',
            },
            {
              id: 'reviewers',
              value: reviewersCount,
              classes: '',
              icon: '',
            },
            {
              id: 'created',
              value: createdAt,
              classes: '',
              icon: '',
            },
            {
              id: 'createdBy',
              value: createdBy,
              classes: '',
              icon: '',
            },
            {
              id: 'hospital',
              value: hospital,
              classes: '',
              icon: '',
            },
            {
              id: 'reportStatus',
              value: reportStatus,
              classes: '',
              icon: '',
            },
            {
              id: 'reportcreated',
              value: reportcreatedat,
              classes: '',
              icon: '',
            },
            {
              id: 'download',
              value: studyInstanceID,
              values: 'n/a',
              classes: '',
              icon: 'cloud_download',
            },
            {
              id: 'download_report',
              value: downloadReport,
              classes: '',
              icon: 'cloud_download',
              status: reportStatus,
            },
          ],
        };
      });
      this.widget.table.rows = rows;
    }

    //////////////////////dcm4chee_api_call_end//////////////////////////////////////////////

    // console.log(rows);
    console.warn(this.state.reports);
    return (
      <FusePageSimpleForReportList
        header={
          <div className="p-24">
            <h4>{'View reports'}</h4>
          </div>
        }
        contentToolbar={
          <div className="p-24">
            <div>Report List </div>
          </div>
        }
        content={
          <div>
            {/* <h2 style={{ paddingLeft: '1%' }}>Search Report</h2> */}
            {/* <div className="flex flex-col sm:flex sm:flex-row items-center">
							<div className="widget flex w-full sm:w-1/3 p-16">
								<TextField
									label={`Patient's Name`}
									variant="outlined"
									name={'name'}
									onChange={this.onNameFieldChange}
									fullWidth
									required
								/>
								<TextField
									label={`Report ID`}
									variant="outlined"
									name={'reportId'}
									onChange={this.onReportIdFieldChange}
									fullWidth
									required
									style={{'margin-left': '5px'}}
								/>
							</div>
							<div className="widget flex w-full sm:w-1/3 p-16">

								<div style={{margin:'auto'}}>
									<Select style={{ marginRight: '5px' }} size="small" defaultValue="status" variant="outlined" onChange={this.statusFieldOnChange}
										required>
										<MenuItem value="status">Select Status</MenuItem>
										<MenuItem value="b">B</MenuItem>
										<MenuItem value="others">Others</MenuItem>
									</Select>
									<Select size="small" defaultValue="status" variant="outlined" onChange={this.centerFieldOnChange}
										required>
										<MenuItem value="status">Select Center</MenuItem>
										<MenuItem value="b">B</MenuItem>
										<MenuItem value="others">Others</MenuItem>
									</Select>
								</div>


							</div>

							<div className="widget flex w-full sm:w-1/3 p-16">

									<KeyboardDatePicker
										margin="normal"
										id="date-picker-dialog"
										label={'Start Date'}
										format="DD/MM/YYYY"
										value={this.state.startDate}
										onChange={this.onStartDateFieldChange}
										KeyboardButtonProps={{
											'aria-label': 'change date'
										}}
										required
									/>
									<KeyboardDatePicker
										margin="normal"
										id="date-picker-dialog"
										label={'End Date'}
										format="DD/MM/YYYY"
										value={this.state.endDate}
										onChange={this.onEndDateFieldChange}
										KeyboardButtonProps={{
											'aria-label': 'change date'
										}}
										required
									/>
							</div>

							<div className="widget flex w-full sm:w-1/3 p-16">



								<div>
									<Symptoms
										name='Search by Date'
										handleCheck={this.handleCheck}
										handleInputField={this.handleInputField}
										checkboxName='Search by Date'
									/>
								</div>

								<div>
									<Button
										style={{ minWidth: '100px' }}
										color="primary"
										variant="contained"
										onClick={this.handleSearch}
									>
										Search
									</Button>
								</div>
							</div>


						</div> */}
            {this.state.showAlert ? (
              <div>
                {' '}
                <Dialog
                  open={this.state.showAlert}
                  onClose={this.handleAlertClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"The report hasn't been Signed Off yet."}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      You can download the report once the "Report Status" has
                      been changed to "Signed off" by the corresponding
                      Radiologist.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={this.handleAlertClose}
                      color="primary"
                      autoFocus
                    >
                      OK
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            ) : (
              <></>
            )}

            <Grid fluid>
              <Row>
                <Col xs={12}>
                  <Paper
                    className="w-full rounded-8 shadow-none border-1"
                    width={1}
                  >
                    <div className="flex items-center justify-between px-16 h-64 border-b-1">
                      <Typography className="text-16">
                        {(this.state.reportsdcm4chee
                          ? this.state.reportsdcm4chee.length
                          : 'No reports') + ' reports to show'}
                      </Typography>
                    </div>
                    <div className="table-responsive">
                      <Table className="w-full min-w-full">
                        <TableHead>
                          <TableRow>
                            {this.widget.table.columns.map(column => (
                              <TableCell
                                key={column.id}
                                className="whitespace-no-wrap"
                              >
                                {column.title}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {this.widget.table.rows.map(row => (
                            <TableRow
                              key={row.id}
                              hover
                              role="checkbox"
                              aria-checked={true}
                              tabIndex={-1}
                              key={row.id}
                              selected={true}
                            >
                              {row.cells.map(cell => {
                                switch (cell.id) {
                                  case 'patientName': {
                                    return (
                                      <TableCell
                                        key={cell.id}
                                        component="th"
                                        scope="row"
                                      >
                                        {/* {console.log(
																					'this is from  ROQW',
																					row.id
																				)} */}
                                        <Button
                                          onClick={event =>
                                            this.handleClick(row.id)
                                          }
                                        >
                                          <Typography
                                            className={clsx(
                                              cell.classes,
                                              'inline text-11 font-500 px-8 py-4 rounded-4'
                                            )}
                                          >
                                            {cell.value}
                                          </Typography>
                                        </Button>
                                      </TableCell>
                                    );
                                  }
                                  case 'patientID': {
                                    return (
                                      <TableCell
                                        key={cell.id}
                                        component="th"
                                        scope="row"
                                      >
                                        <Typography
                                          className={clsx(
                                            cell.classes,
                                            'flex items-center'
                                          )}
                                        >
                                          {cell.value}
                                          <Icon className="text-14 mx-4">
                                            {cell.icon}
                                          </Icon>
                                        </Typography>
                                      </TableCell>
                                    );
                                  }
                                  case 'studyInstanceID': {
                                    return (
                                      <TableCell
                                        key={cell.id}
                                        component="th"
                                        scope="row"
                                      >
                                        <Typography
                                          className={clsx(
                                            cell.classes,
                                            'flex items-center'
                                          )}
                                        >
                                          {cell.value}
                                          <Icon className="text-14 mx-4">
                                            {cell.icon}
                                          </Icon>
                                        </Typography>
                                      </TableCell>
                                    );
                                  }
                                  case 'age': {
                                    return (
                                      <TableCell
                                        key={cell.id}
                                        component="th"
                                        scope="row"
                                      >
                                        <Typography
                                          className={clsx(
                                            cell.classes,
                                            'flex items-center'
                                          )}
                                        >
                                          {cell.value}
                                          <Icon className="text-14 mx-4">
                                            {cell.icon}
                                          </Icon>
                                        </Typography>
                                      </TableCell>
                                    );
                                  }
                                  case 'gender': {
                                    return (
                                      <TableCell
                                        key={cell.id}
                                        component="th"
                                        scope="row"
                                      >
                                        <Typography
                                          className={clsx(
                                            cell.classes,
                                            'flex items-center'
                                          )}
                                        >
                                          {cell.value}
                                          <Icon className="text-14 mx-4">
                                            {cell.icon}
                                          </Icon>
                                        </Typography>
                                      </TableCell>
                                    );
                                  }
                                  case 'reviewers': {
                                    return (
                                      <TableCell
                                        key={cell.id}
                                        component="th"
                                        scope="row"
                                      >
                                        <Typography
                                          className={clsx(
                                            cell.classes,
                                            'flex items-center'
                                          )}
                                        >
                                          {cell.value}
                                          <Icon className="text-14 mx-4">
                                            {cell.icon}
                                          </Icon>
                                        </Typography>
                                      </TableCell>
                                    );
                                  }
                                  case 'created': {
                                    return (
                                      <TableCell
                                        key={cell.id}
                                        component="th"
                                        scope="row"
                                      >
                                        <Typography
                                          className={clsx(
                                            cell.classes,
                                            'flex items-center'
                                          )}
                                        >
                                          {cell.value}
                                          <Icon className="text-14 mx-4">
                                            {cell.icon}
                                          </Icon>
                                        </Typography>
                                      </TableCell>
                                    );
                                  }
                                  case 'createdBy': {
                                    return (
                                      <TableCell
                                        key={cell.id}
                                        component="th"
                                        scope="row"
                                      >
                                        <Typography
                                          className={clsx(
                                            cell.classes,
                                            'flex items-center'
                                          )}
                                        >
                                          {cell.value}
                                          <Icon className="text-14 mx-4">
                                            {cell.icon}
                                          </Icon>
                                        </Typography>
                                      </TableCell>
                                    );
                                  }
                                  case 'hospital': {
                                    return (
                                      <TableCell
                                        key={cell.id}
                                        component="th"
                                        scope="row"
                                      >
                                        <Typography
                                          className={clsx(
                                            cell.classes,
                                            'flex items-center'
                                          )}
                                        >
                                          {cell.value}
                                          <Icon className="text-14 mx-4">
                                            {cell.icon}
                                          </Icon>
                                        </Typography>
                                      </TableCell>
                                    );
                                  }
                                  case 'reportStatus': {
                                    return (
                                      <TableCell
                                        key={cell.id}
                                        component="th"
                                        scope="row"
                                      >
                                        <Typography
                                          className={clsx(
                                            cell.classes,
                                            'flex items-center'
                                          )}
                                        >
                                          {cell.value}
                                          <Icon className="text-14 mx-4">
                                            {cell.icon}
                                          </Icon>
                                        </Typography>
                                      </TableCell>
                                    );
                                  }
                                  case 'reportcreated': {
                                    return (
                                      <TableCell
                                        key={cell.id}
                                        component="th"
                                        scope="row"
                                      >
                                        <Typography
                                          className={clsx(
                                            cell.classes,
                                            'flex items-center'
                                          )}
                                        >
                                          {cell.value}
                                          <Icon className="text-14 mx-4">
                                            {cell.icon}
                                          </Icon>
                                        </Typography>
                                      </TableCell>
                                    );
                                  }
                                  case 'download': {
                                    return cell.value ? (
                                      <TableCell
                                        key={cell.id}
                                        component="th"
                                        scope="row"
                                      >
                                        <a
                                          href={`https://dev.radassist.net/dcm4chee-arc/aets/DCM4CHEE/rs/studies/${cell.value}?accept=application/zip;transfer-syntax=*&dicomdir=true`}
                                          target="_blank"
                                        >
                                          <Typography
                                            className={clsx(
                                              cell.classes,
                                              'flex items-center'
                                            )}
                                          >
                                            <Icon className="text-14 mx-4">
                                              {cell.icon}
                                            </Icon>
                                          </Typography>
                                        </a>
                                      </TableCell>
                                    ) : (
                                      <TableCell
                                        key={cell.id}
                                        component="th"
                                        scope="row"
                                      >
                                        <ExpansionPanel>
                                          <ExpansionPanelSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                          >
                                            <Typography>Links</Typography>
                                          </ExpansionPanelSummary>
                                          <ExpansionPanelDetails>
                                            <Typography>
                                              {cell.values.map(x => (
                                                <a href={x} target="_blank">
                                                  <Typography
                                                    className={clsx(
                                                      cell.classes,
                                                      'flex items-center'
                                                    )}
                                                  >
                                                    <Icon className="text-14 mx-4">
                                                      {cell.icon}
                                                    </Icon>{' '}
                                                    {
                                                      x.split('/')[
                                                        x.split('/').length - 1
                                                      ]
                                                    }
                                                  </Typography>
                                                  <br />
                                                </a>
                                              ))}
                                            </Typography>
                                          </ExpansionPanelDetails>
                                        </ExpansionPanel>
                                      </TableCell>
                                    );
                                  }
                                  case 'download_report': {
                                    return (
                                      <TableCell
                                        key={cell.id}
                                        component="th"
                                        scope="row"
                                      >
                                        <a style={{ cursor: 'pointer' }}>
                                          <Typography
                                            className={clsx(
                                              cell.classes,
                                              'flex items-center'
                                            )}
                                          >
                                            <Icon className="text-14 mx-4">
                                              {cell.icon}
                                            </Icon>
                                          </Typography>
                                        </a>
                                      </TableCell>
                                    );
                                  }
                                  default: {
                                    return (
                                      <TableCell
                                        key={cell.id}
                                        component="th"
                                        scope="row"
                                      >
                                        <Typography className={cell.classes}>
                                          {cell.value}
                                        </Typography>
                                      </TableCell>
                                    );
                                  }
                                }
                              })}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </Paper>
                </Col>
              </Row>
            </Grid>
          </div>
        }
      ></FusePageSimpleForReportList>
    );
  }
}

export default ReportList;
