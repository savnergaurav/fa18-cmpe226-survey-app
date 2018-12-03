import React, { Component } from 'react';
import BasicDetails from './component/Survey/BasicDetails';
import QuestionPreview from './component/Survey/QuestionsPreview';
import { Router, Route } from 'react-router-dom';
import Dashboard from './component/Dashboard/Dashboard';
import SurveyStatistics from './component/SurveyStatistics/SurveyStatistics';
import Home from './component/Home/Home';
import SignIn from './component/Users/SignIn';
import Profile from './component/Users/Profile';
import SignUp from './component/Users/SignUp';
import {history} from "./history";
import { connect }  from "react-redux";
import {authenticateUser} from "./store/actions";

class App extends Component {

    constructor(props) {
        super(props);
        history.listen((location, action) => {});
    }
    componentWillMount() {
        // Check if user is authenticated.
        this.props.authenticateUser();
    }

  render() {
      console.log(this.props);
      const isAuth = this.props.isAuthenticated;



    return (
      <Router history={history}>
          <div>

              {isAuth ? <Route exact path='/login' component={Home} /> : <Route exact path='/login' component={SignIn} />}
              {isAuth ? <Route exact path='/register' component={Home} /> : <Route exact path='/register' component={SignUp} />}
              {isAuth ? <Route exact path='/home' component={Home} /> : <Route exact path='/home' component={SignIn} />}
              {isAuth ? <Route exact path='/profile' component={Profile} /> : <Route exact path='/profile' component={SignIn} />}
              {isAuth ? <Route exact path='/create' component={BasicDetails} /> : <Route exact path='/create' component={SignIn} />}
              {isAuth ? <Route exact path='/question' component={QuestionPreview} /> : <Route exact path='/question' component={QuestionPreview} />}

              {isAuth ? <Route exact path="/dashboard" render={() => {
                  return <Dashboard />
              }} /> : <Route exact path='/dashboard' component={SignIn} />}

              {isAuth ?  <Route exact path="/SurveyStatistics/:surveyId" render={(props) => {
                  return <SurveyStatistics {...props} />
              }} />: <Route exact path='/SurveyStatistics/:surveyId' component={SignIn} />}

          </div>
      </Router>
    );
  }
}
function mapStateToProps(state) {

    const {isAuthenticated} = state;
    return {
        isAuthenticated
    };
}


function mapDispatchToProps(dispatch) {
    return {
        authenticateUser    : () => dispatch(authenticateUser()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
