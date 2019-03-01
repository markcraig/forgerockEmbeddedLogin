"use strict";function _typeof(a){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}(function(a){if("object"===("undefined"==typeof exports?"undefined":_typeof(exports))&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var b;b="undefined"==typeof window?"undefined"==typeof global?"undefined"==typeof self?this:self:global:window,b.ForgeRockEmbeddedLogin=a()}})(function(){var a;return function(){function b(d,e,g){function a(j,i){if(!e[j]){if(!d[j]){var f="function"==typeof require&&require;if(!i&&f)return f(j,!0);if(h)return h(j,!0);var c=new Error("Cannot find module '"+j+"'");throw c.code="MODULE_NOT_FOUND",c}var k=e[j]={exports:{}};d[j][0].call(k.exports,function(b){var c=d[j][1][b];return a(c||b)},k,k.exports,b,d,e,g)}return e[j].exports}for(var h="function"==typeof require&&require,c=0;c<g.length;c++)a(g[c]);return a}return b}()({1:[function(a,b){"use strict";a("whatwg-fetch"),b.exports=a("./index")},{"./index":2,"whatwg-fetch":3}],2:[function(a,c){"use strict";(function(){var o=function(a,d){return a.reduce(function(b,a){return b||a.name===d&&a},!1)},a=function(b){return this.authenticateUrl=b.authenticateUrl,this.postRenderHandler=b.postRenderHandler,this.successHandler=b.successHandler,this.failureHandler=b.failureHandler,this.loginElement=b.loginElement,this};a.prototype.handleCallbackResponse=function(){var b=this;return this.success()&&this.successHandler?this.successHandler():this.failure()&&this.failureHandler?this.failureHandler():this.renderAllCallbacks().then(function(c){return b.renderHandler(c)}).then(function(){b.postRenderHandler&&b.postRenderHandler(b.currentCallbacks.header,b.currentCallbacks.stage,b.currentCallbacks.template)}),this},a.prototype.startLogin=function(){return this.currentCallbacks={},this.submitCallbacks()},a.prototype.success=function(){return!!this.currentCallbacks.tokenId},a.prototype.failure=function(){return"undefined"==typeof this.currentCallbacks.authId&&401===this.currentCallbacks.code},a.prototype.renderHandler=function(b){if(this.loginElement){var a=this.loginElement.cloneNode(!1);this.loginElement.parentNode.replaceChild(a,this.loginElement),this.loginElement=a,this.loginElement.appendChild(b);var d=this.loginElement.getElementsByTagName("form")[0];d.onsubmit=this.handleLoginSubmit.bind(this)}return this},a.prototype.renderAllCallbacks=function(){var c=this,d=!this.currentCallbacks.callbacks.reduce(function(c,a){return c||-1!==["ConfirmationCallback","PollingWaitCallback","RedirectCallback"].indexOf(a.type)},!1),a={input:{index:this.currentCallbacks.callbacks.length,name:"loginButton",value:0},output:[{name:"options",value:[this.getLoginButtonText()]}],type:"ConfirmationCallback"};return Promise.all((d?this.currentCallbacks.callbacks.concat(a):this.currentCallbacks.callbacks).map(function(d,a){return c.renderCallback(d,a)})).then(this.joinRenderedCallbacks)},a.prototype.getLoginButtonText=function(){return"Login"},a.prototype.handleLoginSubmit=function(h){h.preventDefault();var i,a=!0,j=!1;try{for(var k,l,m=new FormData(h.currentTarget)[Symbol.iterator]();!(a=(k=m.next()).done);a=!0){l=k.value;var g=l[0].match(/^callback_(\d+)$/);g&&(this.currentCallbacks.callbacks[parseInt(g[1],10)].input[0].value=l[1])}}catch(b){j=!0,i=b}finally{try{a||null==m.return||m.return()}finally{if(j)throw i}}return this.submitCallbacks()},a.prototype.submitCallbacks=function(){var b=this;return fetch(this.authenticateUrl,{mode:"cors",method:"POST",credentials:"include",headers:{"accept-api-version":"protocol=1.0,resource=2.1","content-type":"application/json"},body:JSON.stringify(this.currentCallbacks)}).then(function(b){return b.json()}).then(function(c){return b.currentCallbacks=c,b.currentCallbacks}).then(function(){return b.handleCallbackResponse()})},a.prototype.renderCallback=function(p,q){var c=this,r="",a=o(p.output,"prompt");switch(a&&a.value&&a.value.length&&(r=a.value.replace(/:$/,"")),p.type){case"NameCallback":return this.renderNameCallback(p,q,r);case"PasswordCallback":return this.renderPasswordCallback(p,q,r);case"TextInputCallback":return this.renderTextInputCallback(p,q,r);case"TextOutputCallback":var b=o(p.output,"messageType"),e=o(p.output,"message");return"4"===b.value?this.renderTextOutputScript(q,e.value):this.renderTextOutputMessage(q,e.value,{0:"INFORMATION",1:"WARNING",2:"ERROR"}[b.value]);case"ConfirmationCallback":var f=o(p.output,"options");if(f&&void 0!==f.value){var m=1<f.value.length?o(p.output,"defaultOption"):{value:0};return Promise.all(f.value.map(function(d,a){return c.renderConfirmationCallbackOption(d,q,a,m&&m.value===a)}))}return Promise.all([]);case"ChoiceCallback":var g=o(p.output,"choices");if(g&&void 0!==g.value){var n=g.value.map(function(b,a){return{active:p.input.value===a,key:a,value:b}});return this.renderChoiceCallback(p,q,r,n)}return Promise.all([]);case"HiddenValueCallback":return this.renderHiddenValueCallback(p,q);case"RedirectCallback":var h=o(p.output,"redirectUrl"),i=o(p.output,"redirectMethod"),j=o(p.output,"redirectData"),k=document.createElement("form");k.action=h.value,k.method=i.value,j&&j.value&&j.value.forEach(function(d,a){var b=document.createElement("input");b.type="hidden",b.name=a,b.value=d,k.appendChild(b)}),document.getElementsByTagName("body")[0].appendChild(k),k.submit();break;case"PollingWaitCallback":var l=o(p.output,"waitTime").value;return setTimeout(function(){c.pollingInProgress=!0},l),this.renderPollingWaitCallback(p,q,o(p.output,"message").value);default:return this.renderUnknownCallback(p,q,r);}},a.prototype.joinRenderedCallbacks=function(c){var d=document.createElement("form");return c.reduce(function(c,a){return c.concat(a)},[]).forEach(function(b){d.appendChild(b),d.appendChild(document.createElement("br"))}),Promise.resolve(d)},a.prototype.renderNameCallback=function(e,a,b){var c=document.createElement("div");return c.innerHTML="<input type=\"text\" name=\"callback_".concat(a,"\" value=\"").concat(e.input[0].value,"\" placeholder=\"").concat(b,"\">"),Promise.resolve(c.firstElementChild)},a.prototype.renderPasswordCallback=function(e,a,b){var c=document.createElement("div");return c.innerHTML="<input type=\"password\" name=\"callback_".concat(a,"\" value=\"").concat(e.input[0].value,"\" placeholder=\"").concat(b,"\">"),Promise.resolve(c.firstElementChild)},a.prototype.renderTextInputCallback=function(d,a){var b=document.createElement("div");return b.innerHTML="<textarea name=\"callback_".concat(a,"\">").concat(d.input[0].value,"</textarea>"),Promise.resolve(b.firstElementChild)},a.prototype.renderTextOutputScript=function(d,a){var b=document.createElement("script");return b.innerHTML=a,Promise.resolve(b)},a.prototype.renderTextOutputMessage=function(e,a,b){var c=document.createElement("div");return c.innerHTML="<div id=\"callback_".concat(e,"\" class=\"").concat(b,"\">").concat(a,"</div>"),Promise.resolve(c.firstElementChild)},a.prototype.renderConfirmationCallbackOption=function(e,a,b){var c=document.createElement("div");return c.innerHTML="<input name=\"callback_".concat(a,"\" type=\"submit\" index=\"").concat(b,"\" value=\"").concat(e,"\">"),Promise.resolve(c.firstElementChild)},a.prototype.renderChoiceCallback=function(f,a,b,c){var d=document.createElement("div");return d.innerHTML="<label for=\"callback_".concat(a,"\" id=\"label_callback_").concat(a,"\">").concat(b,"</label>\n            <select name=\"callback_").concat(a,"\" id=\"callback_").concat(a,"\">\n            ").concat(c.map(function(b){return"<option value=\"".concat(b.key,"\" ").concat(b.active?"selected":"",">").concat(b.value,"</option>")}),"\n            </select>"),Promise.resolve(d.firstElementChild)},a.prototype.renderHiddenValueCallback=function(d,a){var b=document.createElement("div");return b.innerHTML="<input type=\"hidden\" id=\"".concat(d.input.value,"\" aria-hidden=\"true\" name=\"callback_").concat(a,"\" value=\"\" />"),Promise.resolve(b.firstElementChild)},a.prototype.renderPollingWaitCallback=function(d,a){var b=document.createElement("div");return b.innerHTML="<input type=\"hidden\" id=\"".concat(d.input.value,"\" aria-hidden=\"true\" name=\"callback_").concat(a,"\" value=\"\" />"),Promise.resolve(b.firstElementChild)},a.prototype.renderUnknownCallback=function(d,a,b){return this.renderNameCallback(d,a,b)},c.exports=a})()},{}],3:[function(b,c,d){(function(b,e){"object"===_typeof(d)&&"undefined"!=typeof c?e(d):"function"==typeof a&&a.amd?a(["exports"],e):e(b.WHATWGFetch={})})(this,function(a){'use strict';function b(a){return a&&DataView.prototype.isPrototypeOf(a)}function c(a){if("string"!=typeof a&&(a+=""),/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(a))throw new TypeError("Invalid character in header field name");return a.toLowerCase()}function d(a){return"string"!=typeof a&&(a+=""),a}function e(a){var b={next:function c(){var b=a.shift();return{done:void 0===b,value:b}}};return t.iterable&&(b[Symbol.iterator]=function(){return b}),b}function f(a){this.map={},a instanceof f?a.forEach(function(a,b){this.append(b,a)},this):Array.isArray(a)?a.forEach(function(a){this.append(a[0],a[1])},this):a&&Object.getOwnPropertyNames(a).forEach(function(b){this.append(b,a[b])},this)}function g(a){return a.bodyUsed?Promise.reject(new TypeError("Already read")):void(a.bodyUsed=!0)}function h(a){return new Promise(function(b,c){a.onload=function(){b(a.result)},a.onerror=function(){c(a.error)}})}function i(a){var b=new FileReader,c=h(b);return b.readAsArrayBuffer(a),c}function j(a){var b=new FileReader,c=h(b);return b.readAsText(a),c}function k(a){for(var b=new Uint8Array(a),c=Array(b.length),d=0;d<b.length;d++)c[d]=String.fromCharCode(b[d]);return c.join("")}function l(a){if(a.slice)return a.slice(0);var b=new Uint8Array(a.byteLength);return b.set(new Uint8Array(a)),b.buffer}function m(){return this.bodyUsed=!1,this._initBody=function(a){this._bodyInit=a,a?"string"==typeof a?this._bodyText=a:t.blob&&Blob.prototype.isPrototypeOf(a)?this._bodyBlob=a:t.formData&&FormData.prototype.isPrototypeOf(a)?this._bodyFormData=a:t.searchParams&&URLSearchParams.prototype.isPrototypeOf(a)?this._bodyText=a.toString():t.arrayBuffer&&t.blob&&b(a)?(this._bodyArrayBuffer=l(a.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):t.arrayBuffer&&(ArrayBuffer.prototype.isPrototypeOf(a)||v(a))?this._bodyArrayBuffer=l(a):this._bodyText=a=Object.prototype.toString.call(a):this._bodyText="",this.headers.get("content-type")||("string"==typeof a?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):t.searchParams&&URLSearchParams.prototype.isPrototypeOf(a)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},t.blob&&(this.blob=function(){var a=g(this);if(a)return a;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");else return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?g(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(i)}),this.text=function(){var a=g(this);if(a)return a;if(this._bodyBlob)return j(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(k(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");else return Promise.resolve(this._bodyText)},t.formData&&(this.formData=function(){return this.text().then(p)}),this.json=function(){return this.text().then(JSON.parse)},this}function n(a){var b=a.toUpperCase();return-1<w.indexOf(b)?b:a}function o(a,b){b=b||{};var c=b.body;if(a instanceof o){if(a.bodyUsed)throw new TypeError("Already read");this.url=a.url,this.credentials=a.credentials,b.headers||(this.headers=new f(a.headers)),this.method=a.method,this.mode=a.mode,this.signal=a.signal,c||null==a._bodyInit||(c=a._bodyInit,a.bodyUsed=!0)}else this.url=a+"";if(this.credentials=b.credentials||this.credentials||"same-origin",(b.headers||!this.headers)&&(this.headers=new f(b.headers)),this.method=n(b.method||this.method||"GET"),this.mode=b.mode||this.mode||null,this.signal=b.signal||this.signal,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&c)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(c)}function p(a){var b=new FormData;return a.trim().split("&").forEach(function(a){if(a){var c=a.split("="),d=c.shift().replace(/\+/g," "),e=c.join("=").replace(/\+/g," ");b.append(decodeURIComponent(d),decodeURIComponent(e))}}),b}function q(a){var b=new f,c=a.replace(/\r?\n[\t ]+/g," ");return c.split(/\r?\n/).forEach(function(a){var c=a.split(":"),d=c.shift().trim();if(d){var e=c.join(":").trim();b.append(d,e)}}),b}function r(a,b){b||(b={}),this.type="default",this.status=b.status===void 0?200:b.status,this.ok=200<=this.status&&300>this.status,this.statusText="statusText"in b?b.statusText:"OK",this.headers=new f(b.headers),this.url=b.url||"",this._initBody(a)}function s(b,c){return new Promise(function(d,e){function f(){h.abort()}var g=new o(b,c);if(g.signal&&g.signal.aborted)return e(new a.DOMException("Aborted","AbortError"));var h=new XMLHttpRequest;h.onload=function(){var a={status:h.status,statusText:h.statusText,headers:q(h.getAllResponseHeaders()||"")};a.url="responseURL"in h?h.responseURL:a.headers.get("X-Request-URL");var b="response"in h?h.response:h.responseText;d(new r(b,a))},h.onerror=function(){e(new TypeError("Network request failed"))},h.ontimeout=function(){e(new TypeError("Network request failed"))},h.onabort=function(){e(new a.DOMException("Aborted","AbortError"))},h.open(g.method,g.url,!0),"include"===g.credentials?h.withCredentials=!0:"omit"===g.credentials&&(h.withCredentials=!1),"responseType"in h&&t.blob&&(h.responseType="blob"),g.headers.forEach(function(a,b){h.setRequestHeader(b,a)}),g.signal&&(g.signal.addEventListener("abort",f),h.onreadystatechange=function(){4===h.readyState&&g.signal.removeEventListener("abort",f)}),h.send("undefined"==typeof g._bodyInit?null:g._bodyInit)})}var t={searchParams:"URLSearchParams"in self,iterable:"Symbol"in self&&"iterator"in Symbol,blob:"FileReader"in self&&"Blob"in self&&function(){try{return new Blob,!0}catch(a){return!1}}(),formData:"FormData"in self,arrayBuffer:"ArrayBuffer"in self};if(t.arrayBuffer)var u=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],v=ArrayBuffer.isView||function(a){return a&&-1<u.indexOf(Object.prototype.toString.call(a))};f.prototype.append=function(a,b){a=c(a),b=d(b);var e=this.map[a];this.map[a]=e?e+", "+b:b},f.prototype["delete"]=function(a){delete this.map[c(a)]},f.prototype.get=function(a){return a=c(a),this.has(a)?this.map[a]:null},f.prototype.has=function(a){return this.map.hasOwnProperty(c(a))},f.prototype.set=function(a,b){this.map[c(a)]=d(b)},f.prototype.forEach=function(a,b){for(var c in this.map)this.map.hasOwnProperty(c)&&a.call(b,this.map[c],c,this)},f.prototype.keys=function(){var a=[];return this.forEach(function(b,c){a.push(c)}),e(a)},f.prototype.values=function(){var a=[];return this.forEach(function(b){a.push(b)}),e(a)},f.prototype.entries=function(){var a=[];return this.forEach(function(b,c){a.push([c,b])}),e(a)},t.iterable&&(f.prototype[Symbol.iterator]=f.prototype.entries);var w=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];o.prototype.clone=function(){return new o(this,{body:this._bodyInit})},m.call(o.prototype),m.call(r.prototype),r.prototype.clone=function(){return new r(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new f(this.headers),url:this.url})},r.error=function(){var a=new r(null,{status:0,statusText:""});return a.type="error",a};var x=[301,302,303,307,308];r.redirect=function(a,b){if(-1===x.indexOf(b))throw new RangeError("Invalid status code");return new r(null,{status:b,headers:{location:a}})},a.DOMException=self.DOMException;try{new a.DOMException}catch(b){a.DOMException=function(a,b){this.message=a,this.name=b;var c=Error(a);this.stack=c.stack},a.DOMException.prototype=Object.create(Error.prototype),a.DOMException.prototype.constructor=a.DOMException}s.polyfill=!0,self.fetch||(self.fetch=s,self.Headers=f,self.Request=o,self.Response=r),a.Headers=f,a.Request=o,a.Response=r,a.fetch=s,Object.defineProperty(a,"__esModule",{value:!0})})},{}]},{},[1])(1)});
