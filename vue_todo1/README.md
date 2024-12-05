# vue_todo1

 Version: 0.9.1

 Author  :
 
 date    : 2024/11/31

 update :

***

Vue 3 + drizzle + sqlite + express.js

***
### Setup
* .env
```
DB_FILE_NAME=file:local.db
```

***
* drizzle setting

https://orm.drizzle.team/docs/get-started/sqlite-new

***
* migrate
```
npx drizzle-kit generate
npx drizzle-kit migrate
```
***
### Prompt


```
コード生成して欲しいです。
CRUD アプリ、
バックエンド: Express.js
フロントエンド : Vue.js , tailwindCSS 使用したいです。
データベース、sqlite 連携してほしい。
ORMは、 drizzleを使用したい。

・バックエンドのみ、生成して欲しい。

・TODOの追加機能を、ダイアログで編集したいです。
・TODOの編集機能を、ダイアログで編集したいです。
・TODOの削除機能を、追加したいです。
・TODOの検索機能を、追加したいです。

```
***
```
上記、
フロントエンドのみ生成して欲しい。
Vue.js , tailwindCSS 使用したいです。

・バリデーション追加したい。
npmは zod 使用したい。

検証内容は、下記です。
TODOデータ: 未入力は、エラー
```


***

