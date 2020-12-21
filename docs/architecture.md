# Architecture

- [Architecture](#architecture)
  - [`.vscode`](#vscode)
  - [`docs`](#docs)
  - [`public`](#public)
    - [`index.html`](#indexhtml)
  - [`src`](#src)
    - [`api`](#api)
    - [`app`](#app)
    - [`assets`](#assets)
    - [`boot`](#boot)
    - [`css`](#css)
    - [`router`](#router)
    - [`store`](#store)
    - [`utils`](#utils)
    - [`App.vue`](#appvue)

## `.vscode`

Settings and extensions specific to this project, for Visual Studio Code. See [the editors doc](editors.md#visual-studio-code) for more.

## `docs`

You found me! :wink:

## `public`

Where you'll keep any static assets, to be added to the `dist` directory without processing from our build system.

### `index.html`

This one file actually _does_ get processed by our build system, allowing us to inject some information from Webpack with [EJS](http://ejs.co/), such as the title, then add our JS and CSS.

## `src`

Where we keep all our source files.

### `api`

Where we keep all files that related to API calls. See [the API doc](api.md) for more details.

### `app`

Where we will work most of the time. All components should be placed here. See [the App doc](app.md) for more details.

### `assets`

This project manages assets via Vue CLI. Learn more about [its asset handling here](https://cli.vuejs.org/guide/html-and-static-assets.html).

### `boot`

Files that are needed when the app starts. Learn more about [quasar boot](https://quasar.dev/quasar-cli/boot-files).

### `css`

Where we keep our [design variables and tooling](tech.md#css-variables-and-tooling).

### `router`

Where the router, routes, and any routing-related components live. See [the routing doc](routing.md) for more details.

### `store`

Where all our global state management lives. See [the store management doc](store.md) for more details.

### `utils`

These are utility functions you may want to share between many files in your application. They will always be pure and never have side effects, meaning if you provide a function the same arguments, it will always return the same result. These should also never directly affect the DOM or interface with our Vuex state.

### `App.vue`

The root Vue component that simply delegates to the router view. This is typically the only component to contain global CSS.
