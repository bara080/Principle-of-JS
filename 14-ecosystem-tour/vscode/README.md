# VS Code

The editor most JS engineers use.

## Extensions worth installing

- **ESLint** — inline errors, fix on save.
- **Prettier** — format on save.
- **Error Lens** — pushes squiggly-line errors into the gutter.
- **GitLens** — inline `git blame`, history.
- **Path Intellisense** — path autocomplete.
- **Code Spell Checker** — typos in comments and identifiers.

## Settings that pay for themselves

`.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "javascript.updateImportsOnFileMove.enabled": "always",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "files.trimTrailingWhitespace": true
}
```

## Keybindings to burn in

- `⌘P` — quick open by filename.
- `⌘⇧P` — command palette.
- `⌘⇧F` — search across project.
- `F12` — go to definition.
- `⌥F12` — peek definition inline.
- `⇧F12` — find all references.
- `F2` — rename symbol (project-wide).
- `⌘.` — quick fix / code action.
- `⌘⇧O` — jump to symbol in file.

## Debug configuration

`.vscode/launch.json` for Node:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Run current file",
      "program": "${file}"
    }
  ]
}
```

## Interview tips

- Not a tool question, but "walk me through your editor setup" is a
  frequent conversation opener with senior engineers. Have an answer.
