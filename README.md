# class.js

Provides simple class extend functionality.

#### Usage

```javascript
/*
 * Define parent class
 */
function Parent(){
  // does something
}

Parent.prototype.foo = function(){
  return 'foo';
}

/*
 * Define child class
 */
function Child(){
  // call parent constructor
  Prent.call(this);
}

/*
 * extend parent
 */
Class(Child).extendsClass(Parent, {
  // optional child prototype ...
});
```





