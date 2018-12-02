import React, { Component } from 'react'
// import { login } from './UserFunctions'
import { RESTService } from "../../api";
// import {history} from "../../history";
import { message } from 'antd';
import {history} from "../../history";
import { connect }          from 'react-redux';
import {saveUser} from "../../store/actions";


class SignIn extends Component{
    state = {
        email : '',
        password : '',
    };

    handleChange = events =>{
        events.preventDefault();
        if(events.target.name === 'email'){
            this.setState({
                email : events.target.value
            });
        }
        if(events.target.name === 'password'){
            this.setState({
                password : events.target.value
            });
        }
    };

    handleSubmit = events =>{
        events.preventDefault();
        const user = {
            email : this.state.email,
            password : this.state.password
        };

        RESTService.signIn(user).then(
            response => {
                console.log(response);
                message.success(response.data.message, 1);
                this.props.saveUser(response.data.user);
                history.push("/home");
            },
            error => {
                console.log(error);
                message.error(error.data.message, 1);
            }
        );
    };


    render() {
        return <div>
            <nav className="navbar navbar-expand-sm navbar-dark bg-primary mb-3">
                <div className="container">
                    <a className="navbar-brand" href="/">Navbar</a>
                </div>
            </nav>
        <div className="container">
            <div className="row">
                <div className="col-md-6 mt-5 mx-auto">
                    <form noValidate onSubmit={this.onSubmit}>
                        <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input
                                type="email"
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
                            Sign in
                        </button>
                    </form>
                </div>
            </div>
        </div>
        </div>
    }
}

function mapDispatchToProps(dispatch) {
    return {
        saveUser: user => dispatch(saveUser(user)),
    };
}

export default connect(null, mapDispatchToProps)(SignIn);