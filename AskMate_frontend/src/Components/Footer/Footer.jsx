//import "./Footer.css";
import { Link } from "react-router-dom"

export default function Footer() {
    return (
        <footer className="d-flex flex-column border-2 border-top border-primary pb-1">
            <p>© 2025 AskApe. All rights reserved.</p>
            <nav className="d-flex justify-content-around">
                <Link to="/about" className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">About</Link> |
                <Link to="/contact" className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">Contact</Link> |
                <Link to="/privacy-policy" className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">Privacy Policy</Link> |
                <Link to="/tos" className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">Terms & Conditions</Link>
            </nav>
        </footer>
    )
}