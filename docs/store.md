# State management

- [State management](#state-management)
  - [Modules](#modules)
  - [Pattern](#pattern)
    - [Boot](#boot)

## Modules

All of our state will be namespaced meaning all should be under a [namespaced module](https://vuex.vuejs.org/en/modules.html#namespacing).
The `src/store` is only for defining the Vuex setup and importing modules.

The modules should live inside each domain for example if we want to create a new module inside module GL then we should create a new file in `src/app/modules/GL/store/index.ts` then define the store module inside that file.

One example you can look at is in the `src/layouts/store/index.ts` file.
Then in the main `src/store/index.ts` we import that module: `import layout from '~/layouts/store';` and we register it.

## Pattern

To respect typings with typescript we are using a package helper [direct-vuex](https://github.com/paroi-tech/direct-vuex). Please refer to the docs or look at the current structure for examples how to define a store module.

So all store related should use the pattern:

```ts
import { store } from '~/store';
```

### Boot

There is one exception for calling the store if you want to use any of the store inside the boot files. Just use the store that is provided by the boot arguments, no need to import the store.
