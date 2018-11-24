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

class QuestionPreview extends Component {
  drop = (event) => {
    var options = ["1","2","3","4"];
    event.preventDefault();
    var data = event.dataTransfer.getData(localStorage.getItem("qType"));
    var question = {
      id : (this.props.numberOfQuestion.length + 1), 
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
  render() {
    let q = null;
    console.log("Props : ", this.props.numberOfQuestion);
    if(this.props.numberOfQuestion !== undefined){
      q = this.props.numberOfQuestion.map((ques) => {
        if(ques.qType === "Text Question"){
          return(
            <TextQuestion id={ques.id} lab = {ques.lab}/>
          )
        }else if(ques.qType === "Radio Question"){
         return(
           <RadioQuestion id = {ques.id} lab = {ques.lab}/>
         )
        }else if(ques.qType === "Checkbox Question"){
         return(
           <Checkbox id = {ques.id} lab = {ques.lab}/>
         )
        }else if(ques.qType === "Rating Question"){
          return(
            <RatingQuestion id = {ques.id} lab = {ques.lab}/>
          )
        }else if(ques.qType === "Date Question"){
          return(
            <DateQuestion id = {ques.id} lab = {ques.lab}/>
          )
        }
     })
    }
    
    return (
      <div className="App">
        <SideNav/>
        <div style={{marginLeft:"20%"}}>
            <div class="w3-container w3-teal">
              <h1>Survey Name</h1>
            </div>
            <div className="droptarget" onDrop={this.drop} onDragOver={this.allowDrop} style={{width:"100%", border:"0px solid none", height : "500px"}}>
              <h5>Drag Questions Here</h5>
              <br/>
              {q}
            </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
   return{
      numberOfQuestion : state.question
   }
}

const mapDispatchToProps = dispatch => {
  return{
      onQuestionAdded : (question) => dispatch(QuestionAdded(question))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(QuestionPreview);
