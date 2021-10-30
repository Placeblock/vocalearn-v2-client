import "./MainContent.css";
import LessonList from './LessonList';
import SelectionList from './SelectionList';
import Learning from '../learning/Learning';
import React, {useState} from "react";
import Modal from "../global/Modal";

const MainContent = ({token}) => {

    const [learnvocables, setlearnvocables] = useState();
    const [learnname, setlearnname] = useState();


    function learnLesson(id, name) {
        fetch('/api/lesson/content?token=' + token + '&id=' + id)
        .then(async response => {
            const data = await response.json();
            if (!response.ok) {
                const reserror = (data && data.error.message) || response.status;
                console.log(reserror);
            }
            setlearnname(name);
            var vocableslist = [];
            Object.keys(data["content"]).forEach(vocable => {
                var vocabledata = data["content"][vocable];
                vocabledata["id"] = vocable;
                console.log(vocabledata);
                vocableslist.push(vocabledata);
            })
            setlearnvocables(vocableslist);
        })
        .catch(error => {
            console.log(error);
        });
    }

    function learnSelection(id, name) {
        fetch('/api/selection/vocables?token=' + token + '&id=' + id)
        .then(async response => {
            const data = await response.json();
            if (!response.ok) {
                const reserror = (data && data.error.message) || response.status;
                console.log(reserror);
                return;
            }
            setlearnname(name);
            var vocableslist = []
            Object.keys(data["vocables"]).forEach(vocable => {
                vocableslist.push(data["vocables"][vocable]);
            })
            setlearnvocables(vocableslist);
        })
        .catch(error => {
            console.log(error);
        });
    }

    return (
        <div id="mainContent">
            {learnvocables !== undefined &&
                <Learning token={token} vocables={learnvocables} name={learnname} onExit={() => {setlearnvocables(undefined)}}/>
            }
            <div id="lists-container">
                <SelectionList token={token} onLearn={(id, name) => {learnSelection(id, name)}}/>
                <LessonList token={token} onLearn={(id, name) => {learnLesson(id, name)}}/>
            </div>
        </div>
    );
}

export default MainContent