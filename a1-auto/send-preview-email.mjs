#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const CALENDLY_URL =
  'https://calendly.com/qqwebsitesolutions/qq-solutions-consultation';
const SITE_URL = 'https://www.a1auto.ca';
const QQ_SITE_URL = 'https://www.qqwebsitesolutions.com/';
const BOOKING_URL = `${QQ_SITE_URL}book/`;
const EMAIL_ASSET_BASE_URL = `${QQ_SITE_URL}images/email/a1-auto/`;
const DEFAULT_FROM = 'QQ Solutions <hello@qqwebsitesolutions.com>';
const DEFAULT_SUBJECT = 'Website Concepts for A1 Auto';
const DEFAULT_SENDER_NAME = 'Julian';
const BRAND_LOGO = {
  id: 'qq-logo-white',
  filename: 'QQ-logo-transparent.png',
  file: '../images/QQ logo transparent.png',
  alt: 'QQ Solutions logo',
  contentType: 'image/png',
  remoteUrl: `${QQ_SITE_URL}images/QQ%20logo%20transparent.png`,
};
const COMPARISON_BOARD = {
  id: 'a1-comparison-board',
  filename: 'a1-auto-three-way-comparison.png',
  file: 'comparison/a1-auto-three-way-comparison.png',
  alt: 'A1 Auto current website compared with two QQ redesign concepts',
  contentType: 'image/png',
  remoteUrl: `${EMAIL_ASSET_BASE_URL}a1-auto-three-way-comparison.png`,
};

const TEMPLATE_SECTIONS = [
  {
    title: 'Template One',
    label: 'Bold / Performance-Focused',
    description:
      'A darker, more aggressive direction with strong contrast, clear trust cues, and a modern shop feel.',
    images: [
      {
        id: 'template-one-hero',
        filename: 'template-one-hero.jpeg',
        file: 'email-assets/template-one-hero.jpeg',
        alt: 'Template one hero section',
        caption: 'Hero section',
        contentType: 'image/jpeg',
        remoteUrl: `${EMAIL_ASSET_BASE_URL}template-one-hero.jpeg`,
      },
      {
        id: 'template-one-services',
        filename: 'template-one-services.jpeg',
        file: 'email-assets/template-one-services.jpeg',
        alt: 'Template one services section',
        caption: 'Services and trust section',
        contentType: 'image/jpeg',
        remoteUrl: `${EMAIL_ASSET_BASE_URL}template-one-services.jpeg`,
      },
      {
        id: 'template-one-process-results',
        filename: 'template-one-process-results.jpeg',
        file: 'email-assets/template-one-process-results.jpeg',
        alt: 'Template one process and results section',
        caption: 'Process and results section',
        contentType: 'image/jpeg',
        remoteUrl: `${EMAIL_ASSET_BASE_URL}template-one-process-results.jpeg`,
      },
    ],
  },
  {
    title: 'Template Two',
    label: 'Premium / Editorial',
    description:
      'A cleaner, more refined direction with premium spacing, stronger storytelling, and a more upscale presentation.',
    images: [
      {
        id: 'template-two-hero',
        filename: 'template-two-hero.jpeg',
        file: 'email-assets/template-two-hero.jpeg',
        alt: 'Template two hero section',
        caption: 'Hero section',
        contentType: 'image/jpeg',
        remoteUrl: `${EMAIL_ASSET_BASE_URL}template-two-hero.jpeg`,
      },
      {
        id: 'template-two-services',
        filename: 'template-two-services.jpeg',
        file: 'email-assets/template-two-services.jpeg',
        alt: 'Template two services section',
        caption: 'Services section',
        contentType: 'image/jpeg',
        remoteUrl: `${EMAIL_ASSET_BASE_URL}template-two-services.jpeg`,
      },
      {
        id: 'template-two-process',
        filename: 'template-two-process.jpeg',
        file: 'email-assets/template-two-process.jpeg',
        alt: 'Template two process section',
        caption: 'Process section',
        contentType: 'image/jpeg',
        remoteUrl: `${EMAIL_ASSET_BASE_URL}template-two-process.jpeg`,
      },
    ],
  },
];

function parseArgs(argv) {
  const options = {
    dashboardPreview: false,
    dryRun: false,
    help: false,
    saveHtml: '',
    to: '',
    name: 'Carlton',
    subject: DEFAULT_SUBJECT,
    from: DEFAULT_FROM,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (value === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (value === '--dashboard-preview') {
      options.dashboardPreview = true;
      continue;
    }

    if (value === '--help' || value === '-h') {
      options.help = true;
      continue;
    }

    if (value === '--to') {
      options.to = argv[index + 1] || '';
      index += 1;
      continue;
    }

    if (value === '--name') {
      options.name = argv[index + 1] || options.name;
      index += 1;
      continue;
    }

    if (value === '--subject') {
      options.subject = argv[index + 1] || options.subject;
      index += 1;
      continue;
    }

    if (value === '--from') {
      options.from = argv[index + 1] || options.from;
      index += 1;
      continue;
    }

    if (value === '--save-html') {
      options.saveHtml = argv[index + 1] || '';
      index += 1;
      continue;
    }
  }

  return options;
}

function usage() {
  console.log(`Usage:
  node a1-auto/send-preview-email.mjs --to carlton@example.com

Options:
  --to EMAIL        Recipient email address
  --name NAME       Recipient first name (default: Carlton)
  --subject TEXT    Email subject line
  --from TEXT       Sender value for Resend
  --dashboard-preview Send a review-only version with inline data-URI images
  --dry-run         Build the payload without sending
  --save-html PATH  Save a browser-previewable HTML file
  --help            Show this message
`);
}

function loadImages() {
  return TEMPLATE_SECTIONS.map((section) => ({
    ...section,
    images: section.images.map((image) => {
      const fullPath = path.join(SCRIPT_DIR, image.file);
      const buffer = fs.readFileSync(fullPath);

      return {
        ...image,
        fullPath,
        base64: buffer.toString('base64'),
      };
    }),
  }));
}

function loadBrandLogo() {
  const fullPath = path.join(SCRIPT_DIR, BRAND_LOGO.file);
  const buffer = fs.readFileSync(fullPath);

  return {
    ...BRAND_LOGO,
    fullPath,
    base64: buffer.toString('base64'),
  };
}

function loadComparisonBoard() {
  const fullPath = path.join(SCRIPT_DIR, COMPARISON_BOARD.file);
  const buffer = fs.readFileSync(fullPath);

  return {
    ...COMPARISON_BOARD,
    fullPath,
    base64: buffer.toString('base64'),
  };
}

function imageSource(image, mode) {
  if (mode === 'dataUri') {
    return `data:${image.contentType};base64,${image.base64}`;
  }

  if (mode === 'hosted') {
    return image.remoteUrl;
  }

  return `cid:${image.id}`;
}

function buildHtml({ recipientName, sections, logo, comparisonBoard, mode }) {
  const sectionMarkup = sections
    .map(
      (section) => `
        <tr>
          <td style="padding: 0 32px 0;">
            <div style="border: 1px solid #e5e7eb; border-radius: 18px; padding: 24px; margin-top: 24px; background: #ffffff;">
              <p style="margin: 0 0 8px; color: #d42723; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">
                ${section.title}
              </p>
              <h2 style="margin: 0 0 8px; color: #111827; font-size: 24px; line-height: 1.3;">
                ${section.label}
              </h2>
              <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.7;">
                ${section.description}
              </p>
              ${section.images
                .map(
                  (image) => `
                    <div style="margin-top: 18px;">
                      <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">
                        ${image.caption}
                      </p>
                      <img
                        src="${imageSource(image, mode)}"
                        alt="${image.alt}"
                        width="576"
                        style="display: block; width: 100%; max-width: 576px; border-radius: 14px; border: 1px solid #e5e7eb;"
                      >
                    </div>
                  `,
                )
                .join('')}
            </div>
          </td>
        </tr>
      `,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${DEFAULT_SUBJECT}</title>
  </head>
  <body style="margin: 0; padding: 0; background: #f3f4f6; font-family: Arial, Helvetica, sans-serif; color: #111827;">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
      Website concepts for A1 Auto, including a live site comparison and booking link.
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #f3f4f6;">
      <tr>
        <td align="center" style="padding: 32px 16px;">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="width: 100%; max-width: 640px; background: #ffffff; border-radius: 24px; overflow: hidden;">
            <tr>
              <td style="padding: 36px 32px 16px; background: #111827;">
                <img
                  src="${imageSource(logo, mode)}"
                  alt="${logo.alt}"
                  width="120"
                  style="display: block; width: 120px; height: auto;"
                >
                <p style="margin: 12px 0 0; color: #f9fafb; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase;">
                  QQ Solutions
                </p>
                <p style="margin: 6px 0 0; color: rgba(249,250,251,0.72); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;">
                  Web Design Agency
                </p>
                <h1 style="margin: 10px 0 0; color: #ffffff; font-size: 30px; line-height: 1.2;">
                  Website Concepts for A1 Auto
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding: 28px 32px 0;">
                <p style="margin: 0 0 16px; color: #111827; font-size: 16px; line-height: 1.7;">
                  Hi ${recipientName},
                </p>
                <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.7;">
                  Rafae mentioned he had the chance to speak with you at Walmart, so I wanted to personally follow up and share the website concepts we prepared for A1 Auto after reviewing
                  <span style="color: #d42723;">www.A1Auto.ca</span>.
                </p>
                <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.7;">
                  We created a comparison that places your current site beside two distinct redesign directions so you can clearly see how A1 Auto could be presented with a more refined, modern, and credible online presence.
                </p>
                <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.7;">
                  Rather than limiting this to a single mockup, we explored two different visual directions. We also included supporting screens from each concept so you can see how the design language carries beyond the homepage and across the rest of the site.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px 32px 0;">
                <div style="border: 1px solid #e5e7eb; border-radius: 18px; padding: 18px; background: #ffffff;">
                  <p style="margin: 0 0 10px; color: #6b7280; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
                    Current Website vs. Two QQ Concepts
                  </p>
                  <img
                    src="${imageSource(comparisonBoard, mode)}"
                    alt="${comparisonBoard.alt}"
                    width="576"
                    style="display: block; width: 100%; max-width: 576px; border-radius: 14px; border: 1px solid #e5e7eb;"
                  >
                </div>
              </td>
            </tr>
            ${sectionMarkup}
            <tr>
              <td style="padding: 28px 32px 0;">
                <div style="border-radius: 18px; background: #f9fafb; padding: 24px;">
                  <p style="margin: 0 0 14px; color: #111827; font-size: 16px; line-height: 1.7;">
                    If one direction feels especially aligned with how you want A1 Auto to be represented, we would be happy to refine it further around your services, positioning, and customer experience. If you'd like to go through the concepts together, you can book a quick walkthrough here:
                  </p>
                  <a href="${BOOKING_URL}" style="display: inline-block; padding: 14px 22px; background: #d42723; color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 10px;">
                    Book Here
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 28px 32px 36px;">
                <p style="margin: 0 0 12px; color: #374151; font-size: 16px; line-height: 1.7;">
                  Looking forward to hearing what you think.
                </p>
                <p style="margin: 0; color: #111827; font-size: 16px; line-height: 1.7;">
                  Best regards,<br>
                  ${DEFAULT_SENDER_NAME}<br>
                  QQ Solutions<br>
                  <a href="mailto:hello@qqwebsitesolutions.com" style="color: #111827; text-decoration: none;">hello@qqwebsitesolutions.com</a><br>
                  <a href="${QQ_SITE_URL}" style="color: #111827; text-decoration: none;">qqwebsitesolutions.com</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildText({ recipientName, sections }) {
  const sectionText = sections
    .map(
      (section) =>
        `${section.title} - ${section.label}\n${section.description}\nScreens included: ${section.images
          .map((image) => image.caption)
          .join(', ')}\n`,
    )
    .join('\n');

  return `Hi ${recipientName},

Rafae mentioned he had the chance to speak with you at Walmart, so I wanted to personally follow up and share the website concepts we prepared for A1 Auto after reviewing www.A1Auto.ca.

We created a comparison that places your current site beside two distinct redesign directions so you can clearly see how A1 Auto could be presented with a more refined, modern, and credible online presence.

Rather than limiting this to a single mockup, we explored two different visual directions. We also included supporting screens from each concept so you can see how the design language carries beyond the homepage and across the rest of the site.

${sectionText}
If one direction feels especially aligned with how you want A1 Auto to be represented, we would be happy to refine it further around your services, positioning, and customer experience. You can book a quick walkthrough here:
${BOOKING_URL}

Looking forward to hearing what you think.

Best regards,
${DEFAULT_SENDER_NAME}
QQ Solutions
`;
}

async function sendEmail({ apiKey, payload }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `a1-auto-preview-${Date.now()}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || JSON.stringify(data));
  }

  return data;
}

const options = parseArgs(process.argv.slice(2));

if (options.help) {
  usage();
  process.exit(0);
}

const sections = loadImages();
const logo = loadBrandLogo();
const comparisonBoard = loadComparisonBoard();
const imageMode = options.dashboardPreview ? 'dataUri' : 'hosted';
const html = buildHtml({
  recipientName: options.name,
  sections,
  logo,
  comparisonBoard,
  mode: imageMode,
});
const text = buildText({
  recipientName: options.name,
  sections,
});
const attachments = [];

if (options.saveHtml) {
  const previewHtml = buildHtml({
    recipientName: options.name,
    sections,
    logo,
    comparisonBoard,
    mode: 'dataUri',
  });

  fs.writeFileSync(options.saveHtml, previewHtml);
}

const payload = {
  from: options.from,
  to: options.to ? [options.to] : [],
  subject: options.subject,
  html,
  text,
  attachments,
  tags: [
    {
      name: 'campaign',
      value: 'a1_auto_preview',
    },
  ],
};

if (options.dryRun) {
  console.log(
    JSON.stringify(
      {
        to: options.to || '(not set)',
        subject: options.subject,
        from: options.from,
        dashboardPreview: options.dashboardPreview,
        imageMode,
        savedHtml: options.saveHtml || '(not set)',
        attachmentCount: attachments.length,
        hostedAssets: [
          ...sections.flatMap((section) =>
            section.images.map((image) => ({
              filename: image.filename,
              localFile: image.fullPath,
              remoteUrl: image.remoteUrl,
            })),
          ),
          {
            filename: logo.filename,
            localFile: logo.fullPath,
            remoteUrl: logo.remoteUrl,
          },
          {
            filename: comparisonBoard.filename,
            localFile: comparisonBoard.fullPath,
            remoteUrl: comparisonBoard.remoteUrl,
          },
        ],
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

if (!options.to) {
  usage();
  console.error('Missing required --to recipient email.');
  process.exit(1);
}

if (!process.env.RESEND_API_KEY) {
  console.error('Missing RESEND_API_KEY in the environment.');
  process.exit(1);
}

try {
  const result = await sendEmail({
    apiKey: process.env.RESEND_API_KEY,
    payload,
  });

  console.log(`Sent email ${result.id} to ${options.to}`);
} catch (error) {
  console.error(`Resend send failed: ${error.message}`);
  process.exit(1);
}
