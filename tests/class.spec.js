/**
 * Created by br0wn on 3/2/15.
 */
describe("Class", function () {
    it("should exist", function () {
        expect(Class).toBeDefined();
    });

    it("should provide class extending", function () {
        /**
         * Foo
         *
         * @param a
         * @constructor
         */
        function Foo(a) {
            this.a = a;
            this.c = 10;
        }

        Foo.prototype.getA = function () {
            return this.a;
        };

        Foo.prototype.getC = function () {
            return this.c;
        };

        /**
         * Bar
         *
         * @param a
         * @param b
         * @constructor
         */
        function Bar(a, b) {
            Foo.call(this, a);
            this.b = b;
        }

        Class(Bar).extendsClass(Foo, {
            getB: function () {
                return this.b;
            },
            getC: function () {
                return this._parent('getC') + 10;
            }
        });

        /**
         * Baz
         *
         * @param a
         * @param b
         * @constructor
         */
        function Baz(a, b) {
            Bar.call(this, a, b);
        }

        Class(Baz).extendsClass(Bar, {
            getA: function () {
                return 10 + this._parent('getA');
            },
            getC: function () {
                return this._parent('getC') + 20;
            }
        });

        //
        // ASSERT
        //
        var barInstance = new Bar(5, 10);
        var bazInstance = new Baz(11, 12);

        expect(barInstance instanceof Foo).toBe(true);
        expect(barInstance instanceof Bar).toBe(true);
        expect(bazInstance instanceof Bar).toBe(true);

        expect(barInstance.getA()).toBe(5);
        expect(barInstance.getB()).toBe(10);
        expect(barInstance.getC()).toBe(20);
        expect(bazInstance.getA()).toBe(21);
        expect(bazInstance.getC()).toBe(40);
    })
});