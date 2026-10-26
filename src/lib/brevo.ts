/**
 * Brevo (Sendinblue) Transactional Email Service
 * Handles quote enquiry acknowledgements to customers and new enquiry alerts to admins.
 */

import { QuoteRequest } from './types';

export const isBrevoConfigured = Boolean(
  process.env.BREVO_API_KEY &&
  !process.env.BREVO_API_KEY.includes('your-brevo')
);

export async function sendQuoteAcknowledgementEmail(quote: QuoteRequest): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'info@afrodreamglobal.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'Afro Dream Global';

  if (!isBrevoConfigured || !apiKey) {
    console.log(
      `[Brevo Service] Email skipped (BREVO_API_KEY not configured). Quote reference: ${quote.referenceNumber} to ${quote.email}`
    );
    return false;
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F5F7FA; margin: 0; padding: 20px; color: #231F20; }
          .container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 8px; overflow: hidden; border: 1px solid #E4E7EC; }
          .header { background-color: #231F20; padding: 28px; text-align: center; border-bottom: 4px solid #2B7CC0; }
          .header h1 { color: #FFFFFF; margin: 0; font-size: 24px; letter-spacing: 1px; }
          .content { padding: 30px; }
          .badge { display: inline-block; background-color: #EBF3FA; color: #2B7CC0; padding: 6px 14px; border-radius: 4px; font-weight: 600; font-size: 14px; margin-bottom: 20px; }
          .details-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .details-table td { padding: 10px 0; border-bottom: 1px solid #F1F5F9; font-size: 14px; }
          .details-table td.label { color: #667085; width: 40%; font-weight: 500; }
          .details-table td.value { color: #231F20; font-weight: 600; }
          .footer { background-color: #F8FAFC; padding: 20px 30px; text-align: center; font-size: 12px; color: #667085; border-top: 1px solid #E4E7EC; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>AFRO DREAM GLOBAL</h1>
            <p style="color: #94A3B8; margin: 5px 0 0; font-size: 13px;">Reliable Shipping Solutions Connecting Africa to Global Markets</p>
          </div>
          <div class="content">
            <span class="badge">Quote Enquiry Received — ${quote.referenceNumber}</span>
            <p>Dear <strong>${quote.customerName}</strong>,</p>
            <p>Thank you for reaching out to Afro Dream Global. We have received your freight forwarding enquiry and our logistics desk is currently reviewing the specifications.</p>
            
            <table class="details-table">
              <tr>
                <td class="label">Reference Number</td>
                <td class="value">${quote.referenceNumber}</td>
              </tr>
              <tr>
                <td class="label">Requested Service</td>
                <td class="value">${quote.serviceType}</td>
              </tr>
              ${quote.paymentTerms ? `<tr><td class="label">Payment Terms</td><td class="value" style="color: #2B7CC0; font-weight: bold;">${quote.paymentTerms}</td></tr>` : ''}
              <tr>
                <td class="label">Origin Port</td>
                <td class="value">${quote.originPort}, ${quote.originCountry}</td>
              </tr>
              <tr>
                <td class="label">Destination Port</td>
                <td class="value">${quote.destinationPort}, ${quote.destinationCountry}</td>
              </tr>
              <tr>
                <td class="label">Cargo Description</td>
                <td class="value">${quote.cargoDescription}</td>
              </tr>
              ${quote.cargoWeight ? `<tr><td class="label">Estimated Weight</td><td class="value">${quote.cargoWeight}</td></tr>` : ''}
              ${quote.preferredDate ? `<tr><td class="label">Target Shipping Date</td><td class="value">${quote.preferredDate}</td></tr>` : ''}
            </table>

            <p style="margin-top: 25px; line-height: 1.6; font-size: 14px;">
              An Afro Dream Global trade representative will contact you with verified routing options and competitive schedule tariffs within 24 business hours.
            </p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Afro Dream Global. Mtwara Port & West Africa Logistics Networks.<br/>
            Contact: info@afrodreamglobal.com | www.afrodreamglobal.com
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: quote.email, name: quote.customerName }],
        subject: `[${quote.referenceNumber}] Afro Dream Global — Quote Enquiry Received`,
        htmlContent: emailHtml,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[Brevo Service] Error response:', errText);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[Brevo Service] Network exception:', err);
    return false;
  }
}
