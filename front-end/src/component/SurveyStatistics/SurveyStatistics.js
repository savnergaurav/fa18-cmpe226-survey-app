import React, {Component} from 'react' ;
import {Router, Route} from 'react-router-dom';
import './SurveyStatistics.css';
import {connect} from 'react-redux';
import 'antd/dist/antd.css';
import { Layout, Menu, Icon, Table } from 'antd';
import ReactHighcharts from 'react-highcharts';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

const { Header, Content, Footer, Sider } = Layout;
const { Column, ColumnGroup } = Table;


class SurveyStatistics extends Component {

    constructor(props) {
        super(props);
        this.state = {
            questionRespondTrend: true,
            optionTrend: false,

            // Loop below for all questions for current survey_id
            // TODO: Step1: Fetch response_id from RESPONSE Table for current survey_id <--- Total 
            // Fetch all response detail from RESPONSE_DETAIL table for the Step 1 response_id (Group by question_id) <--- Step 2
            // count(response_id) in Step 1 - Step 2 for every question
            piedata: [
                {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: 'Question Response Vs No response'
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
                    series: [{
                        name: 'question_response_trend',
                        colorByPoint: true,
                        data: [{
                            name: 'Attempted',
                            y: 180
                        }, {
                            name: 'Not Responded',
                            y: 20
                        }]
                    }],
                    credits: {
                        enabled: false
                    },
                },
                {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: 'Question Response Vs No response'
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
                    series: [{
                        name: 'question_response_trend',
                        colorByPoint: true,
                        data: [{
                            name: 'Attempted',
                            y: 10
                        }, {
                            name: 'Not Responded',
                            y: 120
                        }]
                    }],
                    credits: {
                        enabled: false
                    }
                }
            ],
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

    createQuestionResponseGraph = () => {
        let temp=[];
        for(let i=0; i<this.state.piedata.length; i++) {
            temp.push(<div key={i}><ReactHighcharts config={this.state.piedata[i]} ref="chart"/></div>);
        }
        return temp;
    }

    render() {
       
        let { questionRespondTrend, optionTrend } = this.state;
        
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
                    <Content style={{ margin: '24px 16px 0', overflow: 'initial', height : '100vh' }}>
                        <Carousel showThumbs={false} showArrows useKeyboardArrows autoPlay>
                            {
                                this.state.piedata.length &&
                                this.state.piedata.map( (item, i) => {
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
