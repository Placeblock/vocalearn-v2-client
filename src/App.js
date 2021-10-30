import Navbar from "./components/navbar/Navbar";
import MainContent from "./components/mainContent/MainContent";
import Auth from "./components/authentication/Auth";
import React, {useState, useEffect} from 'react'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSignInAlt, faSignOutAlt, faTrashAlt, faPlus, faTimes, faInfo, faSave, faBook, faAdjust, faWrench, faPlay, faSearch, faLock, faUnlock, faStar} from '@fortawesome/free-solid-svg-icons'
import Dictionary from "./components/dictionary/Dictionary";

library.add(faSignInAlt, faSignOutAlt, faTrashAlt, faWrench, faPlus, faTimes, faInfo, faSave, faBook, faAdjust, faPlay, faSearch, faLock, faUnlock, faStar);

function App() {
  const [token, settoken] = useState();
  const [dark, setdark] = useState(true);
  const [showdict, setshowdict] = useState();

  useEffect(() => {
    var match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    if (match && token === undefined) {
      settoken(match[2]);
    }
  }, []);

  useEffect(() => {
    if(token === undefined) return;
    fetch('/api/user/getdarkmode?token=' + token)
    .then(async response => {
        const data = await response.json();
        if (!response.ok) {
            const reserror = (data && data.error.message) || response.status;
            console.log(reserror);
            return;
        }
        if(data["darkmode"] === 1) {
          setdark(true);
        }else {
          setdark(false);
        }
    })
    .catch(error => {
        console.log(error);
    });
  }, [token]);


  function delete_token() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  }

  useEffect(() => {
    let root = document.documentElement;
    if(dark) {
      root.style.setProperty("--background-body","#363636");
      root.style.setProperty("--background-item","#2c2c2c");
      root.style.setProperty("--shadow-dark","#1a1a1a");
      root.style.setProperty("--shadow-light","#555555");
      root.style.setProperty("--primary-dark","#334fcc");
      root.style.setProperty("--primary-light","#3399ff");
      root.style.setProperty("--text-color-light","white");
      root.style.setProperty("--text-color-dark","black");
      root.style.setProperty("--soft-color","rgb(36, 36, 36)");
      root.style.setProperty("--soft-color-opposite","rgb(167, 203, 218)");
    }else {
        root.style.setProperty("--background-body","#ccd0df");
        root.style.setProperty("--background-item","#e9ecf1");
        root.style.setProperty("--shadow-dark","#6c7eaf");
        root.style.setProperty("--shadow-light","#d3d3d3");
        root.style.setProperty("--primary-dark","#334fcc");
        root.style.setProperty("--primary-light","#3399ff");
        root.style.setProperty("--text-color-light","rgb(0, 0, 0)");
        root.style.setProperty("--text-color-dark","rgb(255, 255, 255)");
        root.style.setProperty("--soft-color","rgb(194, 208, 214)");
        root.style.setProperty("--soft-color-opposite","rgb(36, 36, 36)");
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
      body: JSON.stringify({ "token":token,"darkmode":dark ? 1 : 0})
    };
    fetch('/api/user/setdarkmode', requestOptions)
    .then(async response => {
        if (!response.ok) {
            const data = await response.json();
            const reserror = (data && data.error.message) || response.status;
            console.log(reserror);
            return;
        }
    })
    .catch(error => {
        console.log(error);
    });
  }, [dark]);

  function changeDarkMode() {
  }

  if(token !== undefined) {
    return (
      <div className="App">
        <Navbar onLogout={() => {settoken(undefined); delete_token();}} 
          onDarkMode={() => {setdark(!dark)}}
          onDict={() => {setshowdict(!showdict)}}/>
        <MainContent token={token}/>
        {showdict && <Dictionary token={token}/>}
        <p style={{"color":"var(--primary-dark)","position":"fixed","top":10,"right":10}}>©Felix</p>
      </div>
    );
  }else {
    return (
      <div className="App">
        <Auth onLoginCb={(token) => {settoken(token); document.cookie = "token=" + token;}}/>
        <p style={{"color":"var(--primary-dark)","position":"fixed","top":0,"right":0}}>©Felix</p>
      </div>
    );
  }
}

export default App;
