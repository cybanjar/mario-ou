# Linting & formatting

- [Linting & formatting](#linting--formatting)
  - [**Setup**](#setup)
  - [**Pre-commit**](#pre-commit)
    - [Editor](#editor)
  - [**Configuration**](#configuration)

This project uses ESLint and Prettier to catch errors and avoid bikeshedding by enforcing a common code style.

## **Setup**

We recommend you to use VSCode for your editor but if you are already comfortable with a different one then please continue to use that.
If you do use VSCode there is a folder `.vscode` with relevant settings and recommended extensions. But please note we are using `prettier` and make sure you don't have any extensions that will cause conflicts.

## **Pre-commit**

<!-- TODO: WIP -->
Staged files are automatically linted and tested before each commit. See `lint-staged.config.ts` to update.

### Editor

In supported editors, all files will be linted and formatted on-save. See [editors.md](editors.md) for details.

## **Configuration**

This boilerplate ships with opinionated defaults, but you can edit each tools configuration in the following config files:

- [ESLint](https://eslint.org/docs/user-guide/configuring)
  - `.eslintrc.js`
- [Prettier](https://prettier.io/docs/en/configuration.html)
  - `.prettierrc.js`
