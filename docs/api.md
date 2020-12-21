# API

- [API](#api)
  - [`Setup`](#setup)
  - [Usage](#usage)

Everything that is related to the API should be placed in the `api` folder. Each file should represent a specific domain and each file name should have a suffix `*.api.ts`. The current structure is one `api` file is for the purpose for one VHP Module.

Please feel free to propose a better solution if you find this current structure not optimal.

## `Setup`

In order to add a new API file follow these steps.

1. Create a new file inside the `api/repositories/` (example: `housekeeping.api.ts`).
2. import the `DoRequest` utility on top of the file: `import { DoRequest } from '../config/repository';`
3. Create an interface for the endpoints and make sure to **export** it. Example:

```ts
export interface HousekeepingEndpoints {
  getSomething: any;
}
```

4. Export the default API by using this example:

```ts
export default (doFetch: DoRequest): HousekeepingEndpoints => ({
})
```

5. Go to `src/plugins.types.d.ts` file and import and add the new interface into the `ApiEndpoints` interface.

## Usage

There are a few ways to call the API:

1. Within component with Options API: `this.$api.housekeeping.getSomething()`
2. Within component with Composition API: `$api.housekeeping.getSomething()` (Please refer to other example where does the `$api` comes from)
3. Outside of component, just import the API like this: `import API from '~/api/config/http';`

All of the API calls will return an array with two elements. Where the first index is the error object and the second element is the response's data.
For example:

```js
const response = await this.$api.get('dummyURL');

if (response[0]) {
  // handle error
} else {
  // handle success
}
```

But the best way to do this is to use destructuring array like the following:

```js
const [err, response] = await this.$api.get('dummyURL');

if (err) {
  // handle error
} else {
  // handle success
}
```
