import React, { useState } from "react"
import { AuthContext } from "../../AuthContext/AuthContext"
import { Navigate } from "react-router-dom"

export default function Tags({ categories, selector, filter }) {

    const [activeButton, setActiveButton] = useState(null);

    const handleButtonClick = (id) => {
        if (activeButton === id) {
            setActiveButton(null);
            selector(0)
            // filter(0);
            return;
        }
        setActiveButton(id); // Set the clicked button as active
        selector(id);
        // filter(id);
    };

    return (
        <>
            {
                categories.map(category => {
                    return (
                        <button
                            key={category.id}
                            className={activeButton === category.id ? "btn btn-success" : "btn btn-secondary"}
                            onClick={() => handleButtonClick(category.id)}
                        >
                            {category.name}
                        </button>)
                })
            }

        </>
    )
}