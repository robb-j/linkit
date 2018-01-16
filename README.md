# Node Sample Project
> A project to kickstart a node app, with the common things already setup.  

```bash

# Build & publish the image (from node-9:alpine)
# -> uses REGISTRY file & the npm version to tag image
npm run push-image

# Lint the web & test directories
npm run lint

# Run the unit tests
npm test

# Generate coverage
npm run coverage          # outputs to coverage/
npm run coverage-summary  # outputs to terminal

# Watch code with nodemon (restarts on file changes)
npm run watch

```
