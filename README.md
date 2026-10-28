# karya-api-build

A project-neutral, interactive field guide to spec-driven API development with Claude Code.

## Run locally

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. No dependency installation or build is required.

## Contents

- Eight development steps with copyable prompts and two project starting modes.
- A synthetic resource-booking example with four acceptance scenarios.
- Browser-local progress tracking, keyboard-accessible navigation, and responsive layout.
- Downloadable Markdown guide and starter templates.
- Links to official Claude Code and GitHub Spec Kit documentation.

`content.js` contains the walkthrough and scenario content. `app.js` manages interactions. `styles.css` defines the responsive design. Run `python3 scripts/package_starter.py` to regenerate downloads after changing the content or templates. Node.js is needed only by that packaging script to read the content data.

## Hosting

Publish the repository's `main` branch, root directory, with GitHub Pages. All internal asset paths are relative so the site works under a project URL. `.nojekyll` keeps the static files unchanged.

This is an independent educational guide. The example describes intended behavior; it does not call a live API or claim tests have passed. Progress is stored only in this browser. No analytics, external fonts, account system, or backend are used.
