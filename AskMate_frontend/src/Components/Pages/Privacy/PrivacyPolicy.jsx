import { Link } from "react-router-dom";
import "./PrivacyPolicy.css"
import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="privacy-policy-container">
      <h1 className="privacy-policy-title">Privacy Policy</h1>

      <section className="privacy-policy-section">
        <h2>What We Collect</h2>
        <p>
          When you register on our site, we collect some basic information that you provide, such as:
        </p>
        <ul>
          <li>Username</li>
          <li>Email address</li>
        </ul>
        <p>This information is used to create and manage your account. We do not use or share this information for any other purpose.</p>
      </section>

      <section className="privacy-policy-section">
        <h2>How We Use Your Information</h2>
        <p>
          The information you provide during registration is only used for account creation and management. We do not share, sell, or use your data for marketing purposes.(Wink, wink 😉)
        </p>
      </section>

      <section className="privacy-policy-section">
        <h2>Data Storage</h2>
        <p>
          We do not store sensitive information beyond what you provide when registering (username and email). Your data is stored securely, but we do not use or process it for anything other than account-related activities.
        </p>
      </section>

      <section className="privacy-policy-section">
        <h2>Cookies</h2>
        <p>
          We use cookies (small text files stored in your browser) to authenticate you.
        </p>
      </section>

      <section className="privacy-policy-section">
        <h2>Your Rights</h2>
        <p>
          You have the right to:
        </p>
        <ul>
          <li>Access the information we hold about you.</li>
          <li>Update your information if it's incorrect.</li>
          <li>Delete your account and data if you no longer wish to use our site.</li>
        </ul>
      </section>

      <section className="privacy-policy-section">
        <h2>Security</h2>
        <p>
          We take basic security measures to protect the information you provide, but since this is a learning project, we recommend not sharing sensitive personal data.
        </p>
      </section>

      <section className="privacy-policy-section">
        <h2>Changes to This Policy</h2>
        <p>
          We may update this policy occasionally. If we do, we will post the updated version on this page.
        </p>
      </section>

      <section className="privacy-policy-section">
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or how we handle your data, feel free to contact us at {<a href="/contact">Contact</a>}.
        </p>
      </section>
    </div>
  );
}
