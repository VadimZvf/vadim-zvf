(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(i){if(i.ep)return;i.ep=!0;const o=t(i);fetch(i.href,o)}})();const a={symbolsPerLine:54,linesCount:18,fontSize:32};class f{constructor(e,t){this.onType=this.onType.bind(this),this.onDelete=this.onDelete.bind(this),this.onFocus=this.onFocus.bind(this),this.onBlur=this.onBlur.bind(this),this.onEnter=this.onEnter.bind(this),this.renderer=e,this.input=t,this.input.subscribeChangeEvent(this.onType),this.input.subscribeBackspaceKeyEvent(this.onDelete),this.input.subscribeFocusEvent(this.onFocus),this.input.subscribeBlurEvent(this.onBlur),this.input.subscribeEnterKeyEvent(this.onEnter),this.commandListeners=[],window.requestAnimationFrame(this.update.bind(this))}renderer;input;commandListeners;static defaultInputArrow=">";static cursorSymbol="█";static cursorBlinkInterval=500;content=[];typedText="";inputArrow=f.defaultInputArrow;isFocused=!1;cursorVisible=!1;subscribeCommand(e){this.commandListeners.push(e)}addContent(e){const t=[];for(let s=0;s<e.length;s++){const i=e[s];i.length>a.symbolsPerLine?(t.push(i.slice(0,a.symbolsPerLine)),e[s]=i.slice(a.symbolsPerLine),s--):t.push(i)}this.content=this.content.concat(t),this.checkLinesCount(),this.updateRenderer()}setInputArrow(e){this.inputArrow=e,this.updateRenderer()}resetInputArrow(){this.inputArrow!==f.defaultInputArrow&&(this.inputArrow=f.defaultInputArrow,this.updateRenderer())}clear(){this.content=Array(17).fill(" "),this.checkLinesCount(),this.updateRenderer()}toggleRainbowEffect(){this.renderer.toggleRainbowEffect()}onType(e){this.typedText.length+e.length+1<=a.symbolsPerLine&&(this.typedText+=e,this.checkLinesCount(),this.updateRenderer())}onDelete(){this.typedText.length>0&&(this.typedText=this.typedText.substring(0,this.typedText.length-1),this.updateRenderer())}onEnter(){const e=this.typedText;this.typedText="",this.updateRenderer();for(const t of this.commandListeners)t(e.toLocaleLowerCase())}onFocus(){this.isFocused=!0,this.updateRenderer()}onBlur(){this.isFocused=!1,this.updateRenderer()}checkLinesCount(){this.content.length>=a.linesCount&&(this.content=this.content.slice(this.content.length-a.linesCount+1))}update(e){this.isFocused&&(this.cursorVisible=Math.floor(e/f.cursorBlinkInterval)%2===0,this.updateRenderer()),window.requestAnimationFrame(this.update.bind(this))}updateRenderer(){const e=this.content.concat([`${this.inputArrow}${this.typedText}${this.cursorVisible?f.cursorSymbol:""}`]);this.renderer.setContent(e)}}class G{constructor(e,t){this.handleCommand=this.handleCommand.bind(this),this.screen=e,this.system=this.createSystem(),this.loadPrograms(t),e.subscribeCommand(this.handleCommand)}screen;system;programs={};programInProgress;systemApiInProgress=null;loadPrograms(e){for(const t of e)this.programs[t.name]=t.program}handleCommand(e=""){const t=e.split(" ");if(this.systemApiInProgress&&this.performSystemApi(),this.programInProgress){this.performCurrentProgram(t);return}const[s,...i]=t;this.runProgram(s,i)}runProgram(e,t){if(e&&this.programs[e]){this.programInProgress=this.programs[e](t,this.system),this.performCurrentProgram(t);return}this.screen.addContent([`Unknown command - ${e}`,'Use "help" to see the list of available commands'])}performCurrentProgram(e){if(!this.programInProgress)return;const t=this.programInProgress.next(e);if(t.done){this.programInProgress=null;return}t.value&&this.applySystemAPI(t.value)}applySystemAPI(e){e&&e.type===b.text&&(this.systemApiInProgress=b.text,e.data&&e.data.arrowText&&this.screen.setInputArrow(e.data.arrowText))}performSystemApi(){this.systemApiInProgress===b.text&&this.screen.resetInputArrow(),this.systemApiInProgress=null}createSystem(){return{addContent:e=>this.screen.addContent(e),toggleRainbowEffect:()=>this.screen.toggleRainbowEffect(),clear:()=>this.screen.clear(),requestText:e=>({type:b.text,data:e}),lockInput(){throw new Error("Not implemented")},unlockInput(){throw new Error("Not implemented")}}}}const b={text:"REQUEST_STRING"};function c(n,e){return{name:n,program:e}}function g(n){const e=document.createElement("a");e.target="_blank",e.href=n,e.click()}function D(n,e){switch(n){case"vk":g("https://vk.com/zainetdinov_vadim");break;case"instagram":g("https://www.instagram.com/zainetdinovvadim");break;case"linkedin":g("https://www.linkedin.com/in/vadim-zaynetdinov-27908417b");break;case"telegram":g("https://t.me/vadimzvf");break;default:e.addContent([`Unknown social name - ${n}`]);break}}const M=c("socials",function*(n,e){const[t]=n;if(t){D(t,e);return}else e.addContent(["I am in social networks:"," - vk"," - instagram"," - linkedin"," - telegram","Enter the name of a social network to open it"]);const s=yield e.requestText({arrowText:"social:"});D(s[0],e)}),H=c("help",function*(n,e){e.addContent(["Available commands:"," - contacts"," - socials"," - about"," - show"," - rainbow"," - race"," - source-code"," - help"," - clear"])}),X=c("contacts",function*(n,e){e.addContent(["email: vadim.zvf@gmail.com","","Do you want to write to me?"]);const t=yield e.requestText({arrowText:"Yes or no (Y/N):"});["Y","y","Yes","yes"].includes(t[0])?g("mailto:vadim.zvf@gmail.com"):e.addContent(["OK :("])});function z(){const n=new Date("1994-07-14"),e=Date.now()-n.getTime(),t=new Date(e);return Math.abs(t.getUTCFullYear()-1970)}const W=c("about",function*(n,e){e.clear(),e.addContent(["name: Vadim",`age: ${z()}`,"skills: Frontend","experience:","  May 2023 - now...............Pigment","  April 2020 - May 2023........Yandex","  July 2017 - March 2020.......byndyusoft","  September 2016 - July 2017...bookscriptor","  ... - September 2016.........freelance","","",""])}),Y=c("source-code",function*(n,e){g("https://github.com/VadimZvf/vadim-zvf")});function N(n,e){switch(n){case"cat":e.addContent(["██        ██","█ █      █ █","█░ █    █ ░█","█░░ ████ ░░█","█  █    █  █","█          █     ██","█  █    █  █    █  █","█ █ █  █ █ █    █   █","█░░      ░░█     ██  █"," █   ░░   █ ███    █ █","  █      █     █   █ █","   ██████   ██  █  █ █","    █      █    ███  █","    █      █    ██   █","   ███     █    █   █","  █       █     ████","   █████████████"]);break;case"dog":e.addContent([" ███     ███","█░░░█████░░░█","█░██  ░░░██░█"," █ █ █░█░█ █","   █  ░░░█","  █       █","  █  ███  █","  █       █    ██","   █  █  █ █   █░█","    █████  ░█   █░█","       █   ░░█   █ █","       █   ░░░█  █ █","       █ █ █░░░██   █","       █ █ █        █","       █ █ █     █  █","      █  █  █   █   █","      ███████████████"]);break;default:e.addContent(["Unknown name"]);break}}const $=c("show",function*(n,e){const[t]=n;if(t){N(t,e);return}else e.addContent(["I can show you a cat or a dog. who do you want to see?"]);const s=yield e.requestText({arrowText:"name:"});N(s[0],e)}),q=c("clear",function*(n,e){e.clear()}),K=c("rainbow",function*(n,e){e.toggleRainbowEffect()}),V=c("greeting",function*(n,e){e.addContent(["HELLO!","Nice to meet U!","My name is Vadim and this is my petproject","","If U need help, just write command - help"])}),j=""+new URL("explosion-CySXobLL.wav",import.meta.url).href,J=""+new URL("speed-FadTC-I9.wav",import.meta.url).href,v=40,B=17,E=11,C=17,T=[" █ ","███"," █ ","█ █"],u=T[0].length,Q=T.length,I=["░░░"],Z=I[0].length,ee=I.length,L=["░░░░░░░░░░░░░░","░  YOU FAIL  ░","░ TRY HARDER ░","░░░░░░░░░░░░░░"];function m(n,e,t){const s=e.length,i=e[0].length;for(let o=0;o<n.length;o++)if(!(o<t.y||o>=t.y+s))for(let r=0;r<n[o].length;r++)r<t.x||r>=t.x+i||(n[o][r]=e[o-t.y][r-t.x]);return n}function te(){const n=[];for(let e=0;e<B;e++){const t=[];for(let s=0;s<v;s++)t.push(" ");n.push(t)}return n}function ne(n){for(const e of n)e[0]="░",e[E-1]="░"}const F=[1,4,7],ie=8,R=200,se=30;function U(){const n=Math.floor(Math.random()*F.length);return F[n]}function oe(){const n=[];for(let e=C;e>=0;e-=ie)n.push({x:U(),y:e-C});return n}function re(n){const e=[];for(const t of n)t.y>C?e.push({x:U(),y:-Q}):e.push({x:t.x,y:t.y+1});return e}function ae(n){return 1-Math.pow(1-n,3)}function ce(n,e){const t=e-n,s=R-se;return R-s*ae(t/1e5)}function le(n,e){for(const t of n)if(Math.abs(t.x-e.x)<Z&&Math.abs(t.y-e.y)<ee)return!0;return!1}function O(){return(JSON.parse(window.localStorage.getItem("race"))||{bestScore:0}).bestScore}function de(n){n>O()&&window.localStorage.setItem("race",JSON.stringify({bestScore:n}))}const he=c("race",function*(n,e){const t=new Audio(j);t.volume=.5;const s=new Audio(J);s.volume=.3;const i={x:0,y:0};let o;function r(){const d=O();i.x=Math.round(E/2-u/2),i.y=C-T.length;const x=Date.now();let h=oe(),_=Date.now(),w=0,S=R;function k(){const A=Date.now(),l=te();if(ne(l),A>=_+S){if(h=re(h),_=A,w+=1,le(h,i)){m(l,L,{x:Math.round(v/2-L[0].length/2),y:Math.round(B/2-L.length/2)}),t.play(),de(w),e.addContent(l.map(y=>y.join("")));return}w%8===0&&s.play()}S=ce(x,A);for(const y of h)m(l,I,y);m(l,T,i),m(l,["best score:"+d],{x:v-25,y:0}),m(l,["score:"+w],{x:v-25,y:1}),m(l,["speed:"+Math.floor(R-S)],{x:v-25,y:3}),e.addContent(l.map(y=>y.join(""))),o=window.requestAnimationFrame(k)}o=window.requestAnimationFrame(k)}function p(d){d.key==="ArrowLeft"&&i.x>1&&(i.x=i.x-u),d.key==="ArrowRight"&&i.x<E-u-1&&(i.x=i.x+u)}function P(d){const x=window.innerWidth,h=d.touches[0].clientX;h/x<.45&&i.x>1&&(i.x=i.x-u),h/x>=.55&&i.x<E-u-1&&(i.x=i.x+u)}for(document.addEventListener("keydown",p),document.addEventListener("touchstart",P),r();;){const[d]=yield e.requestText({arrowText:"type q - for exit, r - for retry:"});if(e.clear(),window.cancelAnimationFrame(o),["R","r","retry","Retry"].includes(d))r();else{document.removeEventListener("keydown",p),document.removeEventListener("touchstart",P);return}}}),ue=c("ls",function*(n,e){e.addContent(["No files here"])}),fe=c("pwd",function*(n,e){e.addContent(["/"])}),me=c("mkdir",function*(n,e){e.addContent(["Permission denied"])}),ge=c("cd",function*(n,e){e.addContent(["Permission denied"])}),pe=`precision highp float;
uniform sampler2D uGlitch;
uniform float uShowRainbow;
uniform float uSymbolsPerLineOnScreen;
uniform float uLinesCountOnScreen;
uniform sampler2D uScreenTexture;
uniform float time;
varying vec2 v_uv;

#define SYMBOLS_PER_LINE_IN_SPRITE 11.0
#define LINES_COUNT_IN_SPRITE 15.0

#define TEXT_BRIGHTNESS 2.0

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃        Noise effect        ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
float noise(vec2 uv) {
    float s = texture2D(uGlitch, uv + sin(time * 2.0)).x;
    return s / 5.0; // spped up texture
}

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃       Fisheye effect       ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
vec2 getOffsetCoordinatesByFisheye(vec2 sourceCoordinates) {
    vec2 intensity = vec2(
        0.04,
        0.01
    );

    // Simple streatch logic
    vec2 coords = sourceCoordinates;
    coords = (coords - 0.5) * 2.0;        
        
    vec2 coordsOffset = vec2(
        (1.0 - coords.y * coords.y) * intensity.y * (coords.x), 
        (1.0 - coords.x * coords.x) * intensity.x * (coords.y)
    );

    return sourceCoordinates - coordsOffset;
}

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃     Distortion effect      ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
// a - first value
// b - second value
// c - frequency, 0 - always, 1 - never
float onOff(float a, float b, float c) {
    return step(c, sin(time / 100.0 + a * cos(time / 10.00 * b)));
}

vec2 getDistortedCoords(vec2 uv) {
    vec2 look = uv;

    // Some random calculation, depended Y axis, for wave effect
    float xShift = (
        (sin(look.y * 100.0 + time) / 30.0 * onOff(0.0, 0.01, 0.03) * cos(look.y * time / 2.0)) *
        onOff(1000.0, 0.1, 0.98)
    );

    // Random calculation for broken effect
    float yShift = onOff(0.2, 0.01, 0.5) * (
        sin(time / 15.0) + (sin(time / 2.0) * cos(time + 10.0))
    ) / 500.0;

    look.x = look.x + xShift;
    look.y = look.y + yShift;

    return look;
}

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃       Vignette effect      ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
float vignette(vec2 uv) {
    // Simple noise function, for animate vignette
    float vignetteIntensity = sin(time / 8.0 + cos(time) / 2.0) + 4.0;
    // Dimming for current point
    float vignetteValue = (
        // Calculate dimming for Y axis
        1.0 - (vignetteIntensity * (uv.y - 0.5) * (uv.y - 0.5)) / 2.0
    ) * (
        // Calculate dimming for X axis
        1.0 - (vignetteIntensity * (uv.x - 0.5) * (uv.x - 0.5)) / 2.0
    );

    return vignetteValue;
}

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃       Stripes effect       ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
float ramp(float y, float start, float end) {
    float inside = step(start, y) - step(end, y);
    float fact = (y - start) / (end - start) * inside;

    return (1.0 - fact) * inside;
}

float stripes(vec2 uv) {
    // Animation
    float rand = uv.y * 4.0 + time / 80.0 + sin(time / 80.0 + sin(time / 100.0));

    // get noise color
    float noi = noise(uv);
    // apply noise vawe
    return ramp(mod(rand, 1.5), 0.4, 0.6) * noi;
}

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃       Rainbow effect       ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
vec4 rainbow(vec2 uv) {
    vec3 color = 0.5 + 0.5 * cos(time / 10.0 + uv.xyx + vec3(0,2,4));

    return uShowRainbow == 1.0 ? vec4(color, 1.0) : vec4(1.0);
}

vec4 getText(vec2 uv) {
    return texture2D(uScreenTexture, uv);
}

void main(void) {
    // Real point
    vec4 currentPointColor = vec4(0.0);

    // Apply fisheye effect, and distortion effect
    // vec2 fisheyedCoords = getOffsetCoordinatesByFisheye(v_uv);
    vec2 uvWithDistortion = getDistortedCoords(v_uv);

    // Add text
    currentPointColor += getText(uvWithDistortion);
    // add stripes effect
    currentPointColor += stripes(uvWithDistortion);
    // apply noise texture
    currentPointColor += noise(uvWithDistortion);
    // apply vignette
    currentPointColor *= vignette(uvWithDistortion);
    // apply rainbow effect
    currentPointColor *= rainbow(uvWithDistortion);

    gl_FragColor = currentPointColor;
}
`,ye=`precision mediump float;
attribute vec2 a_position;

varying vec2 v_uv;

void main() {
    v_uv = a_position * 0.5 + 0.5;

    gl_Position = vec4(a_position, 0.0, 1.0);
}`;class ve{constructor(e){const t=document.createElement("canvas");t.style.position="absolute",t.style.top="-100%",t.style.left="-100%",t.style.opacity="0",document.body.appendChild(t),this.screenCanvasCtx=t.getContext("2d"),this.screenCanvasCtx.font=`${a.fontSize}px monospace`,this.screenCanvasCtx.fillStyle="white",this.screenCanvasCtx.textBaseline="top";const s=this.screenCanvasCtx.measureText("M"),i=s.width;this.screenLineHeight=s.fontBoundingBoxDescent+s.fontBoundingBoxAscent;const o=i*a.symbolsPerLine,r=this.screenLineHeight*a.linesCount;t.width=o,t.height=r;const p=document.createElement("canvas");document.body.appendChild(p),this.renderCanvas=p,this.setSize(e.size)}renderCanvas;gl;screenTexture;screenCanvasCtx;screenLineHeight;render(){}setSize(e){this.renderCanvas.width=e.width,this.renderCanvas.height=e.height}createScreen(){this.gl=this.renderCanvas.getContext("webgl");const e=new Float32Array([-1,-1,1,-1,-1,1,1,1]),t=this.gl.createProgram();this.gl.attachShader(t,this.createShader(this.gl.VERTEX_SHADER,ye)),this.gl.attachShader(t,this.createShader(this.gl.FRAGMENT_SHADER,pe)),this.gl.linkProgram(t),this.gl.useProgram(t),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.gl.createBuffer()),this.gl.bufferData(this.gl.ARRAY_BUFFER,e,this.gl.STATIC_DRAW);const s=this.gl.getAttribLocation(t,"a_position");this.gl.enableVertexAttribArray(s),this.gl.vertexAttribPointer(s,2,this.gl.FLOAT,!1,0,0);const i=this.screenCanvasCtx.canvas;this.screenTexture=this.createTexture(i);function o(r){this.gl.activeTexture(this.gl.TEXTURE0),this.gl.bindTexture(this.gl.TEXTURE_2D,this.screenTexture),this.gl.uniform1i(this.gl.getUniformLocation(t,"uScreenTexture"),0),this.gl.uniform1f(this.gl.getUniformLocation(t,"time"),r),this.gl.drawArrays(this.gl.TRIANGLE_STRIP,0,4),requestAnimationFrame(o.bind(this))}requestAnimationFrame(o.bind(this))}setLines(e){e.length>a.linesCount&&console.warn(`Too many lines - ${e.length}. Maximum available - ${a.linesCount}`),this.screenCanvasCtx.clearRect(0,0,this.screenCanvasCtx.canvas.width,this.screenCanvasCtx.canvas.height),this.screenCanvasCtx.font=`${a.fontSize}px monospace`,this.screenCanvasCtx.fillStyle="white",this.screenCanvasCtx.textBaseline="top";const t=e.slice(0,a.linesCount);for(let s=0;s<t.length;s++){let i=e[s];i.length>a.symbolsPerLine&&console.warn(`Too many symbols - ${i.length}. Line can contain maximum - ${a.symbolsPerLine}`),this.screenCanvasCtx.fillText(i,0,this.screenLineHeight*s)}this.gl.bindTexture(this.gl.TEXTURE_2D,this.screenTexture),this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL,!0),this.gl.texSubImage2D(this.gl.TEXTURE_2D,0,0,0,this.gl.RGBA,this.gl.UNSIGNED_BYTE,this.screenCanvasCtx.canvas)}toggleRainbowEffect(){console.log("toggleRainbowEffect")}createTexture(e){this.gl.activeTexture(this.gl.TEXTURE0);let t=this.gl.createTexture();return this.gl.bindTexture(this.gl.TEXTURE_2D,t),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.NEAREST),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.NEAREST),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,e),t}createShader(e,t){const s=this.gl.createShader(e);return this.gl.shaderSource(s,t),this.gl.compileShader(s),this.gl.getShaderParameter(s,this.gl.COMPILE_STATUS)||console.error(this.gl.getShaderInfoLog(s)),s}}class xe{constructor(){this.render=this.render.bind(this),this.handleResize=this.handleResize.bind(this);const e={width:window.innerWidth,height:window.innerHeight};this.webGLRenderer=new ve({size:e}),this.webGLRenderer.createScreen(),this.init()}webGLRenderer;init(){window.addEventListener("resize",this.handleResize),this.render()}render(){this.webGLRenderer.render(),window.requestAnimationFrame(this.render)}handleResize(){const e={width:window.innerWidth,height:window.innerHeight};this.webGLRenderer.setSize(e)}setContent(e){this.webGLRenderer.setLines(e)}toggleRainbowEffect(){this.webGLRenderer.toggleRainbowEffect()}}const we=/Android/i.test(navigator.userAgent);class be{constructor(){this.textareaNode=document.createElement("textarea"),this.textareaNode.style.position="absolute",this.textareaNode.style.top="50%",this.textareaNode.style.left="-999px",this.textareaNode.style.zIndex="-9999",this.textareaNode.style.fontSize="99px",this.textareaNode.style.opacity="0",document.body.appendChild(this.textareaNode),this.subscribeEvents()}textareaNode;subscribeEvents(){document.addEventListener("click",()=>{this.textareaNode.focus()})}subscribeChangeEvent(e){we?document.addEventListener("input",t=>{const s=t.data;s&&e(s),this.textareaNode.value=""}):this.textareaNode.addEventListener("keydown",t=>{t.key&&t.key.length===1&&(e(t.key),this.textareaNode.value="")})}subscribeBackspaceKeyEvent(e){this.textareaNode.addEventListener("keydown",t=>{t.key==="Backspace"&&e(),this.textareaNode.value=""})}subscribeEnterKeyEvent(e){this.textareaNode.addEventListener("keyup",t=>{t.key==="Enter"&&e(),this.textareaNode.value=""})}subscribeFocusEvent(e){this.textareaNode.addEventListener("focus",()=>{e()})}subscribeBlurEvent(e){this.textareaNode.addEventListener("blur",()=>{e()})}}const Ee=[M,H,X,W,Y,$,q,K,V,he,ue,fe,me,ge];function Ce(){const n=new f(new xe,new be);new G(n,Ee).runProgram("greeting",[])}Ce();
