# akashic-pointer-plugin

**akashic-pointer-plugin**はAkashicでマウスポインタの位置を確認できるプラグインです。

## 利用方法

[akashic-cli](https://github.com/akashic-games/akashic-cli)をインストールした後、

```sh
akashic install @akashic-extension/akashic-pointer-plugin
```

でインストールできます。

本プラグインをコンテンツへ登録し利用するには `g.OperationPluginManager#register()` を利用します。
`g.OperationPluginManager#register()` の第一引数にはプラグインの実態、第二引数には識別コードを指定する必要があります。識別コードは対象のプラグインを開始/停止する操作に必要となります。

```javascript
import { PointerPlugin } from "@akashic-extension/akashic-pointer-plugin";
...
const pointerPlugin = g.game.operationPluginManager.register(PointerPlugin, 5); // PointerPlugin を 識別コード 5 で 登録
g.game.operationPluginManager.start(5); // 識別コード 5 のプラグインを開始

console.log(pointerPlugin.getLatestPointerPoint());
...

g.game.operationPluginManager.stop(5) // 識別コード 5 のプラグインを停止
```

## ライセンス
本リポジトリは MIT License の元で公開されています。
