import transfrom from "../src/transform";
import config from "../i18n.config";

describe("transfrom", () => {
  test("generate content successful", () => {
    const content = `
@import '~@/utils/css/_function';
@import '~@/utils/css/_define';

:global{
  .pong-alert{
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    @i18n background-image: url('rule');
    .pong {
      @i18n background-image: url('rule2');
    }
  }
  .pong-alert-mask{
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background:rgba(0, 0, 0, 0.7);    
  }
  .pong-alert-content{
    min-width:px2rem(300);
    max-width:98%;
    position: relative;
  }
  .pong-alert-close-button{
    border:none;
    margin:0;
    padding:0;
    outline:none;

    position:absolute;
    bottom:px2rem(-72);
    left:50%;
    transform: translateX(-50%);

    width:px2rem(40);
    height:px2rem(40);
    border-radius:50%;
    line-height: px2rem(40);
    text-align: center;
    font-size: px2rem(24);
    color:#fff;
    background: #333;
  }
}
`
    global.i18nSyntax = config.syntax;
    expect(transfrom(content, config.paths)).toEqual(expect.stringContaining('at-root'));
  })
})

describe("transfrom", () => {
  test("generate content successful", () => {
    const content = `
@import '~@/utils/css/_function';
@import '~@/utils/css/_define';

:global{
  .pong-alert{
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    @i18n background-image: url('rule');
    .pong {
      @i18n background-image: url('rule2');
    }
  }
  .pong-alert-mask{
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background:rgba(0, 0, 0, 0.7);    
  }
  .pong-alert-content{
    min-width:px2rem(300);
    max-width:98%;
    position: relative;
  }
  .pong-alert-close-button{
    border:none;
    margin:0;
    padding:0;
    outline:none;

    position:absolute;
    bottom:px2rem(-72);
    left:50%;
    transform: translateX(-50%);

    width:px2rem(40);
    height:px2rem(40);
    border-radius:50%;
    line-height: px2rem(40);
    text-align: center;
    font-size: px2rem(24);
    color:#fff;
    background: #333;
  }
}
`
    global.i18nSyntax = 'less';
    expect(transfrom(content, config.paths)).toEqual(expect.stringContaining('&'));
  })
})