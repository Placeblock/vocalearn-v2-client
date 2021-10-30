import React, {useState} from 'react'
import "./Menubutton.css"

const Menubutton = ({onClick}) => {
    const [collapsed, setCollapsed] = useState({value:false});

    function click() {
        setCollapsed(!collapsed);
    }

    return (
        <div className={collapsed ? "menu-btn" : "menu-btn open"}  onClick={() => {click(); onClick();}}>
            <div className="menu-btn__burger"></div>
        </div>
    );
}

export default Menubutton