import React, { Component } from "react";
import axios from "axios";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import Navbar from "../Dashboard/Navbar";
import { Table, Divider, Tag, Button, Input, Icon, message } from "antd";
import { connect } from "react-redux";
import { RESTService } from "../../api";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mySurveys: [],
      sharedWithMe: [],
      voluntarySurveys: [],
      userEmail: "",
      surveyUrl: "",
      surveyId: "",
      tableJsx: ""
    };
    this.renderSurveys = this.renderSurveys.bind(this);
  }

  componentWillMount = () => {
    const { user } = this.props;

    axios
      .post("http://localhost:3001/fetchMySurveys", {
        email: user.email
      })
      .then(res => {
        this.setState({ mySurveys: res.data.mySurveys });
      });
    axios
      .post("http://localhost:3001/fetchSharedWithMe", {
        email: user.email
      })
      .then(res => {
        this.setState({ sharedWithMe: res.data.sharedWithMe });
      });
    axios.post("http://localhost:3001/fetchVolunteerSurvey").then(res => {
      this.setState({ voluntarySurveys: res.data.voluntarySurveys });
    });

    setTimeout(() => {
        this.renderSurveys("mySurveys");
    }, 1500);
  };

  renderSurveys = (surveyType = "mySurveys") => {
    let surveyColumns = [];
    let surveyData = [];

    if (surveyType === "mySurveys") {
      surveyColumns = [
        {
          title: "Survey Name",
          dataIndex: "surveyName",
          key: "surveyName"
        },
        {
          title: "Survey URL",
          dataIndex: "surveyUrl",
          key: "surveyUrl"
        }
      ];
      surveyData = this.state.mySurveys;
    } else if (surveyType === "sharedWithMe") {
      surveyColumns = [
        {
          title: "Survey Name",
          dataIndex: "surveyName",
          key: "surveyName"
        },
        {
          title: "Survey URL",
          dataIndex: "surveyUrl",
          key: "surveyUrl"
        }
      ];
      surveyData = this.state.sharedWithMe;
    } else if (surveyType === "voluntarySurveys") {
      surveyColumns = [
        {
          title: "Survey Name",
          dataIndex: "surveyName",
          key: "surveyName",
          width: "10px"
        },
        {
          title: "Survey URL",
          dataIndex: "surveyUrl",
          key: "surveyId",
          width: "10px"
        },
        {
          title: "Subscription",
          key: "action",
          width: 100,
          render: (text, record) => (
            <span>
              <Input
                placeholder="Enter your email"
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                onChange={e => this.onChangeEmail(e, text)}
                ref={node => (this.userEmailInput = node)}
              />
              <Button type="primary" onClick={this.handleSubscribe}>
                Subscibe
              </Button>
            </span>
          )
        }
      ];
      surveyData = this.state.voluntarySurveys;
    }

    let jsx = <Table columns={surveyColumns} dataSource={surveyData} />;

    this.setState({
      tableJsx: jsx
    });
  };

  onChangeEmail = (event, text) => {
    this.setState({
      userEmail: event.target.value,
      surveyUrl: text.surveyUrl,
      surveyId: text.surveyId
    });
  };

  handleSubscribe = () => {
    const { userEmail, surveyUrl, surveyId } = this.state;

    let volunteerSurvey = {
      surveyID: surveyId,
      survey_url: surveyUrl,
      email: userEmail
    };

    console.log("--this.handleSubscribe");
    console.log(volunteerSurvey);
    console.log("--this.handleSubscribe");
    RESTService.volunteerSubscription(volunteerSurvey).then(
      response => {
        console.log("RESPNSE SUCCESS");
        message.success("Email sent!");
      },
      error => {
        message.error("Subscription Error");
      }
    );
  };

  render() {
    const { tableJsx } = this.state;

    return (
      <div>
        <Navbar />

        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3" />
            <div className="col-md-2">
              <Button
                type="primary"
                onClick={() => this.renderSurveys("mySurveys")}
              >
                My Surveys
              </Button>
            </div>
            <div className="col-md-2">
              <Button
                type="primary"
                onClick={() => this.renderSurveys("sharedWithMe")}
              >
                Shared With Me
              </Button>
            </div>
            <div className="col-md-2">
              <Button
                type="primary"
                onClick={() => this.renderSurveys("voluntarySurveys")}
              >
                Voluntary
              </Button>
            </div>
            <div className="col-md-3" />
          </div>
          <div className="row" style={{ marginTop: "5px" }}>
            <div className="col-md-1" />
            <div className="col-md-10">{tableJsx}</div>
            <div className="col-md-1" />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return {
    user
  };
}

export default connect(mapStateToProps)(Home);
