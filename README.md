# pennsieve-discover-app

> Pennsieve Discover

## Pre-requisites:
- yarn
- Node.js v12.x

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Deployment
The **Pennsieve Discover** app is hosted on [Heroku](https://heroku.com/). Specifics on how the application is deployed can be found by logging into Heroku, clicking on *Deploy* tab, and then viewing the *Deployment method* section.

### Non-production
Branch `main` autodeploys to dev
### Production
Branch `main` should be manually deployed to promote to production 
Branch `prod` doesn't currently have a purpose in our workflow

TODO: Update this branching strategy to match what we do in pennsieve-app

