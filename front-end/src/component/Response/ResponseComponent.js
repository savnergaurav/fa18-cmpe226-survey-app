import React, { Component } from "react";
import EmailComponent from "./EmailComponent";
import "./survey-response.css";
import { fetchQuestions } from "../../store/actions";
import { connect } from "react-redux";
import TextQuestion from "../Questions/TextQuestion";
import RadioQuestion from "../Questions/RadioQuestion";
import Checkbox from "../Questions/Checkbox";
import DateQuestion from "../Questions/DateQuestion";
import RateQuestion from "../Questions/RateQuestion";
import { RESTService } from "../../api";
import { notification, message } from "antd";

class ResponseComponent extends Component {
  constructor() {
    super();
    this.state = {
      userEmail: "",
      isValidEmail: false,
      surveyType: "",
      surveyUrl: "",
      answers: new Map()
    };
  }

  componentWillMount() {
    let urlString = this.props.location.pathname.substr(10);
    let surveyType = urlString.substr(0, urlString.search("/"));
    let surveyUrl = this.props.match.params.surveyUrl;

    this.setState({
      ...this.state,
      surveyType: surveyType,
      surveyUrl: surveyUrl
    });
  }

  fetchUserSurveyDetails = (userEmail, isValidEmail) => {
    this.setState({
      userEmail: userEmail,
      isValidEmail: isValidEmail
    });

    this.props.fetchQuestions({ surveyUrl: this.state.surveyUrl });
  };

  componentDidMount() {
    if (this.state.surveyType === "general") {
      this.props.fetchQuestions({ surveyUrl: this.state.surveyUrl });
    }
  }

  handleSubmitResponse = () => {
    const { questions, surveyId } = this.props.surveyQuestions;
    const { answers, surveyType } = this.state;
    let isCompleted = 0;

    for (let i = 0; i < questions.length; i++) {
      let questionId = questions[i].questionId;
      let isMandatory = questions[i].isMandatory === 1 ? true : false;
      let questionText = questions[i].questionText;
      let serialNumber = i + 1;
      if (isMandatory && !answers.has(questionId)) {
        isCompleted--;
        notification.error({
          message: `Please fill question: ${serialNumber}`,
          description: `${questionText}`,
          duration: 3.5
        });
      } else {
        isCompleted++;
      }
    }

    if (isCompleted === questions.length) {
      const { userEmail } = this.state;
      let userReponse = {
        user_email: userEmail,
        survey_id: surveyId,
        surveyType: surveyType,
        responses: []
      };

      answers.forEach((value, key, answers) => {
        if (typeof value === "string") {
          userReponse.responses.push({
            question_id: key,
            response_text: value
          });
        } else if (typeof value === "number") {
          userReponse.responses.push({
            question_id: key,
            option_id: value
          });
        } else {
          value.forEach((v1, v2, value) => {
            userReponse.responses.push({
              question_id: key,
              option_id: v1
            });
          });
        }
      });

      RESTService.submitAnswers({
        userReponse: userReponse
      }).then(
        response => {
          console.log("RESPNSE SUCCESS");
          message.success(response.data.message);
          setTimeout(() => {
            window.location.href = "/login";
          }, 1500);
        },
        error => {
          console.log("RESPNSE ERROR");
          message.error(error.data.message);
        }
      );
    }
  };

  onValueChange = (questionId, answer) => {
    this.state.answers.set(questionId, answer);
  };

  prepareQuestions = surveyQuestions => {
    let questions = surveyQuestions.questions;
    let questionsJsx = [];
    for (let i = 0; i < questions.length; i++) {
      let questionId = questions[i].questionId;
      let questionText = questions[i].questionText;
      let questionType = questions[i].questionType;
      let isMandatory = questions[i].isMandatory === 1 ? true : false;
      let responseOptions = questions[i].options;
      switch (questionType) {
        case "Text Question":
          questionsJsx.push(
            <TextQuestion
              key={i}
              serialNumber={i + 1}
              isMandatory={isMandatory}
              id={questionId}
              lab={questionText}
              responseMode={true}
              onValueChange={this.onValueChange}
            />
          );
          break;
        case "Radio Question":
          questionsJsx.push(
            <RadioQuestion
              key={i}
              serialNumber={i + 1}
              isMandatory={isMandatory}
              id={questionId}
              lab={questionText}
              responseMode={true}
              responseOptions={responseOptions}
              onValueChange={this.onValueChange}
            />
          );
          break;
        case "Checkbox Question":
          questionsJsx.push(
            <Checkbox
              key={i}
              serialNumber={i + 1}
              isMandatory={isMandatory}
              id={questionId}
              lab={questionText}
              responseMode={true}
              responseOptions={responseOptions}
              onValueChange={this.onValueChange}
            />
          );
          break;
        case "Rating Question":
          questionsJsx.push(
            <RateQuestion
              key={i}
              serialNumber={i + 1}
              isMandatory={isMandatory}
              id={questionId}
              lab={questionText}
              responseMode={true}
              responseRate={responseOptions}
              onValueChange={this.onValueChange}
            />
          );
          break;
        case "Date Question":
          questionsJsx.push(
            <DateQuestion
              key={i}
              serialNumber={i + 1}
              isMandatory={isMandatory}
              id={questionId}
              lab={questionText}
              responseMode={true}
              onValueChange={this.onValueChange}
            />
          );
          break;
        default:
      }
    }
    return questionsJsx;
  };

  render() {
    const { surveyId, surveyUrl, surveyType, isValidEmail } = this.state;
    const { surveyQuestions } = this.props;
    return (
      <div>
        {surveyType === "general" && (
          <div
            className="container-fluid"
            style={{ backgroundColor: "#EBECED" }}
          >
            <div className="row">
              <div className="col-md-2" />
              <div
                className="col-md-8"
                style={{
                  boxShadow: "0 0 10px #000",
                  marginTop: "5%",
                  marginBottom: "5%",
                  backgroundColor: "#CBC5C1"
                }}
              >
                <div className="row" style={{ textAlign: "center" }}>
                  <h2 style={{ marginTop: "2%" }}>
                    {surveyQuestions.surveyName}
                  </h2>
                  <h4 style={{ marginTop: "2%" }}>
                    {surveyQuestions.surveyDesc}
                  </h4>
                </div>
                <div className="row" style={{ marginTop: "5%" }}>
                  <div className="col-md-2" />
                  <div className="col-md-8">
                    <div className="row">
                      {this.prepareQuestions(surveyQuestions)}
                    </div>
                    <div className="row" style={{ textAlign: "center" }}>
                      <button
                        onClick={this.handleSubmitResponse}
                        type="button"
                        className="btn btn-primary"
                        style={{
                          backgroundColor: "#3E3B3F",
                          color: "white",
                          borderColor: "#3E3B3F",
                          boxShadow: "0 0 10px #000",
                          margin: "2%"
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                  <div className="col-md-2" />
                </div>
              </div>
              <div className="col-md-2" />
            </div>
          </div>
        )}
        {(surveyType === "voluntary" || surveyType === "invited") && (
          <EmailComponent
            surveyUrl={surveyUrl}
            surveyType={surveyType}
            fetchUserSurveyDetails={this.fetchUserSurveyDetails}
          />
        )}
        {(surveyType === "voluntary" || surveyType === "invited") && (
          <div
            className="container-fluid"
            style={{
              backgroundColor: "#EBECED",
              height: isValidEmail ? "" : "100vh"
            }}
            visibility={isValidEmail ? "visible" : "hidden"}
          >
            <div className="row">
              <div className="col-md-2" />
              <div
                className="col-md-8"
                style={{
                  boxShadow: isValidEmail ? "0 0 10px #000" : "",
                  marginTop: "5%",
                  marginBottom: "5%",
                  backgroundColor: isValidEmail ? "#CBC5C1" : "#EBECED"
                }}
              >
                <div className="row" style={{ textAlign: "center" }}>
                  <h2 style={{ marginTop: "2%" }}>
                    {surveyQuestions.surveyName}
                  </h2>
                  <h4 style={{ marginTop: "2%" }}>
                    {surveyQuestions.surveyDesc}
                  </h4>
                </div>
                <div className="row" style={{ marginTop: "5%" }}>
                  <div className="col-md-2" />
                  <div className="col-md-8">
                    <div className="row">
                      {this.prepareQuestions(surveyQuestions)}
                    </div>
                    {isValidEmail && (
                      <div className="row" style={{ textAlign: "center" }}>
                        <button
                          onClick={this.handleSubmitResponse}
                          type="button"
                          className="btn btn-primary"
                          style={{
                            backgroundColor: "#3E3B3F",
                            color: "white",
                            borderColor: "#3E3B3F",
                            boxShadow: "0 0 10px #000",
                            margin: "2%"
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="col-md-2" />
                </div>
              </div>
              <div className="col-md-2" />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    surveyQuestions: state.surveyQuestions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchQuestions: surveyUrl => dispatch(fetchQuestions(surveyUrl))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResponseComponent);
