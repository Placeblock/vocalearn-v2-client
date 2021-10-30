import "./Auth.css";
import Button from "../global/Button";
import React, {useState} from 'react';

const Auth = ({onLoginCb}) => {
    const [error, setError] = useState();
    const [authstate, setauthstate] = useState("login");

    //##################################  LOGIN

    function onLogin(email, password) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
            body: JSON.stringify({ email: email, password: password })
        };
        fetch('/api/token/login', requestOptions)
        .then(async response => {
            const data = await response.json();
            if (!response.ok) {
                const reserror = (data && data.error.message) || response.status;
                setError("Error: " + reserror);
                return;
            }
            onLoginCb(data["token"]);
        })
        .catch(error => {
            setError("Error: " + error);
        });
    }


    
    //##################################  REGISTER


    function onRegister(email, name, password, passwordr) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
            body: JSON.stringify({email: email, password: password, passwordr: passwordr, name: name.trim()})
        };
        fetch('/api/token/register', requestOptions)
        .then(async response => {
            if (!response.ok) {
                const data = await response.json();
                const reserror = (data && data.error.message) || response.status;
                setError("Error: " + reserror);
                return;
            }
            setauthstate("emailvalidate");
        })
        .catch(error => {
            console.log(error);
            setError("Error: " + error);
        });
    }

    function onEmailValidate(email, token) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
            body: JSON.stringify({email: email, token: token})
        };
        fetch('/api/token/emailvalidate', requestOptions)
        .then(async response => {
            if (!response.ok) {
                const data = await response.json();
                const reserror = (data && data.error.message) || response.status;
                setError("Error: " + reserror);
                return;
            }
            setAuthState("login");
        })
        .catch(error => {
            setError("Error: " + error);
        });
    }

    function resendEmailValidateMail(email) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
            body: JSON.stringify({email: email})
        };
        fetch('/api/token/resendvalidatemail', requestOptions)
        .then(async response => {
            if (!response.ok) {
                const data = await response.json();
                const reserror = (data && data.error.message) || response.status;
                setError("Error: " + reserror);
                return;
            }
            setError("<span>Email erneut gesendet ("+email+")!</span>");
        })
        .catch(error => {
            setError("Error: " + error);
        });
    }


    //##################################  RESET PASSWORD


    function onResetPassword(email) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
            body: JSON.stringify({email: email})
        };
        fetch('/api/token/resetpasswordmail', requestOptions)
        .then(async response => {
            if (!response.ok) {
                const data = await response.json();
                const reserror = (data && data.error.message) || response.status;
                setError("Error: " + reserror);
                return;
            }
            setAuthState("passwordresetvalidate");
        })
        .catch(error => {
            setError("Error: " + error);
        });
    }

    function verifyPasswordReset(email, token) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
            body: JSON.stringify({email: email, token: token})
        };
        fetch('/api/token/passwordresetvalidate', requestOptions)
        .then(async response => {
            if (!response.ok) {
                const data = await response.json();
                const reserror = (data && data.error.message) || response.status;
                setError("Error: " + reserror);
                return;
            }
            setAuthState("resetpasswordenternew");
        })
        .catch(error => {
            setError("Error: " + error);
        });
    }

    function resetPassword(email, password, token) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
            body: JSON.stringify({email: email, password: password, passwordr: password, token: token})
        };
        fetch('/api/token/setnewpassword', requestOptions)
        .then(async response => {
            if (!response.ok) {
                const data = await response.json();
                const reserror = (data && data.error.message) || response.status;
                setError("Error: " + reserror);
                return;
            }
            setAuthState("login");
        })
        .catch(error => {
            setError("Error: " + error);
        });
    }


    //##################################  GENERAL

    function setAuthState(state) {
        document.getElementById("form-content").style.opacity = "0";
        setTimeout(() => {
            setError("");
            setauthstate(state);
            document.getElementById("form-content").style.opacity = "1";
        }, 200);
    }

    function passwordCheck() {
        const password = document.getElementById("lpswd");
        const passwordr = document.getElementById("lpswdr");
        function disable() {
            passwordr.style.borderBottom = "2px solid #ff0000";
            password.style.borderBottom = "2px solid #ff0000";
        }

        if(/\d/.test(password.value) === false) {
            disable();
            setError("Das Passwort muss mindestens eine Ziffer enthalten!");
            return;
        }
        if(password.value.length < 6) {
            disable();
            setError("Das Passwort muss mindestens 6 Zeichen lang sein!");
            return;
        }
        if(password.value !== passwordr.value) {
            disable();
            setError("Die Passwörter müssen übereinstimmen!");
            return;
        }
        setError("");
        passwordr.style.borderBottom = "2px solid #00ff00";
        password.style.borderBottom = "2px solid #00ff00";
    }

    function emailCheck() {
        const email = document.getElementById("lemail");
        if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.value) !== true) {
            email.style.borderBottom = "2px solid #ff0000";
            setError("Keine valide Email!");
            return;
        }
        setError("");
        email.style.borderBottom = "2px solid #00ff00";
    }

    function nameCheck() {
        const name = document.getElementById("lname");
        var lettercount = (name.value.trim().match(/\S/g) || []).length;
        if(lettercount < 3) {
            name.style.borderBottom = "2px solid #ff0000";
            setError("Dein Name muss mindestens 3 Zeichen enthalten!");
            return;
        }
        setError("");
        name.style.borderBottom = "2px solid #00ff00";
    }

    function tokenCheck() {
        const code = document.getElementById("lcode");
        if(/^\d+$/.test(code.value) !== true) {
            code.style.borderBottom = "2px solid #ff0000";
            setError("Der Token darf nur Zahlen enthalten!");
            return;
        }
        if(code.value.length !== 6) {
            code.style.borderBottom = "2px solid #ff0000";
            setError("Der Token muss 6 Zeichen lang sein!");
            return;
        }
        setError("");
        code.style.borderBottom = "2px solid #00ff00";
    }

    const emailstates = ["login","register","resetpasswordemail"];
    const namestates = ["register"];
    const passwordstates = ["login","register","resetpasswordenternew"];
    const passwordrstates = ["register","resetpasswordenternew"];
    const codestates = ["emailvalidate","passwordresetvalidate"];
    const emailcheckstates = ["register","resetpasswordemail"];
    const namecheckstates = ["register"];
    const passwordcheckstates = ["register","resetpasswordenternew"];
    const passwordrcheckstates = ["register","resetpasswordenternew"];
    const codecheckstates = ["emailvalidate","passwordresetvalidate"];

    return (
        <div id="form-container">
            <form className="shadow-small" id="auth-form">
                <div id="form-content">
                    <div className="form-section" style={emailstates.includes(authstate) ? {} : {"display":"none"}}>
                        <label htmlFor="lemail">Email:</label>
                        <input type="text" id="lemail" name="lemail" placeholder="räuber.hotzenplotz@gmx.de" onInput={emailcheckstates.includes(authstate) ? emailCheck : undefined}/>
                    </div>
                    <div className="form-section" style={namestates.includes(authstate) ? {} : {"display":"none"}}>
                        <label htmlFor="lname">Name:</label>
                        <input type="text" id="lname" name="lname" placeholder="Felix" onInput={namecheckstates.includes(authstate) ? nameCheck : undefined}/>
                    </div>
                    <div className="form-section" style={passwordstates.includes(authstate) ? {} : {"display":"none"}}>
                        <label htmlFor="lpswd">Password:</label>
                        <input type="password" id="lpswd" name="lpswd" placeholder="ichbinhübsch1234" onInput={passwordcheckstates.includes(authstate) ? passwordCheck : undefined}/>
                    </div>
                    <div className="form-section" style={passwordrstates.includes(authstate) ? {} : {"display":"none"}}>
                        <label htmlFor="lpswdr">Repeat Password:</label>
                        <input type="password" id="lpswdr" name="lpswdr" placeholder="ichbinhübsch1234" onInput={passwordrcheckstates.includes(authstate) ? passwordCheck : undefined}/>
                    </div>
                    <div className="form-section" style={codestates.includes(authstate) ? {} : {"display":"none"}}>
                        <label htmlFor="lcode">Code:</label>
                        <input type="password" id="lcode" name="lcode" placeholder="418396" onInput={codecheckstates.includes(authstate) ? tokenCheck : undefined}/>
                    </div>
                    <p id="form-error">{error}</p>
                    <br/>
                    {authstate === "login" && <p id="form-register">Noch keinen Account? <span id="form-register-click" onClick={() => {setAuthState("register")}}>Registrieren</span></p>}
                    {authstate === "login" && <p id="form-register">Passwort vergessen? <span id="form-register-click" onClick={() => {setAuthState("resetpasswordemail")}}>Zurücksetzen</span></p>}
                    {authstate === "register" && <p id="form-register">Bereits einen Account? <span id="form-register-click" onClick={() => {setAuthState("login")}}>Anmelden</span></p>}
                    {authstate === "emailvalidate" && <p id="form-register">Keine Email bekommen? <span id="form-register-click" onClick={() => {resendEmailValidateMail(document.getElementById("lemail").value)}}>Erneut senden</span></p>}

                    {authstate === "login" && <Button type="1" 
                    text="Login" icon="sign-in-alt" 
                    customCss={{"padding":"10px"}}
                    onClick={(e) => {e.preventDefault(); onLogin(document.getElementById("lemail").value, document.getElementById("lpswd").value);}}/>}
                    {authstate === "register" && <Button id="testauthid" type="1" 
                    text="Register" icon="sign-in-alt" 
                    customCss={{"padding":"10px"}}
                    onClick={(e) => {e.preventDefault(); onRegister(document.getElementById("lemail").value, document.getElementById("lname").value, document.getElementById("lpswd").value, document.getElementById("lpswdr").value);}}/>}
                    {authstate === "emailvalidate" && <Button type="1" 
                    text="Verifizieren" icon="sign-in-alt" 
                    customCss={{"padding":"10px"}}
                    onClick={(e) => {e.preventDefault(); onEmailValidate(document.getElementById("lemail").value, document.getElementById("lcode").value);}}/>}
                    {authstate === "resetpasswordemail" && <Button type="1" 
                    text="Zurücksetzen" icon="sign-in-alt" 
                    customCss={{"padding":"10px"}}
                    onClick={(e) => {e.preventDefault(); onResetPassword(document.getElementById("lemail").value);}}/>}
                    {authstate === "passwordresetvalidate" && <Button type="1" 
                    text="Verifizieren" icon="sign-in-alt" 
                    customCss={{"padding":"10px"}}
                    onClick={(e) => {e.preventDefault(); verifyPasswordReset(document.getElementById("lemail").value, document.getElementById("lcode").value);}}/>}
                    {authstate === "resetpasswordenternew" && <Button type="1" 
                    text="Zurücksetzen" icon="sign-in-alt" 
                    customCss={{"padding":"10px"}}
                    onClick={(e) => {e.preventDefault(); resetPassword(document.getElementById("lemail").value, document.getElementById("lpswd").value, document.getElementById("lcode").value);}}/>}

                </div>
            </form>
        </div>
    );
}

export default Auth