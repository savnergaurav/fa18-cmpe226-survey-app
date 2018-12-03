import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import { connect }  from "react-redux";

class Navbar extends Component{

    render(){
        const isAuth = this.props.isAuthenticated;
        return(
            <nav class="navbar navbar-inverse">
                <div class="container-fluid">
                    <ul class="nav navbar-nav">
                        <li><Link to="/home">Home</Link></li>/li>
                        {isAuth ? <li><Link to="/profile">Profile</Link></li> : null}
                        {isAuth ? <li><Link to="/create">Create Survey</Link></li> : null}
                        {isAuth ? <li><Link to="/dashboard">Dashboard</Link></li> : null}
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                    {!isAuth ? <li><Link to="/register"><span class="glyphicon glyphicon-log-in"></span>Signup</Link></li> :null}
                    {isAuth ? <li><Link to="/login"><span class="glyphicon glyphicon-log-in"></span> Logout</Link></li> : <li><Link to="/login"><span class="glyphicon glyphicon-log-in"></span>Login</Link></li> }
                    </ul>
                </div>
            </nav>
        )
    }
}

function mapStateToProps(state) {
    const {isAuthenticated} = state;
    return {
        isAuthenticated
    };
}


export default connect(mapStateToProps)(Navbar);