/**
 * Class
 *
 * @param ClassDef Class to do stuff on
 * @returns {{extendsClass: extendsClass}}
 */
function Class(ClassDef) {

    /**
     * Returns true if passed object is a function
     *
     * @param {*} object
     * @return {boolean}
     *
     * @private
     */
    function _isFunction(object) {
        return Object.prototype.toString.call(object) == '[object Function]';
    }

    /**
     *  Returns true if passed object is defined
     *
     * @param {*} object
     * @returns {boolean}
     *
     * @private
     */
    function _isDefined(object) {
        return typeof object !== "undefined";
    }

    /**
     * Returns class of the caller
     *
     * @param caller
     * @param baseClass
     *
     * @private
     */
    function _getCallerClass(caller, baseClass) {
        while (1) {

            for (var item in baseClass.prototype) {
                if (baseClass.prototype.hasOwnProperty(item) && baseClass.prototype[item] === caller) {
                    return baseClass;
                }
            }

            if (!_isDefined(baseClass.prototype._ancestor)) {
                throw  new Error("Caller is not class member.");
            }

            baseClass = baseClass.prototype._ancestor;
        }
    }

    /**
     * Extends ClassDef with Parent class and adds optional prototype
     *
     * @param {function} Parent
     * @param {object=} prototype
     */
    function extendsClass(Parent, prototype) {
        var Child = ClassDef;

        // if parent is already defined throw error (no multiple inheritance supported)
        if (typeof  Child.prototype._parent !== "undefined") {
            throw new Error('Class can extend only one parent class!');
        }

        // initialize empty prototype parameter
        if (typeof  prototype === "undefined") {
            prototype = {};
        }

        // extend parent class
        Child.prototype = Object.create(Parent.prototype);
        Child.prototype.constructor = Child;

        // set childs parent reference
        Child.prototype._ancestor = Parent;

        /**
         * If 'property' is method of parent class, calls it with childs context and returns result.
         * If 'property' is a property of parent class, returns its value.
         * If 'property' is ommited, returns parent class's prototype.
         *
         * @param {string=} property
         * @return {*}
         *
         * @private
         */
        Child.prototype._parent = function (property) {
            // if no argument is passed, return parent prototype
            if (!_isDefined(property)) {
                return Parent.prototype;
            }

            // set caller class
            var callerClass = _getCallerClass(arguments.callee.caller, Child);

            // set ancestor class
            var ancestorClass = callerClass.prototype._ancestor;

            // if property is passed but does not exist in parent's prototype throw error
            if (!_isDefined(ancestorClass) || !_isDefined(ancestorClass.prototype[property])) {
                throw new Error("Property '" + property + "' is not defined");
            }

            // if property is method execute it and return result
            if (_isFunction(ancestorClass.prototype[property])) {

                // save current parent and set curren parent's parent as current parent
                var _tmpParent = this._parent;
                this._parent = ancestorClass.prototype._parent;

                // call parent method
                var _arguments = Array.prototype.slice.call(arguments, 1);
                var result = ancestorClass.prototype[property].apply(this, _arguments);

                // restore parent
                this._parent = _tmpParent;

                // return method result
                return result;
            }

            // otherwise return property value
            return ancestorClass.prototype[property];
        };

        // extend child prototype
        for (var item in prototype) {
            if (prototype.hasOwnProperty(item)) {
                Child.prototype[item] = prototype[item];
            }
        }
    }

    /**
     * return exports
     */
    return {
        extendsClass: extendsClass
    }
}