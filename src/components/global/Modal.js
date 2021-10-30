import "./Modal.css";
import Button from "./Button";
import React, {useEffect} from 'react';
import { fadeInDown } from 'react-animations';
import Radium, {StyleRoot} from 'radium';

const styles = {
    fadeInDown: {
      animation: 'x 0.5s',
      animationName: Radium.keyframes(fadeInDown, 'fadeInDown')
    }
  }

const Modal = ({html, onSubmit, onClose, buttontext, left_color_submit, right_color_submit, left_color_close, right_color_close}) => {

    useEffect(() => {
        document.addEventListener("keyup", handleKeyDown); ;     
        return () => {
            document.removeEventListener('keyup', handleKeyDown);
        };
    },[]);

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            onSubmit();
        }
        if (event.key === "Escape") {
            event.preventDefault();
            onClose();
        }
    }

    return (
        <StyleRoot className="modal-container">
            <div className="modal shadow-large" style={styles.fadeInDown}>
                    {html}
                    <div className="modal-buttons">
                        <Button type="1" left_color={left_color_close} right_color={right_color_close} text_color="#ffffff" text="Abbrechen" onClick={onClose} customCss={{"margin":"10px","padding":"10px"}}/>

                        <Button type="1" left_color={left_color_submit} right_color={right_color_submit} text_color="#ffffff" text={buttontext} onClick={onSubmit} customCss={{"margin":"10px","padding":"10px"}}/>
                    </div>
            </div>
        </StyleRoot>
    );
}

export default Modal