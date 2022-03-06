# Style I18n Loader

It's webpack loader for I18N style

## Configuration:
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
  rtl: ['ar'],
  syntax: 'scss'
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
          require.resolve('style-i18n-loader'),
        ],
      },
    ],
  },
};
```

## Usage
The loader support the below rules.
<ul>
  <li><a href="#i18n" >i18n</a></li>
  <li><a href="#rtl" >rtl</a></li>
  <li><a href="#lang" >lang</a></li>
</ul>

#

### <b id="i18n" >i18n Usage</b>
When you want to load the i18n image for different languages, it will refer the i18n image according to the paths in i18n.config.js.  



style.scss

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

### <b id="rtl" >rtl Usage</b>
The direction of reading is right to left in Some of countries, special in middle east.

style.scss

```scss
body {
  @rtl margin: 1px 2px 3px 4px;
}

// it will be complied to scss

body {
  margin: 1px 2px 3px 4px;
  @at-root #{selector-nest('html[lang=ar]', &)} {
    margin: 1px 4px 3px 2px;
  }
}

```

### <b id="lang" >lang Usage</b>
Sometime you need some style for different country for current selector, you can do it like below:

style.scss

```scss
body {
  color: #fff;
  @lang(en) {
    color: #000;
  }
}
// it will be complied to scss

body {
  color: #fff;
  @at-root #{selector-nest('html[lang=en]', &)} {
    color: #000;
  }
}

```