# Style I18n Loader

It's webpack loader for I18N style

## Usage:
> create a configuration file(i18n.config.js) for loader under the root of project  

**i18n.config.js**
```js
module.exports = {
  paths: {
    'zh-CN': '~@/assets/lang/zh-Hans',
    'zh-TW': '~@/assets/lang/zh-Hant-TW',
    'th': '~@/assets/lang/th',
    'id': '~@/assets/lang/id',
    'en': '~@/assets/lang/en',
    'ar': '~@/assets/lang/ar',
  },
  syntax: 'scss'
}
```

**style.scss**

```scss
body {
  @i18n background-image: url(test.png)
}

// it will be complied to scss

body {
  @at-root #{selector-nest('html[lang=zh-CN]', &)} {
    background-image: url(~@/assets/lang/zh-Hans/test.png);
  }

  @at-root #{selector-nest('html[lang=zh-TW]', &)} {
    background-image: url(~@/assets/lang/zh-Hant-TW/test.png);
  }

  @at-root #{selector-nest('html[lang=th]', &)} {
    background-image: url(~@/assets/lang/th/test.png);
  }

  @at-root #{selector-nest('html[lang=id]', &)} {
    background-image: url(~@/assets/lang/id/test.png);
  }

  @at-root #{selector-nest('html[lang=en]', &)} {
    background-image: url(~@/assets/lang/en/test.png);
  }

  @at-root #{selector-nest('html[lang=ar]', &)} {
    background-image: url(~@/assets/lang/ar/test.png);
  }
}

```

**wepback.config.js**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
          // Complie @i18n to special code
          "i18n-style-loader",
        ],
      },
    ],
  },
};
```
