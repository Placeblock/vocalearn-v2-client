import Menubutton from "../global/Menubutton";
import Button from "../global/Button";
import React, {useState} from 'react';
import "./Navbar.css";

const Navbar = ({onLogout, onDarkMode, onDict}) => {
    const [navcollapsed, setnavCollapsed] = useState({value:true});

    return (
        <div className="navbar-cont">
            <div className={navcollapsed ? "navbar" : "navbar open"}>
                <div className="navbar-top">
                    <Button type="2" text="" icon="book" customCss={{"margin":"10px","padding":"10px"}} onClick={onDict}/>
                    <Button type="2" text="" icon="adjust" customCss={{"margin":"10px","padding":"10px"}}
                    onClick={onDarkMode}/>

                </div>
                <div className="navbar-bottom">                    
                    <Button type="2" 
                    left_color="#ff0000" 
                    right_color="#990000" 
                    text="" icon="sign-out-alt"
                    customCss={{"margin":"10px","padding":"10px"}}
                    onClick={() => {onLogout()}}/>
                </div>
            </div>
            <Menubutton onClick={() => {setnavCollapsed(!navcollapsed);}}/>
        </div>
    );
}

export default Navbar