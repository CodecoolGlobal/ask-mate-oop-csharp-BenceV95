import { Link } from "react-router-dom"

export default function Contact() {
    return (
        <div style={{ backgroundColor: "#333" }} className="rounded p-3">
            <h1>Contact us at:</h1>
            <h4><Link to="https://benceveres.com" className="btn btn-success">Bence</Link></h4>
            <h4><Link to="https://github.com/vulpes556" className="btn btn-success">Bálint</Link></h4>
            <h4><Link to="https://github.com/molnarimi0211" className="btn btn-success">Imre</Link></h4>
            <h3><Link to="https://github.com/CodecoolGlobal/ask-mate-oop-csharp-BenceV95.git" className="btn btn-primary">GitHub for this project</Link></h3>
        </div>
    )
}