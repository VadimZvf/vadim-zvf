(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();const a={symbolsPerLine:54,linesCount:18,fontSize:40};class g{constructor(e,t){this.onType=this.onType.bind(this),this.onDelete=this.onDelete.bind(this),this.onFocus=this.onFocus.bind(this),this.onBlur=this.onBlur.bind(this),this.onEnter=this.onEnter.bind(this),this.renderer=e,this.input=t,this.input.subscribeChangeEvent(this.onType),this.input.subscribeBackspaceKeyEvent(this.onDelete),this.input.subscribeFocusEvent(this.onFocus),this.input.subscribeBlurEvent(this.onBlur),this.input.subscribeEnterKeyEvent(this.onEnter),this.commandListeners=[],window.requestAnimationFrame(this.update.bind(this))}renderer;input;commandListeners;static defaultInputArrow=">";static cursorSymbol="█";static cursorBlinkInterval=500;content=[];typedText="";inputArrow=g.defaultInputArrow;isFocused=!1;cursorVisible=!1;subscribeCommand(e){this.commandListeners.push(e)}addContent(e){const t=[];for(let r=0;r<e.length;r++){const i=e[r];i.length>a.symbolsPerLine?(t.push(i.slice(0,a.symbolsPerLine)),e[r]=i.slice(a.symbolsPerLine),r--):t.push(i)}this.content=this.content.concat(t),this.checkLinesCount(),this.updateRenderer()}setInputArrow(e){this.inputArrow=e,this.updateRenderer()}resetInputArrow(){this.inputArrow!==g.defaultInputArrow&&(this.inputArrow=g.defaultInputArrow,this.updateRenderer())}clear(){this.content=Array(17).fill(" "),this.checkLinesCount(),this.updateRenderer()}toggleRainbowEffect(){this.renderer.toggleRainbowEffect()}onType(e){this.typedText.length+e.length+1<=a.symbolsPerLine&&(this.typedText+=e,this.checkLinesCount(),this.updateRenderer())}onDelete(){this.typedText.length>0&&(this.typedText=this.typedText.substring(0,this.typedText.length-1),this.updateRenderer())}onEnter(){const e=this.typedText;this.typedText="",this.updateRenderer();for(const t of this.commandListeners)t(e.toLocaleLowerCase())}onFocus(){this.isFocused=!0,this.updateRenderer()}onBlur(){this.isFocused=!1,this.updateRenderer()}checkLinesCount(){this.content.length>=a.linesCount&&(this.content=this.content.slice(this.content.length-a.linesCount+1))}update(e){this.isFocused&&(this.cursorVisible=Math.floor(e/g.cursorBlinkInterval)%2===0,this.updateRenderer()),window.requestAnimationFrame(this.update.bind(this))}updateRenderer(){const e=this.content.concat([`${this.inputArrow}${this.typedText}${this.cursorVisible?g.cursorSymbol:""}`]);this.renderer.setContent(e)}}class O{constructor(e,t){this.handleCommand=this.handleCommand.bind(this),this.screen=e,this.system=this.createSystem(),this.loadPrograms(t),e.subscribeCommand(this.handleCommand)}screen;system;programs={};programInProgress;systemApiInProgress=null;loadPrograms(e){for(const t of e)this.programs[t.name]=t.program}handleCommand(e=""){const t=e.split(" ");if(this.systemApiInProgress&&this.performSystemApi(),this.programInProgress){this.performCurrentProgram(t);return}const[r,...i]=t;this.runProgram(r,i)}runProgram(e,t){if(e&&this.programs[e]){this.programInProgress=this.programs[e](t,this.system),this.performCurrentProgram(t);return}this.screen.addContent([`Unknown command - ${e}`,'Use "help" to see the list of available commands'])}performCurrentProgram(e){if(!this.programInProgress)return;const t=this.programInProgress.next(e);if(t.done){this.programInProgress=null;return}t.value&&this.applySystemAPI(t.value)}applySystemAPI(e){e&&e.type===T.text&&(this.systemApiInProgress=T.text,e.data&&e.data.arrowText&&this.screen.setInputArrow(e.data.arrowText))}performSystemApi(){this.systemApiInProgress===T.text&&this.screen.resetInputArrow(),this.systemApiInProgress=null}createSystem(){return{addContent:e=>this.screen.addContent(e),toggleRainbowEffect:()=>this.screen.toggleRainbowEffect(),clear:()=>this.screen.clear(),requestText:e=>({type:T.text,data:e}),lockInput(){throw new Error("Not implemented")},unlockInput(){throw new Error("Not implemented")}}}}const T={text:"REQUEST_STRING"};function c(n,e){return{name:n,program:e}}function m(n){const e=document.createElement("a");e.target="_blank",e.href=n,e.click()}function D(n,e){switch(n){case"vk":m("https://vk.com/zainetdinov_vadim");break;case"instagram":m("https://www.instagram.com/zainetdinovvadim");break;case"linkedin":m("https://www.linkedin.com/in/vadim-zaynetdinov-27908417b");break;case"telegram":m("https://t.me/vadimzvf");break;default:e.addContent([`Unknown social name - ${n}`]);break}}const H=c("socials",function*(n,e){const[t]=n;if(t){D(t,e);return}else e.addContent(["I am in social networks:"," - vk"," - instagram"," - linkedin"," - telegram","Enter the name of a social network to open it"]);const r=yield e.requestText({arrowText:"social:"});D(r[0],e)}),W=c("help",function*(n,e){e.addContent(["Available commands:"," - contacts"," - socials"," - about"," - show"," - rainbow"," - race"," - source-code"," - help"," - clear"])}),Y=c("contacts",function*(n,e){e.addContent(["email: vadim.zvf@gmail.com","","Do you want to write to me?"]);const t=yield e.requestText({arrowText:"Yes or no (Y/N):"});["Y","y","Yes","yes"].includes(t[0])?m("mailto:vadim.zvf@gmail.com"):e.addContent(["OK :("])});function $(){const n=new Date("1994-07-14"),e=Date.now()-n.getTime(),t=new Date(e);return Math.abs(t.getUTCFullYear()-1970)}const K=c("about",function*(n,e){e.clear(),e.addContent(["name: Vadim",`age: ${$()}`,"skills: Frontend","experience:","  May 2023 - now...............Pigment","  April 2020 - May 2023........Yandex","  July 2017 - March 2020.......byndyusoft","  September 2016 - July 2017...bookscriptor","  ... - September 2016.........freelance","","",""])}),q=c("source-code",function*(n,e){m("https://github.com/VadimZvf/vadim-zvf")});function B(n,e){switch(n){case"cat":e.addContent(["██        ██","█ █      █ █","█░ █    █ ░█","█░░ ████ ░░█","█  █    █  █","█          █     ██","█  █    █  █    █  █","█ █ █  █ █ █    █   █","█░░      ░░█     ██  █"," █   ░░   █ ███    █ █","  █      █     █   █ █","   ██████   ██  █  █ █","    █      █    ███  █","    █      █    ██   █","   ███     █    █   █","  █       █     ████","   █████████████"]);break;case"dog":e.addContent([" ███     ███","█░░░█████░░░█","█░██  ░░░██░█"," █ █ █░█░█ █","   █  ░░░█","  █       █","  █  ███  █","  █       █    ██","   █  █  █ █   █░█","    █████  ░█   █░█","       █   ░░█   █ █","       █   ░░░█  █ █","       █ █ █░░░██   █","       █ █ █        █","       █ █ █     █  █","      █  █  █   █   █","      ███████████████"]);break;default:e.addContent(["Unknown name"]);break}}const V=c("show",function*(n,e){const[t]=n;if(t){B(t,e);return}else e.addContent(["I can show you a cat or a dog. who do you want to see?"]);const r=yield e.requestText({arrowText:"name:"});B(r[0],e)}),j=c("clear",function*(n,e){e.clear()}),J=c("rainbow",function*(n,e){e.toggleRainbowEffect()}),Q=c("greeting",function*(n,e){e.addContent(["HELLO!","Nice to meet U!","My name is Vadim and this is my petproject","","If U need help, just write command - help"])}),Z=""+new URL("explosion-CySXobLL.wav",import.meta.url).href,ee=""+new URL("speed-FadTC-I9.wav",import.meta.url).href,v=40,X=17,E=11,w=17,y=[" █ ","███"," █ ","█ █"],d=y[0].length,te=y.length,P=["░░░"],ne=P[0].length,re=P.length,_=["░░░░░░░░░░░░░░","░  YOU FAIL  ░","░ TRY HARDER ░","░░░░░░░░░░░░░░"];function f(n,e,t){const r=e.length,i=e[0].length;for(let s=0;s<n.length;s++)if(!(s<t.y||s>=t.y+r))for(let o=0;o<n[s].length;o++)o<t.x||o>=t.x+i||(n[s][o]=e[s-t.y][o-t.x]);return n}function ie(){const n=[];for(let e=0;e<X;e++){const t=[];for(let r=0;r<v;r++)t.push(" ");n.push(t)}return n}function se(n){for(const e of n)e[0]="░",e[E-1]="░"}const N=[1,4,7],oe=8,R=200,ae=30;function G(){const n=Math.floor(Math.random()*N.length);return N[n]}function ce(){const n=[];for(let e=w;e>=0;e-=oe)n.push({x:G(),y:e-w});return n}function he(n){const e=[];for(const t of n)t.y>w?e.push({x:G(),y:-te}):e.push({x:t.x,y:t.y+1});return e}function le(n){return 1-Math.pow(1-n,3)}function ue(n,e){const t=e-n,r=R-ae;return R-r*le(t/1e5)}function de(n,e){for(const t of n)if(Math.abs(t.x-e.x)<ne&&Math.abs(t.y-e.y)<re)return!0;return!1}function z(){return(JSON.parse(window.localStorage.getItem("race"))||{bestScore:0}).bestScore}function ge(n){n>z()&&window.localStorage.setItem("race",JSON.stringify({bestScore:n}))}const fe=c("race",function*(n,e){const t=new Audio(Z);t.volume=.5;const r=new Audio(ee);r.volume=.3;const i={x:0,y:0};let s;function o(){const l=z();i.x=Math.round(E/2-d/2),i.y=w-y.length;const b=Date.now();let u=ce(),F=Date.now(),p=0,C=R;function I(){const A=Date.now(),h=ie();if(se(h),A>=F+C){if(u=he(u),F=A,p+=1,de(u,i)){f(h,_,{x:Math.round(v/2-_[0].length/2),y:Math.round(X/2-_.length/2)}),t.play(),ge(p),e.addContent(h.map(x=>x.join("")));return}p%8===0&&r.play()}C=ue(b,A);for(const x of u)f(h,P,x);f(h,y,i),f(h,["best score:"+l],{x:v-25,y:0}),f(h,["score:"+p],{x:v-25,y:1}),f(h,["speed:"+Math.floor(R-C)],{x:v-25,y:3}),e.addContent(h.map(x=>x.join(""))),s=window.requestAnimationFrame(I)}s=window.requestAnimationFrame(I)}function L(l){l.key==="ArrowLeft"&&i.x>1&&(i.x=i.x-d),l.key==="ArrowRight"&&i.x<E-d-1&&(i.x=i.x+d)}function U(l){const b=window.innerWidth,u=l.touches[0].clientX;u/b<.45&&i.x>1&&(i.x=i.x-d),u/b>=.55&&i.x<E-d-1&&(i.x=i.x+d)}for(document.addEventListener("keydown",L),document.addEventListener("touchstart",U),o();;){const[l]=yield e.requestText({arrowText:"type q - for exit, r - for retry:"});if(e.clear(),window.cancelAnimationFrame(s),["R","r","retry","Retry"].includes(l))o();else{document.removeEventListener("keydown",L),document.removeEventListener("touchstart",U);return}}}),me=c("ls",function*(n,e){e.addContent(["No files here"])}),xe=c("pwd",function*(n,e){e.addContent(["/"])}),ve=c("mkdir",function*(n,e){e.addContent(["Permission denied"])}),be=c("cd",function*(n,e){e.addContent(["Permission denied"])}),pe=`precision highp float;
uniform float uShowRainbow;
uniform sampler2D uScreenTexture;
uniform float time;
varying vec2 v_uv;


// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃       Rainbow effect       ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
vec4 rainbow(vec2 uv) {
    vec3 color = 0.5 + 0.5 * cos(time / 10.0 + uv.xyx + vec3(0,2,4));

    return uShowRainbow == 1.0 ? vec4(color, 1.0) : vec4(1.0);
}

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃       Curved effect        ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
// Takes coordinates of a pixel and returns new coordinates with applied curvature
// of the simulated screen
vec2 getCurvedScreenUv(vec2 uv) {
    vec2 intensity = vec2(
        0.04,
        0.01
    );

    // Simple stretch logic
    vec2 coords = (uv - 0.5) * 2.0;        
        
    vec2 coordsOffset = vec2(
        (1.0 - coords.y * coords.y) * intensity.y * (coords.x), 
        (1.0 - coords.x * coords.x) * intensity.x * (coords.y)
    );

    return uv - coordsOffset;
}

vec3 applyPadding(vec2 uv) {
    vec2 padding = vec2(0.1, 0.1);

    vec2 scale = (0.5 - padding) / 0.5;
    vec2 centeredUv = uv - 0.5;
    vec2 scaledCenteredUv = centeredUv / scale;
    vec2 finalUv = scaledCenteredUv + 0.5;

    return vec3(
        finalUv,
        // alpha to hide pixels outside of the screen
        step(0.0, finalUv.x) * step(0.0, finalUv.y) * step(finalUv.x, 1.0) * step(finalUv.y, 1.0)
    );
}

void main(void) {
    vec2 curvedUv = getCurvedScreenUv(v_uv);
    vec3 uv = applyPadding(curvedUv);

    vec4 textColor = texture2D(uScreenTexture, uv.xy);

    textColor *= rainbow(uv.xy);

    gl_FragColor = textColor * uv.z;
}
`,Te=`precision highp float;

uniform sampler2D uTexture;

uniform float u_horizontal;

uniform vec2 u_resolution;

uniform float u_blurRadius;
varying vec2 v_uv;

float weight0 = 0.227027;
float weight1 = 0.1945946;
float weight2 = 0.1216216;
float weight3 = 0.054054;
float weight4 = 0.016216;

void main(void) {
    vec2 texelSize = 1.0 / u_resolution;

    vec2 direction = u_horizontal == 1.0 ? vec2(1.0, 0.0) : vec2(0.0, 1.0);

    vec3 result = texture2D(uTexture, v_uv).rgb * weight0;

    // Sample ±1 pixel
    vec2 offset1 = direction * texelSize * 1.0 * u_blurRadius;
    result += texture2D(uTexture, v_uv + offset1).rgb * weight1;
    result += texture2D(uTexture, v_uv - offset1).rgb * weight1;

    // Sample ±2 pixels
    vec2 offset2 = direction * texelSize * 2.0 * u_blurRadius;
    result += texture2D(uTexture, v_uv + offset2).rgb * weight2;
    result += texture2D(uTexture, v_uv - offset2).rgb * weight2;

    // Sample ±3 pixels
    vec2 offset3 = direction * texelSize * 3.0 * u_blurRadius;
    result += texture2D(uTexture, v_uv + offset3).rgb * weight3;
    result += texture2D(uTexture, v_uv - offset3).rgb * weight3;

    // Sample ±4 pixels
    vec2 offset4 = direction * texelSize * 4.0 * u_blurRadius;
    result += texture2D(uTexture, v_uv + offset4).rgb * weight4;
    result += texture2D(uTexture, v_uv - offset4).rgb * weight4;

    gl_FragColor = vec4(result, 1.0);
}
`,Ee=`precision highp float;

uniform sampler2D uTexture1;
uniform sampler2D uTexture2;

varying vec2 v_uv;

void main(void) {
    vec4 color1 = texture2D(uTexture1, v_uv);
    vec4 color2 = texture2D(uTexture2, v_uv);

    gl_FragColor = color1 + color2;
}
`,S=`precision mediump float;
attribute vec2 a_position;

varying vec2 v_uv;

void main() {
    v_uv = a_position * 0.5 + 0.5;

    gl_Position = vec4(a_position, 0.0, 1.0);
}`,k="monospace",M="#fff";class we{constructor(e){const t=document.createElement("canvas");t.style.position="absolute",t.style.top="-100%",t.style.left="-100%",t.style.opacity="0",document.body.appendChild(t),this.screenCanvasCtx=t.getContext("2d");const r=document.createElement("canvas");document.body.appendChild(r),this.renderCanvas=r,this.setSize(e.size)}renderCanvas;renderProgram;mergeProgram;blurProgram;blurTextureA;blurTextureB;blurFramebufferA;blurFramebufferB;gl;screenTexture;screenBendedTexture;screenBendedFramebuffer;screenCanvasCtx;screenLineHeight;isRainbowEffectEnabled=!1;render(e){this.gl.useProgram(this.renderProgram),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,this.blurFramebufferB),this.gl.activeTexture(this.gl.TEXTURE0),this.gl.bindTexture(this.gl.TEXTURE_2D,this.screenTexture),this.gl.uniform1i(this.gl.getUniformLocation(this.renderProgram,"uScreenTexture"),0),this.gl.uniform1f(this.gl.getUniformLocation(this.renderProgram,"uShowRainbow"),this.isRainbowEffectEnabled?1:0),this.gl.uniform1f(this.gl.getUniformLocation(this.renderProgram,"time"),e/100),this.gl.drawArrays(this.gl.TRIANGLE_STRIP,0,4),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,this.screenBendedFramebuffer),this.gl.drawArrays(this.gl.TRIANGLE_STRIP,0,4),this.gl.useProgram(this.blurProgram);for(let t=0;t<8;t++)[this.blurTextureA,this.blurTextureB]=[this.blurTextureB,this.blurTextureA],[this.blurFramebufferA,this.blurFramebufferB]=[this.blurFramebufferB,this.blurFramebufferA],this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,this.blurFramebufferB),this.gl.bindTexture(this.gl.TEXTURE_2D,this.blurTextureA),this.gl.uniform1i(this.gl.getUniformLocation(this.blurProgram,"uTexture"),0),this.gl.uniform2f(this.gl.getUniformLocation(this.blurProgram,"u_resolution"),this.renderCanvas.width,this.renderCanvas.height),this.gl.uniform1f(this.gl.getUniformLocation(this.blurProgram,"u_blurRadius"),.5),this.gl.uniform1f(this.gl.getUniformLocation(this.blurProgram,"u_horizontal"),t%2===0?1:0),this.gl.drawArrays(this.gl.TRIANGLE_STRIP,0,4);this.gl.useProgram(this.mergeProgram),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.activeTexture(this.gl.TEXTURE0),this.gl.bindTexture(this.gl.TEXTURE_2D,this.blurTextureB),this.gl.uniform1i(this.gl.getUniformLocation(this.mergeProgram,"uTexture1"),0),this.gl.activeTexture(this.gl.TEXTURE1),this.gl.bindTexture(this.gl.TEXTURE_2D,this.screenBendedTexture),this.gl.uniform1i(this.gl.getUniformLocation(this.mergeProgram,"uTexture2"),1),this.gl.drawArrays(this.gl.TRIANGLE_STRIP,0,4)}setSize(e){const t=Math.min(e.width,e.height);this.renderCanvas.width=t,this.renderCanvas.height=t}createScreen(){this.screenCanvasCtx.font=`${a.fontSize}px ${k}`,this.screenCanvasCtx.fillStyle=M,this.screenCanvasCtx.textBaseline="top";const e=this.screenCanvasCtx.measureText("M"),t=e.width;this.screenLineHeight=e.fontBoundingBoxDescent;const r=t*a.symbolsPerLine,i=this.screenLineHeight*a.linesCount;this.screenCanvasCtx.canvas.width=r,this.screenCanvasCtx.canvas.height=i,this.gl=this.renderCanvas.getContext("webgl"),this.blurTextureA=this.createTextureWithSize(this.renderCanvas.width,this.renderCanvas.height),this.blurTextureB=this.createTextureWithSize(this.renderCanvas.width,this.renderCanvas.height),this.blurFramebufferA=this.createFramebuffer(this.blurTextureA),this.blurFramebufferB=this.createFramebuffer(this.blurTextureB),this.renderProgram=this.createProgram(S,pe),this.blurProgram=this.createProgram(S,Te),this.mergeProgram=this.createProgram(S,Ee),this.screenTexture=this.createTexture(this.screenCanvasCtx.canvas),this.screenBendedTexture=this.createTextureWithSize(this.renderCanvas.width,this.renderCanvas.height),this.screenBendedFramebuffer=this.createFramebuffer(this.screenBendedTexture);const s=new Float32Array([-1,-1,1,-1,-1,1,1,1]);this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.gl.createBuffer()),this.gl.bufferData(this.gl.ARRAY_BUFFER,s,this.gl.STATIC_DRAW);const o=this.gl.getAttribLocation(this.renderProgram,"a_position");this.gl.enableVertexAttribArray(o),this.gl.vertexAttribPointer(o,2,this.gl.FLOAT,!1,0,0)}setLines(e){e.length>a.linesCount&&console.warn(`Too many lines - ${e.length}. Maximum available - ${a.linesCount}`),this.screenCanvasCtx.clearRect(0,0,this.screenCanvasCtx.canvas.width,this.screenCanvasCtx.canvas.height),this.screenCanvasCtx.font=`${a.fontSize}px ${k}`,this.screenCanvasCtx.fillStyle=M,this.screenCanvasCtx.textBaseline="top";const t=e.slice(0,a.linesCount);for(let r=0;r<t.length;r++){let i=e[r];i.length>a.symbolsPerLine&&console.warn(`Too many symbols - ${i.length}. Line can contain maximum - ${a.symbolsPerLine}`),this.screenCanvasCtx.fillText(i,0,this.screenLineHeight*r)}this.gl.bindTexture(this.gl.TEXTURE_2D,this.screenTexture),this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL,!0),this.gl.texSubImage2D(this.gl.TEXTURE_2D,0,0,0,this.gl.RGBA,this.gl.UNSIGNED_BYTE,this.screenCanvasCtx.canvas)}toggleRainbowEffect(){this.isRainbowEffectEnabled=!this.isRainbowEffectEnabled}createTexture(e){this.gl.activeTexture(this.gl.TEXTURE0);let t=this.gl.createTexture();return this.gl.bindTexture(this.gl.TEXTURE_2D,t),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.NEAREST),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.NEAREST),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,e),t}createTextureWithSize(e,t){this.gl.activeTexture(this.gl.TEXTURE0);let r=this.gl.createTexture();return this.gl.bindTexture(this.gl.TEXTURE_2D,r),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.NEAREST),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.NEAREST),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,e,t,0,this.gl.RGBA,this.gl.UNSIGNED_BYTE,null),r}createFramebuffer(e){let t=this.gl.createFramebuffer();return this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,t),this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER,this.gl.COLOR_ATTACHMENT0,this.gl.TEXTURE_2D,e,0),t}createShader(e,t){const r=this.gl.createShader(e);return this.gl.shaderSource(r,t),this.gl.compileShader(r),this.gl.getShaderParameter(r,this.gl.COMPILE_STATUS)||console.error(this.gl.getShaderInfoLog(r)),r}createProgram(e,t){const r=this.gl.createProgram();return this.gl.attachShader(r,this.createShader(this.gl.VERTEX_SHADER,e)),this.gl.attachShader(r,this.createShader(this.gl.FRAGMENT_SHADER,t)),this.gl.linkProgram(r),this.gl.getProgramParameter(r,this.gl.LINK_STATUS)||console.error(this.gl.getProgramInfoLog(r)),r}}class ye{constructor(){this.render=this.render.bind(this),this.handleResize=this.handleResize.bind(this);const e={width:window.innerWidth,height:window.innerHeight};this.webGLRenderer=new we({size:e}),this.webGLRenderer.createScreen(),this.init()}webGLRenderer;init(){window.addEventListener("resize",this.handleResize),this.render(Date.now())}render(e){this.webGLRenderer.render(e),window.requestAnimationFrame(this.render)}handleResize(){const e={width:window.innerWidth,height:window.innerHeight};this.webGLRenderer.setSize(e)}setContent(e){this.webGLRenderer.setLines(e)}toggleRainbowEffect(){this.webGLRenderer.toggleRainbowEffect()}}const Re=/Android/i.test(navigator.userAgent);class Ce{constructor(){this.textareaNode=document.createElement("textarea"),this.textareaNode.style.position="absolute",this.textareaNode.style.top="50%",this.textareaNode.style.left="-999px",this.textareaNode.style.zIndex="-9999",this.textareaNode.style.fontSize="99px",this.textareaNode.style.opacity="0",document.body.appendChild(this.textareaNode),this.subscribeEvents()}textareaNode;subscribeEvents(){document.addEventListener("click",()=>{this.textareaNode.focus()})}subscribeChangeEvent(e){Re?document.addEventListener("input",t=>{const r=t.data;r&&e(r),this.textareaNode.value=""}):this.textareaNode.addEventListener("keydown",t=>{t.key&&t.key.length===1&&(e(t.key),this.textareaNode.value="")})}subscribeBackspaceKeyEvent(e){this.textareaNode.addEventListener("keydown",t=>{t.key==="Backspace"&&e(),this.textareaNode.value=""})}subscribeEnterKeyEvent(e){this.textareaNode.addEventListener("keyup",t=>{t.key==="Enter"&&e(),this.textareaNode.value=""})}subscribeFocusEvent(e){this.textareaNode.addEventListener("focus",()=>{e()})}subscribeBlurEvent(e){this.textareaNode.addEventListener("blur",()=>{e()})}}const Ae=[H,W,Y,K,q,V,j,J,Q,fe,me,xe,ve,be];function _e(){const n=new g(new ye,new Ce);new O(n,Ae).runProgram("greeting",[])}_e();
