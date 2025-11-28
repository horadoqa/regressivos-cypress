## Testes regressivos com Cypress

Aqui vai um guia **claro e completo** para rodar **testes regressivos com Cypress em uma pipeline** (CI/CD) — com boas práticas, paralelização e exemplos para GitHub Actions, GitLab CI e Azure DevOps.

---

# ✅ **1. Estrutura recomendada para testes regressivos**

Normalmente você separa seus testes Cypress em pastas por tipo:

```
cypress/
 └── e2e/
      ├── smoke/
      ├── regression/
      └── integration/
```

E roda regressivos com:

```
cypress run --spec "cypress/e2e/regression/**/*.cy.js"
```

Ou usando tags:

```
npx cypress run --env grepTags="regression"
```

*(Com plugin `cypress-grep`.)*

---

# ✅ **2. Cypress em pipeline — requisitos**

Você precisa:

* Node.js ≥ 16
* `npm ci` (instalação limpa)
* Cypress instalado localmente (`npm install cypress --save-dev`)
* **Iniciar a aplicação** antes dos testes (se necessário)
* *Artifact upload* (screenshots, vídeos e reports)
* Variáveis sensíveis em secrets do pipeline (API keys, tokens, etc.)

---

# ✅ **3. Exemplo completo — GitHub Actions**

`.github/workflows/cypress.yml`

```yaml
name: Cypress Regression Tests

on:
  push:
    branches: [ "main" ]
  pull_request:

jobs:
  regression:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install Dependencies
        run: npm ci

      - name: Start Application
        run: npm start &
      
      - name: Wait for app
        run: npx wait-on http://localhost:3000

      - name: Run Regression Tests
        run: npx cypress run --spec "cypress/e2e/regression/**/*.cy.js"

      - name: Upload Cypress Artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: cypress-results
          path: cypress/results
```

---

# ✅ **4. Exemplo — GitLab CI**

`.gitlab-ci.yml`

```yaml
stages:
  - test

cypress_regression:
  stage: test
  image: cypress/base:latest
  script:
    - npm ci
    - npm start &
    - npx wait-on http://localhost:3000
    - npx cypress run --spec "cypress/e2e/regression/**/*.cy.js"
  artifacts:
    when: always
    paths:
      - cypress/videos
      - cypress/screenshots
```

---

# ✅ **5. Exemplo — Azure DevOps**

`azure-pipelines.yml`

```yaml
trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
- checkout: self

- task: NodeTool@0
  inputs:
    versionSpec: '18.x'

- script: npm ci

- script: |
    npm start &
    npx wait-on http://localhost:3000
    npx cypress run --spec "cypress/e2e/regression/**/*.cy.js"
  displayName: "Run Cypress Regression Tests"

- task: PublishBuildArtifacts@1
  inputs:
    pathtoPublish: 'cypress'
    artifactName: 'cypress-artifacts'
```

---

# 🚀 **6. Paralelização e Otimização**

Se você tem muitos testes, ative o **Dashboard do Cypress** (plano gratuito já ajuda):

```
npx cypress run --record --key $CYPRESS_KEY --parallel
```

Benefícios:

* divide os testes em várias máquinas
* reduz o tempo total de execução
* histórico e insights de flakiness
* retries configurados no dashboard

---

# 🔧 **7. Melhores práticas para testes regressivos**

✔ Rodar regressivos **em PRs grandes** e **commits na main**
✔ Usar **smoke tests** para validar builds mais rápidos
✔ Mockar APIs instáveis
✔ Criar **retry automático** via Cypress:

```js
"retries": {
  "runMode": 2,
  "openMode": 1
}
```

✔ Ter ambiente dedicado para regressão (ex: `staging`)

---

# 📌 Se quiser, posso gerar:

✅ O pipeline completo para a sua stack (GitHub, GitLab, Azure, Bitbucket, Jenkins etc.)
✅ Um modelo de estrutura de testes regressivos
✅ Uma pipeline com paralelização e reports em HTML (Allure / Mochawesome)

---

