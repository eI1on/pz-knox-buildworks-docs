import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const repository = process.env.GITHUB_REPOSITORY;
const repositoryName = repository?.split('/')[1];
const githubOwner = process.env.GITHUB_REPOSITORY_OWNER;
const customSite = process.env.SITE;

const site = customSite || (githubOwner ? 'https://' + githubOwner + '.github.io' : undefined);
const base = process.env.BASE_URL ||
  (!customSite && repositoryName && !repositoryName.endsWith('.github.io')
    ? '/' + repositoryName
    : undefined);
const editLink = repository
  ? 'https://github.com/' + repository + '/edit/main/'
  : undefined;

export default defineConfig({
  site,
  base,
  integrations: [
    starlight({
      title: 'Knox Buildworks',
      description: 'Project Zomboid Build 42 building, planning, blueprints, and add-on authoring.',
      favicon: '/favicon.svg',
      logo: {
        dark: './src/assets/kbw-logo-dark.svg',
        light: './src/assets/kbw-logo-light.svg',
        alt: ''
      },
      customCss: ['./src/styles/custom.css'],
      components: {
        SocialIcons: './src/components/CommunityLinks.astro'
      },
      lastUpdated: true,
      editLink: editLink ? { baseUrl: editLink } : undefined,
      sidebar: [
        { slug: 'index' },
        {
          label: 'Players & server owners',
          items: [
            'guides/getting-started',
            'guides/interface-tour',
            'guides/catalogue',
            'guides/building-and-finishes',
            'guides/planning-mode',
            'guides/blueprints-and-access',
            'guides/server-configuration'
          ]
        },
        {
          label: 'Add-on authors',
          items: [
            'modders/quickstart',
            'modders/creating-buildables',
            'modders/definitions',
            'modders/json-only-buildables',
            'modders/requirements-and-tags',
            'modders/geometry-and-groups',
            'modders/finishes',
            'modders/entity-compatibility',
            'modders/extension-apis',
            'modders/translations-and-packaging',
            'modders/testing-and-release'
          ]
        },
        {
          label: 'Reference',
          items: [
            'reference/architecture',
            'reference/json-schema',
            'reference/definition-field-reference',
            'reference/validation-and-integrity',
            'reference/troubleshooting'
          ]
        }
      ]
    })
  ]
});
