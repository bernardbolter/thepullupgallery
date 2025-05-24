# The Pull Up Gallery

A modern, internationalized Next.js website with support for multiple languages.

## Features

- 🌐 Internationalization (i18n) with next-intl
- 🎨 Responsive design with Tailwind CSS
- 🎨 Custom styling with SASS and BEM methodology
- 🔄 Language switching between multiple languages
- ⚡ Optimized for performance and SEO

## Supported Languages

- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Dutch (nl)

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn
```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
# or
yarn build
```

### Running Tests

```bash
npm run test
# or
yarn test
```

## Project Structure

```
src/
├── app/
│   ├── [locale]/           # Locale-specific routes
│   │   ├── layout.tsx      # Layout for locale-specific pages
│   │   └── page.tsx        # Home page
│   └── globals.scss        # Global styles
├── messages/               # Translation files
│   ├── en.json
│   ├── es.json
│   ├── fr.json
│   ├── de.json
│   └── nl.json
└── styles/                 # SASS modules
```

## Adding a New Language

1. Add the new locale to the `locales` array in `src/app/[locale]/i18n.ts`
2. Create a new JSON file in the `messages` directory (e.g., `it.json` for Italian)
3. Add translations for all keys used in the application

## Deployment

This project is ready to be deployed on Vercel, Netlify, or any other platform that supports Next.js applications.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
