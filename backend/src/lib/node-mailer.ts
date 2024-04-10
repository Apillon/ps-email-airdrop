import * as nodemailer from 'nodemailer';
import { env } from '../config/env';
import { Options, MailOptions } from 'nodemailer/lib/smtp-transport';
import { MailTemplates } from '../templates/mail-templates';
import { writeLog, LogType } from './logger';
import { Attachment } from 'nodemailer/lib/mailer';
import * as path from 'path';

/**
 * Send email via SMTP server
 *
 * @export
 * @param mail mail options
 * @returns promise of a boolean
 */
export async function SmtpSend(mail: MailOptions): Promise<boolean> {
  const transportOptions: Options & { pool: boolean } = {
    pool: true,
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USERNAME,
      pass: env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  };

  const transporter = nodemailer.createTransport(transportOptions);

  try {
    const res = await transporter.sendMail(mail);

    if (res.accepted && res.accepted.length) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    writeLog(
      LogType.ERROR,
      'Error while sending email',
      'lib/node-mailer',
      'SmtpSend request',
      err,
    );
  }
}

/**
 * Send email via SMTP server with template
 *
 * @export
 * @param mailAddresses email recipients (string array)
 * @param subject email subject
 * @param templateName name of the template
 * @param templateData template data that is an object
 * @param [senderName] optional name of sender
 * @returns promise of a boolean
 */
export async function SmtpSendTemplate(
  mailAddresses: string[],
  subject: string,
  templateName: string,
  templateData: object,
  senderName?: string,
  senderEmail?: string,
): Promise<boolean> {
  let templName = templateName;

  let template = MailTemplates.getTemplate(templName);

  if (!template && !templName.startsWith('en-')) {
    writeLog(
      LogType.INFO,
      `Template not found: ${templName}! Retrying with 'en-' prefix.`,
      'lib/smtp-sender',
      'SmtpSendTemplate request',
    );
    const altName = templName.split('-');
    altName[0] = 'en';
    templName = altName.join('-');
    template = MailTemplates.getTemplate(templName);
  }

  if (!template) {
    writeLog(
      LogType.ERROR,
      `Template not found: ${templName}!`,
      'lib/smtp-sender',
      'SmtpSendTemplate request',
    );
    return false;
  }

  writeLog(
    LogType.INFO,
    `Sending email (subject: "${subject}") from "${
      senderName ? senderName : env.SMTP_NAME_FROM
    } <${
      senderEmail ? senderEmail : env.SMTP_EMAIL_FROM
    }>" to "${mailAddresses.join(';')}"`,
    'node-mailer.ts',
    'SmtpSendTemplate',
  );
  const mail = {
    from: `${senderName ? senderName : env.SMTP_NAME_FROM} <${
      senderEmail ? senderEmail : env.SMTP_EMAIL_FROM
    }>`,
    to: mailAddresses.join(';'),
    subject: subject,
    html: template(templateData),
    // attachments: [
    //   {
    //     filename: "logo.png",
    //     // path: `${path.dirname(process.mainModule.filename)}/files/logo.png`,
    //     path: `${__dirname}/files/logo.png`,
    //     cid: "logo.png",
    //   },
    // ],
  };

  const transporter = nodemailer.createTransport({
    pool: true,
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USERNAME,
      pass: env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    const res = await transporter.sendMail(mail);

    if (res.accepted && res.accepted.length) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    writeLog(
      LogType.ERROR,
      `error: ${err}`,
      'lib/smtp-sender',
      'SmtpSendTemplate request',
    );
  }
}

/**
 * Send email via SMTP server with template and attachments
 *
 */
export async function SmtpSendTemplateWithAttachments(
  mailAddresses: string[],
  subject: string,
  templateName: string,
  templateData: object,
  attachments: Attachment[],
  senderName?: string,
  senderEmail?: string,
): Promise<boolean> {
  const template = MailTemplates.getTemplate(templateName);

  if (!template) {
    writeLog(
      LogType.ERROR,
      `Template not found: ${templateName}!`,
      'lib/smtp-sender',
      'SmtpSendTemplate request',
    );
    return false;
  }

  attachments.push({
    filename: 'logo.png',
    path: `${path.dirname(process.mainModule.filename)}/files/logo.png`,
    cid: 'logo.png',
  });

  const mail = {
    from: `${senderName ? senderName : env.SMTP_NAME_FROM} <${
      senderEmail ? senderEmail : env.SMTP_EMAIL_FROM
    }>`,
    to: mailAddresses.join(';'),
    subject: subject,
    html: template(templateData),
    attachments: attachments,
  };

  // tslint:disable-next-line: no-object-literal-type-assertion
  const transporter = nodemailer.createTransport({
    pool: true,
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USERNAME,
      pass: env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  } as Options);

  try {
    const res = await transporter.sendMail(mail);

    if (res.accepted && res.accepted.length) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    writeLog(
      LogType.ERROR,
      `error: ${err}`,
      'lib/smtp-sender',
      'SmtpSendTemplate request',
    );
  }
}

/**
 * Verify connection with SMTP server
 *
 * @export
 * @returns promise of a boolean
 */
export async function SMTPverify(): Promise<boolean> {
  const transporter = nodemailer.createTransport({
    pool: true,
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USERNAME,
      pass: env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    await transporter.verify();
  } catch (err) {
    writeLog(
      LogType.ERROR,
      'SMTP mailer error',
      'lib/smtp-sender',
      'SMTPverify',
      err,
    );
    return false;
  }

  return true;
}
