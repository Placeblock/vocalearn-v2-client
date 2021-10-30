import React from 'react';
import Button from "../global/Button";
import "./MainContent.css";
import { fadeOutUp } from 'react-animations';
import Radium, {StyleRoot} from 'radium';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
 
const styles = {
    fadeOutUp: {
        animation: 'x 2s',
        animationName: Radium.keyframes(fadeOutUp, 'fadeOutUp')
    }
}

const SelectionListItem = ({id, name, onDelete, onEdit, onLearn, lessonadded}) => {

    return (
        <div selectionid={id} className="draggable not-draggable list-item shadow-small">
            <p className="list-item-text">{name}</p>
            <div className="list-item-buttons">
                <Button type="2" text="" icon="play" id={id} onClick={onLearn}/>
                <Button type="2" text="" icon="wrench" id={id} onClick={onEdit}/>
                <Button type="2" left_color="#ff0000" right_color="#990000" text_color="#ffffff" text="" icon="trash-alt" id={id} onClick={onDelete}/>
            </div>
            {lessonadded && <StyleRoot className="lessonadded">
                <div style={styles.fadeOutUp} className="lessonaddeditems">
                    <FontAwesomeIcon icon={"plus"} className="lessonaddeditem"/>
                    <FontAwesomeIcon icon={"plus"} className="lessonaddeditem"/>
                    <FontAwesomeIcon icon={"plus"} className="lessonaddeditem"/>
                    <FontAwesomeIcon icon={"plus"} className="lessonaddeditem"/>
                    <FontAwesomeIcon icon={"plus"} className="lessonaddeditem"/>
                    <FontAwesomeIcon icon={"plus"} className="lessonaddeditem"/>
                    <FontAwesomeIcon icon={"plus"} className="lessonaddeditem"/>
                </div>
            </StyleRoot>}
        </div>
    );
}

export default SelectionListItem