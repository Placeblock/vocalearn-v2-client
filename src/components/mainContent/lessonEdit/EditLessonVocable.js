import React, {useEffect} from 'react';
import Button from "../../global/Button";

const EditLessonVocable = ({id, n_text, f_text, hint, onEdit, onDelete}) => {

    function edit() {
        var inputs = document.querySelectorAll(".lesson-edit-vocable[vocableid='"+id+"'] input");
        onEdit(inputs[0].value,inputs[2].value,inputs[1].value);
    }

    return (
        <div className="lesson-edit-vocable shadow-small" vocableid={id}>
            <div>
                <div className="input-container">
                    <input onChange={edit} defaultValue={n_text !== "" ? n_text : ""} placeholder={n_text === "" ? "go" : ""}></input>
                    <input onChange={edit} defaultValue={hint !== "" ? hint : ""}  placeholder={hint === "" ? "extra info" : ""}></input>
                    <input onChange={edit} defaultValue={f_text !== "" ? f_text : ""} placeholder={f_text === "" ? "gehen" : ""}></input>
                </div>
            </div>
            <Button type="1" left_color="#ff0000" right_color="#990000" text_color="#ffffff" text="" icon="trash-alt" onClick={() => {
                onDelete();
            }}/>
        </div>
    );
}

export default EditLessonVocable