import React,{Component} from 'react';
import {connect} from 'react-redux';
import {QuestionUpdated} from '../../store/actions';
import {QuestionDeleted} from '../../store/actions';

class Checkbox extends Component{
    state = {
        questionLabel : "Checkbox Question",
        options : [],
        editing : false
    }
    handleChangeLabel = (event) => {
        this.setState({
            questionLabel : event.target.value
        })
    }

    handleChangeOption = (event,index) => {
        event.preventDefault();
        const items = this.state.options;
        items[index] = event.target.value;
        this.setState({
            options :items,
        });
    }
    handleUpdate = (event) => {
        event.preventDefault();
        this.setState({
            editing : false
        })
        let op = []
        var text = document.getElementById("ta" + (localStorage.getItem("qNumber") - 1)).value;
        var lines = text.split("\n");
        op = op.concat(lines);
        op = lines.map(l => {
            if(l.trim()!="" && l.trim() != null){
                return l;
            }
        })       
        var question = {
            id : localStorage.getItem("qNumber"), 
            lab : this.state.questionLabel,
            options : op
        }
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
        var id = localStorage.getItem("qNumber")
        this.props.onQuestionDelete(id);
    }

    render(){
        let options1 = null;
        let val = "";
        var i = -1;
        this.props.questions.map((q,ind) => {
            if(q.id == this.props.id){
                i = ind;
            }
        })
        localStorage.setItem("qNumber",this.props.id);
        if(!this.state.editing){
            if(i == -1){
                i = this.props.id
            }
            options1 = this.props.questions[i].options.map((op,index) => {
                return(
                    <label className="radio-inline">
                            <input type="checkbox"></input>{op}   
                    </label>
                )
            })
        }else{
            val = "";
            var len = this.props.questions[i].options.length;
            this.props.questions[i].options.map((op,index) => {
                if(index == (len - 1))
                    val += op;
                else
                    val += op + "\n";
            })
            document.getElementById("ta" + (localStorage.getItem("qNumber") - 1)).value = val;
        }
        var modalNname = ("modal" + (localStorage.getItem("qNumber") - 1));
        return(
            <div className="form-group" style={{background: "lightgrey", paddingTop:"10px", paddingBottom:"15px"}}>
                <label className="col-md-4 control-label">
                    {this.props.id} .
                    {this.props.questions[i].lab}
                </label>
                <button onClick={(e) => this.toggleEditing(e,this.props.id)} style={{marginLeft:"30%"}} type="button" class="btn btn-primary" data-toggle="modal" data-target= {"#" + modalNname}>
                        Edit Question
                    </button>
                    <button onClick = {(e) => this.handleDelete(e,this.props.id)} type="button" class="btn btn-danger" style={{marginLeft:"2%"}}>Delete Question</button>
                <div className="col-md-4">
                    {options1}
                </div>
                <br/><br/>
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
                            <h4>New Options</h4>
                            <div>
                                <textarea id={"ta" + (localStorage.getItem("qNumber") - 1)} cols="10" rows="4">Some default Value</textarea>
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

export default connect(mapStateToProps,mapDispatchToProps)(Checkbox);