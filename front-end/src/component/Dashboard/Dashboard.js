import React, {Component} from 'react' ;
import {Router, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import 'antd/dist/antd.css';
import { Layout, Menu, Icon, Table } from 'antd';
import Chart from "react-google-charts";
import {RESTService} from "../../api/index";
import {Link} from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const { Column, ColumnGroup } = Table;

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            myCreatedSurveys: true,
            myRespondedSurveys: false,
            createdByYouResponse: [{sname: 'NO SURVEY DATA', invite_count: 0, response_count: 0}],
            respondedByYouResponse: [{sname: 'NO SURVEY DATA', invite_count: 0, response_count: 0}],
        }
    }

    componentDidMount() {

        let user = {
            // username: "relansaket@gmail.com"
            username : this.props.user.email
            
        }
        console.log("Username : ", user.username);

        RESTService.dashboardCreatedByYou( user ).then(response => {
            this.setState({
                createdByYouResponse : response.data.survey_data
            });
        });

        RESTService.dashboardResondedByYou( user ).then(response => {
            this.setState({
                respondedByYouResponse : response.data.survey_data
            });
        });
    }
    
    handleMenuClick = (e) => {
        // console.log('e.key: ', e.key);

        switch (e.key) {

            case '1': 
                this.setState({
                    myCreatedSurveys : true,
                    myRespondedSurveys : false
                })
                break;

            case '2': 
                this.setState({
                    myCreatedSurveys : false,
                    myRespondedSurveys : true,
                })
                break;               
        }
    }

    render() {

        let { myCreatedSurveys, myRespondedSurveys, createdByYouResponse, respondedByYouResponse } = this.state;
        let j;
        
        // TODO: Step1: Fetch survey_id created by current user from SURVEYS Table and then 
        // Fetch all Invites from INVITES table for the Step 1 surveys -> First Column
        // Fetch responses from RESPONSE table for the Step 1 surveys -> Second Column
        // *********************EXPECTED FORMAT**************************
        // let inviteRespondedData1 = [
        //     ['Surveys', 'Invite', 'Response'],
        //     ['survey 1', 1000, 400],
        //     ['survey 2', 1170, 460],
        //     ['survey 3', 660, 1120],
        //     ['survey 4', 1030, 540],
        // ];

        let inviteRespondedData1 = [
            ['Surveys', 'Invite', 'Response'],
        ];

        for (let i = 0, j = 1; i < createdByYouResponse.length; i++) {

            inviteRespondedData1[j++] = [createdByYouResponse[i].sname, createdByYouResponse[i].invite_count, createdByYouResponse[i].response_count];
        }

        // TODO: Step1: Fetch survey_id respnded by current user from RESPONSE Table and then 
        // Fetch all Invites from INVITES table for the Step 1 surveys (Group by survey_id) -> First Column
        // Fetch responses from RESPONSE table for the Step 1 surveys (Group by survey_id) -> Second Column
        // *********************EXPECTED FORMAT**************************
        // let inviteRespondedData2 = [
        //     ['Surveys', 'Invite', 'Response'],
        //     ['survey 1', 1000, 400],
        //     ['survey 2', 1170, 460],
        //     ['survey 3', 660, 1120],
        //     ['survey 4', 1030, 540],
        // ];

        let inviteRespondedData2 = [
            ['Surveys', 'Invite', 'Response']
        ];

        for (let i = 0, j = 1; i < respondedByYouResponse.length; i++) {

            inviteRespondedData2[j++] = [respondedByYouResponse[i].sname, respondedByYouResponse[i].invite_count, respondedByYouResponse[i].response_count];
        }

        const options = {
            // chart options
            title: 'Survey Statistics',
            hAxis: {
                title: '# of responses',
            },
            vAxis: {
                title: 'Surveys',
            },            
        };

        // TODO: Step1: Fetch survey_id and all other details created by current user from SURVEYS Table
        // *********************EXPECTED FORMAT**************************
        // let surveyList1 = [{
        //     key: '1',
        //     firstName: 'Saket',
        //     lastName: 'Brown',
        //     age: 32,
        //     address: 'New York No. 1 Lake Park',
        //   }, {
        //     key: '2',
        //     firstName: 'Suhas',
        //     lastName: 'Green',
        //     age: 42,
        //     address: 'London No. 1 Lake Park',
        //   }];

        let surveyList1 = [];

        for (let i = 0, j = 1; i < createdByYouResponse.length; i++) {

            let createdByYouSurvey = {
                key: createdByYouResponse[i].id,
                surveyName: createdByYouResponse[i].sname,
                surveyType: createdByYouResponse[i].stype,
                surveyCreatedDate: createdByYouResponse[i].screated_date,
                surveyValidity: createdByYouResponse[i].svalidity
            }

            surveyList1.push(createdByYouSurvey);
        }

        console.log("surveyList1");
        console.log(surveyList1);
        // TODO: Step1: Fetch survey_id respnded by current user from RESPONSE Table and then
        // Fetch all details corresponding to survey_id from SURVEYS Table
        // *********************EXPECTED FORMAT**************************
        // let surveyList2 = [{
        //         key: '1',
        //         firstName: 'John',
        //         lastName: 'Brown',
        //         age: 32,
        //         address: 'New York No. 1 Lake Park',
        //     }, {
        //         key: '2',
        //         firstName: 'Jim',
        //         lastName: 'Green',
        //         age: 42,
        //         address: 'London No. 1 Lake Park',
        //     }];

        let surveyList2 = [];

        for (let i = 0, j = 1; i < respondedByYouResponse.length; i++) {

            let respondedByYouSurvey = {
                key: respondedByYouResponse[i].id,
                surveyName: respondedByYouResponse[i].sname,
                surveyType: respondedByYouResponse[i].stype,
                surveyCreatedDate: respondedByYouResponse[i].screated_date,
                surveyValidity: respondedByYouResponse[i].svalidity
            }

            surveyList2.push(respondedByYouSurvey);
        }
        return (
            <Layout>
                <Header className="header">
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} style={{ lineHeight: '64px' }}>
                        <Menu.Item key="1"><Link to={`/home`}> Home </Link> </Menu.Item>
                        <Menu.Item key="2"><Link to={`/dashboard`}> Dashboard </Link> </Menu.Item>
                        <Menu.Item key="3"><Link to={`/create`}> Create Survey </Link> </Menu.Item>
                    </Menu>
                </Header>
                <Content>
                    <Layout style={{ height: '100%'  }}>
                        <Sider width={200} style={{ height: '100%'}}>
                            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={this.handleMenuClick} style={{ height: '100vh' }}>
                                <Menu.Item key="1" style={{height: '10%' }}>
                                    <Icon type="bar-chart" />
                                    <span className="nav-text">Created by You</span>
                                </Menu.Item>
                                <Menu.Item key="2" style={{height: '10%' }} >
                                    <Icon type="user"/>
                                    <span className="nav-text">Responded by You</span>
                                </Menu.Item>
                            </Menu>
                        </Sider>
                        <Content style={{ margin: '24px 16px 0', overflow: 'initial', height : '75vh' }}>
                            {
                                myCreatedSurveys &&
                                <h3>Surveys created by you </h3>
                            }
                            {
                                myRespondedSurveys &&
                                <h3> Surveys responded by you </h3>
                            }
                            {
                                myCreatedSurveys &&
                                <Chart chartType="Bar" width="100%" height="90%" data={inviteRespondedData1} options={options}/>
                            }
                            {
                                myRespondedSurveys &&
                                <Chart chartType="Bar" width="100%" height="90%" data={inviteRespondedData2} options={options}/>
                            }
                            {
                                myCreatedSurveys &&
                                <Table bordered dataSource={surveyList1}>
                                    <Column title="Survey Name" dataIndex="surveyName" key="surveyName" />
                                    <Column title="Type" dataIndex="surveyType" key="surveyType" />
                                    <Column title="Created Date" dataIndex="surveyCreatedDate" key="surveyCreatedDate" />
                                    <Column title="Validity" dataIndex="surveyValidity" key="surveyValidity"/>
                                    <Column align = 'center' title="Action" key="action" render={(text, record) => (
                                        <span>
                                            <a href={`/SurveyStatistics/${record.key}`}> View Statistics </a>
                                        </span>
                                    )}
                                    />
                                </Table>
                            }
                            {
                                myRespondedSurveys &&
                                <Table bordered dataSource={surveyList2}>
                                    <Column title="Survey Name" dataIndex="surveyName" key="surveyName" />
                                    <Column title="Type" dataIndex="surveyType" key="surveyType" />
                                    <Column title="Created Date" dataIndex="surveyCreatedDate" key="surveyCreatedDate" />
                                    <Column title="Validity" dataIndex="surveyValidity" key="surveyValidity"/>
                                    <Column align = 'center' title="Action" key="action" render={(text, record) => (
                                        <span>
                                            <a href={`/SurveyStatistics/${record.key}`}> View Statistics </a>
                                        </span>
                                    )}
                                    />
                                </Table>
                            }
                        </Content>
                    </Layout>
                </Content>
            </Layout>           
        );
    }
}

function mapStateToProps(state) {

    const { user } = state;
    return {
        user
    };
}

export default connect(mapStateToProps)(Dashboard);
