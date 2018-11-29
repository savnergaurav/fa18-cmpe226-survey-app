import React, { Component } from 'react';
import BasicDetails from './component/Survey/BasicDetails';
import QuestionPreview from './component/Survey/QuestionsPreview';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './component/Dashboard/Dashboard';
import SurveyStatistics from './component/SurveyStatistics/SurveyStatistics';
import Home from './component/Home/Home';

class App extends Component {

  render() {

    return (
      <Switch>
        <Route exact path='/' component={BasicDetails} />
        <Route exact path='/question' component={QuestionPreview} />
        <Route exact path="/dashboard" render={() => {
          return <Dashboard />
        }} />
        <Route exact path='/home' component={Home} />
        <Route exact path="/SurveyStatistics/:surveyId" render={(props) => {
          return <SurveyStatistics {...props} />
        }} />
      </Switch>
    );
  }
}

export default App;
