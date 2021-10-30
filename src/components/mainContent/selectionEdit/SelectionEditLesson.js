import React from 'react';
import Button from "../../global/Button";

const EditLessonVocable = ({name, onDelete}) => {

    return (
        <div className="lesson-edit-vocable shadow-small">
            <p style={{"width":"100%"}}>{name}</p>
            <Button type="1" left_color="#ff0000" right_color="#990000" text_color="#ffffff" text="" icon="trash-alt" onClick={() => {
                onDelete();
            }} customCss={{"width":"40px"}}/>
        </div>
    );
}

export default EditLessonVocable