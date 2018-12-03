import React, { Component } from "react";
// import jwt_decode from 'jwt-decode'
import { RESTService } from "../../api";
import { history } from "../../history";
import { message } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "../Dashboard/Navbar";

class Profile extends Component {
  state = {
    fname: "",
    lname: "",
    password: "",
    email: "",
    gender: "",
    city: "",
    state: "",
    zip: ""
  };
  handleChange = events => {
    events.preventDefault();
    if (events.target.name === "gender") {
      this.setState({
        gender: events.target.value
      });
    }
    if (events.target.name === "city") {
      this.setState({
        city: events.target.value
      });
    }
    if (events.target.name === "state") {
      this.setState({
        state: events.target.value
      });
    }
    if (events.target.name === "zip") {
      this.setState({
        zip: events.target.value
      });
    }
  };

  handleSubmit = events => {
    events.preventDefault();
    const newUser = {
      city: this.state.city,
      state: this.state.state,
      zip: this.state.zip,
      gender: this.state.gender
    };

    console.log("____%$#$%%_____" + newUser);
    RESTService.profile(newUser).then(
      response => {
        console.log(response.data);
        message.success(response.data.message, 1);
        history.push("/home");
      },
      error => {
        console.log(error);
        message.error(error.data.message, 1);
      }
    );
  };

  componentDidMount() {
    const token = localStorage.usertoken;
    this.setState({});
  }

  render() {
    const newUser = this.props.user;
    console.log("-------");
    console.log(newUser);
    console.log("-------");

    return (
      <div>
        <Navbar />
        {/* <nav className="navbar navbar-expand-sm navbar-dark bg-primary mb-3">
                <div className="container">
                    <Link to="/home">Navbar</Link>
                    <Link to="/profile">Profile</Link>
                    <Link to="/create">Create Survey</Link>
                    <Link to="/dashboard">Dashboard</Link>

                    <a to="/">Logout</a>
                </div>
                </nav> */}
        <div className="container">
          <div className="col-sm-4">
            <h1 className="text-center">PROFILE</h1>
          </div>
          <div>
            <table className="col-sm">
              <tbody>
                <tr>
                  <td>Fist Name: </td>
                  <td>{newUser.fname}</td>
                </tr>
                <tr>
                  <td>Last Name</td>

                  <td>{newUser.lname}</td>
                </tr>
                <tr>
                  <td>Email: </td>
                  <td>{newUser.email}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <br />
          <br />
          <div className="col-sm">
            <h1>Complete the following details: </h1>
            <form className="col-sm">
              <div>
                <div>
                  <label htmlFor="name">City</label>
                  <input
                    type="text"
                    className="form-control col-sm"
                    name="city"
                    value={this.state.city}
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="name">State</label>
                  <input
                    type="text"
                    className="form-control col-sm"
                    name="state"
                    value={this.state.state}
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="name">Zip</label>
                  <input
                    type="text"
                    className="form-control col-sm"
                    name="zip"
                    value={this.state.zip}
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="name">Gender</label>
                  <div>
                    {" "}
                    <input
                      type="radio"
                      className="form-control"
                      id="male"
                      name="gender"
                      value={this.state.gender}
                      onChange={this.handleChange}
                    />
                    <label for="male">Male</label>
                    <input
                      type="radio"
                      className="form-control"
                      id="female"
                      name="gender"
                      value={this.state.gender}
                      onChange={this.handleChange}
                    />
                    <label for="female">Female</label>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary btn-block col-sm"
                    onClick={this.handleSubmit}
                  >
                    Submit!
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log("State in Profile : ", state.user);
  const { user } = state;
  return {
    user
  };
}

export default connect(mapStateToProps)(Profile);
