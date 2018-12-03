import React, { Component } from 'react';
import '../../App.css';
import SideNav from '../Survey/SIdeNav';
import TextQuestion from '../Questions/TextQuestion';
import RadioQuestion from '../Questions/RadioQuestion';
import Checkbox from '../Questions/Checkbox';
import {connect} from 'react-redux';
import RatingQuestion from '../Questions/RateQuestion';
import DateQuestion from '../Questions/DateQuestion';

import {QuestionAdded} from '../../store/actions';
import {CreateQuestion} from '../../store/actions';
import Navbar from '../Dashboard/Navbar';
import {history} from '../../history'
class QuestionPreview extends Component {
  drop = (event) => {
    var options = ["1","2","3","4"];
    event.preventDefault();
    var data = event.dataTransfer.getData(localStorage.getItem("qType"));
    var qID = -1;
    if(this.props.numberOfQuestion.length > 0){
        qID = (this.props.numberOfQuestion[this.props.numberOfQuestion.length - 1].id + 1);
    }else{
      qID = 1;
    }
    var question = {
      id : qID, 
      qType : document.getElementById(data).innerHTML,
      lab : document.getElementById(data).innerHTML,
      options : options,
      rating : 5
   }
    this.props.onQuestionAdded(question);
  }

  allowDrop = (event) => {
    event.preventDefault();
    
  }
  handleSubmit = (e) => {
      e.preventDefault();
      var questionsArr = {
        "questions" : this.props.numberOfQuestion,
        "surveyID" : this.props.surveyID
      }
      this.props.onSubmitClicked(questionsArr);
      history.push("/home");
  }
  render() {
    let q = null;
    console.log("Props : ", this.props.numberOfQuestion);
    if(this.props.numberOfQuestion !== undefined){
      q = this.props.numberOfQuestion.map((ques) => {
        if(ques.qType === "Text Question"){
          return(
            <TextQuestion id={ques.id} lab = {ques.lab} responseMode={false}/>
          )
        }else if(ques.qType === "Radio Question"){
         return(
           <RadioQuestion id = {ques.id} lab = {ques.lab} responseMode={false}/>
         )
        }else if(ques.qType === "Checkbox Question"){
         return(
           <Checkbox id = {ques.id} lab = {ques.lab} responseMode={false}/>
         )
        }else if(ques.qType === "Rating Question"){
          return(
            <RatingQuestion id = {ques.id} lab = {ques.lab} responseMode={false}/>
          )
        }else if(ques.qType === "Date Question"){
          return(
            <DateQuestion id = {ques.id} lab = {ques.lab} responseMode={false}/>
          )
        }
     })
    }
    
    return (
      <div className="App">
        <Navbar/>
        <SideNav/>
        <div style={{marginLeft:"20%"}}>
            <div class="w3-container w3-teal">
              <h1>{this.props.surveyName}</h1>
            </div>
            <div className="droptarget" onDrop={this.drop} onDragOver={this.allowDrop} style={{width:"100%", border:"0px solid none", height : "500px"}}>
              <h5>Drag Questions Here</h5>
              <br/>
              {q}
              <button onClick={this.handleSubmit} style={{marginLeft:"30%"}} type="button" class="btn btn-primary">
                Submit
            </button>
            </div>
            
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
   return{
      numberOfQuestion : state.question,
      surveyName : state.surveyName,
      surveyID : state.surveyID
   }
}

const mapDispatchToProps = dispatch => {
  return{
      onQuestionAdded : (question) => dispatch(QuestionAdded(question)),
      onSubmitClicked : (questions) => dispatch(CreateQuestion(questions))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(QuestionPreview);
