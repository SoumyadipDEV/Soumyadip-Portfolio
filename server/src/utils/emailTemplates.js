const escapeHtml = (str = '') =>
  String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getDisplaySubject = (subject) => {
  const trimmedSubject = String(subject ?? '').trim();

  return trimmedSubject || 'No subject';
};

const getCleanEmailAddress = (email) => String(email ?? '').trim().replace(/[\r\n]/g, '');

export const getNotificationEmailTemplate = ({
  senderName,
  senderEmail,
  subject,
  message,
}) => {
  const currentYear = new Date().getFullYear();
  const displaySubject = getDisplaySubject(subject);
  const cleanSenderEmail = getCleanEmailAddress(senderEmail);
  const safeSenderName = escapeHtml(senderName);
  const safeSenderEmail = escapeHtml(cleanSenderEmail);
  const safeSubject = escapeHtml(displaySubject);
  const safeMessage = escapeHtml(message);
  const replyHref = escapeHtml(
    `mailto:${cleanSenderEmail}?subject=${encodeURIComponent(`Re: ${displaySubject}`)}`,
  );

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Contact</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #eef2f6; font-family: Arial, sans-serif; color: #333333;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; margin: 0; padding: 24px 12px; background-color: #eef2f6; border-collapse: collapse;">
      <tr>
        <td align="center" style="padding: 0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border-collapse: separate;">
            <tr>
              <td align="center" style="background-color: #0A1628; padding: 24px 20px;">
                <div style="font-family: Arial, sans-serif; color: #ffffff; font-size: 22px; line-height: 1.3; font-weight: bold;">Portfolio Contact</div>
                <div style="font-family: Arial, sans-serif; color: #C9A84C; font-size: 13px; line-height: 1.5; margin-top: 4px;">New message received</div>
              </td>
            </tr>
            <tr>
              <td style="background-color: #ffffff; padding: 32px; font-family: Arial, sans-serif;">
                <div style="color: #0A1628; font-size: 18px; line-height: 1.4; font-weight: bold; margin: 0 0 12px;">Hello,</div>
                <p style="margin: 0 0 24px; color: #333333; font-size: 14px; line-height: 1.7;">You have received a new message through portfolio contact form.</p>
                <div style="background-color: #f5f7fa; border-left: 4px solid #C9A84C; border-radius: 6px; padding: 16px; margin: 0 0 28px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td valign="top" style="width: 86px; padding: 0 12px 10px 0; font-family: Arial, sans-serif; color: #0A1628; font-size: 14px; line-height: 1.5; font-weight: bold;">Name:</td>
                      <td valign="top" style="padding: 0 0 10px; font-family: Arial, sans-serif; color: #333333; font-size: 14px; line-height: 1.5;">${safeSenderName}</td>
                    </tr>
                    <tr>
                      <td valign="top" style="width: 86px; padding: 0 12px 10px 0; font-family: Arial, sans-serif; color: #0A1628; font-size: 14px; line-height: 1.5; font-weight: bold;">Email:</td>
                      <td valign="top" style="padding: 0 0 10px; font-family: Arial, sans-serif; color: #333333; font-size: 14px; line-height: 1.5;"><a href="mailto:${safeSenderEmail}" style="color: #0A1628; text-decoration: underline;">${safeSenderEmail}</a></td>
                    </tr>
                    <tr>
                      <td valign="top" style="width: 86px; padding: 0 12px 10px 0; font-family: Arial, sans-serif; color: #0A1628; font-size: 14px; line-height: 1.5; font-weight: bold;">Subject:</td>
                      <td valign="top" style="padding: 0 0 10px; font-family: Arial, sans-serif; color: #333333; font-size: 14px; line-height: 1.5;">${safeSubject}</td>
                    </tr>
                    <tr>
                      <td valign="top" style="width: 86px; padding: 0 12px 0 0; font-family: Arial, sans-serif; color: #0A1628; font-size: 14px; line-height: 1.5; font-weight: bold;">Message:</td>
                      <td valign="top" style="padding: 0; font-family: Arial, sans-serif; color: #333333; font-size: 14px; line-height: 1.6;">
                        <div style="margin: 0 0 0 12px; padding-left: 12px; border-left: 2px solid #d9dee8; white-space: pre-wrap;">${safeMessage}</div>
                      </td>
                    </tr>
                  </table>
                </div>
                <div style="text-align: center; margin: 0;">
                  <a href="${replyHref}" style="background-color: #0A1628; color: #ffffff; padding: 12px 28px; border-radius: 6px; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4; font-weight: bold; border: 2px solid #C9A84C; display: inline-block; text-decoration: none;">Reply to ${safeSenderName}</a>
                </div>
              </td>
            </tr>
            <tr>
              <td align="center" style="background-color: #f5f7fa; padding: 16px; font-family: Arial, sans-serif;">
                <div style="color: #333333; font-size: 12px; line-height: 1.5;">This notification was sent from Soumyadip Banerjee's portfolio website.</div>
                <div style="color: #888888; font-size: 11px; line-height: 1.5; margin-top: 4px;">&copy; ${currentYear} &mdash; Portfolio</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};

export const getAutoReplyEmailTemplate = ({ senderName, subject }) => {
  const currentYear = new Date().getFullYear();
  const safeSenderName = escapeHtml(senderName);
  const safeSubject = escapeHtml(getDisplaySubject(subject));

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Reaching Out</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #eef2f6; font-family: Arial, sans-serif; color: #333333;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; margin: 0; padding: 24px 12px; background-color: #eef2f6; border-collapse: collapse;">
      <tr>
        <td align="center" style="padding: 0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border-collapse: separate;">
            <tr>
              <td align="center" style="background-color: #0A1628; padding: 24px 20px;">
                <div style="font-family: Arial, sans-serif; color: #ffffff; font-size: 22px; line-height: 1.3; font-weight: bold;">Thank You for Reaching Out</div>
                <div style="font-family: Arial, sans-serif; color: #C9A84C; font-size: 13px; line-height: 1.5; margin-top: 4px;">We'll get back to you soon</div>
              </td>
            </tr>
            <tr>
              <td style="background-color: #ffffff; padding: 32px; font-family: Arial, sans-serif;">
                <div style="color: #0A1628; font-size: 18px; line-height: 1.4; font-weight: bold; margin: 0 0 16px;">Hello ${safeSenderName},</div>
                <p style="margin: 0 0 16px; color: #333333; font-size: 14px; line-height: 1.7;">Thank you for getting in touch! I have received your message regarding '${safeSubject}' and will get back to you as soon as possible.</p>
                <p style="margin: 0 0 16px; color: #333333; font-size: 14px; line-height: 1.7;">I typically respond within 1&ndash;2 business days.</p>
                <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.7;">In the meantime, feel free to explore my portfolio.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="background-color: #f5f7fa; padding: 16px; font-family: Arial, sans-serif;">
                <div style="color: #333333; font-size: 12px; line-height: 1.5;">You are receiving this because you submitted a contact form on my portfolio.</div>
                <div style="color: #888888; font-size: 11px; line-height: 1.5; margin-top: 4px;">&copy; ${currentYear} &mdash; Soumyadip Banerjee's Portfolio</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};

export const getReplyEmailTemplate = ({ senderName, replyBody, originalSubject }) => {
  const currentYear = new Date().getFullYear();
  const displaySubject = String(originalSubject ?? '').trim() || 'Your message';
  const safeSenderName = escapeHtml(senderName);
  const safeReplyBody = escapeHtml(replyBody);
  const safeOriginalSubject = escapeHtml(displaySubject);

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reply from Soumyadip Banerjee</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #eef2f6; font-family: Arial, sans-serif; color: #333333;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; margin: 0; padding: 24px 12px; background-color: #eef2f6; border-collapse: collapse;">
      <tr>
        <td align="center" style="padding: 0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border-collapse: separate;">
            <tr>
              <td align="center" style="background-color: #0A1628; padding: 24px 20px;">
                <div style="font-family: Arial, sans-serif; color: #ffffff; font-size: 22px; line-height: 1.3; font-weight: bold;">Reply from Soumyadip Banerjee</div>
                <div style="font-family: Arial, sans-serif; color: #C9A84C; font-size: 13px; line-height: 1.5; margin-top: 4px;">Re: ${safeOriginalSubject}</div>
              </td>
            </tr>
            <tr>
              <td style="background-color: #ffffff; padding: 32px; font-family: Arial, sans-serif;">
                <p style="margin: 0 0 16px; color: #0A1628; font-size: 16px; line-height: 1.6; font-weight: bold;">Hello ${safeSenderName},</p>
                <p style="margin: 0 0 16px; color: #333333; font-size: 14px; line-height: 1.7;">Thank you for your message. Here is my reply:</p>
                <div style="background-color: #f5f7fa; border-left: 4px solid #C9A84C; border-radius: 6px; padding: 16px; margin: 16px 0; color: #333333; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${safeReplyBody}</div>
              </td>
            </tr>
            <tr>
              <td align="center" style="background-color: #f5f7fa; padding: 16px; font-family: Arial, sans-serif;">
                <div style="color: #333333; font-size: 12px; line-height: 1.5;">This is a reply to your portfolio contact form submission.</div>
                <div style="color: #888888; font-size: 11px; line-height: 1.5; margin-top: 4px;">&copy; ${currentYear} &ndash; Soumyadip Banerjee's Portfolio</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};
