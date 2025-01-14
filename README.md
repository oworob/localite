# Project Roadmap

#### Components

- [ ] Autocomplete (mutiple or singular)

#### Authentication

- [x] Logging in
- [x] Creating account
- [ ] Securing endpoints

#### Projects

- [x] Creating project
- [ ] Inviting members
- [ ] Accepting invitations
- [x] Browsing joined projects
- [ ] Filtering projects (by name and language)
- [ ] Leaving projects

#### Singular Project

- [x] Browsing project
- [ ] Updating _last_project_visit_

#### Testing

- [ ] Backend
- [x] Frontend
- [ ] CI

---

Pages:

- Login
- Register
- Entry Page
  - entry list
  - entry translations + form + voting
  - comment section
- Create Project
- Manage Project (inviting)
- Project list (with invites)

Entry statuses:

- pending (has at least one translation added)
- needs_translation (has zero translations)
- accepted (one of the translations was accepted by the project owner)

---

# dashboard

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
