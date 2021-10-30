import React from 'react';
import "./MainContent.css";
import SelectionListItem from './SelectionListItem.js';
import AddInput from '../global/AddInput';
import Modal from '../global/Modal';
import { Draggable } from '@shopify/draggable';
import Loading from '../global/Loading';
import SelectionEdit from './selectionEdit/SelectionEdit';

class SelectionList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: props.token,
            selectionsdeletemodal: {},
            onLearn: props.onLearn
        };
        this.deleteselection = this.deleteselection.bind(this);
        this.createselection = this.createselection.bind(this);
        this.updateSelections = this.updateSelections.bind(this);
        this.openModal = this.openModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.editSelection = this.editSelection.bind(this);
    }

    componentDidMount() {
        this.updateSelections();
        const draggable = new Draggable(document.querySelectorAll('.list'), {
            draggable: '.draggable',
            delay: '150'
        });
                
        draggable.on("drag:start", (event) => {
            if(event.data.originalSource.classList.contains("not-draggable")) {
                event.cancel();
            }
        });
        
        draggable.on("drag:stop", (event) => {
            var elements = document.getElementsByClassName("draggable not-draggable selected");
            if(elements.length > 0) {
                elements[0].classList.remove("selected");
            }
            if(event.data.originalSource.getAttribute("lessonid") !== undefined && this.state.lasthoveredselection !== undefined) {
                var lessonid = event.data.originalSource.getAttribute("lessonid");
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
                    body: JSON.stringify({ token: this.state.token, id:this.state.lasthoveredselection, lesson: lessonid})
                };
                fetch('/api/selection/addlesson', requestOptions)
                .then(async response => {
                    if (!response.ok) {
                        var data = await response.json();
                        const reserror = (data && data.error.message) || response.status;
                        console.log(reserror);
                        this.setState({"lasthoveredselection": undefined});
                    }else {
                        this.setState({"addedtoselection": this.state.lasthoveredselection});
                        this.setState({"lasthoveredselection": undefined});
                        setTimeout(() => {
                            this.setState({"addedtoselection": undefined});
                        }, 1950);
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.setState({"lasthoveredselection": undefined});
                });
            }
        });
        
        draggable.on("drag:over", (event) => {
            if(event.data.over.classList.contains("not-draggable") && event.data.over.getAttribute("selectionid") !== undefined) {
                event.data.over.classList.add("selected");
                this.setState({"lasthoveredselection": event.data.over.getAttribute("selectionid")});
            }
        });

        draggable.on("drag:out", (event) => {
            if(event.data.over.classList.contains("not-draggable")) {
                event.data.over.classList.remove("selected");
            }
            this.setState({"lasthoveredselection": undefined});
        });
    }

    updateSelections() {
        fetch('/api/selection/usermetadata?token=' + this.state.token)
        .then(async response => {
            var data = await response.json();
            if (!response.ok) {
                const reserror = (data && data.error.message) || response.status;
                console.log(reserror);
                return;
            }
            this.setState({"selections":(data["selections"])});
        })
        .catch(error => {
            console.log(error);
        });
    }
    
    deleteselection() {
        console.log(this.state.selectiondeletemodal);
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
            body: JSON.stringify({"token": this.state.token, "id": this.state.selectiondeletemodal.lessonid })
        };
        fetch('/api/selection/delete', requestOptions)
        .then(response => {
            if (response.ok) {
                this.updateSelections();
                this.setState({selectiondeletemodal:undefined});
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    createselection(name) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
            body: JSON.stringify({ name: name, token: this.state.token })
        };
        fetch('/api/selection/create', requestOptions)
        .then(async response => {
            const data = await response.json();
            if (response.ok) {
                this.updateSelections();
            }else {
                const reserror = (data && data.error.message) || response.status;
                console.log(reserror);
                return;
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    openModal(lessonname, lessonid) {
        var modal = {
            "html":"Willst du wirklich die Lernliste '" +  lessonname + "' löschen?",
            "buttontext":"Löschen",
            "left_color_submit":"#ee0979",
            "right_color_submit":"#ff6a00",
            "left_color_close":"#999999",
            "right_color_close":"#999999",
            "lessonid":lessonid
        }
        this.setState({"selectiondeletemodal":modal});
    }

    hideModal() {
        this.setState({"selectiondeletemodal":undefined});
    }

    editSelection(id) {
        this.setState({"currenteditselection":id});
    }

    render() {
        const selections = this.state.selections;
        const addedtoselection = this.state.addedtoselection;
        const onLearn = this.state.onLearn;
        const openModal = this.openModal;
        const hideModal = this.hideModal;
        const deleteselection = this.deleteselection;
        const createselection = this.createselection;
        const editSelection = this.editSelection;
        return (
            <div id="lessonlist" className="draggable-container list shadow-large">   
                {this.state.selectiondeletemodal !== undefined &&
                    <Modal html={this.state.selectiondeletemodal.html}
                    buttontext={this.state.selectiondeletemodal.buttontext}
                    left_color_submit={this.state.selectiondeletemodal.left_color_submit}
                    right_color_submit={this.state.selectiondeletemodal.right_color_submit}
                    left_color_close={this.state.selectiondeletemodal.left_color_close}
                    right_color_close={this.state.selectiondeletemodal.right_color_close} 
                    onClose={() => {hideModal();}}
                    onSubmit={() => {deleteselection();}}/>
                }
                <p className="list-header">Lernlisten</p>
                <div className="list-content">
                {selections !== undefined ? Object.keys(selections).map(function(id){
                    return <SelectionListItem id={id} onLearn={() => {onLearn(id, selections[id]["name"])}} lessonadded={addedtoselection === id ? true : false} name={selections[id]["name"]} key={id} onDelete={() => {
                        openModal(selections[id]["name"], id);
                    }}
                    onEdit={() => {editSelection(id)}}/>
                }) : <Loading/>}
                </div> 
                <div id="lessonlist-inputcontainer">
                    <AddInput placeholder="Schulaufgabe Englisch" onAdd={(input) => {createselection(input)}} button="plus"/>
                </div>
                {this.state.currenteditselection !== undefined && <SelectionEdit token={this.state.token} selectionid={this.state.currenteditselection} onClose={() => {editSelection(undefined)}}/>}
            </div>
        );
    }
}

export default SelectionList