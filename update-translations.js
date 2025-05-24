const fs = require('fs');
const path = require('path');

const translations = {
  es: {
    "Home": {
      "title": "Bienvenido a The Pull Up Gallery",
      "welcome": "Descubre nuestra increíble colección de barras de dominadas y equipos de fitness.",
      "switchLanguage": "Seleccionar idioma",
      "languages": {
        "en": "Inglés",
        "es": "Español",
        "fr": "Francés",
        "de": "Alemán",
        "nl": "Neerlandés"
      }
    }
  },
  fr: {
    "Home": {
      "title": "Bienvenue sur The Pull Up Gallery",
      "welcome": "Découvrez notre incroyable collection de barres de traction et d'équipements de fitness.",
      "switchLanguage": "Choisir la langue",
      "languages": {
        "en": "Anglais",
        "es": "Espagnol",
        "fr": "Français",
        "de": "Allemand",
        "nl": "Néerlandais"
      }
    }
  },
  de: {
    "Home": {
      "title": "Willkommen bei The Pull Up Gallery",
      "welcome": "Entdecken Sie unsere erstaunliche Sammlung von Klimmzugstangen und Fitnessgeräten.",
      "switchLanguage": "Sprache wählen",
      "languages": {
        "en": "Englisch",
        "es": "Spanisch",
        "fr": "Französisch",
        "de": "Deutsch",
        "nl": "Niederländisch"
      }
    }
  },
  nl: {
    "Home": {
      "title": "Welkom bij The Pull Up Gallery",
      "welcome": "Ontdek onze geweldige collectie optrekstangen en fitnessapparatuur.",
      "switchLanguage": "Taal selecteren",
      "languages": {
        "en": "Engels",
        "es": "Spaans",
        "fr": "Frans",
        "de": "Duits",
        "nl": "Nederlands"
      }
    }
  }
};

Object.entries(translations).forEach(([lang, data]) => {
  const filePath = path.join('src', 'messages', `${lang}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Updated ${filePath}`);
});

console.log('All translation files have been updated!');
