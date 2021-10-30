import React, {useState, useEffect} from 'react';
import Button from "../global/Button";
import "./MainContent.css";
import Loading from '../global/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LessonSearchItem = ({id, name, token, owner_name, rating, creation_date, onLearn, onRate}) => {
    const [hovered, sethovered] = useState();
    const [hoveredrating, sethoveredrating] = useState(rating["user_rating"]);
    const [showlesson, setshowlesson] = useState(false);
    const [lessoncontent, setlessoncontent] = useState();

    useEffect(() => {
        sethoveredrating(rating["user_rating"]);
    }, []);

    function loadLessonContent() {
        fetch('/api/lesson/content?token=' + token + '&id=' + id)
        .then(async response => {
            const data = await response.json();
            if (response.ok) {
                setlessoncontent(data["content"]);
            }else {
                const reserror = (data && data.error.message) || response.status;
                console.log(reserror);
                return;
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    return (
        <div lessonid={id} className="draggable list-item shadow-small search-list-item">
            <div className="list-item-content">
                <div className="list-item-text">
                    {hovered &&
                        <div className="rate-lesson" onMouseLeave={() => {sethovered(false);}}>
                            <p className="rate-lesson-info">({Object.keys(rating["ratings"]).length} {Object.keys(rating["ratings"]).length !== 1 ? "Bewertungen" : "Bewertung"})</p>
                            <div className="rate-lesson-stars">
                                <FontAwesomeIcon className="rating-star rating-star-big" 
                                    color={hoveredrating >= 1 ? "var(--primary-dark)" : "white"} icon={"star"}
                                    onMouseEnter={() => {sethoveredrating(1);}}
                                    onClick={() => {onRate(1);}}
                                />
                                <FontAwesomeIcon className="rating-star rating-star-big" 
                                    color={hoveredrating >= 2 ? "var(--primary-dark)" : "white"} icon={"star"}
                                    onMouseEnter={() => {sethoveredrating(2);}}
                                    onClick={() => {onRate(2);}}
                                />
                                <FontAwesomeIcon className="rating-star rating-star-big" 
                                    color={hoveredrating >= 3 ? "var(--primary-dark)" : "white"} icon={"star"}
                                    onMouseEnter={() => {sethoveredrating(3);}}
                                    onClick={() => {onRate(3);}}
                                />
                                <FontAwesomeIcon className="rating-star rating-star-big" 
                                    color={hoveredrating >= 4 ? "var(--primary-dark)" : "white"} icon={"star"}
                                    onMouseEnter={() => {sethoveredrating(4);}}
                                    onClick={() => {onRate(4);}}
                                />
                                <FontAwesomeIcon className="rating-star rating-star-big" 
                                    color={hoveredrating >= 5 ? "var(--primary-dark)" : "white"} icon={"star"}
                                    onMouseEnter={() => {sethoveredrating(5);}}
                                    onClick={() => {onRate(5);}}
                                />
                            </div>
                        </div>
                    }
                    <span className="lesson-rating-badge" onMouseEnter={() => {sethovered(true);}}>
                        {Math.round(rating["average"] * 10) / 10}<FontAwesomeIcon className="rating-star" icon={"star"}/>
                    </span>
                    {name}
                </div>
                <p>Erstellt von {owner_name} am {new Date(creation_date).toLocaleDateString()}</p>
            </div>
            <div className="list-item-buttons">
                <Button type="2" text_color="#ffffff" text="" icon="info" id={id} onClick={() => {
                    if(lessoncontent === undefined) {
                        loadLessonContent();
                    }
                    setshowlesson(true);
                }}/>
                <Button type="2" text_color="#ffffff" text="" icon="play" id={id} onClick={onLearn}/>
            </div>

            {showlesson &&
            <div id="lesson-edit-container" className="shadow-large">
                <div id="lesson-edit" className="shadow-large">
                    <div id="lesson-edit-info" className="shadow-small">
                        {name}
                        <div id="lesson-edit-buttons">
                            #
                            <Button type="1" text_color="#ffffff" text="" icon="times" onClick={() => {
                                setshowlesson(false);
                            }}/>
                        </div>
                    </div>
                    <div id="lesson-edit-list">
                        {lessoncontent !== undefined ? Object.keys(lessoncontent).map((id) => {
                            return(
                                <div key={id} className="dictionary-content-item shadow-small shadow-primary">
                                    <p>{lessoncontent[id]["n_text"]}</p><p>{lessoncontent[id]["f_text"]}</p>
                                </div>
                            );
                        }) : <Loading />}
                    </div>
                </div>
            </div>
            }

        </div>
    );
}

export default LessonSearchItem