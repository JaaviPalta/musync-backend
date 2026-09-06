import nodemailer from 'nodemailer';

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

const transporter =
  GMAIL_USER && GMAIL_APP_PASSWORD
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_APP_PASSWORD,
        },
      })
    : null;

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export function buildTrackingUrl(accessToken) {
  return `${FRONTEND_URL}/seguimiento/${accessToken}`;
}

// El email es el respaldo real del link de seguimiento (ver conversación con
// el equipo): si el cliente cierra la ventana o pierde el historial, este
// correo es lo único que le permite volver a encontrar la conversación. Por
// eso nunca debe tumbar la creación de la cotización si falla — la fila en
// la base ya existe, el email es un extra, no un requisito.
export async function sendQuoteTrackingEmail({ to, clientName, artistName, accessToken }) {
  const trackingUrl = buildTrackingUrl(accessToken);

  if (!transporter) {
    console.log(
      `[email] GMAIL_USER/GMAIL_APP_PASSWORD no configurados. Link de seguimiento para ${to}: ${trackingUrl}`,
    );
    return;
  }

  try {
    await transporter.sendMail({
      from: `MUSYNC <${GMAIL_USER}>`,
      to,
      subject: `Tu solicitud a ${artistName} en MUSYNC`,
      html: `
        <p>Hola ${clientName},</p>
        <p>Tu solicitud a <strong>${artistName}</strong> se envió correctamente.</p>
        <p>Podés seguir la conversación y ver las respuestas en este link:</p>
        <p><a href="${trackingUrl}">${trackingUrl}</a></p>
        <p>Guardá este correo — es la forma de volver a esta conversación si cerrás la ventana.</p>
      `,
    });
  } catch (error) {
    console.error('[email] Error al enviar el email de seguimiento:', error);
  }
}
