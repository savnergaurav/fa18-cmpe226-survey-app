import React, {Component} from 'react' ;
import {Router, Route} from 'react-router-dom';
import './SurveyStatistics.css';
import {connect} from 'react-redux';
import 'antd/dist/antd.css';
import { Layout, Menu, Icon, Table } from 'antd';
import ReactHighcharts from 'react-highcharts';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import {RESTService} from "../../api/index";

const { Header, Content, Footer, Sider } = Layout;
const { Column, ColumnGroup } = Table;



class SurveyStatistics extends Component {

    constructor(props) {
        super(props);
        this.state = {
            questionRespondTrend: true,
            optionTrend: false,
            responseTrendResponse: [],
            // Loop below for all questions for current survey_id
            // TODO: Step1: Fetch response_id from RESPONSE Table for current survey_id <--- Total 
            // Fetch all response detail from RESPONSE_DETAIL table for the Step 1 response_id (Group by question_id) <--- Step 2
            // count(response_id) in Step 1 - Step 2 for every question
            // piedata: [
            //     {
            //         chart: {
            //             plotBackgroundColor: null,
            //             plotBorderWidth: null,
            //             plotShadow: false,
            //             type: 'pie'
            //         },
            //         title: {
            //             text: 'Question Response Vs No response'
            //         },
            //         plotOptions: {
            //             pie: {
            //                 allowPointSelect: true,
            //                 cursor: 'pointer',
            //                 dataLabels: {
            //                     enabled: true,
            //                     format: '<b>{point.name}</b>: {point.y}'
            //                 },
            //                 colors: [
            //                     '#50b432', 
            //                     '#db4437'
            //                 ]
            //             }
            //         },
            //         series: [{
            //             name: 'question_response_trend',
            //             colorByPoint: true,
            //             data: [{
            //                 name: 'Attempted',
            //                 y: 180
            //             }, {
            //                 name: 'Not Responded',
            //                 y: 20
            //             }]
            //         }],
            //         credits: {
            //             enabled: false
            //         },
            //     },
            //     {
            //         chart: {
            //             plotBackgroundColor: null,
            //             plotBorderWidth: null,
            //             plotShadow: false,
            //             type: 'pie'
            //         },
            //         title: {
            //             text: 'Question Response Vs No response'
            //         },
            //         plotOptions: {
            //             pie: {
            //                 allowPointSelect: true,
            //                 cursor: 'pointer',
            //                 dataLabels: {
            //                     enabled: true,
            //                     format: '<b>{point.name}</b>: {point.y}'
            //                 },
            //                 colors: [
            //                     '#50b432', 
            //                     '#db4437'
            //                 ]
            //             }
            //         },
            //         series: [{
            //             name: 'question_response_trend',
            //             colorByPoint: true,
            //             data: [{
            //                 name: 'Attempted',
            //                 y: 10
            //             }, {
            //                 name: 'Not Responded',
            //                 y: 120
            //             }]
            //         }],
            //         credits: {
            //             enabled: false
            //         }
            //     }
            // ],
            optionData: [
                {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Option Respond trend'
                    },
                    subtitle: {
                        text: 'Based on option selected per question'
                    },
                    xAxis: {
                        type: 'category'
                    },
                    yAxis: {
                        title: {
                            text: 'Option Selected'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    series: [{
                        name: '# of Responses',
                        data: [
                            ['Option 1', 10],
                            ['Option 2', 20],
                            ['Option 3', 30],
                            ['Option 4', 40],
                            ['Option 5', 50],                                                                                    
                        ]
                    }]
                },
                {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Option Respond trend'
                    },
                    subtitle: {
                        text: 'Based on option selected per question'
                    },
                    xAxis: {
                        type: 'category'
                    },
                    yAxis: {
                        title: {
                            text: 'Option Selected'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    series: [{
                        name: '# of Responses',
                        data: [
                            ['Option 1', 60],
                            ['Option 2', 70],
                            ['Option 3', 80],
                            ['Option 4', 90],
                            ['Option 5', 100],                                                                                    
                        ]
                    }]
                }
            ]
        }
    }

    componentDidMount() {

        console.log(this.props);
        console.log("###this.props.match.params.surveyId:" + this.props.match.params.surveyId);

        let survey = {
            survey_id: this.props.match.params.surveyId
            // survey_id: '1'
        }

        RESTService.surveyResponseTrend( survey ).then(response => {
            console.log('response');
            console.log(response.data.survey_data);
            this.setState({
                responseTrendResponse : response.data.survey_data
            });
        });


        // RESTService.dashboardResondedByYou( survey ).then(response => {
        //     this.setState({
        //         respondedByYouResponse : response.data.survey_data
        //     });
        // });        
    }

    handleMenuClick = (e) => {
        // console.log('e.key: ', e.key);

        switch (e.key) {

            case '1': 
                this.setState({
                    questionRespondTrend : true,
                    optionTrend : false
                })
                break;

            case '2': 
                this.setState({
                    questionRespondTrend : false,
                    optionTrend : true,
                })
                break;               
        }
    }

    render() {
       
        let { questionRespondTrend, optionTrend, responseTrendResponse } = this.state;
        let piedata = [];
        console.log('responseTrendResponse:');
        console.log(responseTrendResponse);
        for (let i = 0; i < responseTrendResponse.length; i++) {

            let questionPieData = {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Question Response Vs No response (Question ' + (i+1) + ')'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.y}'
                        },
                        colors: [
                            '#50b432', 
                            '#db4437'
                        ]
                    }
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'question_response_trend',
                    colorByPoint: true,
                    data: [{
                        name: 'Attempted',
                        y: responseTrendResponse[i].responded
                    }, {
                        name: 'Not Responded',
                        y: responseTrendResponse[i].total - responseTrendResponse[i].responded
                    }]
                }]
            }
            piedata.push(questionPieData);
        }
        console.log("piedata");
        console.log(piedata);
        return (
            <Layout>
            <Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
              <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={this.handleMenuClick} style={{ height: '100vh' }}>
                    <Menu.Item key="1" style={{height: '10%' }}>
                        <Icon type="bar-chart" />
                        <span className="nav-text">Response Trend</span>
                    </Menu.Item>
                    <Menu.Item key="2" style={{height: '10%' }} >
                        <Icon type="user"/>
                        <span className="nav-text">Option Trend</span>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout style={{ marginLeft: 200 }}>
                {
                    questionRespondTrend &&
                    <Header style={{ background: '#fff'}} > <h3>Respond/ No-Response Trend </h3> </Header>
                }
                {
                    optionTrend &&
                    <Header style={{ background: '#fff'}} > <h3> Options Response Trend </h3> </Header>
                }
                {
                    questionRespondTrend &&
                    piedata.length > 0 &&
                    <Content style={{ margin: '24px 16px 0', overflow: 'initial', height : '100vh' }}>
                        <Carousel showThumbs={false} showArrows useKeyboardArrows>
                            {
                                piedata.length > 0 &&
                                piedata.map( (item, i) => {
                                return <ReactHighcharts config={item} ref="chart"/>
                            })}
                        </Carousel>
                    </Content>
                }
                {
                    optionTrend &&
                    <Content style={{ margin: '24px 16px 0', overflow: 'initial', height : '100vh' }}>
                    
                        <Carousel showThumbs={false} showArrows useKeyboardArrows autoPlay>
                        {
                                this.state.optionData.length &&
                                this.state.optionData.map( (item, i) => {
                                    return <ReactHighcharts config={item} ref="chart"/>
                                })
                        }
                        </Carousel>
                    </Content>
                }
            </Layout>
          </Layout>
        );
    }
}

export default SurveyStatistics;
