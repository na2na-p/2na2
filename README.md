# フォーク元と違うところ

- 一部の絵文字リアクション機能
- ねこ召喚(summonCat)
- ランダムカラーピッカー(color)
- ランダムにクックパッドからレシピを引っ張ってくる(menu)
- 強震モニター Extension と連携して震度レポートのノート(earthquake)

# メモ

## 強震モニターについて

http サーバーを起動させて、震度レポートを受け取るような仕組み。  
config.json にポート番号を指定、そのポート番号に対して、震度レポートを受け取るようにする。  
リバースプロキシなんかを使ってたりします。

## ランダムカラーピッカー

ランダムに決定した色の 1px \* 1px の画像をアップロードしてます。

# TODO

地震通知について、2度送られてくることがある。やっぱりEEWつかわない？
