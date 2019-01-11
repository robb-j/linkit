# Linkit

A tiny node app to redirect traffic using a string template

## Environment Variables

| Name           | Use |
| -------------- | --- |
| `URL_TEMPLATE` | A template to redirect the user where `{0}` is replaced with the 1st url parmeter |
| `HOME_URL`     | A url to redirect the user if they hit home, i.e. `/` |

## Sample run

```bash
docker run -it --rm -p 3000:3000 \
  -e "HOME_URL=https://github.com/robb-j/" \
  -e "URL_TEMPLATE=https://github.com/robb-j/{0}" \
  robbj/linkit
```

## Dev Commands

```bash
# Start the app
npm run start

# Start the app and reload on file changes
npm run watch

# Update version (builds & pushes a new docker image)
# -> Uses the REGISTRY file & the npm version to tag image
npm version ... # --help

# Lint the web & test directories
npm run lint

# Run the unit tests
npm test

# Generate coverage, outputs to coverage/
npm run coverage

# Watch code with nodemon (restarts on file changes)
npm run watch

```
