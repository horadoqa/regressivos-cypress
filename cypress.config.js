const { defineConfig } = require('cypress');
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://horadoqa.com.br', // ou 'http://localhost:3000' se rodar local
    setupNodeEvents(on, config) {
      // Ativa o Allure e define o diretório de resultados
      allureWriter(on, config, { resultsDir: './allure-results' });
      return config;
    },
    supportFile: 'cypress/support/e2e.js',
  },
});
