import React, {useEffect, useState} from 'react';
import "./MainContent.css";
import LessonListItem from './LessonListItem';
import LessonSearchItem from './LessonSearchItem';
import AddInput from '../global/AddInput';
import Modal from '../global/Modal';
import Loading from '../global/Loading';
import LessonEdit from './lessonEdit/LessonEdit';

const LessonList = ({token, onLearn}) => {
    const [lessons, setlessons] = useState();
    const [lessoneditmodal, setlessoneditmodal] = useState();
    const [currenteditlesson, setcurrenteditlesson] = useState();
    const [searchmode, setsearchmode] = useState(false);
    const [searchedlessons, setsearchedlessons] = useState();
    const [searchedtext, setsearchedtext] = useState();

    useEffect(() => {
        updateLessons();
    }, []);

    function updateLessons() {
        fetch('/api/lesson/usermetadata?token=' + token)
        .then(async response => {
            var data = await response.json();
            if (!response.ok) {
                const reserror = (data && data.error.message) || response.status;
                console.log(reserror);
                return;
            }
            setlessons(data["lessons"]);
        })
        .catch(error => {
            console.log(error);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    function deletelesson() {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
            body: JSON.stringify({"token": token, "id": lessoneditmodal.lessonid })
        };
        fetch('/api/lesson/delete', requestOptions)
        .then(response => {
            if (response.ok) {
                updateLessons();
            }
            setlessoneditmodal(undefined);
        })
        .catch(error => {
            setlessoneditmodal(undefined);
            console.log(error);
        });
    }

    function createlesson(name) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
            body: JSON.stringify({ name: name, token: token })
        };
        fetch('/api/lesson/create', requestOptions)
        .then(async response => {
            const data = await response.json();
            if (response.ok) {
                updateLessons();
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

    function searchlesson(input) {
        if(input.length < 1 || input.length > 128) {
            setsearchedlessons(undefined);
            return;
        }    
        fetch('/api/lesson/search?token=' + token + "&regex=^.*"+ input +".*$")
        .then(async response => {
            var data = await response.json();
            if (!response.ok) {
                const reserror = (data && data.error.message) || response.status;
                console.log(reserror);
                return;
            }
            setsearchedtext(input);
            setsearchedlessons(data["lessons"]);
        })
        .catch(error => {
            console.log(error);
        });
    }

    function setPrivate(id, rprivate) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
            body: JSON.stringify({ "token":token,"id":id,"private":rprivate})
        };
        fetch('/api/lesson/setprivate', requestOptions)
        .then(async response => {
            if (!response.ok) {
                const data = await response.json();
                const reserror = (data && data.error.message) || response.status;
                console.log(reserror);
                return;
            }
            updateLessons();
        })
        .catch(error => {
            console.log(error);
        });
    }

    function onRate(id, rating) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
            body: JSON.stringify({ "token":token,"id":id,"rating":rating})
        };
        fetch('/api/lesson/setrating', requestOptions)
        .then(async response => {
            if (!response.ok) {
                const data = await response.json();
                const reserror = (data && data.error.message) || response.status;
                console.log(reserror);
                return;
            }
            searchlesson(searchedtext);
        })
        .catch(error => {
            console.log(error);
        });
    }

    return (
        <div id="lessonlist" className="list shadow-large">  
            {lessoneditmodal !== undefined &&
                <Modal html={lessoneditmodal.html}
                buttontext={lessoneditmodal.buttontext}
                left_color_submit={lessoneditmodal.left_color_submit}
                right_color_submit={lessoneditmodal.right_color_submit}
                left_color_close={lessoneditmodal.left_color_close}
                right_color_close={lessoneditmodal.right_color_close} 
                onClose={() => {setlessoneditmodal(undefined)}}
                onSubmit={() => {deletelesson();}}/>
            }
            <p className="list-header">Lektionen</p>
            <div className="list-content">
                {searchmode === false ? lessons !== undefined ? Object.keys(lessons).map(function(id){
                            return <LessonListItem id={id} name={lessons[id]["name"]} rprivate={lessons[id]["private"]} key={id} onDelete={() => {
                                var modal = {
                                    "html":"Willst du wirklich die Lektion '" +  lessons[id]["name"] + "' löschen?",
                                    "buttontext":"Löschen",
                                    "left_color_submit":"#ee0979",
                                    "right_color_submit":"#ff6a00",
                                    "left_color_close":"#999999",
                                    "right_color_close":"#999999",
                                    "lessonid":id
                                }
                                setlessoneditmodal(modal);
                            }}
                            onEdit={() => {setcurrenteditlesson(id);}}
                            onPrivate={(rprivate) => {setPrivate(id, rprivate);}}
                            onLearn={() => {onLearn(id, lessons[id]["name"])}}/>
                        }) : <Loading /> 
                    :
                    searchedlessons !== undefined && Object.keys(searchedlessons).map(function(id){
                            return <LessonSearchItem id={id} 
                            token={token}
                            name={searchedlessons[id]["name"]} 
                            rating={searchedlessons[id]["rating"]}
                            owner_name={searchedlessons[id]["owner_name"]} 
                            creation_date={searchedlessons[id]["creation_date"]}
                            onLearn={() => {onLearn(id, searchedlessons[id]["name"])}}
                            onRate={(rating) => {onRate(id, rating);}}
                            key={id}/>
                    })
                }
            </div>
            <div id="lessonlist-inputcontainer">
                <AddInput
                onAdd={(input) => {createlesson(input)}}
                placeholder={"Unit 1, Ich bin dumm"}
                button="plus"
                defaultCollapsed={searchmode}
                collapseIcon="book"
                collapseAndExpand={true}
                onFocus={() => {setsearchmode(false);}}/>
                <AddInput
                placeholder={"Suchen"}
                collapseAndExpand={true}
                defaultCollapsed={!searchmode}
                collapseIcon="search"
                onInput={(input) => {searchlesson(input);}}
                onFocus={() => {setsearchmode(true);}}/>
            </div>
            
            {currenteditlesson !== undefined && <LessonEdit token={token} lessonid={currenteditlesson} onClose={() => {setcurrenteditlesson(undefined)}}
            onNameEdit={(name) => {
                var lessonscopy = lessons;
                if(lessonscopy[currenteditlesson] !== undefined) {
                    lessonscopy[currenteditlesson]["name"] = name;
                    setlessons(lessonscopy);
                }
            }}/>}
        </div>
    );
}

export default LessonList