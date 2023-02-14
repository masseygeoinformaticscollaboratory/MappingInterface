import React, {useState} from "react";
import {impactLabels} from "./LayerStyle/labels";
import "./LayerStyle/labels.css"
import {switcherDiv} from "./LayerStyle/LayerSwitcherStyle";

function LayerSwitcher(props) {

    const [checkedState, setCheckedState] = useState(
        new Array(impactLabels.length).fill(true)
    );

    const handleOnChange = (position) => {
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        setCheckedState(updatedCheckedState);

        const impact = props.impactLayers.getLayers().getArray()[position];


        if (impact.getVisible()) {
            impact.setVisible(false)
        } else {
            impact.setVisible(true)
        }
        props.popup.current.style.display = "none";
    }

    return (
        <div className="layer-switcher">
            <h4>Select Impacts</h4>
            <ul className="impacts-list">
                {impactLabels.map(({impact}, index) => {
                    return (
                        <div className="impact-list-item">
                            <input
                                type="checkbox"
                                id={`custom-checkbox-${index}`}
                                name={impact}
                                value={impact}
                                checked={checkedState[index]}
                                onChange={() => handleOnChange(index)}
                            />
                            <label htmlFor={`custom-checkbox-${index}`}>{impact}</label>
                        </div>
                    );
                })}

            </ul>
        </div>
    );

}

export default LayerSwitcher;
