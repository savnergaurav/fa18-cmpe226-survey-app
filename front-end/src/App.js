import React, { Component } from 'react';
import BasicDetails from './component/Survey/BasicDetails';
import QuestionPreview from './component/Survey/QuestionsPreview';
import {Switch,Route} from 'react-router-dom';

class App extends Component {
  
  render() {
    
    return (
        <Switch>
            <Route exact path = '/' component = {BasicDetails}/>
            <Route exact path = '/question' component = {QuestionPreview}/>
      </Switch>
    );
  }
}



export default App;
