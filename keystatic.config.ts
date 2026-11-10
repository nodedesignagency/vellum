// The editing screen for the studio, at /keystatic.
// Locally it edits the files in this folder; on the live site it saves to GitHub and Vercel rebuilds.
import { config, collection, singleton, fields } from '@keystatic/core';

export const SECTORS = ['Hospitality', 'Residential', 'Cultural', 'Workplace', 'Retail', 'Landscape'] as const;

const sectorOptions = SECTORS.map((s) => ({ label: s, value: s }));

export default config({
  // Live site: saves go to GitHub, Vercel rebuilds. Locally: edits these files directly.
  // PUBLIC_KEYSTATIC_STORAGE=github npm run dev runs the one-time GitHub setup locally (see README).
  storage:
    import.meta.env.PROD || import.meta.env.PUBLIC_KEYSTATIC_STORAGE === 'github'
      ? { kind: 'github', repo: 'nodedesignagency/vellum' }
      : { kind: 'local' },
  ui: {
    brand: { name: 'Vellum' },
    navigation: { Work: ['projects'], 'Home page': ['collaborators'] },
  },
  collections: {
    projects: collection({
      label: 'Projects',
      path: 'src/content/projects/*',
      format: { data: 'yaml' },
      slugField: 'title',
      columns: ['title', 'sector', 'year', 'order', 'hidden'],
      schema: {
        title: fields.slug({
          name: { label: 'Title', description: 'As it appears on the card and in the journal, e.g. Harbour Hotel lobby.' },
          slug: { label: 'Web address', description: 'Used in links to this project. Lower case, words joined by hyphens.' },
        }),
        hidden: fields.checkbox({
          label: 'Hidden',
          description: 'Tick to keep this project off the site without deleting it.',
          defaultValue: false,
        }),
        order: fields.integer({
          label: 'Order',
          description: 'Lower numbers show first, on the Home page and in the journal.',
          defaultValue: 10,
          validation: { isRequired: true },
        }),
        sector: fields.select({ label: 'Sector', options: sectorOptions, defaultValue: 'Hospitality' }),
        location: fields.text({
          label: 'Location',
          description: 'Short and specific, e.g. Coastal hotel, 120 keys.',
          validation: { length: { min: 1 } },
        }),
        // a text field, so the editor shows 2025 rather than 2,025
        year: fields.text({
          label: 'Year',
          description: 'Year of completion, e.g. 2025.',
          validation: { length: { min: 4, max: 4 }, pattern: { regex: /^(19|20)\d{2}$/, message: 'Four digits, e.g. 2025' } },
        }),
        summary: fields.text({
          label: 'Summary',
          description: 'Two or three short sentences for the journal. Real units, no superlatives, no em dashes.',
          multiline: true,
        }),
        cover: fields.image({
          label: 'Cover image',
          description: 'Shown on the Home page card. Upright (4:5) works best.',
          directory: 'src/assets/projects',
          publicPath: '../../assets/projects/',
          validation: { isRequired: true },
        }),
        coverAlt: fields.text({
          label: 'Cover image description',
          description: 'What the image shows, for people who cannot see it.',
          validation: { length: { min: 1 } },
        }),
        entries: fields.array(
          fields.object({
            kind: fields.select({
              label: 'Type',
              options: [
                { label: 'Drawing', value: 'drawing' },
                { label: 'Installation photo', value: 'installation' },
              ],
              defaultValue: 'drawing',
            }),
            image: fields.image({
              label: 'Image',
              directory: 'src/assets/projects',
              publicPath: '../../assets/projects/',
              validation: { isRequired: true },
            }),
            alt: fields.text({
              label: 'Image description',
              description: 'What the image shows, for people who cannot see it.',
              validation: { length: { min: 1 } },
            }),
            caption: fields.text({
              label: 'Caption',
              description: 'Label style: fitting reference, colour temperature, dim level. e.g. G01 linear graze · 2700K · 40%',
            }),
            hidden: fields.checkbox({ label: 'Hide this image', defaultValue: false }),
          }),
          {
            label: 'Journal images',
            description: 'Drawings first, then installation photos. Drag to reorder.',
            itemLabel: (props) => {
              const kind = props.fields.kind.value === 'drawing' ? 'Drawing' : 'Photo';
              const text = props.fields.caption.value || props.fields.alt.value || 'No caption yet';
              return `${props.fields.hidden.value ? '(Hidden) ' : ''}${kind}: ${text}`;
            },
          },
        ),
      },
    }),
  },
  singletons: {
    collaborators: singleton({
      label: 'Collaborators',
      path: 'src/content/collaborators',
      format: { data: 'yaml' },
      schema: {
        logos: fields.array(
          fields.object({
            name: fields.text({ label: 'Name', validation: { length: { min: 1 } } }),
            logo: fields.image({
              label: 'Logo',
              description: 'SVG or PNG, shown in grey. Leave empty to show the name as text instead.',
              directory: 'src/assets/collaborators',
              publicPath: '../assets/collaborators/',
            }),
            hidden: fields.checkbox({ label: 'Hide from the ticker', defaultValue: false }),
          }),
          {
            label: 'Logo ticker',
            description: 'The order here is the order on the page. Drag to reorder.',
            itemLabel: (props) => `${props.fields.hidden.value ? '(Hidden) ' : ''}${props.fields.name.value || 'New collaborator'}`,
          },
        ),
      },
    }),
  },
});
