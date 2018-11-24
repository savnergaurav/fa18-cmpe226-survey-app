import React,{Component} from 'react';
import {connect} from 'react-redux';
import {QuestionUpdated} from '../../store/actions';
import {QuestionDeleted} from '../../store/actions';

class DateQuestion extends Component{
    state = {
        questionLabel : "Text Question"
    }
    handleChange = (event) => {
        this.setState({
            questionLabel : event.target.value
        })
    }
    handleEdit = (e,no) => {
        e.preventDefault();
        localStorage.setItem("qNumber",no);
    }
    handleUpdate = (event, index) => {
        event.preventDefault();
        var question = {
            id : localStorage.getItem("qNumber"), 
            qType : this.props.questions[index - 1].qType,
            lab : this.state.questionLabel
        }
        this.props.onQuestionUpdated(question);
    }
    
    handleDelete = (e,index) => {
        localStorage.setItem("qNumber",index);
        var id = localStorage.getItem("qNumber");
        this.props.onQuestionDelete(id);
    }
    render(){
        localStorage.setItem("qNumber",this.props.id);
        var modalNname = ("modal" + (localStorage.getItem("qNumber") - 1));
        return(
            <div className="form-group" style={{background: "lightgrey", paddingTop:"10px"}}>
                <div>
                    <label className="col-md-3 control-label">
                        {this.props.id} . 
                        {this.props.lab}
                    </label>
                    <button onClick = {(e) => this.handleEdit(e,this.props.id)} style={{marginLeft:"38.5%"}} type="button" class="btn btn-primary" data-toggle="modal" data-target= {"#" + modalNname}>
                        Edit Question
                    </button>
                    <button onClick = {(e) => this.handleDelete(e,this.props.id)}  type="button" class="btn btn-danger" style={{marginLeft:"2%"}}>Delete Question</button>
                </div>
                <div className="col-md-6">
                    <input type="date"/>
                </div>
                <br/><br/>
                
                <div class="modal fade" id={modalNname} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Question Number : {this.props.id}</h5>
                        </div>
                        <div class="modal-body">
                            <h4>New Question Label</h4>
                            <br/>
                            <input style = {{width : "500px", fontSize : "14pt"}} value={this.state.questionLabel} onChange={(e) => this.handleChange(e)} ></input>
                        </div>
                        <br/>
                        <div class="modal-footer">
                            {/* <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> */}
                            <button onClick = {(e) => this.handleUpdate(e,localStorage.getItem("qNumber") - 1)} type="button" data-dismiss="modal" class="btn btn-primary">Save changes</button>
                            <button onClick = {(e) => this.handleUpdate(e,localStorage.getItem("qNumber") - 1)} type="button" class="btn btn-danger" data-dismiss="modal" style={{marginLeft:"1%"}}>Cancel</button>
                        </div>
                        </div>
                    </div>
                </div>
                <br/>
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


export default connect(mapStateToProps,mapDispatchToProps)(DateQuestion);