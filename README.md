# Warehouse Project

This is a monorepo containing multiple applications:

- `apps/api` - NestJS API server
- `apps/web` - Nuxt.js web application

## Development

### Prerequisites

- Node.js 22.16.0 or higher
- Yarn 4.10.3 (managed via Corepack)

### Setup

```bash
# Enable Corepack to use the correct Yarn version
corepack enable

# Install dependencies
yarn install

# Start development servers
yarn dev
```

## Deployment

### Render.com Configuration

**For Web Service (Nuxt.js):**

- **Build Command**: `yarn build`
- **Start Command**: `yarn start`
- **Node Version**: 22.16.0
- **Environment**: Node

**For API Service (NestJS) - Optional:**

- **Build Command**: `yarn build:api`
- **Start Command**: `yarn start:api`
- **Node Version**: 22.16.0
- **Environment**: Node

The build process automatically:

1. Enables Corepack to use Yarn 4.10.3
2. Installs dependencies
3. Builds the application
4. Prepares the server for production

**Important**: Make sure to set the correct service type in Render.com:

- For web app: Use "Web Service"
- For API: Use "Background Worker" or separate "Web Service"

### Manual Deployment

```bash
# Build the project
yarn build

# Start the production server
yarn start
```

## Project Structure

```
warehouse/
├── apps/
│   ├── api/          # NestJS API
│   └── web/          # Nuxt.js Web App
├── package.json      # Root package.json with workspace config
└── .yarnrc.yml       # Yarn configuration (node-modules mode)
```
