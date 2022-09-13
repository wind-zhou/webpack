//var MagicString = require('magic-string');
class MagicString {
    constructor(origin) {
      this.origin = origin;
    }
    snip(start, end) {
      return new MagicString(this.origin.slice(start, end));
    }
    remove(start, end) {
      return new MagicString(this.origin.slice(0, start) + this.origin.slice(end))
    }
    toString() {
      return this.origin;
    }
    clone() {
      return new MagicString(this.origin);
    }
  }
  
  MagicString.Bundle = class Bundle {
    constructor() {
      this.sources = [];
    }
    addSource(source) {
      this.sources.push(source);
    }
    toString() {
      return this.sources.reduce((result, { content, separator }) => {
        result += content;
        result += separator;
        return result;
      }, ``);
  
      /* let result = '';
      this.sources.forEach(({ content, separator }) => {
        result += content;
        result += separator;
      });
      return result; */
    }
  }
  
  var sourceCode = `export var name = "zhufeng"`;
  var ms = new MagicString(sourceCode);
  console.log(ms);
  console.log(ms.snip(0, 6).toString());//export slice(0,6)
  console.log(ms.remove(0, 7).toString());//var name = "zhufeng"
  
  /* 
  //还可以用来拼接字符串 Bundle一束 一包
  let bundle = new MagicString.Bundle();
  bundle.addSource({
    content: `var a = 1`,
    separator: '\n'
  });
  bundle.addSource({
    content: `var b = 2`,
    separator: '\n'
  });
  console.log(bundle.toString()); */