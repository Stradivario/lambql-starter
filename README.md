## Install

```
npm install --legacy-peer-deps
```

## Create `.env`. file

```
NODE_ENV=development
```

## Install `@gapi/cli` (skip if you already have it)

```
npm i -g @gapi/cli
```

## Start server

```
npm start
```

## Deploy Graphql Lambda

### Login to graphql-server cli

1. Go to https://graphql-server.com/profile/settings/identity/cli
2. Click Generate CLI Token button
3. Copy the generated command
4. Install `npm i -g @gapi/gcli`
5. Execute the command from step 3
6. Go to https://graphql-server.com/projects/replace-with-your-project-id/lambdas
7. On the top right corner you will find button called `CONNECT CLI` click it
8. Copy the command provided in the dialog
9. Execute it inside the terminal `gcli project:use replace-with-your-project-id`
10. If lambda does no exists `gcli lambda:create` else `gcli lambda:update`
11. Get current lambda `gcli lambda:get`
12. To update the lambda execute `gcli lambda:update`
13. Check the Graphql CLI documentation https://github.com/Stradivario/gapi/tree/master/packages/gcli

### Execute status node

```graphql
query {
  status {
   status
  }
}
```

### Example Fetch

```graphql
{ 
 getUsers {
    id
    name
    email
 }
 findUser(id: "68b56ddd03b629b7f64cec70") {
    email
    id
 }
 status {
    status
 }
}
```


### Database credentials can be found at `.env_example`

```bash
MONGODB_URI=mongodb+srv://user:pass@test.ouljk.mongodb.net/my-database-name?retryWrites=true&w=majority
NODE_ENV=production
PORT=9000
```


### Schema introspection
Collect all schema interfaces for the Graphql API

```bash
npm run introspect
```