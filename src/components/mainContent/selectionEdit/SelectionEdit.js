import React from 'react';
import "../lessonEdit/LessonEdit.css";
import Loading from "../../global/Loading";
import SelectionEditLesson from "./SelectionEditLesson";
import Button from "../../global/Button";



class SelectionEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: props.token,
            selectionid: props.selectionid,
            onClose: props.onClose
        };
        this.removeLesson=this.removeLesson.bind(this);
        this.handleKeyDown=this.handleKeyDown.bind(this);
    }

    componentDidMount() {
        fetch('/api/selection/metadata?token=' + this.state.token + '&id=' + this.state.selectionid)
        .then(async response => {
            const data = await response.json();
            if (response.ok) {
                this.setState({"metadata":data["metadata"]});
            }else {
                const reserror = (data && data.error.message) || response.status;
                console.log(reserror);
                return;
            }
        })
        .catch(error => {
            console.log(error);
        });
        fetch('/api/selection/contentmetadata?token=' + this.state.token + '&id=' + this.state.selectionid)
        .then(async response => {
            const data = await response.json();
            if (response.ok) {
                this.setState({"lessons":data["content"]});
            }else {
                const reserror = (data && data.error.message) || response.status;
                console.log(reserror);
                return;
            }
        })
        .catch(error => {
            console.log(error);
        });
        document.addEventListener("keyup", this.handleKeyDown); 
    }

    componentWillUnmount() {
        document.removeEventListener("keyup", this.handleKeyDown); 
    }

    handleKeyDown(e) {
        if (e.key === "Escape") {
            e.preventDefault();
            this.state.onClose();
        }
    }
    
    removeLesson(id) {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
            body: JSON.stringify({"token": this.state.token, "id": this.state.selectionid, "lesson": id })
        };
        fetch('/api/selection/removelesson', requestOptions)
        .then(async response => {
            if (response.ok) {
                console.log("deleted");
                var lessons = this.state.lessons;
                delete lessons[id];
                this.setState({"lessons":lessons});
            }else {
                const data = await response.json();
                const reserror = (data && data.error.message) || response.status;
                console.log(reserror);
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    render() {
        var lessons = this.state.lessons;
        var removeLesson = this.removeLesson;
        var onClose = this.state.onClose;
        var metadata = this.state.metadata;
        var name = undefined;
        if(metadata !== undefined) {
            name = metadata.name;
        }
        var creation_date = undefined;
        if(metadata !== undefined) {
            creation_date = metadata.creation_date;
        }
        return (
            <div id="lesson-edit-container">
                <div id="lesson-edit" className="shadow-large">
                    <div id="lesson-edit-info" className="shadow-small">
                        {name !== undefined ? <p>{name}</p> : <Loading />}
                        <div id="lesson-edit-buttons">
                            <Button type="1" text_color="#ffffff" text="" icon="times" onClick={() => {
                                onClose();
                            }}/>
                        </div>
                    </div>
                    <div id="lesson-edit-list">
                        {lessons !== undefined ? Object.keys(lessons).map((id) => {
                            return(<SelectionEditLesson
                                key={id}
                                name={lessons[id]["name"]}
                                onDelete={() => {removeLesson(id)}}
                            />);
                        }) : <Loading />}
                    </div>
                </div>
            </div>
        );
    }
}

export default SelectionEdit