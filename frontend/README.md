# Pre-built solution for Email Airdrop via Apillon API (frontend)

This repository contains source code for Email Airdrop website.

## Overview

Solution has 2 main parts. Admin dashboard and page for NFT claim.
In admin dashboard, admin adds emails, see their status, statistic, ...

Cron job runs in the background and sends claim email when time set for sending passes.

Users receives an email that redirects him to the claim page. On the claim page he connects the wallets and triggers the claiming process on the backend.

## Configuration

In `lib/config/` we can find configs for different environments.

```ts
const config: ConfigInterface = {
  APP_URL: 'http://localhost:3000',
  API_BASE: 'http://localhost:3001',
  CHAIN_ID: 1287,
  CONTRACT_ADDRESS: null,
  METADATA_BASE_URI: null,
  METADATA_TOKEN: null,
};
```

You need to update this config for a smoother frontend experience.

- `APP_URL` presents the URL where the frontend website lives.
- `API_BASE` presents the URL where backend (API) lives.
- `CHAIN_ID` is the ID of the EVM chain that you NFTs are.
- `CONTRACT_ADDRESS` is the onchain contract address of your NFT collection.
- `METADATA_BASE_URI` presents the base uri where you NFTs metadata live (IPNS if created via apillon).
- `METADATA_TOKEN` presents the JWT token of the NFTs metadata URI.

If `METADATA_BASE_URI` and `METADATA_TOKEN` are not present, the website still works normally but the users need to have their metamask connected to load a NFT after it was minted.

## Stack

- node 18.16.1
- Nuxt 3
- Vue 3 w/ TypeScript
- Pinia Store
- NaiveUI
- TailwindCSS

## Info

### Naive UI

[Naive UI](https://www.naiveui.com/en-US/os-theme) is used for default frontend components.

Its styles can be modified globally in `/lib/config/naive.ts` - [docs](https://www.naiveui.com/en-US/os-theme/docs/customize-theme#Customizing-theme-vars-in-TypeScript).

Each naive component also has the `:theme-overrides` prop to overwrite styles per specific usage.

```html
<n-tabs
  type="segment"
  size="small"
  :theme-overrides="{ panePaddingSmall: '1.5rem 0 0 0' }"
></n-tabs>
```

### API

API interaction should be done with api wrapper globally imported as `$api` (`/lib/utils/api.ts`).

API global interceptors (onRequest, onResponse, onForbidden) are also defined in `/lib/utils/api.ts`.

Api requests throw errors, handle them with try catches. `useHandleError(e)` can be used for general error handling (eg. toast display).

```js
try {
  await $api.post('/login', formData);
} catch (e: any) {
  useHandleError(e);
}
```

### Vueuse

Many common tasks can be solved with using helper functions from [vueuse](https://vueuse.org/functions.html). Use those instead of reinventing the wheel.

eg.

```js
useIntersectionObserver();
useInfiniteScroll();
useScroll();
useScrollLock();
```

### Icons

Add icon svg to `/assets/icons`, then use `<NuxtIcon :name="" />` component to use the icon - set name prop to filename. Implements [nuxt-icons](https://github.com/gitFoxCode/nuxt-icons).

Control size with font-size.

```html
<NuxtIcon name="close" class="inline-block text-[18px] mr-3 align-middle" />
```

### Breakpoints

For basic styles, use tailwind breakpoint system. For js usage, use `useScreen` composable.

```js
const screens = reactive(useScreen());
// or
const { isXl } = useScreen();
```

```html
<div v-if="screens.isXl" class="w-8 h-8 bg-red"></div>
<div v-else class="w-8 h-8 bg-blue"></div>
```

### Modal

Implements naive-ui modal.

```html
<Modal v-model:show="isModal" title="MY Modal">
  <div>ETC</div>
</Modal>
```

## Wallet / Crypto

Wallet integration can be implemented with [use-wagmi](https://github.com/unicape/use-wagmi) and [viem](https://viem.sh/). Docs for wagmi: [docs](https://wagmi.sh/react/getting-started) (react docs, but most hooks are supported).

Check for implementation on branch `crypto`.
Configuration is in `/plugins/use-wagmi.ts`.
Helpers are in `/composables/blockchain/**` and `/components/parts/Wallet/**`.

## Translations

Use [Nuxt i18n](https://github.com/nuxt-modules/i18n).

Check for implementation on branch `i18n`. Basically:

- install module and add config to `nuxt.config.ts`
- add translation json file: `/locales/en.json`
- add language switch component

### Usage

In template

```handlebars
{{ $t('investments.details.opensOn') }}
```

In script

```js
const { t } = useI18n();
const label = t('investments.details.location');
```

Internal links can be simple paths if using `strategy: 'no_prefix'`. Otherwise `localePath()` helper should be used.
