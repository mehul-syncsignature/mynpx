# my-ui-cli

A customizable UI component package for Next.js applications and React Chrome extensions.

## Features

- ✅ Easily add UI components to your projects with a simple CLI
- ✅ Works with both Next.js apps and React Chrome extensions
- ✅ Integrates with shadcn/ui components
- ✅ TypeScript and Tailwind CSS support
- ✅ Component registry system for organizing your components

## Local Development Setup

Once your project structure is set up and code is in place:

```bash
# Build the package
bun run build

# Create a symlink for local development
bun link
```

### Creating a New Component

## Using Your Package in Another Project

After linking your package, you can use it in another project:

```bash
# Navigate to your target project
cd ~/projects/my-nextjs-app

# Use your locally linked package
npx my-ui-cli add social-banner

```

## Publishing Your Package

When ready to share with others:

```bash
# Update version in package.json
npm version patch  # or minor, or major

# Publish to npm
npm publish
```

After publishing, users can install your components using:

```bash
npx my-ui-cli add social-banner
```

## Troubleshooting

If you encounter issues with local development:

1. Make sure you've built the package with `bun run build`
2. Check if the symlink is created properly with `bun link`
3. Try unlinking and relinking with `bun unlink -g my-ui-cli && bun link`
4. Verify the paths in your component registry are correct
