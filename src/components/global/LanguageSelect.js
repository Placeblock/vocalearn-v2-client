import React, {useState} from 'react';
import "./LanguageSelect.css";
var randomToken = require('random-token');

const languages = {
    "Unbekannt":"Unbekannt",
    "Englisch":"Englisch",
    "Latein":"Latein",
    "Spanisch":"Spanisch",
    "Französich":"Französisch",
    "Italienisch":"Italienisch",
    "Chinesisch":"Chinesisch",
    "Deutsch":"Deutsch",
    "Mathe":"Mathe",
    "Informatik":"Informatik",
    "Physik":"Physik",
    "Chemie":"Chemie",
    "Biologie":"Biologie",
    "Erdkunde":"Erdkunde",
    "Wirtschaft":"Wirtschaft",
    "Geschichte":"Geschichte",
    "Sozialkunde":"Sozialkunde",
    "Musik":"Musik",
    "Religion":"Religion",
}

const LanguageSelect = ({onSelect, selected}) => {
    const [id, setid] = useState(randomToken(16));

    return (
        <select id={id} name="langages" className="shadow-small shadow-primary" value={selected} onChange={(event) => {onSelect(event.target.value)}}>
            {Object.keys(languages).map((value, index) => {
                return (
                    <option key={value} value={value}>{languages[value]}</option>
                )
            })}
        </select>
    );
}

export default LanguageSelect