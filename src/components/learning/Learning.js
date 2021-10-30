import React from 'react';
import "./learning.css";
import Button from "../global/Button";

class Learning extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vocableslist: props.vocables,
            token: props.token,
            name: props.name,
            onExit: props.onExit,
            direction: true
        }
    }

    register(known) {
        var vocableslistcopy = this.state.vocableslist;
        const vocable = vocableslistcopy.shift();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*' },
            body: JSON.stringify({ "token": this.state.token, "vocable":vocable["id"],"known":known,"direction":this.state.direction ? 1 : 0})
        };
        /*fetch('/api/statistics/add', requestOptions)
        .then(async response => {
            const data = await response.json();
            if (response.ok) {
                document.getElementById("learning-card").classList.remove("turned");
                setTimeout(() => {this.setState({"vocableslist":vocableslistcopy})}, 280);
            }else {
                const reserror = (data && data.error.message) || response.status;
                console.log(reserror);
                return;
            }
        })*/
        if(known) {
            vocableslistcopy.push(vocable);
        }else {
            const index = Math.min(Math.max(Math.floor(Math.random() * vocableslistcopy.length), 1), 4);
            vocableslistcopy.splice(index, 0, vocable);
        }
        document.getElementById("learning-card").classList.remove("turned");
        setTimeout(() => {
            this.setState({"vocableslist":vocableslistcopy});
        }, 220);
    }

    render() {
        const direction = this.state.direction;
        return (
            <div id="learning-container">
                <div id="learning-card">
                    <div id="learning-card-inner">
                        <div id="learning-card-front" className="shadow-small shadow-primary" onClick={() => {
                            document.getElementById("learning-card").classList.add("turned");
                        }}>
                        <p id="learning-card-ntext">{this.state.vocableslist !== undefined ? this.state.vocableslist[0][direction ? "n_text" : "f_text"]: ""}</p>
                        </div>
                        <div id="learning-card-back" className="shadow-small shadow-primary">
                            <div id="learning-card-back-text">
                                <p id="learning-card-ftext">{this.state.vocableslist !== undefined ? this.state.vocableslist[0][direction ? "f_text" : "n_text"]: ""}</p>
                                <p id="learning-card-hint">{this.state.vocableslist !== undefined ? this.state.vocableslist[0]["hint"]: ""}</p>
                            </div>
                            <div id="learning-card-buttons">
                                <Button type="2" left_color="#ff0000" right_color="#990000" text="Nicht gewusst" customCss={{"marginLeft":"15px"}} onClick={() => {this.register(false)}}/>
                                <Button type="2" text="Gewusst" customCss={{"marginLeft":"15px"}} onClick={() => {this.register(true)}}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="learning-info" className="shadow-small shadow-primary">
                    <p>Du lernst "{this.state.name}"</p>
                    <Button type="2" text_color="#ffffff" text="Abbrechen" customCss={{"marginLeft":"15px"}} onClick={this.state.onExit}/>
                </div>
            </div>
        );
    }
}

export default Learning
