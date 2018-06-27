export default ({ helmet, assets, html, initialState }) => {
  return `
<!doctype html>
<html lang="ja">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        <link rel="shortcut icon" href="/assets/images/favicon.ico">
        <link rel="stylesheet" href="/assets/css/style.css">
    </head>
    <body>
        <div id="root">${html}</div>
        <script>window.INITIAL_STATE = ${JSON.stringify(initialState)}</script>
        <script src="/${assets["main.js"]}"></script>
    </body>
</html>`;
};
