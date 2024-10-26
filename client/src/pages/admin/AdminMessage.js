import React, { useState, useEffect } from 'react';
import './AdminMessage.css'; // Import your external CSS file for styling

const AdminMessages = () => {
  // State to store the list of emails/messages
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null); // To store the selected email details

  // Simulate fetching email data
  useEffect(() => {
    const fetchedEmails = [
      {
        id: 1,
        senderEmail: 'user1@example.com',
        subject: 'Order Issue',
        message: 'I have an issue with my recent order. Please assist.',
        receivedAt: '2024-09-01',
      },
      {
        id: 2,
        senderEmail: 'user2@example.com',
        subject: 'Product Inquiry',
        message: 'I would like more details about the MacBook Pro 2021.',
        receivedAt: '2024-09-02',
      },
      {
        id: 3,
        senderEmail: 'user3@example.com',
        subject: 'Return Request',
        message: 'I want to return a product I purchased last week.',
        receivedAt: '2024-09-03',
      },
    ];

    // Set emails after a short delay to simulate API call
    setTimeout(() => {
      setEmails(fetchedEmails);
    }, 1000);
  }, []);

  // Function to handle clicking on an email
  const handleEmailClick = (email) => {
    setSelectedEmail(email);
  };

  // Function to go back to the email list
  const handleBackClick = () => {
    setSelectedEmail(null);
  };

  return (
    <div className="admin-messages-container">
      {/* If an email is selected, show the email details */}
      {selectedEmail ? (
        <div className="admin-message-detail">
          <button onClick={handleBackClick} className="back-button">← Back to Inbox</button>
          <h2 className="email-subject">{selectedEmail.subject}</h2>
          <p className="email-info">
            <strong>From:</strong> {selectedEmail.senderEmail} <br />
            <strong>Received:</strong> {selectedEmail.receivedAt}
          </p>
          <div className="email-message">
            <strong>Message:</strong>
            <p>{selectedEmail.message}</p>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="admin-messages-title">Inbox</h1>

          {emails.length === 0 ? (
            <div className="admin-messages-loading">Loading emails...</div>
          ) : (
            <ul className="admin-messages-list">
              {emails.map((email) => (
                <li
                  key={email.id}
                  className="admin-message-item"
                  onClick={() => handleEmailClick(email)}
                >
                  <p className="message-subject"><strong>{email.subject}</strong></p>
                  <p className="message-sender">From: {email.senderEmail}</p>
                  <p className="message-received">Received: {email.receivedAt}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
