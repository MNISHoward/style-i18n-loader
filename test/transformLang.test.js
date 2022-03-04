import transform from "../src/transform";
import config from "../i18n.config";

describe("transform lang scss", () => {
  test("generate content successful", () => {
    const content = `
.test {
  color: white;
  @lang(ar) {
    color: blue;
  }
}
`
    global.i18nSyntax = 'scss';
    const res = transform(content, config);
    expect(res).toContain('@at-root');
    expect(res).toContain('lang=ar');
  })
})

describe("transform lang less", () => {
  test("generate content successful", () => {
    const content = `
.test {
  color: white;
  @lang(ar) {
    color: blue;
  }
}
`
    global.i18nSyntax = 'less';
    const res = transform(content, config);
    expect(res).toContain('&');
    expect(res).toContain('lang=\'ar\'');
  })
})

describe("transform lang css", () => {
  test("generate content successful", () => {
    const content = `
.test {
  color: white;
  @lang(ar) {
    color: blue;
  }
}
`
    global.i18nSyntax = 'css';
    const res = transform(content, config);
    expect(res).toContain('html');
    expect(res).toContain('lang=\'ar\'');
  })
})