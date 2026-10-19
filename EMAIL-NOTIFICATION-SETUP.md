# Email notifications — deployment notes

The website forms now submit to `send-enquiry.php` on the same hosting server. Notifications are addressed to `AmanBhardwaj1745@gmail.com`, the email already displayed on the site. Lead source is included in the notification subject/body (Homepage Popup, Consultation CTA, Contact Page, or Brochure Download).

## Required hosting conditions

1. Upload the complete `site/` contents to a PHP-enabled hosting account (PHP 8.0+ recommended). A static preview, `file://` open, or static-only hosting cannot run `send-enquiry.php`.
2. The hosting server must have PHP `mail()` enabled and correctly configured. A successful response means the host accepted the message for delivery; it does not guarantee inbox placement.
3. For best reliability, use a mailbox on your own domain and configure your hosting provider's authenticated SMTP service. Set `sender_email` in `mail-config.php` to that domain mailbox. Do not use a visitor's email as the From address; it is used only as Reply-To.
4. Ensure the sender domain has SPF/DKIM configured through your mail host. Check spam/junk folders during the first live test.
5. Send a real test enquiry from the deployed website and confirm the message arrives at `AmanBhardwaj1745@gmail.com` before advertising the site.

## Security notes

- Recipient configuration is server-side; no mail secret is exposed in `script.js`.
- Server validates the fields and allowed plan categories, sanitizes header values, rejects non-POST requests and supports the form honeypot.
- This plain HTML/PHP package does not store lead submissions in a database. It emails the enquiry only. If persistent lead records are needed, add an authenticated CRM or server-side database with an appropriate privacy/retention policy.
- `mail()` availability varies by host. If the endpoint returns an email-server error, configure authenticated SMTP through your host or ask for a PHPMailer SMTP version with the hosting mailbox details.
