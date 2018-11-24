import React,{Component} from 'react';
import moment, { now } from 'moment';
import DatePicker from 'react-datepicker';
import TagsInput from 'react-tagsinput';
import "react-datepicker/dist/react-datepicker.css";
import 'react-tagsinput/react-tagsinput.css';
import {connect} from 'react-redux';
import {CreateSurvey} from '..//../store/actions';

class BasicDetails extends Component{
    constructor(props) {
        super(props);
        this.state = {
            surveyName : '',
            surveyDesc : '',
            surveyType : '',
            validDate : now(),
            inviteEmails : []
        } 
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);  
        this.handleInviteEmailChange = this.handleInviteEmailChange.bind(this);  
        this.handleNameChange = this.handleNameChange.bind(this);  
        this.handleDateChange = this.handleDateChange.bind(this);
    }
    handleDateChange = (moment) => {
        this.setState({
            validDate : moment
        });
    }
    handleNameChange = (events) => {
        this.setState({
            surveyName : events.target.value
        });
    }

    handleDescChange = (events) => {
        this.setState({
            surveyDesc : events.target.value
        })
    }

    handleTypeChange = (events) => {
        this.setState({
            surveyType : events.target.value
        })
    }

    handleInviteEmailChange(inviteEmails) {
        this.setState({inviteEmails})
    }

    handleDelete(i) {
        this.setState({
            inviteEmails : this.state.inviteEmails.filter((email, index) => index !== i),
        });
    }
    
    handleAddition(inviteEmails) {
        this.setState({inviteEmails})
    }

    handleSubmit = (e) => {
        e.preventDefault();
        var surveyDetails = {
            surveyName : this.state.surveyName,
            surveyDesc : this.state.surveyDesc,
            surveyType : this.state.surveyType,
            validDate : this.state.validDate,
            inviteEmails : this.state.inviteEmails
        }
        this.props.onSubmitClicked(surveyDetails);

    }
    render(){
        let inviteEmails = null;

        if(this.state.surveyType === "Invite Only"){
            inviteEmails = (
                <div class="form-group">
                    <label for="SurveyName">Email List</label>
                        <TagsInput value={this.state.inviteEmails} onChange={this.handleInviteEmailChange} />
                </div>
                
            )
        }
        return(
            <div  style={{marginTop : "5%", marginLeft:"30%"}}>
                <div >
                    <div class="col col-sm-8 col-md-8 col-lg-8 col-xl-8">
                        <form>
                            <fieldset>
                                <div class="form-group">
                                    <label for="SurveyName">Survey Name</label>
                                    <input onChange={this.handleNameChange} type="text" id="NameTextInput" class="form-control" placeholder="Survey Name"/>
                                </div>
                                <div class="form-group">
                                    <label for="SurveyDesc">Survey Description</label>
                                    <input onChange={this.handleDescChange} type="text" id="DescTextInput" class="form-control" placeholder="Survey Description"/>
                                </div>
                                <div class="form-group">
                                    <label for="SurveyType">Survey Type</label>
                                    <select onChange = {this.handleTypeChange} class="form-control" id="exampleFormControlSelect1">
                                        <option>Select</option>
                                        <option>General</option>
                                        <option>Invite Only</option>
                                        <option>Volunteer</option>
                                    </select>
                                </div>
                                {inviteEmails}
                                <div class="form-group">
                                    <label for="ValidTill">Valid Till</label>
                                    <br/>
                                    <DatePicker 
                                        selected={this.state.validDate}
                                        onChange={this.handleDateChange}
                                        allowSameDay
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        timeCaption="time"
                                        style={{width : "400px"}}
                                    />
                                </div>
                                <button onClick={this.handleSubmit} type="" class="btn btn-primary">Submit</button> 
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        )
    }    
}


const mapDispatchToProps = dispatch => {
    console.log("Inside map dipatch to props");
    return{
        onSubmitClicked : (details) => dispatch(CreateSurvey(details)),
    }
}
export default connect(null,mapDispatchToProps)(BasicDetails);