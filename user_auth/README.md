# user_auth

 Version: 0.9.1

 Author  :
 
 date    : 2024/11/18

 update :

***

user auth sqlite , example

***
### setup
* .env

```
APP_NAME="claude_2"
# EXPIRED_TIME: min set
AUTH_EXPIRED_TIME=720

```
***
### Prompt

```
コード生成して欲しいです。
ユーザー作成画面
Express.js, React,  shadcn/ui 使用したいです。

・入力項目は、下記にして欲しい。
名前: INPUT タグ　type=text
メールアドレス: INPUT タグ　type=text
パスワード: INPUT タグ　type=password

・パスワード暗号化は、bcrypt を使用したい。

・データベースと、連携してほしい。
sqlite に、データを保存したい。
sqlite 接続は、 prismaを使用したい。

```

***

