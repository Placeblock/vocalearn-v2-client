import React from 'react';
import "./LessonEdit.css";
import Loading from "../../global/Loading";
import EditLessonVocable from "./EditLessonVocable";
import Button from "../../global/Button";
import LanguageSelect from '../../global/LanguageSelect';


class LessonList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: props.token,
            lessonid: props.lessonid,
            onClose: props.onClose,
            onNameEdit: props.onNameEdit,
            n_lang: undefined,
            f_lang: undefined
        };
        this.createVocable=this.createVocable.bind(this);
        this.deleteVocable=this.deleteVocable.bind(this);
        this.editVocable=this.editVocable.bind(this);
        this.saveVocables=this.saveVocables.bind(this);
        this.handleKeyDown=this.handleKeyDown.bind(this);
        this.setName=this.setName.bind(this);
    }

    componentDidMount() {
        fetch('/api/lesson/metadata?token=' + this.state.token + '&id=' + this.state.lessonid)
        .then(async response => {
            const data = await response.json();
            if (response.ok) {
                this.setState({"metadata":data["metadata"],"n_lang":data["metadata"]["n_lang"],"f_lang":data["metadata"]["f_lang"]});
            }else {
                const reserror = (data && data.error.message) || response.status;
                console.log(reserror);
                return;
            }
        })
        .catch(error => {
            console.log(error);
        });
        fetch('/api/lesson/content?token=' + this.state.token + '&id=' + this.state.lessonid)
        .then(async response => {
            const data = await response.json();
            if (response.ok) {
                this.setState({"vocables":data["content"]})
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
        if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode === 83) { 
            e.preventDefault();
            this.saveVocables();
        }
        if (e.key === "Escape") {
            e.preventDefault();
            this.saveVocables();
            this.state.onClose();
        }
    }

    createVocable() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
            body: JSON.stringify({ token:this.state.token,lesson:this.state.lessonid,n_text:"",f_text:"",hint:""})
        };
        fetch('/api/vocable/create', requestOptions)
        .then(async response => {
            const data = await response.json();
            if (!response.ok) {
                const reserror = (data && data.error.message) || response.status;
                console.log(reserror);
                return;
            }
            var vocables = this.state.vocables;
            vocables[data["id"]] = {n_text:"",f_text:"",hint:""};
            this.setState({"vocables":vocables});
        })
        .catch(error => {
            console.log(error);
        });
    }

    deleteVocable(id) {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
            body: JSON.stringify({"token": this.state.token, "id": id })
        };
        fetch('/api/vocable/delete', requestOptions)
        .then(async response => {
            if (response.ok) {
                var vocables = this.state.vocables;
                delete vocables[id];
                this.setState({"vocables":vocables});
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

    editVocable(id, n_text, f_text, hint) {
        var vocables = this.state.vocables;
        vocables[id] = {n_text: n_text, f_text: f_text, hint:hint};
        this.setState({"vocables":vocables});
    }

    saveVocables() {
        for(var id in this.state.vocables) {
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
                body: JSON.stringify({ 
                    token:this.state.token,
                    id:id,
                    lesson:this.state.lessonid,
                    n_text:this.state.vocables[id]["n_text"],
                    f_text:this.state.vocables[id]["f_text"],
                    hint:this.state.vocables[id]["hint"]
                })
            };
            fetch('/api/vocable/edit', requestOptions)
            .then(async response => {
                if (!response.ok) {
                    const data = await response.json();
                    const reserror = (data && data.error.message) || response.status;
                    console.log(reserror);
                    return;
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
    }

    setLang(n_lang, f_lang) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
            body: JSON.stringify({ "token":this.state.token,"id":this.state.lessonid,"n_lang":n_lang,"f_lang":f_lang})
        };
        fetch('/api/lesson/setlang', requestOptions)
        .then(async response => {
            if (!response.ok) {
                const data = await response.json();
                const reserror = (data && data.error.message) || response.status;
                console.log(reserror);
                return;
            }
        })
        .catch(error => {
            console.log(error);
        });
        this.setState({n_lang:n_lang,f_lang:f_lang});
    }

    setName(name) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
            body: JSON.stringify({ "token":this.state.token,"id":this.state.lessonid,"name":name})
        };
        fetch('/api/lesson/setname', requestOptions)
        .then(async response => {
            if (!response.ok) {
                const data = await response.json();
                const reserror = (data && data.error.message) || response.status;
                console.log(reserror);
                return;
            }
            var metadata = this.state.metadata;
            if(metadata === undefined) return;
            metadata["name"] = name;
            this.setState({"metadata":metadata});
            this.state.onNameEdit(name);
        })
        .catch(error => {
            console.log(error);
        });
    }

    render() {
        var vocables = this.state.vocables;
        var onClose = this.state.onClose;
        var editVocable = this.editVocable;
        var createVocable = this.createVocable;
        var deleteVocable = this.deleteVocable;
        var saveVocables = this.saveVocables;
        var setName = this.setName;
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
                        <div id="lesson-edit-info-name">
                            <Button type="1" text_color="#ffffff" text="" icon="save" onClick={() => {
                                setName(document.getElementById("lesson-edit-name-input").value);
                            }} customCss={{"fontSize":"10px", "marginRight":"10px"}}/>
                            {name !== undefined ? <input id="lesson-edit-name-input" defaultValue={name}/> : <Loading />}
                        </div>
                        <div id="lesson-edit-buttons">
                            <Button type="1" text_color="#ffffff" text="" icon="plus" onClick={() => {
                                createVocable();
                            }}/>
                            <Button type="1" text_color="#ffffff" text="" icon="times" onClick={() => {
                                saveVocables();
                                onClose();
                            }}/>
                        </div>
                    </div>
                    <table id="lesson-edit-headings" className="shadow-small">
                        <tbody>
                            <tr>
                                <th><LanguageSelect selected={this.state.n_lang} onSelect={(selected) => {this.setLang(selected, this.state.f_lang);}}/></th>
                                <th>Info</th>
                                <th><LanguageSelect selected={this.state.f_lang} onSelect={(selected) => {this.setLang(this.state.n_lang, selected);}}/></th>
                            </tr>
                        </tbody>
                    </table>
                    <div id="lesson-edit-list">
                        {vocables !== undefined ? Object.keys(vocables).map((id) => {
                            return(<EditLessonVocable
                                key={id}
                                n_text={vocables[id]["n_text"]} 
                                f_text={vocables[id]["f_text"]}
                                hint={vocables[id]["hint"]}
                                n_hint={vocables[id]["n_hint"]}
                                f_hint={vocables[id]["f_hint"]}
                                id={id}
                                onEdit={(n_text, f_text, hint, n_hint, f_hint) => {editVocable(id, n_text, f_text, hint, n_hint, f_hint);}}
                                onDelete={() => {deleteVocable(id)}}
                            />);
                        }) : <Loading />}
                    </div>
                </div>
            </div>
        );
    }
}

export default LessonList