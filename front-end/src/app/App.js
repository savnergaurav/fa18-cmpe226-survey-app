import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import NavBar from './NavBar';
import Home from './Home';
import './App.css';

class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <NavBar />
                        <Route exact path="/" component={Home} />
                        <Route path="/login" component={Login} />
                        <Route path="/signup" component={Signup} />
                    </div>
                </BrowserRouter>
            </div>

        );
    }
}

export default App;
