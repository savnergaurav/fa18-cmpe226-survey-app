import React, { Component } from 'react'
import axios from 'axios';
import ReactDOM from 'react-dom';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            createdByMe: [],
            sharedWithMe: [],
            voluntary: []
        }
        this.create_list = this.create_list.bind(this);
    }

    create_list(e, arr) {
        e.preventDefault();
        // console.log('started');
        if (arr.length === 0)
            return;
        var id = 0;

        var namesList = arr.map((name, id) => {
            id = id + 1;
            return <tr><td>{id}</td><td>{name.sname}</td><td>{name.surl}</td></tr>;
        })
        if (namesList.length === 0)
            return;
        // console.log('NameLIST ->', namesList);
        // ReactDOM.render(<table>{namesList}</table>, document.getElementById("my_table"));
        ReactDOM.render(
            <table className="table table-bordered my_table_style">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Survey Name</th>
                        <th>Survey URL</th>
                    </tr>
                </thead>
                <tbody>{namesList}
                </tbody>
            </table>,
            document.getElementById('my_table'));
    }

    componentDidMount = () => {
        axios.post('http://localhost:3001/fetchMySurveys', {
            email: "saket@gmail.com"
        }).then((res) => {
            // console.log('fetchMySurveys -> ', res.data);
            this.setState({ createdByMe: res.data });
        });
        axios.post('http://localhost:3001/fetchSharedWithMe', {
            email: "rajiv@gmail.com"
        }).then((res) => {
            // console.log('fetchSharedWithMe -> ', res.data);
            this.setState({ sharedWithMe: res.data })
        })
        axios.post('http://localhost:3001/fetchVolunteerSurvey').then((res) => {
            // console.log('fetchVolunteerSurvey -> ', res.data);
            this.setState({ voluntary: res.data });
        })
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-sm navbar-dark bg-primary mb-3">
                    <div className="container">
                        <a className="navbar-brand" href="/">Navbar</a>
                    </div>
                </nav>
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="dropdown">
                                <button onClick={(e) => this.create_list(e, this.state.createdByMe)} className="btn btn-primary btn-block" type="button" data-toggle="dropdown">
                                    My Survey
                                </button>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="dropdown">
                                <button onClick={(e) => this.create_list(e, this.state.sharedWithMe)} className="btn btn-success btn-block" type="button" data-toggle="dropdown">
                                    Shared With Me
                                </button>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="dropdown">
                                <button onClick={(e) => this.create_list(e, this.state.voluntary)} className="btn btn-warning btn-block" type="button" data-toggle="dropdown">
                                    Voluntary Survey
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
            </div>

        )
    }


}
