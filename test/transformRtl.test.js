import config from "../i18n.config";
import transform from "../src/transform";

describe("transform rtl scss", () => {
  test("generate collection successful", () => {
    const content = `
.tes {
  margin: 10px 2px 5px 1px;
}

.test {
  @rtl margin: 10px 5rem 10px 6px;
}

.test1 {
  @rtl padding: 10px 5px 10px 6px;
}

.test2 {
  @rtl inset: 10px 5px 10px 6px;
}

.test4 {
  @rtl margin: 10px 5px;
}
`
    global.i18nSyntax = 'scss';
    const res = transform(content, config);
    expect(res).toContain('@at-root');
    expect(res).toContain('margin: 10px 6px 10px 5rem;');
    expect(res).toContain('padding: 10px 6px 10px 5px;');
    expect(res).toContain('inset: 10px 6px 10px 5px;')
    expect(res).not.toContain('@rtl margin: 10px 5px')
    expect(res).toContain('margin: 10px 5px')
  })

  test("genernate single successful", () => {
    const content = `
.margin {
  @rtl margin-left: 12px;
  @rtl margin-right: 13px;
  margin-top: 15px;
}

.padding {
  @rtl padding-left: 12px;
  @rtl padding-right: 13px;
}

.left {
  @rtl left: 12px;
  @rtl right: 13px;
}

.border {
  @rtl border-left: 12px;
  @rtl border-right: 13px;
}

.normal {
  margin-left: 10px;
}
`
    global.i18nSyntax = 'scss';
    const res = transform(content, config);
    expect(res).toContain('@at-root');
    expect(res).toContain('margin-left: unset');
    expect(res).toContain('margin-right: 12px !important');
    expect(res).toContain('padding-left: unset');
    expect(res).toContain('padding-right: 12px !important');
    expect(res).toContain('left: unset');
    expect(res).toContain('right: 12px !important');
    expect(res).toContain('border-left: unset');
    expect(res).toContain('border-right: 12px !important');
  })
})


describe("transform rtl less", () => {
  test("generate collection successful", () => {
    const content = `
.tes {
  margin: 10px 2px 5px 1px;
}

.test {
  @rtl margin: 10px 5rem 10px 6px;
}

.test1 {
  @rtl padding: 10px 5px 10px 6px;
}

.test2 {
  @rtl inset: 10px 5px 10px 6px;
}

.test4 {
  @rtl margin: 10px 5px;
}
`
    global.i18nSyntax = 'less';
    const res = transform(content, config);
    expect(res).toContain('&');
    expect(res).toContain('margin: 10px 6px 10px 5rem;');
    expect(res).toContain('padding: 10px 6px 10px 5px;');
    expect(res).toContain('inset: 10px 6px 10px 5px;')
    expect(res).not.toContain('@rtl margin: 10px 5px')
    expect(res).toContain('margin: 10px 5px')
  })

  test("genernate single successful", () => {
    const content = `
.margin {
  @rtl margin-left: 12px;
  @rtl margin-right: 13px;
  margin-top: 15px;
}

.padding {
  @rtl padding-left: 12px;
  @rtl padding-right: 13px;
}

.left {
  @rtl left: 12px;
  @rtl right: 13px;
}

.border {
  @rtl border-left: 12px;
  @rtl border-right: 13px;
}

.normal {
  margin-left: 10px;
}
`
    global.i18nSyntax = 'less';
    const res = transform(content, config);
    expect(res).toContain('&');
    expect(res).toContain('margin-left: unset');
    expect(res).toContain('margin-right: 12px !important');
    expect(res).toContain('padding-left: unset');
    expect(res).toContain('padding-right: 12px !important');
    expect(res).toContain('left: unset');
    expect(res).toContain('right: 12px !important');
    expect(res).toContain('border-left: unset');
    expect(res).toContain('border-right: 12px !important');
  })
})

describe("transform rtl css", () => {
  test("generate collection successful", () => {
    const content = `
.tes {
  margin: 10px 2px 5px 1px;
}

.test {
  @rtl margin: 10px 5rem 10px 6px;
}

.test1 {
  @rtl padding: 10px 5px 10px 6px;
}

.test2 {
  @rtl inset: 10px 5px 10px 6px;
}

.test4 {
  @rtl margin: 10px 5px;
}
`
    global.i18nSyntax = 'css';
    const res = transform(content, config);
    expect(res).toContain('html');
    expect(res).toContain('margin: 10px 6px 10px 5rem;');
    expect(res).toContain('padding: 10px 6px 10px 5px;');
    expect(res).toContain('inset: 10px 6px 10px 5px;')
    expect(res).not.toContain('@rtl margin: 10px 5px')
    expect(res).toContain('margin: 10px 5px')
  })

  test("genernate single successful", () => {
    const content = `
.margin {
  @rtl margin-left: 12px;
  @rtl margin-right: 13px;
  margin-top: 15px;
}

.padding {
  @rtl padding-left: 12px;
  @rtl padding-right: 13px;
}

.left {
  @rtl left: 12px;
  @rtl right: 13px;
}

.border {
  @rtl border-left: 12px;
  @rtl border-right: 13px;
}

.normal {
  margin-left: 10px;
}
`
    global.i18nSyntax = 'css';
    const res = transform(content, config);
    expect(res).toContain('html');
    expect(res).toContain('margin-left: unset');
    expect(res).toContain('margin-right: 12px !important');
    expect(res).toContain('padding-left: unset');
    expect(res).toContain('padding-right: 12px !important');
    expect(res).toContain('left: unset');
    expect(res).toContain('right: 12px !important');
    expect(res).toContain('border-left: unset');
    expect(res).toContain('border-right: 12px !important');
  })
})