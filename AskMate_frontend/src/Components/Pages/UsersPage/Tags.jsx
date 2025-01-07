import React from "react"
import { AuthContext } from "../../AuthContext/AuthContext"
import { Navigate } from "react-router-dom"


export default function Tags(categories) {

    return (
        <>
            <div>
                {categories.map(category => {
                    return <div>adsd</div>
                })}
            </div>
        </>
    )
}