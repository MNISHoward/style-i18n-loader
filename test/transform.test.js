import transfrom from "../src/transform";
import config from "../i18n.config";

describe("transfrom scss", () => {
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
    global.i18nSyntax = 'scss';
    expect(transfrom(content, config.paths)).toEqual(expect.stringContaining('at-root'));
  })
})

describe("transfrom less", () => {
  test("generate content successful", () => {
    const content = `
.wrap {
  background: rgba(0, 0, 0, 0.5);
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.container {
  background: url(@/assets/image/pre-rank-bg.png);
  background-size: 100%;
  width: 300px;
  height: 460px;
  box-sizing: border-box;
  padding: 32px 16px 28px 16px;
  z-index: 1;

  &::after {
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    top: -40px;
    content: '';

    @i18n background-image: url(pre-rank-title.png);
    background-size: 100%;
    display: block;
    width: 240px;
    height: 58px;

    .test {
      @i18n background-image: url(pre-rank-title.png);
    }
  }
}

.closeBtn {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 24px;

  img {
    width: 36px;
    height: 36px;
  }
}

.ribbonWrap {
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;

  canvas {
    width: 100%;
    height: 100%;
  }
}

.outter {
  width: 100%;
  position: relative;
  animation: scaleIn ease 0.5s forwards;
  display: flex;
  align-items: center;
  flex-direction: column;
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
  }
  75% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.starWrap {
  width: 375px;
  height: 200px;
  position: absolute;
  top: -120px;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 2;

  canvas {
    width: 100%;
    height: 100%;
  }
}

.lightWrap {
  width: 280px;
  height: 280px;
  position: absolute;
  top: -100px;
  z-index: 0;

  canvas {
    width: 100%;
    height: 100%;
  }
}
`
    global.i18nSyntax = 'less';
    expect(transfrom(content, config.paths)).toEqual(expect.stringContaining('&'));
  })
})

describe("transfrom css", () => {
  test("generate content successful", () => {
    const content = `
.test {
  @i18n background-image: url(test.png);
}
`
    global.i18nSyntax = 'css';
    expect(transfrom(content, config.paths)).toEqual(expect.stringContaining('html'));
  })
})