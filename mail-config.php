<?php
/**
 * Email notification settings for the LIC advisor website.
 * Recipient is configured to the email currently shown on the website.
 * Native PHP mail() is used by default. If the host does not deliver mail reliably,
 * configure a domain mailbox and use the hosting provider's SMTP integration/plugin.
 */
return [
    'recipient' => 'AmanBhardwaj1745@gmail.com',
    // Replace with a sender address on your own domain for best deliverability, e.g. website@yourdomain.in.
    'sender_email' => '',
    'sender_name' => 'Aman Bhardwaj LIC Website',
    'subject_prefix' => 'New LIC Website Enquiry',
];
