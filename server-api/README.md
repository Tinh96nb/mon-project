## Server REST API FE for avatar art
- Setting ENVIRONMENT_VARS:
```
$ cp .env.example .env
$ vim .env
# rewrite your env vars
```
- Init dependency and database:
```
$ yarn install
$ yarn migrate
```
- Start app with PM2:
```
$ yarn start
```
- View logs:
```
$ yarn log
```
- Stop run:
```
$ yarn stop
```