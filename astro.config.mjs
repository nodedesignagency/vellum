// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

export default defineConfig({
  site: 'https://vellum.studio',
  // Pages are prerendered to static HTML. Only /keystatic (the editing screen) and
  // /api/* run on demand as Vercel functions.
  adapter: vercel(),
  // React is only used by the Keystatic editing screen; the public pages ship no framework.
  integrations: [react(), keystatic()],
  build: { inlineStylesheets: 'always' },
  env: {
    schema: {
      // Set these in Vercel once the studio inbox is ready. Without them the form says it is not connected yet.
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      ENQUIRY_TO: envField.string({ context: 'server', access: 'secret', optional: true }),
      ENQUIRY_FROM: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
