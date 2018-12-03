import React, { Component } from "react";
import { Modal, Button, Input, Icon } from "antd";
import "./survey-response.css";
import { RESTService } from "../../api";

class EmailComponent extends Component {
  constructor() {
    super();
    this.state = {
      userEmail: "t@mailinator.com",
      openEmailModal: true,
      loading: false
    };
  }

  showModal = () => {
    this.setState({
      openEmailModal: true
    });
  };

  emitEmpty = () => {
    this.userEmailInput.focus();
    this.setState({ userEmail: "" });
  };

  onChangeUserName = e => {
    this.setState({ userEmail: e.target.value });
  };

  onSubmitClick = () => {
    const { surveyUrl, surveyType } = this.props;
    const { userEmail } = this.state;

    if (userEmail.length === 0) {
      Modal.error({
        title: "Oops!",
        content: "Please enter your email",
        centered: true,
        keyboard: false,
      });
    } else {
      this.setState({ loading: true });
      setTimeout(() => {
        let userSurvey = {
          userEmail: userEmail,
          surveyUrl: surveyUrl,
          surveyType: surveyType
        };

        let checkValidity = new Promise(function(resolve, reject) {
          RESTService.validateEmail(userSurvey).then(
            response => {
              let result = {
                isValidEmail: response.data.isValidEmail,
                message: response.data.message
              };
              resolve(result);
            },
            error => {
              let result = {
                isValidEmail: error.data.isValidEmail,
                message: error.data.message
              };
              reject(result);
            }
          );
        });

        checkValidity
          .then(result => {
            this.onValidEmail(result.message);
            this.props.fetchUserSurveyDetails(userEmail, result.isValidEmail);
          })
          .catch(error => {
            this.onInvalidEmail(error.message);
          });
      }, 3000);
    }
  };

  onValidEmail = message => {
    Modal.success({
      title: "Verified",
      content: message,
      centered: true,
      keyboard: false,
    });
    this.setState({
      loading: false,
      openEmailModal: false,
      isValidEmail: true
    });
  };

  onInvalidEmail = message => {
    Modal.error({
      title: "Oops!",
      content: message,
      centered: true,
      keyboard: false,
      onOk() {
          window.location.href="/login";
      }
    });
    this.setState({
      loading: false,
      openEmailModal: false,
      isValidEmail: false
    });
  };

  render() {
    const { userEmail, openEmailModal, loading } = this.state;

    return (
      <div>
        <Modal
          centered={true}
          visible={openEmailModal}
          title="Verify Email"
          closable={false}
          footer={[
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.onSubmitClick}
            >
              Submit
            </Button>
          ]}
        >
          <Input
            placeholder="Enter your email"
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
            suffix={
              userEmail ? (
                <Icon type="close-circle" onClick={this.emitEmpty} />
              ) : null
            }
            value={userEmail}
            onChange={this.onChangeUserName}
            ref={node => (this.userEmailInput = node)}
            onPressEnter={this.onSubmitClick}
            autoFocus={true}
          />
        </Modal>
      </div>
    );
  }
}

export default EmailComponent;
