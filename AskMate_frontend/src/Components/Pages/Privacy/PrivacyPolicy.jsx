import { Link } from "react-router-dom";
//import "./PrivacyPolicy.css"

export default function PrivacyPolicy() {
  return (
    <div style={{ backgroundColor: "#1f1f1f", maxWidth: "800px", overflowY: "auto", height: "100%" }} className="p-3 rounded text-start">
      <h1 className="pb-3 text-center">Privacy Policy</h1>

      <section className="mb-3">
        <h2>What We Collect</h2>
        <p>
          When you register on our site, we collect some basic information that you provide, such as:
        </p>
        <ul>
          <li>Username</li>
          <li>Email address</li>
          <li>Data relating to questions, answers, votes</li>
        </ul>
      </section>

      <section className="mb-3">
        <h2>How We Use Your Information</h2>
        <p>
          The information you provide is used to make the website function. As this is a learning project, all the data you have provided will eventually be deleted. The data you generate will not be used for any other purpose than the functionality of the site, will not be sold by us.
        </p>
      </section>

      <section className="mb-3">
        <h2>Cookies</h2>
        <p>
          We use cookies (small text files stored in your browser) to authenticate you. We do not bother with GDPR as this is a learning project.
        </p>
      </section>

      <section className="mb-3">
        <h2>Your Rights</h2>
        <p>
          You have the right to:
        </p>
        <ul>
          <li>Access the information we hold about you.</li>
          <li>Update your information if it's incorrect.</li>
          <li>Delete your account and data if you no longer wish to use our site.</li>
          <li>Feel free to reach out, we are happy to help with anything related to your data.</li>
        </ul>
      </section>

      <section className="mb-3">
        <h2>Security</h2>
        <p>
          We take basic security measures to protect the information you provide, but since this is a learning project, we recommend not sharing sensitive personal data. This is why we let you register with fake details.
        </p>
      </section>

      <section className="mb-3">
        <h2>Changes to This Policy</h2>
        <p>
          We may update this policy occasionally. If we do, we will post the updated version on this page.
        </p>
      </section>

      <section className="">
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or how we handle your data, feel free to contact us at {<a href="/contact">Contact</a>}.
        </p>
      </section>

    </div>
  );
}
