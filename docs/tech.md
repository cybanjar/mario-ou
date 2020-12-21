# Languages and technologies

- [Languages and technologies](#languages-and-technologies)
  - [Typescript](#typescript)
    - [Vue](#vue)
    - [Vue Router](#vue-router)
    - [Composition API](#composition-api)
    - [Vuex (state management)](#vuex-state-management)
  - [HTML](#html)
    - [Templates](#templates)
  - [CSS](#css)
    - [SCSS](#scss)
    - [Importing global modules](#importing-global-modules)
    - [Referencing aliased asset URLs](#referencing-aliased-asset-urls)
    - [Design variables and tooling](#design-variables-and-tooling)

## Typescript

We are using typescript for the benefit in the long run. You can read more about it [here](https://www.typescriptlang.org/docs/home.html).

### Vue

Since Vue is such a huge part of our app, I strongly recommend everyone read through at least the _Essentials_ of [Vue's guide](https://vuejs.org/v2/guide/).

### Vue Router

To understand how to manage pages with Vue Router, I recommend reading through the _Essentials_ of [those docs](https://router.vuejs.org/en/essentials/getting-started.html). Then you can read more about [routing in this application](routing.md).

### Composition API

We are using the [composition-api](https://github.com/vuejs/composition-api) to develop the app. But it doesn't mean you can't use the options-API. This approach is to align with the next major Vue v3 release in the feature so there would be minimal effort when we want to upgrade to that version.

### Vuex (state management)

To wrap your head around our state management, I recommend reading through [those docs](https://vuex.vuejs.org/guide), starting at _What is Vuex?_ and stopping before _Application Architecture_. Then skip down and read [_Form Handling_](https://vuex.vuejs.org/en/forms.html) and [_Testing_](https://vuex.vuejs.org/en/testing.html). Finally, read about [state management in this application](store.md).

## HTML

All HTML will exist within [`.vue` files](https://vuejs.org/v2/guide/single-file-components.html), either:

- in a `<template>`, or
- in a [`render` function](https://vuejs.org/v2/guide/render-function.html), optionally using [JSX](https://vuejs.org/v2/guide/render-function.html#JSX).

### [Templates](https://vuejs.org/v2/guide/syntax.html)

~95% of HTML will be in `.vue` files. Since Vue has a chance to parse it before the browser does, we can also do a few extra things that normally aren't possible in a browser.

For example, any element or component can be self-closing:

```html
<span class="fa fa-comment" />
```

The above simply compiles to:

```html
<span class="fa fa-comment"></span>
```

This feature is especially useful when writing components with long names, but no content:

```html
<FileUploader
  title="Upload any relevant legal documents"
  description="PDFs or scanned images are preferred"
  icon="folder-open"
/>
```

## CSS

For our styles, we're using SCSS, which you can activate by adding the `lang="scss"` to style tags in Vue components:

```vue
<style lang="scss" module>
/* Styles go here */
</style>
```

### SCSS

SCSS is a superset of CSS, meaning any valid CSS is _also_ valid SCSS. This allows you to easily copy properties from other sources, without having to reformat it. It also means you can stick to writing the CSS you're still comfortable with while you're learning to use more advanced SCSS features.

I specifically recommend reading about:

- [Variables](http://sass-lang.com/guide#topic-2)
- [Nesting](http://sass-lang.com/guide#topic-3)
- [Operators](http://sass-lang.com/guide#topic-8)

Just those features cover at least 95% of use cases.

### Importing global modules

To import files from `node_modules`, Webpack's [css-loader](https://github.com/webpack-contrib/css-loader) requires adding `~` to the beginning of a module name to denote that it's a global (not relative) file reference. For example:

```scss
@import '~nprogress/nprogress.css';
```

### Referencing aliased asset URLs

Similarly to importing global modules, referencing aliased assets in _non_-module CSS also requires the `~` at the beginning of the name. For example:

```scss
background: url('~@assets/images/background.png');
```

### Design variables and tooling

We are using the [quasar](https://quasar.dev) framework.
All our custom [variables](https://sass-lang.com/guide#topic-2), [placeholder classes](https://sass-lang.com/guide#topic-7), [mixins](https://sass-lang.com/guide#topic-6), and other design tooling are in the `src/css` folder.
