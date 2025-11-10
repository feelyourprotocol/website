# feelyourprotocol.org

Ethereum protocol experiences.

## Project Setup

Project is set up using [vue.js](https://vuejs.org/) and [vite](https://vite.dev/), being initialized with the
[create-vue](https://github.com/vuejs/create-vue) command (TypeScript version, Cypress for end-to-end tests, ESLint for linting, Prettier for formatting).

You can install dependencies with:

```sh
npm install
```

## Getting Started

### Development Server

Start the development server with:

```sh
npm run dev
```

### Linting and Formatting

Linting and formatting is done with [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/).
Run linting and formatting with:

```sh
npm run lf
```

### Testing

There are no unit tests and testing is based on end-to-end coverage with [Cypress](https://www.cypress.io/).

 Run tests with:

```sh
npm run test:e2e:dev
```

## User Interface

The user interface is using Vue.js for the interactions and Tailwind for the styling. There are some additiona
components for things like icons or fonts.

- [Tailwind](https://tailwindcss.com/) for CSS
- [Heroicons](https://heroicons.com/) for basic icons (`@heroicons/vue`)

The dancer images are generated using [Midjourney](https://www.midjourney.com/).

## Content Structure

There are three taxonomies to add new modules:

- EIPs: the most basic unit for structuring
- Hardforks/Research (Projects): called "hardforks" in the code, one per EIP, examples: "Fusaka"
- Technical Topics: called "topics" in the code, one per EIP, examples: "Precompiles"

### Adding a new EIP

EIPs are identified by `eip-<number>` (e.g. `eip-7951`). A clear number-type EIP number is available as a property
in the EIPs array (`num`).

1. Add the EIP to the `EIPs` array in `src/views/structure.ts`
2. Attention! This already activates the router, see `src/router/index.ts` (no other changes needed)
3. Add EIP ID (e.g. `eip-7951`) to `latest` (first item) in `src/views/home.vue`
4. Create EIP component in `src/components/eips/EIP<number>C.vue`
5. Add EIP component to `src/views/EIP<number>View.vue`
6. Add EIP component to `src/views/hardforks/<hardfork>View.vue`
7. Add EIP component to `src/views/topics/<topic>View.vue`

### Third-party Ethereum Library Specifics

#### EthereumJS

If in-between builds should be included, all necessary packages need to be build with `npm pack`, copied to the `ext` directory
and referenced in the `package.json` file as follows:

```json
{
  "@ethereumjs/common": "./ext/ethereumjs-common-10.0.0.tgz",
  "@ethereumjs/evm": "./ext/ethereumjs-evm-10.0.0.tgz",
  "@ethereumjs/util": "^10.0.0"
}
```


