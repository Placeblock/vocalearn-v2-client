import React from 'react';
import Button from "../global/Button";
import "./MainContent.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const LessonListItem = ({id, name, rprivate, onDelete, onEdit, onLearn, onPrivate}) => {

    return (
        <div lessonid={id} className="draggable list-item shadow-small">
            <div className="list-item-content" style={{"display":"flex"}}>
                {rprivate ? 
                <FontAwesomeIcon style={{marginRight:"10px"}} color={"#ef0000"} icon={"lock"} onClick={() => {onPrivate(0);}}/> : 
                <FontAwesomeIcon style={{marginRight:"10px"}} color={"var(--primary-dark)"} icon={"unlock"} onClick={() => {onPrivate(1);}}/>}
                <p className="list-item-text">{name}</p>
            </div>
            <div className="list-item-buttons">
                <Button type="2" text_color="#ffffff" text="" icon="play" id={id} onClick={onLearn}/>
                <Button type="2" text_color="#ffffff" text="" icon="wrench" id={id} onClick={onEdit}/>
                <Button type="2" left_color="#ff0000" right_color="#990000" text_color="#ffffff" text="" icon="trash-alt" id={id} onClick={onDelete}/>
            </div>
        </div>
    );
}

export default LessonListItem