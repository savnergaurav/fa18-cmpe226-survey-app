import React, {Component} from 'react' ;
import {Router, Route} from 'react-router-dom';
import './App.css';
import {connect} from 'react-redux';

class Dashboard extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div>
                Hello
            </div>

        );
    }
}

export default Dashboard;
