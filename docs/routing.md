# Routing, layouts, and views

- [Routing, layouts, and views](#routing-layouts-and-views)
  - [Overview](#overview)
  - [Layouts](#layouts)
  - [Module Routes](#module-routes)

## Overview

This project uses [Vue Router](tech.md#vue-router), which we initialize in `src/router/index.ts`, with routes defined in `src/router/routes.ts`.

## Layouts

We only have one layout that is placed in `src/layouts/MainLayout.vue` file. This layout will be the root path and all other path will be the children of this path. There is an execption for the login page that is using it's own layout.

## Module Routes

We define all module routes in the file `src/app/constants/submoduleList.constant.ts`. Then there's already a function that will generate those module name into a route path.
