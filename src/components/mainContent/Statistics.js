import React, {useEffect, useState} from 'react';
import Button from "../global/Button";
import "./MainContent.css";
 
const Statistics = ({name, vocableids}) => {

    [vocables,setvocables] = useState();
    [statistics, setStatistics] = useState();

    useEffect(() => {
        fetch('/api/lesson/content?token=' + this.state.token + '&id=' + this.state.lessonid)
        .then(async response => {
            const data = await response.json();
            if (response.ok) {
                this.setState({"vocables":data["content"]})
            }else {
                const reserror = (data && data.error.message) || response.status;
                console.log(reserror);
                return;
            }
        })
        .catch(error => {
            console.log(error);
        });
    }, [])

    return (
        <div id="lesson-edit-container">
            <div id="lesson-edit" className="shadow-large">
                <div id="lesson-edit-info" className="shadow-small">
                    <div id="lesson-edit-info-name">
                        <p>{name}</p>
                    </div>
                    <div id="lesson-edit-buttons">
                        <Button type="1" text_color="#ffffff" text="" icon="times" onClick={() => {
                            onClose();
                        }}/>
                    </div>
                </div>
                <div id="lesson-edit-list">
                    {vocables !== undefined ? Object.keys(vocables).map((id) => {
                        return(<EditLessonVocable
                            key={id}
                            n_text={vocables[id]["n_text"]} 
                            f_text={vocables[id]["f_text"]}
                            hint={vocables[id]["hint"]}
                            n_hint={vocables[id]["n_hint"]}
                            f_hint={vocables[id]["f_hint"]}
                            id={id}
                            onEdit={(n_text, f_text, hint, n_hint, f_hint) => {editVocable(id, n_text, f_text, hint, n_hint, f_hint);}}
                            onDelete={() => {deleteVocable(id)}}
                        />);
                    }) : <Loading />}
                </div>
            </div>
        </div>
    );
}

export default Statistics