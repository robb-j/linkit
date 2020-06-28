# Linkit

A tiny node app to redirect traffic using a string template

## Environment Variables

| Name           | Use                                                                               |
| -------------- | --------------------------------------------------------------------------------- |
| `URL_TEMPLATE` | A template to redirect the user where `{0}` is replaced with the 1st url parmeter |
| `HOME_URL`     | A url to redirect the user if they hit home, i.e. `/`                             |

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

# Lint the web & test directories
npm run lint

# Run the unit tests
npm test

# Generate coverage, outputs to coverage/
npm run coverage
```

## Versioning and releasing

Use [npm version] to generate a new version and push it to [GitHub](https://github.com/robb-j/linkit).
This will trigger a [DockerHub](https://hub.docker.com/r/robbj/linkit) pipeline to build a docker image.

```bash
npm version # minor | major | patch | --help
git push --tags
```
