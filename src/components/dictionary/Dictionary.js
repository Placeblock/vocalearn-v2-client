import "./Dictionary.css";
import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Dictionary = ({token}) => {

    const [searchresult, setsearchresult] = useState();
    const [n_text_b, setn_text_b] = useState(true);
    const [f_text_b, setf_text_b] = useState(true);
    const [hint_b, sethint_b] = useState(true);

    function fetchData() {
        var text = document.getElementById("dictionary-input").value;
        if(text.length < 2 || text.length > 128) {
            setsearchresult({});
            return;
        }
        fetch('/api/vocable/search?token=' + token + "&regex=" + "^.*"+ text +".*$&n_text_b="+n_text_b+"&f_text_b="+f_text_b+"&hint_b="+hint_b+"")
        .then(async response => {
            const data = await response.json();
            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const reserror = (data && data.error.message) || response.status;
                console.log(reserror);
                return;
            }
            var vocables = data["vocables"];
            setsearchresult(vocables);
        })
        .catch(error => {
            console.log(error);
        });
    }

    function onInput() {
        fetchData();
    }

    useEffect(() => {
        fetchData();
    }, [n_text_b, f_text_b, hint_b])

    function updateBooleans() {
        const n_text_b_n = document.getElementById("n_text_b_checkbox").checked;
        const f_text_b_n = document.getElementById("f_text_b_checkbox").checked;
        const hint_b_n = document.getElementById("hint_b_checkbox").checked;
        if(n_text_b_n !== n_text_b) setn_text_b(n_text_b_n);
        if(f_text_b_n !== f_text_b) setf_text_b(f_text_b_n);
        if(hint_b_n !== hint_b) sethint_b(hint_b_n);
    }

    return (
        <div id="dictionary" className="shadow-small">
            <div id="dictionary-searchbar" className="shadow-small">
                <input id="dictionary-input" placeholder="persuadere" onInput={onInput}/>
                <FontAwesomeIcon icon={"search"} id="dictionary-search-icon"/>
            </div>
            <div id="dictionary-settings" className="shadow-small">
                <table>
                    <tbody>
                        <tr>
                        <th><input type="checkbox" id="n_text_b_checkbox" name="n_text_b_checkbox" onInput={updateBooleans} defaultChecked/></th>
                        <th><label htmlFor="n_text_b_checkbox">Lang1</label></th>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <tbody>
                        <tr>
                        <th><input type="checkbox" id="f_text_b_checkbox" name="f_text_b_checkbox" onInput={updateBooleans} defaultChecked/></th>
                        <th><label htmlFor="f_text_b_checkbox">Lang2</label></th>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <tbody>
                        <tr>
                        <th><input type="checkbox" id="hint_b_checkbox" name="hint_b_checkbox" onInput={updateBooleans} defaultChecked/></th>
                        <th><label htmlFor="hint_b_checkbox">Hint</label></th>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div id="dictionary-content">
                {searchresult !== undefined ? Object.keys(searchresult).map(function(id){
                    return <div key={id} className="dictionary-content-item shadow-small shadow-primary">
                            <p>{searchresult[id]["n_text"]}</p><p>{searchresult[id]["f_text"]}</p>
                        </div>
                }) : <p>Keine Vokabeln gefunden</p>}
            </div>
        </div>
    );
}

export default Dictionary