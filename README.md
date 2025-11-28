## Testes regressivos com Cypress

Uma **pipeline completa**, com:

✓ Cypress
✓ Paralelização
✓ Relatórios HTML **Allure**
✓ Exemplo para **GitHub Actions** *(Esse processo pode ser realizado também no GitLab/Bitbucket/Azure/Jenkins)*

---

# 🚀 **1. Estrutura recomendada do projeto**

```
cypress/
  e2e/
  reports/
    allure-results/
    allure-report/
```

### Instalaar o Cypress

```shell
npm install -D cypress
```

### Instalar Allure + Cypress plugin:

```shell
npm install -D @shelex/cypress-allure-plugin allure-commandline
```

Adicionar no `cypress/support/e2e.js`:

```js
import '@shelex/cypress-allure-plugin';
```

E no `cypress.config.js`:

```js
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      allureWriter(on, config);
      return config;
    }
  }
};
```

---

# 🚀 **2. Pipeline GitHub Actions com paralelização + Allure**

📌 *Executa Cypress em paralelo, gera artefatos, consolida Allure e publica HTML.*

Crie `.github/workflows/cypress-regression.yml`:

```yaml
name: Cypress Regression with Parallel + Allure

on:
  push:
    branches: [ "main" ]
  pull_request:

jobs:
  cypress-tests:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        containers: [1, 2, 3]   # 3 execuções em paralelo

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

        # Node
      - name: Use Node
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

        # Start app for tests
      - name: Start app
        run: npm start &
      
      - name: Wait for app
        run: npx wait-on http://localhost:3000

      - name: Run Cypress in parallel
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
        run: |
          npx cypress run \
            --record \
            --parallel \
            --ci-build-id $GITHUB_RUN_ID \
            --group container-${{ matrix.containers }}

      - name: Upload allure-results from each container
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: allure-results-${{ matrix.containers }}
          path: cypress/reports/allure-results
```

---

# 🚀 **3. Job final para unir os resultados e gerar o HTML do Allure**

Crie o *job aggregator*:

```yaml
  allure-report:
    runs-on: ubuntu-latest
    needs: cypress-tests

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Download all allure-results
        uses: actions/download-artifact@v4
        with:
          path: allure-results

      - name: Merge results
        run: |
          mkdir -p cypress/reports/allure-results
          cp -r allure-results/*/* cypress/reports/allure-results/

      - name: Generate Allure HTML report
        run: |
          npx allure generate cypress/reports/allure-results --clean
          npx allure open --port 9999 &

      - name: Upload Allure HTML report as artifact
        uses: actions/upload-artifact@v4
        with:
          name: allure-html-report
          path: allure-report
```

---

# 📌 **Como isso funciona**

### ⚡ Paralelização

A matriz `strategy.matrix.containers` cria 3 jobs paralelos:

```
1 → corre 1/3 dos testes  
2 → corre 1/3 dos testes  
3 → corre 1/3 dos testes  
```

Com o Cypress Dashboard (`--record --parallel`), eles se distribuem automaticamente.

---

# 📊 **Relatórios Allure**

Cada container gera:

```
cypress/reports/allure-results
```

No final:

1. Todos os resultados são baixados
2. São consolidados em uma única pasta
3. O Allure gera o HTML final
4. O HTML é disponibilizado como artefato

---

# 🧪 Publicar automaticamente no GitHub Pages

Abaixo está a **configuração completa** para publicar automaticamente o **relatório HTML do Allure no GitHub Pages**, diretamente da sua pipeline do GitHub Actions.
Funciona com o workflow que você já está usando (Cypress + Allure + paralelização).

---

# ✅ **1. Ativar GitHub Pages no repositório**

Vá em:

**Settings → Pages**

Configure:

* **Source:** `GitHub Actions`

Só isso — nenhuma branch específica.

---

# ✅ **2. Adicionar job final no workflow para publicar o Allure HTML**

No seu workflow, adicione **este job** depois do job `allure-report`:

```yaml
  publish-pages:
    runs-on: ubuntu-latest
    needs: allure-report
    permissions:
      pages: write
      id-token: write

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Download Allure HTML final
        uses: actions/download-artifact@v4
        with:
          name: allure-html-report
          path: ./public

      - name: Upload to GitHub Pages
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy-pages:
    needs: publish-pages
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

# 📌 **Como funciona**

### ✔ 1. `allure-report` job

Gera e faz upload do Allure HTML em um artifact chamado **allure-html-report**.

### ✔ 2. `publish-pages` job

Baixa esse artifact e manda para GitHub Pages via:

```
actions/upload-pages-artifact@v3
```

### ✔ 3. `deploy-pages` job

Publica automaticamente no GitHub Pages.

---

# 🎁 Extra: Renomeando o título do relatório

Se quiser personalizar o título do Allure publicado, adicione:

```sh
echo '{"reportName": "Cypress Regression Report"}' > cypress/reports/allure-results/environment.properties
```

---

# 🎉 Pronto!

Assim que a pipeline rodar, o GitHub Pages irá publicar automaticamente o relatório Allure HTML.

---

# 📍 **Acessando o relatório**

Depois do primeiro deploy, o GitHub vai fornecer uma URL como:

```
https://<seu-usuario>.github.io/<seu-repo>/
```

---

❓ Dúvidas ???
