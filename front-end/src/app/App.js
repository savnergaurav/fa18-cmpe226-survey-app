import React, {Component} from 'react'                                           ;
import {Router, Route} from 'react-router-dom'                                ;
import './App.css'                                       ;
import {connect} from 'react-redux';
import Dashboard from './Dashboard'
import {history} from "../helper/history";

class App extends Component {

    constructor(props) {
        super(props);
        history.listen((location, action) => {
            // clear alert on location change
        });        
    }

    render() {
        return (
            <div>
                <Router history={history}>
                    
                    <Route exact path="/dashboard" render={() => {
                        return <Dashboard/>
                    }}/>
                </Router>
            </div>
        );
    }
}

export default App;