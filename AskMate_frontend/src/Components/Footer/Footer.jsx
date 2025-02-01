import "./Footer.css";


export default function Footer() {
    return (
        <div className="footerDiv">
            <footer >
                <p>© 2025 AskApe. All rights reserved.</p>
                <nav>
                    <a href="/about">About</a> |
                    <a href="/contact">Contact</a> |
                    <a href="/privacy-policy">Privacy Policy</a>
                </nav>
            </footer>
        </div>
    )
}