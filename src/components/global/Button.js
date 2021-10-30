import "./Button.css";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Button = ({left_color, right_color, text, icon, onClick, customCss}) => {

    var styleCss = {
        "backgroundImage": left_color !== undefined && right_color !== undefined ? 
            "linear-gradient(to right, "+left_color+", "+right_color+")" : 
            "linear-gradient(to right, var(--primary-light), var(--primary-dark))",
        "boxShadow": left_color !== undefined && right_color !== undefined ? 
            "1px 1px 10px "+left_color+", -1px -1px 10px " + right_color : 
            "1px 1px 10px var(--primary-light), -1px -1px 10px var(--primary-dark)"
    }

    return (
        <button style={{...customCss, ...styleCss}} 
            className="button button-style-1"
            onClick={onClick}>
            {icon !== undefined && <FontAwesomeIcon icon={icon}/>} {text}
        </button>
    );
}

export default Button