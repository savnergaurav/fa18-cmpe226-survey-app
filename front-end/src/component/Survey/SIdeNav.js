import React,{Component} from 'react';

class SideNav extends Component {
    handleDragStart = (event,qType) => {
        //event.preventDefault();
        if(typeof(Storage) !== "undefined"){
            localStorage.setItem("qType",qType);
        }
        console.log("Inside Drag Start Text");
        document.getElementById(event.target.id).cloneNode(true);
        event.dataTransfer.setData(qType, event.target.id); 
    }
    render(){
        return( 
            <div class="w3-sidebar w3-light-grey w3-bar-block" style={{width:"20%"}}>
                <h3 class="w3-bar-item">Question ToolBar</h3>
                <a onDragStart={(e) => this.handleDragStart(e,"Text")}  draggable="true" id="textQuestion" class="w3-bar-item w3-button">Text Question</a>
                <a onDragStart={(e) => this.handleDragStart(e,"Radio")} draggable="true" id="radioQUestion" class="w3-bar-item w3-button">Radio Question</a>
                <a onDragStart={(e) => this.handleDragStart(e,"Check")}  draggable="true" id="checkQuestion" class="w3-bar-item w3-button">Checkbox Question</a>
                <a onDragStart={(e) => this.handleDragStart(e,"Rate")}  draggable="true" id="rateQuestion" class="w3-bar-item w3-button">Rating Question</a>
                <a onDragStart={(e) => this.handleDragStart(e,"Date")}  draggable="true" id="dateQuestion" class="w3-bar-item w3-button">Date Question</a>
            </div>
           
        )
    }
}

export default SideNav;