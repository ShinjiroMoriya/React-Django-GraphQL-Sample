# Heroku Sample App React/SSR/GraphQL

## Heroku Button
[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Language
- Nodejs 10.2.1
- Python 3.6.5
## Web Framework
- express (nodejs)
- django (python)
## Heroku Add-ons
- Cloudinary
- Postgres
- heroku connect
- Sendgrid
## Heroku Config Vars
- GRAPHQL_URL=https://[APP-NAME].herokuapp.com/graphql
- DISABLE_COLLECTSTATIC=1

## Heroku Buildbacks
- https://github.com/heroku/heroku-buildpack-nodejs
- https://github.com/heroku/heroku-buildpack-python
- https://github.com/danp/heroku-buildpack-runit

## Procfile
```
web: bin/runsvdir-dyno
```
## Procfile.web
```
django: gunicorn -c tb_app/config.py tb_app.wsgi --bind 127.0.0.1:8888
node: npm run server
```
## 概要
バックエンドはDjango GraphQLで<br>
フロントエンドはReact/Redux/SSR（expressjs）を利用したアプリケーション。

`/graphql`ディレクトリは`http-proxy-middleware`を利用して<br>
djangoアプリケーションのサーバーにアクセスしている。

```
const app = express();
app.use(
  proxy("/graphql", {
    target: "http://localhost:" + DJANGO_PORT
  })
);
```

## Deploy
- `.env.production`ファイルを作成し、
```GRAPHQL_URL=https://[APP-NAME].herokuapp.com/graphql```
を書き込む。
- `$ npm run build`でビルドする。

## Local開発
- 基本的には`$ npm run start`で開発を進める。
- SSRで確認する場合は、`$ npm run dev_build`でビルドする。
- サーバーは`$ npm run dev_server`
- djangoの方もサーバーを立てる`$ make server`
- 開発環境はSSLで構築されているので、sslのキーを発行する。

### localhostでSSL
#### keyとcrtを発行コマンド
```
openssl req -x509 -out localhost.crt -keyout localhost.key -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -extensions EXT -config <( printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

## Heroku Connect を使う場合
- Salesforceでカスタムオブジェクト、Space、Newsを作成する。
- heroku buttonでデプロイ後
- heroku run bash --app アプリ名
- addonのheroku-connectを追加してContact、Space、Newsをmappingする。
- python manage.py migrate account_token

## Heroku Connect を使わない場合
```
$ heroku run bash --app アプリ名
$ make init
```
## Heroku Connect を使わない場合のサンプルアカウント
`/register`にアクセスして、<br>
Emailに`sample@example.com`を入力してパスワード登録する。
※新規Emailの登録は不可です。

## Salesforce データ構造
### Contact (取引先責任者)
![contact](https://user-images.githubusercontent.com/7581596/41984736-5ddd8b22-7a6c-11e8-807e-85eb40147335.jpg)

### Space__c (カスタムオブジェクト)
![space__c](https://user-images.githubusercontent.com/7581596/41984334-6696971e-7a6b-11e8-89d0-93d853d85c9c.jpg)

### News__c (カスタムオブジェクト)
![news__c](https://user-images.githubusercontent.com/7581596/41984436-a4ce3f1e-7a6b-11e8-9a59-12d213947ab2.jpg)
