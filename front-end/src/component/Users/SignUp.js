import React, { Component } from 'react'
// import { register } from './UserFunctions'
import { RESTService } from "../../api";
import { message } from 'antd';
import {history} from "../../history";

class SignUp extends Component {
    state = {
        fname : '',
        lname : '',
        password : '',
        email : '',
    }

handleChange = (events) => {
        events.preventDefault();
    if(events.target.name === "fname"){
        this.setState({
            fname : events.target.value
        });

    }
    if(events.target.name === "lname"){
        this.setState({
            lname : events.target.value
        });

    }

    if(events.target.name === "password"){
        this.setState({
            password : events.target.value
        });
    }

    if(events.target.name === 'email'){
        this.setState({
            email: events.target.value
        });
    }

}

handleSubmit = (events) =>{
    events.preventDefault();
    const newUser = {
        fname : this.state.fname,
        lname : this.state.lname,
        password : this.state.password,
        email : this.state.email,
    }

    RESTService.signup(newUser).then(
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
       }


render() {
    return (
        <div>
            <nav className="navbar navbar-expand-sm navbar-dark bg-primary mb-3">
                <div className="container">
                    <a className="navbar-brand" href="/">Navbar</a>
                </div>
            </nav>
        <div className="container">
        <div className="row">
            <div className="col-md-6 mt-5 mx-auto">
                <form noValidate onSubmit={this.onSubmit}>
                    <h1 className="h3 mb-3 font-weight-normal">Register</h1>
                    <div className="form-group">
                        <label htmlFor="name">First name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="fname"
                            placeholder="Enter your first name"
                            value={this.state.fname}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Last name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="lname"
                            placeholder="Enter your lastname name"
                            value={this.state.lname}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input
                            type="text"
                            className="form-control"
                            name="email"
                            placeholder="Enter email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.handleChange}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-lg btn-primary btn-block"
                        onClick={this.handleSubmit}
                    >
                        Sign Up!
                    </button>
                </form>
            </div>
        </div>
    </div>
        </div>
)
}
}


export default SignUp