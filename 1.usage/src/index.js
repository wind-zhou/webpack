import './index.css'

// import { add } from '@/util.js'
// console.log('周正');
// console.log(process.env.NODE_ENV1);
// console.log(a);
// console.log(add());


// import png from './assets/logo.png';
// import ico from './assets/logo.ico';
// import jpg from './assets/logo.jpg';
// import txt from './assets/logo.txt';
// console.log(png);
// console.log(ico);
// console.log(jpg);
// console.log(txt);

function readonly(target, key, descriptor) {
    descriptor.writable = false;
}
class Person {
    @readonly PI = 3.14
}
const person = new Person();
person.PI = 3.15;

console.log(person);

