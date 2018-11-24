import React, {Component} from 'react';
import StarRatingComponent from 'react-star-rating-component';
import {connect} from 'react-redux';
import {QuestionUpdated} from '../../store/actions';
import {QuestionDeleted} from '../../store/actions';

class RateQuestion extends Component{
    constructor(props){
        super(props);
        this.state = {
            rating : 0,
            questionLabel : "Rating Question"
        }
    }
    handleChangeLabel = (event) => {
        this.setState({
            questionLabel : event.target.value
        })
    }
    onStarClick(nextValue, prevValue, name) {
        this.setState({rating: nextValue});
    }
    handleUpdate = (e) => {
        e.preventDefault();
        this.setState({
            editing : false,
            rating : e.target.value
        })
        var question = {
            id : localStorage.getItem("qNumber"), 
            qType : this.props.questions[this.props.id - 1].qType,
            lab : this.state.questionLabel,
            rating : this.state.rating
        }
        console.log("New Question Text : ", question);
        this.props.onQuestionUpdated(question);
    }
    toggleEditing = (e, index) => {
        e.preventDefault();
        localStorage.setItem("qNumber",index);
        this.setState({
            editing:true
        })
    }

    handleDelete = (e,index) => {
        localStorage.setItem("qNumber",index);
        var id = localStorage.getItem("qNumber");
        this.props.onQuestionDelete(id);
    }
    render(){
        localStorage.setItem("qNumber",this.props.id);
        var modalNname = ("modal" + (localStorage.getItem("qNumber") - 1));
        var i = -1;
        this.props.questions.map((q,ind) => {
            if(q.id == localStorage.getItem("qNumber")){
                i = ind;
            }
        })
        var rate = this.props.questions[i].rating;
   
        var rate1 = parseInt(rate,10);

        const { rating } = this.state;
        return(
            <div className="form-group" style={{background: "lightgrey", paddingTop:"10px", paddingBottom:"10px"}}>
                <div>
                    <label className="col-md-3 control-label">
                        {this.props.id} . 
                        {this.props.lab}
                    </label>
                    <button onClick={(e) => this.toggleEditing(e,this.props.id)} style={{marginLeft:"38.5%"}} type="button" class="btn btn-primary" data-toggle="modal" data-target= {"#" + modalNname}>
                        Edit Question
                    </button>
                    <button onClick = {(e) => this.handleDelete(e,this.props.id)}  type="button" class="btn btn-danger" style={{marginLeft:"2%"}}>Delete Question</button>
                </div>
                <div  className="col-md-6">
                    <StarRatingComponent 
                        name="rate1" 
                        starCount={rate1}
                        value={rating}
                    />
                </div>
                <br/>

                <div class="modal fade" id={modalNname} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">{this.props.questions[i].qType}</h5>
                        </div>
                        <div class="modal-body">
                            <h4>New Question Label</h4>
                            <br/>
                            <input style = {{width : "500px", fontSize : "14pt"}} onChange={(e) => this.handleChangeLabel(e)}></input>
                            <br/><br/>
                            <h4>Number of Stars</h4>
                            <div>
                                <input onChange = {(e) => this.handleUpdate(e)} type="number" min="1" max="5" placeholder="Rate question"  className="form-control input-md"></input>
                            </div>
                        </div>
                        <div class="modal-footer">
                            {/* <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> */}
                            <button onClick = {(e) => this.handleUpdate(e)} type="button" data-dismiss="modal" class="btn btn-primary">Save changes</button>
                            <button type="button" onClick = {(e) => this.handleUpdate(e)} class="btn btn-danger" data-dismiss="modal" style={{marginLeft:"1%"}}>Cancel</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        questions : state.question
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onQuestionUpdated : (question) => dispatch(QuestionUpdated(question)),
        onQuestionDelete : (questionID) => dispatch(QuestionDeleted(questionID))
    }
  }

export default connect(mapStateToProps,mapDispatchToProps)(RateQuestion);