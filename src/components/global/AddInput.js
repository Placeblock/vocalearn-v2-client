import React, {useEffect, useState} from 'react';
import Button from "../global/Button";
import "./AddInput.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
var randomToken = require('random-token');

const AddInput = ({onAdd, onInput, onFocus, placeholder, button, collapseAndExpand, defaultCollapsed, collapseIcon}) => {
    const [id, setid] = useState(randomToken(16));
    const [collapsed, setcollapsed] = useState(defaultCollapsed);
    const [text, settext] = useState("");

    useEffect(() => {
        document.addEventListener("keyup", handleKeyDown);
        return () => {
            document.removeEventListener('keyup', handleKeyDown);
        };
    },[]);

    useEffect(() => {
        setcollapsed(defaultCollapsed);
    }, [defaultCollapsed]);
    
    function handleKeyDown(event) {
        if (event.key === "Enter" && document.getElementById(id) === document.activeElement && button !== undefined) {
            event.preventDefault();
            onAdd(document.getElementById(id).value);
            document.getElementById(id).value = "";
        }
    }

    return (
        <div className="add-input" style={collapsed ? {"width":"50px","cursor":"pointer"}: {"width":"100%"}} 
            onClick={collapsed ?() => {setcollapsed(false); setTimeout(() => {
                document.getElementById(id).focus();
            },25)} : () => {}}>
            {collapsed && collapseAndExpand ? <FontAwesomeIcon className="add-input-collapsed-icon" icon={collapseIcon}/>
            :<input 
                id={id} 
                placeholder={placeholder}
                onInput={(e) => {
                    if(onInput !== undefined) {
                        onInput(e.target.value);
                    }
                    settext(e.target.value);
                }}
                onFocus={() => {
                    if(onFocus !== undefined) {
                        onFocus();
                    }
                }}
                defaultValue={text}>
            </input>}
            {button !== undefined && !collapsed && <Button type="1" text_color="#ffffff" text="" icon={button} onClick={() => {
                onAdd(document.getElementById(id).value);
            }}/>}

        </div>
    );
}

export default AddInput