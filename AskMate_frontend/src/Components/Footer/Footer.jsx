import "./Footer.css";


export default function Footer() {
    return (
        <div className="footerDiv">
            <footer >
                <span>© 2025 AskApe. All rights reserved.</span>
                <nav>
                    <a href="/about">About</a> |
                    <a href="/contact">Contact</a> |
                    <a href="/privacy-policy">Privacy Policy</a>
                </nav>
            </footer>
        </div>
    )
}