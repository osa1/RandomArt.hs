function h$ghcjszmprimZCGHCJSziPrimziJSRef_con_e() { return h$stack[h$sp]; };
if(typeof require !== 'undefined') {
  var h$nodeFs = require('fs');
}
var goog = {};
goog.global = this;
goog.global.goog = goog;
goog.global.CLOSURE_NO_DEPS = true;
goog.provide = function() { };
goog.require = function() { };
goog.isDef = function(val) { return val !== undefined; };
goog.inherits = function(childCtor, parentCtor) {
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  childCtor.prototype.constructor = childCtor;
  childCtor.base = function(me, methodName, var_args) {
    var args = Array.prototype.slice.call(arguments, 2);
    return parentCtor.prototype[methodName].apply(me, args);
  };
}
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if (goog.STRICT_MODE_COMPATIBLE || (goog.DEBUG && !caller)) {
    throw Error('arguments.caller not defined.  goog.base() cannot be used ' +
                'with strict mode code. See ' +
                'http://www.ecma-international.org/ecma-262/5.1/#sec-C');
  }
  if (caller.superClass_) {
    return caller.superClass_.constructor.apply(
        me, Array.prototype.slice.call(arguments, 1));
  }
  var args = Array.prototype.slice.call(arguments, 2);
  var foundCaller = false;
  for (var ctor = me.constructor;
       ctor; ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = true;
    } else if (foundCaller) {
      return ctor.prototype[opt_methodName].apply(me, args);
    }
  }
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  } else {
    throw Error(
        'goog.base called from a method of one name ' +
        'to a method of a different name');
  }
};
goog.math = {};
goog.crypt = {};
if(this['print'] !== undefined && this['console'] === undefined) {
  this['console'] = { log: this['print'] };
}
if (!Date.now) {
  Date.now = function now() {
    return +(new Date);
  };
}
(function(global) {
  'use strict';
  var undefined = (void 0);
  var MAX_ARRAY_LENGTH = 1e5;
  function Type(v) {
    switch(typeof v) {
    case 'undefined': return 'undefined';
    case 'boolean': return 'boolean';
    case 'number': return 'number';
    case 'string': return 'string';
    default: return v === null ? 'null' : 'object';
    }
  }
  function Class(v) { return Object.prototype.toString.call(v).replace(/^\[object *|\]$/g, ''); }
  function IsCallable(o) { return typeof o === 'function'; }
  function ToObject(v) {
    if (v === null || v === undefined) throw TypeError();
    return Object(v);
  }
  function ToInt32(v) { return v >> 0; }
  function ToUint32(v) { return v >>> 0; }
  var LN2 = Math.LN2,
      abs = Math.abs,
      floor = Math.floor,
      log = Math.log,
      max = Math.max,
      min = Math.min,
      pow = Math.pow,
      round = Math.round;
  (function() {
    var orig = Object.defineProperty;
    var dom_only = !(function(){try{return Object.defineProperty({},'x',{});}catch(_){return false;}}());
    if (!orig || dom_only) {
      Object.defineProperty = function (o, prop, desc) {
        if (orig)
          try { return orig(o, prop, desc); } catch (_) {}
        if (o !== Object(o))
          throw TypeError('Object.defineProperty called on non-object');
        if (Object.prototype.__defineGetter__ && ('get' in desc))
          Object.prototype.__defineGetter__.call(o, prop, desc.get);
        if (Object.prototype.__defineSetter__ && ('set' in desc))
          Object.prototype.__defineSetter__.call(o, prop, desc.set);
        if ('value' in desc)
          o[prop] = desc.value;
        return o;
      };
    }
  }());
  function makeArrayAccessors(obj) {
    if (obj.length > MAX_ARRAY_LENGTH) throw RangeError('Array too large for polyfill');
    function makeArrayAccessor(index) {
      Object.defineProperty(obj, index, {
        'get': function() { return obj._getter(index); },
        'set': function(v) { obj._setter(index, v); },
        enumerable: true,
        configurable: false
      });
    }
    var i;
    for (i = 0; i < obj.length; i += 1) {
      makeArrayAccessor(i);
    }
  }
  function as_signed(value, bits) { var s = 32 - bits; return (value << s) >> s; }
  function as_unsigned(value, bits) { var s = 32 - bits; return (value << s) >>> s; }
  function packI8(n) { return [n & 0xff]; }
  function unpackI8(bytes) { return as_signed(bytes[0], 8); }
  function packU8(n) { return [n & 0xff]; }
  function unpackU8(bytes) { return as_unsigned(bytes[0], 8); }
  function packU8Clamped(n) { n = round(Number(n)); return [n < 0 ? 0 : n > 0xff ? 0xff : n & 0xff]; }
  function packI16(n) { return [(n >> 8) & 0xff, n & 0xff]; }
  function unpackI16(bytes) { return as_signed(bytes[0] << 8 | bytes[1], 16); }
  function packU16(n) { return [(n >> 8) & 0xff, n & 0xff]; }
  function unpackU16(bytes) { return as_unsigned(bytes[0] << 8 | bytes[1], 16); }
  function packI32(n) { return [(n >> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]; }
  function unpackI32(bytes) { return as_signed(bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], 32); }
  function packU32(n) { return [(n >> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]; }
  function unpackU32(bytes) { return as_unsigned(bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], 32); }
  function packIEEE754(v, ebits, fbits) {
    var bias = (1 << (ebits - 1)) - 1,
        s, e, f, ln,
        i, bits, str, bytes;
    function roundToEven(n) {
      var w = floor(n), f = n - w;
      if (f < 0.5)
        return w;
      if (f > 0.5)
        return w + 1;
      return w % 2 ? w + 1 : w;
    }
    if (v !== v) {
      e = (1 << ebits) - 1; f = pow(2, fbits - 1); s = 0;
    } else if (v === Infinity || v === -Infinity) {
      e = (1 << ebits) - 1; f = 0; s = (v < 0) ? 1 : 0;
    } else if (v === 0) {
      e = 0; f = 0; s = (1 / v === -Infinity) ? 1 : 0;
    } else {
      s = v < 0;
      v = abs(v);
      if (v >= pow(2, 1 - bias)) {
        e = min(floor(log(v) / LN2), 1023);
        f = roundToEven(v / pow(2, e) * pow(2, fbits));
        if (f / pow(2, fbits) >= 2) {
          e = e + 1;
          f = 1;
        }
        if (e > bias) {
          e = (1 << ebits) - 1;
          f = 0;
        } else {
          e = e + bias;
          f = f - pow(2, fbits);
        }
      } else {
        e = 0;
        f = roundToEven(v / pow(2, 1 - bias - fbits));
      }
    }
    bits = [];
    for (i = fbits; i; i -= 1) { bits.push(f % 2 ? 1 : 0); f = floor(f / 2); }
    for (i = ebits; i; i -= 1) { bits.push(e % 2 ? 1 : 0); e = floor(e / 2); }
    bits.push(s ? 1 : 0);
    bits.reverse();
    str = bits.join('');
    bytes = [];
    while (str.length) {
      bytes.push(parseInt(str.substring(0, 8), 2));
      str = str.substring(8);
    }
    return bytes;
  }
  function unpackIEEE754(bytes, ebits, fbits) {
    var bits = [], i, j, b, str,
        bias, s, e, f;
    for (i = bytes.length; i; i -= 1) {
      b = bytes[i - 1];
      for (j = 8; j; j -= 1) {
        bits.push(b % 2 ? 1 : 0); b = b >> 1;
      }
    }
    bits.reverse();
    str = bits.join('');
    bias = (1 << (ebits - 1)) - 1;
    s = parseInt(str.substring(0, 1), 2) ? -1 : 1;
    e = parseInt(str.substring(1, 1 + ebits), 2);
    f = parseInt(str.substring(1 + ebits), 2);
    if (e === (1 << ebits) - 1) {
      return f !== 0 ? NaN : s * Infinity;
    } else if (e > 0) {
      return s * pow(2, e - bias) * (1 + f / pow(2, fbits));
    } else if (f !== 0) {
      return s * pow(2, -(bias - 1)) * (f / pow(2, fbits));
    } else {
      return s < 0 ? -0 : 0;
    }
  }
  function unpackF64(b) { return unpackIEEE754(b, 11, 52); }
  function packF64(v) { return packIEEE754(v, 11, 52); }
  function unpackF32(b) { return unpackIEEE754(b, 8, 23); }
  function packF32(v) { return packIEEE754(v, 8, 23); }
  (function() {
    function ArrayBuffer(length) {
      length = ToInt32(length);
      if (length < 0) throw RangeError('ArrayBuffer size is not a small enough positive integer.');
      Object.defineProperty(this, 'byteLength', {value: length});
      Object.defineProperty(this, '_bytes', {value: Array(length)});
      for (var i = 0; i < length; i += 1)
        this._bytes[i] = 0;
    }
    global.ArrayBuffer = global.ArrayBuffer || ArrayBuffer;
    function $TypedArray$() {
      if (!arguments.length || typeof arguments[0] !== 'object') {
        return (function(length) {
          length = ToInt32(length);
          if (length < 0) throw RangeError('length is not a small enough positive integer.');
          Object.defineProperty(this, 'length', {value: length});
          Object.defineProperty(this, 'byteLength', {value: length * this.BYTES_PER_ELEMENT});
          Object.defineProperty(this, 'buffer', {value: new ArrayBuffer(this.byteLength)});
          Object.defineProperty(this, 'byteOffset', {value: 0});
         }).apply(this, arguments);
      }
      if (arguments.length >= 1 &&
          Type(arguments[0]) === 'object' &&
          arguments[0] instanceof $TypedArray$) {
        return (function(typedArray){
          if (this.constructor !== typedArray.constructor) throw TypeError();
          var byteLength = typedArray.length * this.BYTES_PER_ELEMENT;
          Object.defineProperty(this, 'buffer', {value: new ArrayBuffer(byteLength)});
          Object.defineProperty(this, 'byteLength', {value: byteLength});
          Object.defineProperty(this, 'byteOffset', {value: 0});
          Object.defineProperty(this, 'length', {value: typedArray.length});
          for (var i = 0; i < this.length; i += 1)
            this._setter(i, typedArray._getter(i));
        }).apply(this, arguments);
      }
      if (arguments.length >= 1 &&
          Type(arguments[0]) === 'object' &&
          !(arguments[0] instanceof $TypedArray$) &&
          !(arguments[0] instanceof ArrayBuffer || Class(arguments[0]) === 'ArrayBuffer')) {
        return (function(array) {
          var byteLength = array.length * this.BYTES_PER_ELEMENT;
          Object.defineProperty(this, 'buffer', {value: new ArrayBuffer(byteLength)});
          Object.defineProperty(this, 'byteLength', {value: byteLength});
          Object.defineProperty(this, 'byteOffset', {value: 0});
          Object.defineProperty(this, 'length', {value: array.length});
          for (var i = 0; i < this.length; i += 1) {
            var s = array[i];
            this._setter(i, Number(s));
          }
        }).apply(this, arguments);
      }
      if (arguments.length >= 1 &&
          Type(arguments[0]) === 'object' &&
          (arguments[0] instanceof ArrayBuffer || Class(arguments[0]) === 'ArrayBuffer')) {
        return (function(buffer, byteOffset, length) {
          byteOffset = ToUint32(byteOffset);
          if (byteOffset > buffer.byteLength)
            throw RangeError('byteOffset out of range');
          if (byteOffset % this.BYTES_PER_ELEMENT)
            throw RangeError('buffer length minus the byteOffset is not a multiple of the element size.');
          if (length === undefined) {
            var byteLength = buffer.byteLength - byteOffset;
            if (byteLength % this.BYTES_PER_ELEMENT)
              throw RangeError('length of buffer minus byteOffset not a multiple of the element size');
            length = byteLength / this.BYTES_PER_ELEMENT;
          } else {
            length = ToUint32(length);
            byteLength = length * this.BYTES_PER_ELEMENT;
          }
          if ((byteOffset + byteLength) > buffer.byteLength)
            throw RangeError('byteOffset and length reference an area beyond the end of the buffer');
          Object.defineProperty(this, 'buffer', {value: buffer});
          Object.defineProperty(this, 'byteLength', {value: byteLength});
          Object.defineProperty(this, 'byteOffset', {value: byteOffset});
          Object.defineProperty(this, 'length', {value: length});
        }).apply(this, arguments);
      }
      throw TypeError();
    }
    Object.defineProperty($TypedArray$, 'from', {value: function(iterable) {
      return new this(iterable);
    }});
    Object.defineProperty($TypedArray$, 'of', {value: function( ) {
      return new this(arguments);
    }});
    var $TypedArrayPrototype$ = {};
    $TypedArray$.prototype = $TypedArrayPrototype$;
    Object.defineProperty($TypedArray$.prototype, '_getter', {value: function(index) {
      if (arguments.length < 1) throw SyntaxError('Not enough arguments');
      index = ToUint32(index);
      if (index >= this.length)
        return undefined;
      var bytes = [], i, o;
      for (i = 0, o = this.byteOffset + index * this.BYTES_PER_ELEMENT;
           i < this.BYTES_PER_ELEMENT;
           i += 1, o += 1) {
        bytes.push(this.buffer._bytes[o]);
      }
      return this._unpack(bytes);
    }});
    Object.defineProperty($TypedArray$.prototype, 'get', {value: $TypedArray$.prototype._getter});
    Object.defineProperty($TypedArray$.prototype, '_setter', {value: function(index, value) {
      if (arguments.length < 2) throw SyntaxError('Not enough arguments');
      index = ToUint32(index);
      if (index >= this.length)
        return;
      var bytes = this._pack(value), i, o;
      for (i = 0, o = this.byteOffset + index * this.BYTES_PER_ELEMENT;
           i < this.BYTES_PER_ELEMENT;
           i += 1, o += 1) {
        this.buffer._bytes[o] = bytes[i];
      }
    }});
    Object.defineProperty($TypedArray$.prototype, 'constructor', {value: $TypedArray$});
    Object.defineProperty($TypedArray$.prototype, 'copyWithin', {value: function(target, start) {
      var end = arguments[2];
      var o = ToObject(this);
      var lenVal = o.length;
      var len = ToUint32(lenVal);
      len = max(len, 0);
      var relativeTarget = ToInt32(target);
      var to;
      if (relativeTarget < 0)
        to = max(len + relativeTarget, 0);
      else
        to = min(relativeTarget, len);
      var relativeStart = ToInt32(start);
      var from;
      if (relativeStart < 0)
        from = max(len + relativeStart, 0);
      else
        from = min(relativeStart, len);
      var relativeEnd;
      if (end === undefined)
        relativeEnd = len;
      else
        relativeEnd = ToInt32(end);
      var final;
      if (relativeEnd < 0)
        final = max(len + relativeEnd, 0);
      else
        final = min(relativeEnd, len);
      var count = min(final - from, len - to);
      var direction;
      if (from < to && to < from + count) {
        direction = -1;
        from = from + count - 1;
        to = to + count - 1;
      } else {
        direction = 1;
      }
      while (count > 0) {
        o._setter(to, o._getter(from));
        from = from + direction;
        to = to + direction;
        count = count - 1;
      }
      return o;
    }});
    Object.defineProperty($TypedArray$.prototype, 'every', {value: function(callbackfn) {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      if (!IsCallable(callbackfn)) throw TypeError();
      var thisArg = arguments[1];
      for (var i = 0; i < len; i++) {
        if (!callbackfn.call(thisArg, t._getter(i), i, t))
          return false;
      }
      return true;
    }});
    Object.defineProperty($TypedArray$.prototype, 'fill', {value: function(value) {
      var start = arguments[1],
          end = arguments[2];
      var o = ToObject(this);
      var lenVal = o.length;
      var len = ToUint32(lenVal);
      len = max(len, 0);
      var relativeStart = ToInt32(start);
      var k;
      if (relativeStart < 0)
        k = max((len + relativeStart), 0);
      else
        k = min(relativeStart, len);
      var relativeEnd;
      if (end === undefined)
        relativeEnd = len;
      else
        relativeEnd = ToInt32(end);
      var final;
      if (relativeEnd < 0)
        final = max((len + relativeEnd), 0);
      else
        final = min(relativeEnd, len);
      while (k < final) {
        o._setter(k, value);
        k += 1;
      }
      return o;
    }});
    Object.defineProperty($TypedArray$.prototype, 'filter', {value: function(callbackfn) {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      if (!IsCallable(callbackfn)) throw TypeError();
      var res = [];
      var thisp = arguments[1];
      for (var i = 0; i < len; i++) {
        var val = t._getter(i);
        if (callbackfn.call(thisp, val, i, t))
          res.push(val);
      }
      return new this.constructor(res);
    }});
    Object.defineProperty($TypedArray$.prototype, 'find', {value: function(predicate) {
      var o = ToObject(this);
      var lenValue = o.length;
      var len = ToUint32(lenValue);
      if (!IsCallable(predicate)) throw TypeError();
      var t = arguments.length > 1 ? arguments[1] : undefined;
      var k = 0;
      while (k < len) {
        var kValue = o._getter(k);
        var testResult = predicate.call(t, kValue, k, o);
        if (Boolean(testResult))
          return kValue;
        ++k;
      }
      return undefined;
    }});
    Object.defineProperty($TypedArray$.prototype, 'findIndex', {value: function(predicate) {
      var o = ToObject(this);
      var lenValue = o.length;
      var len = ToUint32(lenValue);
      if (!IsCallable(predicate)) throw TypeError();
      var t = arguments.length > 1 ? arguments[1] : undefined;
      var k = 0;
      while (k < len) {
        var kValue = o._getter(k);
        var testResult = predicate.call(t, kValue, k, o);
        if (Boolean(testResult))
          return k;
        ++k;
      }
      return -1;
    }});
    Object.defineProperty($TypedArray$.prototype, 'forEach', {value: function(callbackfn) {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      if (!IsCallable(callbackfn)) throw TypeError();
      var thisp = arguments[1];
      for (var i = 0; i < len; i++)
        callbackfn.call(thisp, t._getter(i), i, t);
    }});
    Object.defineProperty($TypedArray$.prototype, 'indexOf', {value: function(searchElement) {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      if (len === 0) return -1;
      var n = 0;
      if (arguments.length > 0) {
        n = Number(arguments[1]);
        if (n !== n) {
          n = 0;
        } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
          n = (n > 0 || -1) * floor(abs(n));
        }
      }
      if (n >= len) return -1;
      var k = n >= 0 ? n : max(len - abs(n), 0);
      for (; k < len; k++) {
        if (t._getter(k) === searchElement) {
          return k;
        }
      }
      return -1;
    }});
    Object.defineProperty($TypedArray$.prototype, 'join', {value: function(separator) {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      var tmp = Array(len);
      for (var i = 0; i < len; ++i)
        tmp[i] = t._getter(i);
      return tmp.join(separator === undefined ? ',' : separator);
    }});
    Object.defineProperty($TypedArray$.prototype, 'lastIndexOf', {value: function(searchElement) {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      if (len === 0) return -1;
      var n = len;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n !== n) {
          n = 0;
        } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
          n = (n > 0 || -1) * floor(abs(n));
        }
      }
      var k = n >= 0 ? min(n, len - 1) : len - abs(n);
      for (; k >= 0; k--) {
        if (t._getter(k) === searchElement)
          return k;
      }
      return -1;
    }});
    Object.defineProperty($TypedArray$.prototype, 'map', {value: function(callbackfn) {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      if (!IsCallable(callbackfn)) throw TypeError();
      var res = []; res.length = len;
      var thisp = arguments[1];
      for (var i = 0; i < len; i++)
        res[i] = callbackfn.call(thisp, t._getter(i), i, t);
      return new this.constructor(res);
    }});
    Object.defineProperty($TypedArray$.prototype, 'reduce', {value: function(callbackfn) {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      if (!IsCallable(callbackfn)) throw TypeError();
      if (len === 0 && arguments.length === 1) throw TypeError();
      var k = 0;
      var accumulator;
      if (arguments.length >= 2) {
        accumulator = arguments[1];
      } else {
        accumulator = t._getter(k++);
      }
      while (k < len) {
        accumulator = callbackfn.call(undefined, accumulator, t._getter(k), k, t);
        k++;
      }
      return accumulator;
    }});
    Object.defineProperty($TypedArray$.prototype, 'reduceRight', {value: function(callbackfn) {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      if (!IsCallable(callbackfn)) throw TypeError();
      if (len === 0 && arguments.length === 1) throw TypeError();
      var k = len - 1;
      var accumulator;
      if (arguments.length >= 2) {
        accumulator = arguments[1];
      } else {
        accumulator = t._getter(k--);
      }
      while (k >= 0) {
        accumulator = callbackfn.call(undefined, accumulator, t._getter(k), k, t);
        k--;
      }
      return accumulator;
    }});
    Object.defineProperty($TypedArray$.prototype, 'reverse', {value: function() {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      var half = floor(len / 2);
      for (var i = 0, j = len - 1; i < half; ++i, --j) {
        var tmp = t._getter(i);
        t._setter(i, t._getter(j));
        t._setter(j, tmp);
      }
      return t;
    }});
    Object.defineProperty($TypedArray$.prototype, 'set', {value: function(index, value) {
      if (arguments.length < 1) throw SyntaxError('Not enough arguments');
      var array, sequence, offset, len,
          i, s, d,
          byteOffset, byteLength, tmp;
      if (typeof arguments[0] === 'object' && arguments[0].constructor === this.constructor) {
        array = arguments[0];
        offset = ToUint32(arguments[1]);
        if (offset + array.length > this.length) {
          throw RangeError('Offset plus length of array is out of range');
        }
        byteOffset = this.byteOffset + offset * this.BYTES_PER_ELEMENT;
        byteLength = array.length * this.BYTES_PER_ELEMENT;
        if (array.buffer === this.buffer) {
          tmp = [];
          for (i = 0, s = array.byteOffset; i < byteLength; i += 1, s += 1) {
            tmp[i] = array.buffer._bytes[s];
          }
          for (i = 0, d = byteOffset; i < byteLength; i += 1, d += 1) {
            this.buffer._bytes[d] = tmp[i];
          }
        } else {
          for (i = 0, s = array.byteOffset, d = byteOffset;
               i < byteLength; i += 1, s += 1, d += 1) {
            this.buffer._bytes[d] = array.buffer._bytes[s];
          }
        }
      } else if (typeof arguments[0] === 'object' && typeof arguments[0].length !== 'undefined') {
        sequence = arguments[0];
        len = ToUint32(sequence.length);
        offset = ToUint32(arguments[1]);
        if (offset + len > this.length) {
          throw RangeError('Offset plus length of array is out of range');
        }
        for (i = 0; i < len; i += 1) {
          s = sequence[i];
          this._setter(offset + i, Number(s));
        }
      } else {
        throw TypeError('Unexpected argument type(s)');
      }
    }});
    Object.defineProperty($TypedArray$.prototype, 'slice', {value: function(start, end) {
      var o = ToObject(this);
      var lenVal = o.length;
      var len = ToUint32(lenVal);
      var relativeStart = ToInt32(start);
      var k = (relativeStart < 0) ? max(len + relativeStart, 0) : min(relativeStart, len);
      var relativeEnd = (end === undefined) ? len : ToInt32(end);
      var final = (relativeEnd < 0) ? max(len + relativeEnd, 0) : min(relativeEnd, len);
      var count = final - k;
      var c = o.constructor;
      var a = new c(count);
      var n = 0;
      while (k < final) {
        var kValue = o._getter(k);
        a._setter(n, kValue);
        ++k;
        ++n;
      }
      return a;
    }});
    Object.defineProperty($TypedArray$.prototype, 'some', {value: function(callbackfn) {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      if (!IsCallable(callbackfn)) throw TypeError();
      var thisp = arguments[1];
      for (var i = 0; i < len; i++) {
        if (callbackfn.call(thisp, t._getter(i), i, t)) {
          return true;
        }
      }
      return false;
    }});
    Object.defineProperty($TypedArray$.prototype, 'sort', {value: function(comparefn) {
      if (this === undefined || this === null) throw TypeError();
      var t = Object(this);
      var len = ToUint32(t.length);
      var tmp = Array(len);
      for (var i = 0; i < len; ++i)
        tmp[i] = t._getter(i);
      if (comparefn) tmp.sort(comparefn); else tmp.sort();
      for (i = 0; i < len; ++i)
        t._setter(i, tmp[i]);
      return t;
    }});
    Object.defineProperty($TypedArray$.prototype, 'subarray', {value: function(start, end) {
      function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }
      start = ToInt32(start);
      end = ToInt32(end);
      if (arguments.length < 1) { start = 0; }
      if (arguments.length < 2) { end = this.length; }
      if (start < 0) { start = this.length + start; }
      if (end < 0) { end = this.length + end; }
      start = clamp(start, 0, this.length);
      end = clamp(end, 0, this.length);
      var len = end - start;
      if (len < 0) {
        len = 0;
      }
      return new this.constructor(
        this.buffer, this.byteOffset + start * this.BYTES_PER_ELEMENT, len);
    }});
    function makeTypedArray(elementSize, pack, unpack) {
      var TypedArray = function() {
        Object.defineProperty(this, 'constructor', {value: TypedArray});
        $TypedArray$.apply(this, arguments);
        makeArrayAccessors(this);
      };
      if ('__proto__' in TypedArray) {
        TypedArray.__proto__ = $TypedArray$;
      } else {
        TypedArray.from = $TypedArray$.from;
        TypedArray.of = $TypedArray$.of;
      }
      TypedArray.BYTES_PER_ELEMENT = elementSize;
      var TypedArrayPrototype = function() {};
      TypedArrayPrototype.prototype = $TypedArrayPrototype$;
      TypedArray.prototype = new TypedArrayPrototype();
      Object.defineProperty(TypedArray.prototype, 'BYTES_PER_ELEMENT', {value: elementSize});
      Object.defineProperty(TypedArray.prototype, '_pack', {value: pack});
      Object.defineProperty(TypedArray.prototype, '_unpack', {value: unpack});
      return TypedArray;
    }
    var Int8Array = makeTypedArray(1, packI8, unpackI8);
    var Uint8Array = makeTypedArray(1, packU8, unpackU8);
    var Uint8ClampedArray = makeTypedArray(1, packU8Clamped, unpackU8);
    var Int16Array = makeTypedArray(2, packI16, unpackI16);
    var Uint16Array = makeTypedArray(2, packU16, unpackU16);
    var Int32Array = makeTypedArray(4, packI32, unpackI32);
    var Uint32Array = makeTypedArray(4, packU32, unpackU32);
    var Float32Array = makeTypedArray(4, packF32, unpackF32);
    var Float64Array = makeTypedArray(8, packF64, unpackF64);
    global.Int8Array = global.Int8Array || Int8Array;
    global.Uint8Array = global.Uint8Array || Uint8Array;
    global.Uint8ClampedArray = global.Uint8ClampedArray || Uint8ClampedArray;
    global.Int16Array = global.Int16Array || Int16Array;
    global.Uint16Array = global.Uint16Array || Uint16Array;
    global.Int32Array = global.Int32Array || Int32Array;
    global.Uint32Array = global.Uint32Array || Uint32Array;
    global.Float32Array = global.Float32Array || Float32Array;
    global.Float64Array = global.Float64Array || Float64Array;
  }());
  (function() {
    function r(array, index) {
      return IsCallable(array.get) ? array.get(index) : array[index];
    }
    var IS_BIG_ENDIAN = (function() {
      var u16array = new Uint16Array([0x1234]),
          u8array = new Uint8Array(u16array.buffer);
      return r(u8array, 0) === 0x12;
    }());
    function DataView(buffer, byteOffset, byteLength) {
      if (!(buffer instanceof ArrayBuffer || Class(buffer) === 'ArrayBuffer')) throw TypeError();
      byteOffset = ToUint32(byteOffset);
      if (byteOffset > buffer.byteLength)
        throw RangeError('byteOffset out of range');
      if (byteLength === undefined)
        byteLength = buffer.byteLength - byteOffset;
      else
        byteLength = ToUint32(byteLength);
      if ((byteOffset + byteLength) > buffer.byteLength)
        throw RangeError('byteOffset and length reference an area beyond the end of the buffer');
      Object.defineProperty(this, 'buffer', {value: buffer});
      Object.defineProperty(this, 'byteLength', {value: byteLength});
      Object.defineProperty(this, 'byteOffset', {value: byteOffset});
    };
    function makeGetter(arrayType) {
      return function GetViewValue(byteOffset, littleEndian) {
        byteOffset = ToUint32(byteOffset);
        if (byteOffset + arrayType.BYTES_PER_ELEMENT > this.byteLength)
          throw RangeError('Array index out of range');
        byteOffset += this.byteOffset;
        var uint8Array = new Uint8Array(this.buffer, byteOffset, arrayType.BYTES_PER_ELEMENT),
            bytes = [];
        for (var i = 0; i < arrayType.BYTES_PER_ELEMENT; i += 1)
          bytes.push(r(uint8Array, i));
        if (Boolean(littleEndian) === Boolean(IS_BIG_ENDIAN))
          bytes.reverse();
        return r(new arrayType(new Uint8Array(bytes).buffer), 0);
      };
    }
    Object.defineProperty(DataView.prototype, 'getUint8', {value: makeGetter(Uint8Array)});
    Object.defineProperty(DataView.prototype, 'getInt8', {value: makeGetter(Int8Array)});
    Object.defineProperty(DataView.prototype, 'getUint16', {value: makeGetter(Uint16Array)});
    Object.defineProperty(DataView.prototype, 'getInt16', {value: makeGetter(Int16Array)});
    Object.defineProperty(DataView.prototype, 'getUint32', {value: makeGetter(Uint32Array)});
    Object.defineProperty(DataView.prototype, 'getInt32', {value: makeGetter(Int32Array)});
    Object.defineProperty(DataView.prototype, 'getFloat32', {value: makeGetter(Float32Array)});
    Object.defineProperty(DataView.prototype, 'getFloat64', {value: makeGetter(Float64Array)});
    function makeSetter(arrayType) {
      return function SetViewValue(byteOffset, value, littleEndian) {
        byteOffset = ToUint32(byteOffset);
        if (byteOffset + arrayType.BYTES_PER_ELEMENT > this.byteLength)
          throw RangeError('Array index out of range');
        var typeArray = new arrayType([value]),
            byteArray = new Uint8Array(typeArray.buffer),
            bytes = [], i, byteView;
        for (i = 0; i < arrayType.BYTES_PER_ELEMENT; i += 1)
          bytes.push(r(byteArray, i));
        if (Boolean(littleEndian) === Boolean(IS_BIG_ENDIAN))
          bytes.reverse();
        byteView = new Uint8Array(this.buffer, byteOffset, arrayType.BYTES_PER_ELEMENT);
        byteView.set(bytes);
      };
    }
    Object.defineProperty(DataView.prototype, 'setUint8', {value: makeSetter(Uint8Array)});
    Object.defineProperty(DataView.prototype, 'setInt8', {value: makeSetter(Int8Array)});
    Object.defineProperty(DataView.prototype, 'setUint16', {value: makeSetter(Uint16Array)});
    Object.defineProperty(DataView.prototype, 'setInt16', {value: makeSetter(Int16Array)});
    Object.defineProperty(DataView.prototype, 'setUint32', {value: makeSetter(Uint32Array)});
    Object.defineProperty(DataView.prototype, 'setInt32', {value: makeSetter(Int32Array)});
    Object.defineProperty(DataView.prototype, 'setFloat32', {value: makeSetter(Float32Array)});
    Object.defineProperty(DataView.prototype, 'setFloat64', {value: makeSetter(Float64Array)});
    global.DataView = global.DataView || DataView;
  }());
}(this));
var BigInteger = function() {
var dbits, DV, BI_FP;
var dbits;
var canary = 0xdeadbeefcafe;
var j_lm = ((canary&0xffffff)==0xefcafe);
function BigInteger(a,b,c) {
  this.data = [];
  if(a != null)
    if("number" == typeof a) this.fromNumber(a,b,c);
    else if(b == null && "string" != typeof a) this.fromString(a,256);
    else this.fromString(a,b);
}
function nbi() { return new BigInteger(null); }
function am1(i,x,w,j,c,n) {
  while(--n >= 0) {
    var v = x*this.data[i++]+w.data[j]+c;
    c = Math.floor(v/0x4000000);
    w.data[j++] = v&0x3ffffff;
  }
  return c;
}
function am2(i,x,w,j,c,n) {
  var xl = x&0x7fff, xh = x>>15;
  while(--n >= 0) {
    var l = this.data[i]&0x7fff;
    var h = this.data[i++]>>15;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x7fff)<<15)+w.data[j]+(c&0x3fffffff);
    c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
    w.data[j++] = l&0x3fffffff;
  }
  return c;
}
function am3(i,x,w,j,c,n) {
  var xl = x&0x3fff, xh = x>>14;
  while(--n >= 0) {
    var l = this.data[i]&0x3fff;
    var h = this.data[i++]>>14;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x3fff)<<14)+w.data[j]+c;
    c = (l>>28)+(m>>14)+xh*h;
    w.data[j++] = l&0xfffffff;
  }
  return c;
}
if(typeof(navigator) === 'undefined')
{
   BigInteger.prototype.am = am3;
   dbits = 28;
}
else if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
  BigInteger.prototype.am = am2;
  dbits = 30;
}
else if(j_lm && (navigator.appName != "Netscape")) {
  BigInteger.prototype.am = am1;
  dbits = 26;
}
else {
  BigInteger.prototype.am = am3;
  dbits = 28;
}
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1<<dbits)-1);
BigInteger.prototype.DV = (1<<dbits);
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2,BI_FP);
BigInteger.prototype.F1 = BI_FP-dbits;
BigInteger.prototype.F2 = 2*dbits-BI_FP;
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr,vv;
rr = "0".charCodeAt(0);
for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
function int2char(n) { return BI_RM.charAt(n); }
function intAt(s,i) {
  var c = BI_RC[s.charCodeAt(i)];
  return (c==null)?-1:c;
}
function bnpCopyTo(r) {
  for(var i = this.t-1; i >= 0; --i) r.data[i] = this.data[i];
  r.t = this.t;
  r.s = this.s;
}
function bnpFromInt(x) {
  this.t = 1;
  this.s = (x<0)?-1:0;
  if(x > 0) this.data[0] = x;
  else if(x < -1) this.data[0] = x+DV;
  else this.t = 0;
}
function nbv(i) { var r = nbi(); r.fromInt(i); return r; }
function bnpFromString(s,b) {
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 256) k = 8;
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else { this.fromRadix(s,b); return; }
  this.t = 0;
  this.s = 0;
  var i = s.length, mi = false, sh = 0;
  while(--i >= 0) {
    var x = (k==8)?s[i]&0xff:intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-") mi = true;
      continue;
    }
    mi = false;
    if(sh == 0)
      this.data[this.t++] = x;
    else if(sh+k > this.DB) {
      this.data[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
      this.data[this.t++] = (x>>(this.DB-sh));
    }
    else
      this.data[this.t-1] |= x<<sh;
    sh += k;
    if(sh >= this.DB) sh -= this.DB;
  }
  if(k == 8 && (s[0]&0x80) != 0) {
    this.s = -1;
    if(sh > 0) this.data[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
  }
  this.clamp();
  if(mi) BigInteger.ZERO.subTo(this,this);
}
function bnpClamp() {
  var c = this.s&this.DM;
  while(this.t > 0 && this.data[this.t-1] == c) --this.t;
}
function bnToString(b) {
  if(this.s < 0) return "-"+this.negate().toString(b);
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else return this.toRadix(b);
  var km = (1<<k)-1, d, m = false, r = "", i = this.t;
  var p = this.DB-(i*this.DB)%k;
  if(i-- > 0) {
    if(p < this.DB && (d = this.data[i]>>p) > 0) { m = true; r = int2char(d); }
    while(i >= 0) {
      if(p < k) {
        d = (this.data[i]&((1<<p)-1))<<(k-p);
        d |= this.data[--i]>>(p+=this.DB-k);
      }
      else {
        d = (this.data[i]>>(p-=k))&km;
        if(p <= 0) { p += this.DB; --i; }
      }
      if(d > 0) m = true;
      if(m) r += int2char(d);
    }
  }
  return m?r:"0";
}
function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }
function bnAbs() { return (this.s<0)?this.negate():this; }
function bnCompareTo(a) {
  var r = this.s-a.s;
  if(r != 0) return r;
  var i = this.t;
  r = i-a.t;
  if(r != 0) return (this.s<0)?-r:r;
  while(--i >= 0) if((r=this.data[i]-a.data[i]) != 0) return r;
  return 0;
}
function nbits(x) {
  var r = 1, t;
  if((t=x>>>16) != 0) { x = t; r += 16; }
  if((t=x>>8) != 0) { x = t; r += 8; }
  if((t=x>>4) != 0) { x = t; r += 4; }
  if((t=x>>2) != 0) { x = t; r += 2; }
  if((t=x>>1) != 0) { x = t; r += 1; }
  return r;
}
function bnBitLength() {
  if(this.t <= 0) return 0;
  return this.DB*(this.t-1)+nbits(this.data[this.t-1]^(this.s&this.DM));
}
function bnpDLShiftTo(n,r) {
  var i;
  for(i = this.t-1; i >= 0; --i) r.data[i+n] = this.data[i];
  for(i = n-1; i >= 0; --i) r.data[i] = 0;
  r.t = this.t+n;
  r.s = this.s;
}
function bnpDRShiftTo(n,r) {
  for(var i = n; i < this.t; ++i) r.data[i-n] = this.data[i];
  r.t = Math.max(this.t-n,0);
  r.s = this.s;
}
function bnpLShiftTo(n,r) {
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<cbs)-1;
  var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
  for(i = this.t-1; i >= 0; --i) {
    r.data[i+ds+1] = (this.data[i]>>cbs)|c;
    c = (this.data[i]&bm)<<bs;
  }
  for(i = ds-1; i >= 0; --i) r.data[i] = 0;
  r.data[ds] = c;
  r.t = this.t+ds+1;
  r.s = this.s;
  r.clamp();
}
function bnpRShiftTo(n,r) {
  r.s = this.s;
  var ds = Math.floor(n/this.DB);
  if(ds >= this.t) { r.t = 0; return; }
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<bs)-1;
  r.data[0] = this.data[ds]>>bs;
  for(var i = ds+1; i < this.t; ++i) {
    r.data[i-ds-1] |= (this.data[i]&bm)<<cbs;
    r.data[i-ds] = this.data[i]>>bs;
  }
  if(bs > 0) r.data[this.t-ds-1] |= (this.s&bm)<<cbs;
  r.t = this.t-ds;
  r.clamp();
}
function bnpSubTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this.data[i]-a.data[i];
    r.data[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c -= a.s;
    while(i < this.t) {
      c += this.data[i];
      r.data[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c -= a.data[i];
      r.data[i++] = c&this.DM;
      c >>= this.DB;
    }
    c -= a.s;
  }
  r.s = (c<0)?-1:0;
  if(c < -1) r.data[i++] = this.DV+c;
  else if(c > 0) r.data[i++] = c;
  r.t = i;
  r.clamp();
}
function bnpMultiplyTo(a,r) {
  var x = this.abs(), y = a.abs();
  var i = x.t;
  r.t = i+y.t;
  while(--i >= 0) r.data[i] = 0;
  for(i = 0; i < y.t; ++i) r.data[i+x.t] = x.am(0,y.data[i],r,i,0,x.t);
  r.s = 0;
  r.clamp();
  if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
}
function bnpSquareTo(r) {
  var x = this.abs();
  var i = r.t = 2*x.t;
  while(--i >= 0) r.data[i] = 0;
  for(i = 0; i < x.t-1; ++i) {
    var c = x.am(i,x.data[i],r,2*i,0,1);
    if((r.data[i+x.t]+=x.am(i+1,2*x.data[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
      r.data[i+x.t] -= x.DV;
      r.data[i+x.t+1] = 1;
    }
  }
  if(r.t > 0) r.data[r.t-1] += x.am(i,x.data[i],r,2*i,0,1);
  r.s = 0;
  r.clamp();
}
function bnpDivRemTo(m,q,r) {
  var pm = m.abs();
  if(pm.t <= 0) return;
  var pt = this.abs();
  if(pt.t < pm.t) {
    if(q != null) q.fromInt(0);
    if(r != null) this.copyTo(r);
    return;
  }
  if(r == null) r = nbi();
  var y = nbi(), ts = this.s, ms = m.s;
  var nsh = this.DB-nbits(pm.data[pm.t-1]);
  if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
  else { pm.copyTo(y); pt.copyTo(r); }
  var ys = y.t;
  var y0 = y.data[ys-1];
  if(y0 == 0) return;
  var yt = y0*(1<<this.F1)+((ys>1)?y.data[ys-2]>>this.F2:0);
  var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
  var i = r.t, j = i-ys, t = (q==null)?nbi():q;
  y.dlShiftTo(j,t);
  if(r.compareTo(t) >= 0) {
    r.data[r.t++] = 1;
    r.subTo(t,r);
  }
  BigInteger.ONE.dlShiftTo(ys,t);
  t.subTo(y,y);
  while(y.t < ys) y.data[y.t++] = 0;
  while(--j >= 0) {
    var qd = (r.data[--i]==y0)?this.DM:Math.floor(r.data[i]*d1+(r.data[i-1]+e)*d2);
    if((r.data[i]+=y.am(0,qd,r,j,0,ys)) < qd) {
      y.dlShiftTo(j,t);
      r.subTo(t,r);
      while(r.data[i] < --qd) r.subTo(t,r);
    }
  }
  if(q != null) {
    r.drShiftTo(ys,q);
    if(ts != ms) BigInteger.ZERO.subTo(q,q);
  }
  r.t = ys;
  r.clamp();
  if(nsh > 0) r.rShiftTo(nsh,r);
  if(ts < 0) BigInteger.ZERO.subTo(r,r);
}
function bnMod(a) {
  var r = nbi();
  this.abs().divRemTo(a,null,r);
  if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
  return r;
}
function Classic(m) { this.m = m; }
function cConvert(x) {
  if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
  else return x;
}
function cRevert(x) { return x; }
function cReduce(x) { x.divRemTo(this.m,null,x); }
function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }
Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;
function bnpInvDigit() {
  if(this.t < 1) return 0;
  var x = this.data[0];
  if((x&1) == 0) return 0;
  var y = x&3;
  y = (y*(2-(x&0xf)*y))&0xf;
  y = (y*(2-(x&0xff)*y))&0xff;
  y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;
  y = (y*(2-x*y%this.DV))%this.DV;
  return (y>0)?this.DV-y:-y;
}
function Montgomery(m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp&0x7fff;
  this.mph = this.mp>>15;
  this.um = (1<<(m.DB-15))-1;
  this.mt2 = 2*m.t;
}
function montConvert(x) {
  var r = nbi();
  x.abs().dlShiftTo(this.m.t,r);
  r.divRemTo(this.m,null,r);
  if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
  return r;
}
function montRevert(x) {
  var r = nbi();
  x.copyTo(r);
  this.reduce(r);
  return r;
}
function montReduce(x) {
  while(x.t <= this.mt2)
    x.data[x.t++] = 0;
  for(var i = 0; i < this.m.t; ++i) {
    var j = x.data[i]&0x7fff;
    var u0 = (j*this.mpl+(((j*this.mph+(x.data[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
    j = i+this.m.t;
    x.data[j] += this.m.am(0,u0,x,i,0,this.m.t);
    while(x.data[j] >= x.DV) { x.data[j] -= x.DV; x.data[++j]++; }
  }
  x.clamp();
  x.drShiftTo(this.m.t,x);
  if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}
function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }
function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;
function bnpIsEven() { return ((this.t>0)?(this.data[0]&1):this.s) == 0; }
function bnpExp(e,z) {
  if(e > 0xffffffff || e < 1) return BigInteger.ONE;
  var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
  g.copyTo(r);
  while(--i >= 0) {
    z.sqrTo(r,r2);
    if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
    else { var t = r; r = r2; r2 = t; }
  }
  return z.revert(r);
}
function bnModPowInt(e,m) {
  var z;
  if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
  return this.exp(e,z);
}
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);
function bnClone() { var r = nbi(); this.copyTo(r); return r; }
function bnIntValue() {
  if(this.s < 0) {
    if(this.t == 1) return this.data[0]-this.DV;
    else if(this.t == 0) return -1;
  }
  else if(this.t == 1) return this.data[0];
  else if(this.t == 0) return 0;
  return ((this.data[1]&((1<<(32-this.DB))-1))<<this.DB)|this.data[0];
}
function bnByteValue() { return (this.t==0)?this.s:(this.data[0]<<24)>>24; }
function bnShortValue() { return (this.t==0)?this.s:(this.data[0]<<16)>>16; }
function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }
function bnSigNum() {
  if(this.s < 0) return -1;
  else if(this.t <= 0 || (this.t == 1 && this.data[0] <= 0)) return 0;
  else return 1;
}
function bnpToRadix(b) {
  if(b == null) b = 10;
  if(this.signum() == 0 || b < 2 || b > 36) return "0";
  var cs = this.chunkSize(b);
  var a = Math.pow(b,cs);
  var d = nbv(a), y = nbi(), z = nbi(), r = "";
  this.divRemTo(d,y,z);
  while(y.signum() > 0) {
    r = (a+z.intValue()).toString(b).substr(1) + r;
    y.divRemTo(d,y,z);
  }
  return z.intValue().toString(b) + r;
}
function bnpFromRadix(s,b) {
  this.fromInt(0);
  if(b == null) b = 10;
  var cs = this.chunkSize(b);
  var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
  for(var i = 0; i < s.length; ++i) {
    var x = intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
      continue;
    }
    w = b*w+x;
    if(++j >= cs) {
      this.dMultiply(d);
      this.dAddOffset(w,0);
      j = 0;
      w = 0;
    }
  }
  if(j > 0) {
    this.dMultiply(Math.pow(b,j));
    this.dAddOffset(w,0);
  }
  if(mi) BigInteger.ZERO.subTo(this,this);
}
function bnpFromNumber(a,b,c) {
  if("number" == typeof b) {
    if(a < 2) this.fromInt(1);
    else {
      this.fromNumber(a,c);
      if(!this.testBit(a-1))
        this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);
      if(this.isEven()) this.dAddOffset(1,0);
      while(!this.isProbablePrime(b)) {
        this.dAddOffset(2,0);
        if(this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a-1),this);
      }
    }
  }
  else {
    var x = new Array(), t = a&7;
    x.length = (a>>3)+1;
    b.nextBytes(x);
    if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
    this.fromString(x,256);
  }
}
function bnToByteArray() {
  var i = this.t, r = new Array();
  r[0] = this.s;
  var p = this.DB-(i*this.DB)%8, d, k = 0;
  if(i-- > 0) {
    if(p < this.DB && (d = this.data[i]>>p) != (this.s&this.DM)>>p)
      r[k++] = d|(this.s<<(this.DB-p));
    while(i >= 0) {
      if(p < 8) {
        d = (this.data[i]&((1<<p)-1))<<(8-p);
        d |= this.data[--i]>>(p+=this.DB-8);
      }
      else {
        d = (this.data[i]>>(p-=8))&0xff;
        if(p <= 0) { p += this.DB; --i; }
      }
      if((d&0x80) != 0) d |= -256;
      if(k == 0 && (this.s&0x80) != (d&0x80)) ++k;
      if(k > 0 || d != this.s) r[k++] = d;
    }
  }
  return r;
}
function bnEquals(a) { return(this.compareTo(a)==0); }
function bnMin(a) { return(this.compareTo(a)<0)?this:a; }
function bnMax(a) { return(this.compareTo(a)>0)?this:a; }
function bnpBitwiseTo(a,op,r) {
  var i, f, m = Math.min(a.t,this.t);
  for(i = 0; i < m; ++i) r.data[i] = op(this.data[i],a.data[i]);
  if(a.t < this.t) {
    f = a.s&this.DM;
    for(i = m; i < this.t; ++i) r.data[i] = op(this.data[i],f);
    r.t = this.t;
  }
  else {
    f = this.s&this.DM;
    for(i = m; i < a.t; ++i) r.data[i] = op(f,a.data[i]);
    r.t = a.t;
  }
  r.s = op(this.s,a.s);
  r.clamp();
}
function op_and(x,y) { return x&y; }
function bnAnd(a) { var r = nbi(); this.bitwiseTo(a,op_and,r); return r; }
function op_or(x,y) { return x|y; }
function bnOr(a) { var r = nbi(); this.bitwiseTo(a,op_or,r); return r; }
function op_xor(x,y) { return x^y; }
function bnXor(a) { var r = nbi(); this.bitwiseTo(a,op_xor,r); return r; }
function op_andnot(x,y) { return x&~y; }
function bnAndNot(a) { var r = nbi(); this.bitwiseTo(a,op_andnot,r); return r; }
function bnNot() {
  var r = nbi();
  for(var i = 0; i < this.t; ++i) r.data[i] = this.DM&~this.data[i];
  r.t = this.t;
  r.s = ~this.s;
  return r;
}
function bnShiftLeft(n) {
  var r = nbi();
  if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);
  return r;
}
function bnShiftRight(n) {
  var r = nbi();
  if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);
  return r;
}
function lbit(x) {
  if(x == 0) return -1;
  var r = 0;
  if((x&0xffff) == 0) { x >>= 16; r += 16; }
  if((x&0xff) == 0) { x >>= 8; r += 8; }
  if((x&0xf) == 0) { x >>= 4; r += 4; }
  if((x&3) == 0) { x >>= 2; r += 2; }
  if((x&1) == 0) ++r;
  return r;
}
function bnGetLowestSetBit() {
  for(var i = 0; i < this.t; ++i)
    if(this.data[i] != 0) return i*this.DB+lbit(this.data[i]);
  if(this.s < 0) return this.t*this.DB;
  return -1;
}
function cbit(x) {
  var r = 0;
  while(x != 0) { x &= x-1; ++r; }
  return r;
}
function bnBitCount() {
  var r = 0, x = this.s&this.DM;
  for(var i = 0; i < this.t; ++i) r += cbit(this.data[i]^x);
  return r;
}
function bnTestBit(n) {
  var j = Math.floor(n/this.DB);
  if(j >= this.t) return(this.s!=0);
  return((this.data[j]&(1<<(n%this.DB)))!=0);
}
function bnpChangeBit(n,op) {
  var r = BigInteger.ONE.shiftLeft(n);
  this.bitwiseTo(r,op,r);
  return r;
}
function bnSetBit(n) { return this.changeBit(n,op_or); }
function bnClearBit(n) { return this.changeBit(n,op_andnot); }
function bnFlipBit(n) { return this.changeBit(n,op_xor); }
function bnpAddTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this.data[i]+a.data[i];
    r.data[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c += a.s;
    while(i < this.t) {
      c += this.data[i];
      r.data[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c += a.data[i];
      r.data[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += a.s;
  }
  r.s = (c<0)?-1:0;
  if(c > 0) r.data[i++] = c;
  else if(c < -1) r.data[i++] = this.DV+c;
  r.t = i;
  r.clamp();
}
function bnAdd(a) { var r = nbi(); this.addTo(a,r); return r; }
function bnSubtract(a) { var r = nbi(); this.subTo(a,r); return r; }
function bnMultiply(a) { var r = nbi(); this.multiplyTo(a,r); return r; }
function bnSquare() { var r = nbi(); this.squareTo(r); return r; }
function bnDivide(a) { var r = nbi(); this.divRemTo(a,r,null); return r; }
function bnRemainder(a) { var r = nbi(); this.divRemTo(a,null,r); return r; }
function bnDivideAndRemainder(a) {
  var q = nbi(), r = nbi();
  this.divRemTo(a,q,r);
  return new Array(q,r);
}
function bnpDMultiply(n) {
  this.data[this.t] = this.am(0,n-1,this,0,0,this.t);
  ++this.t;
  this.clamp();
}
function bnpDAddOffset(n,w) {
  if(n == 0) return;
  while(this.t <= w) this.data[this.t++] = 0;
  this.data[w] += n;
  while(this.data[w] >= this.DV) {
    this.data[w] -= this.DV;
    if(++w >= this.t) this.data[this.t++] = 0;
    ++this.data[w];
  }
}
function NullExp() {}
function nNop(x) { return x; }
function nMulTo(x,y,r) { x.multiplyTo(y,r); }
function nSqrTo(x,r) { x.squareTo(r); }
NullExp.prototype.convert = nNop;
NullExp.prototype.revert = nNop;
NullExp.prototype.mulTo = nMulTo;
NullExp.prototype.sqrTo = nSqrTo;
function bnPow(e) { return this.exp(e,new NullExp()); }
function bnpMultiplyLowerTo(a,n,r) {
  var i = Math.min(this.t+a.t,n);
  r.s = 0;
  r.t = i;
  while(i > 0) r.data[--i] = 0;
  var j;
  for(j = r.t-this.t; i < j; ++i) r.data[i+this.t] = this.am(0,a.data[i],r,i,0,this.t);
  for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a.data[i],r,i,0,n-i);
  r.clamp();
}
function bnpMultiplyUpperTo(a,n,r) {
  --n;
  var i = r.t = this.t+a.t-n;
  r.s = 0;
  while(--i >= 0) r.data[i] = 0;
  for(i = Math.max(n-this.t,0); i < a.t; ++i)
    r.data[this.t+i-n] = this.am(n-i,a.data[i],r,0,0,this.t+i-n);
  r.clamp();
  r.drShiftTo(1,r);
}
function Barrett(m) {
  this.r2 = nbi();
  this.q3 = nbi();
  BigInteger.ONE.dlShiftTo(2*m.t,this.r2);
  this.mu = this.r2.divide(m);
  this.m = m;
}
function barrettConvert(x) {
  if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
  else if(x.compareTo(this.m) < 0) return x;
  else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }
}
function barrettRevert(x) { return x; }
function barrettReduce(x) {
  x.drShiftTo(this.m.t-1,this.r2);
  if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
  this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
  this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
  while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
  x.subTo(this.r2,x);
  while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}
function barrettSqrTo(x,r) { x.squareTo(r); this.reduce(r); }
function barrettMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
Barrett.prototype.convert = barrettConvert;
Barrett.prototype.revert = barrettRevert;
Barrett.prototype.reduce = barrettReduce;
Barrett.prototype.mulTo = barrettMulTo;
Barrett.prototype.sqrTo = barrettSqrTo;
function bnModPow(e,m) {
  var i = e.bitLength(), k, r = nbv(1), z;
  if(i <= 0) return r;
  else if(i < 18) k = 1;
  else if(i < 48) k = 3;
  else if(i < 144) k = 4;
  else if(i < 768) k = 5;
  else k = 6;
  if(i < 8)
    z = new Classic(m);
  else if(m.isEven())
    z = new Barrett(m);
  else
    z = new Montgomery(m);
  var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;
  g[1] = z.convert(this);
  if(k > 1) {
    var g2 = nbi();
    z.sqrTo(g[1],g2);
    while(n <= km) {
      g[n] = nbi();
      z.mulTo(g2,g[n-2],g[n]);
      n += 2;
    }
  }
  var j = e.t-1, w, is1 = true, r2 = nbi(), t;
  i = nbits(e.data[j])-1;
  while(j >= 0) {
    if(i >= k1) w = (e.data[j]>>(i-k1))&km;
    else {
      w = (e.data[j]&((1<<(i+1))-1))<<(k1-i);
      if(j > 0) w |= e.data[j-1]>>(this.DB+i-k1);
    }
    n = k;
    while((w&1) == 0) { w >>= 1; --n; }
    if((i -= n) < 0) { i += this.DB; --j; }
    if(is1) {
      g[w].copyTo(r);
      is1 = false;
    }
    else {
      while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }
      if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }
      z.mulTo(r2,g[w],r);
    }
    while(j >= 0 && (e.data[j]&(1<<i)) == 0) {
      z.sqrTo(r,r2); t = r; r = r2; r2 = t;
      if(--i < 0) { i = this.DB-1; --j; }
    }
  }
  return z.revert(r);
}
function bnGCD(a) {
  var x = (this.s<0)?this.negate():this.clone();
  var y = (a.s<0)?a.negate():a.clone();
  if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }
  var i = x.getLowestSetBit(), g = y.getLowestSetBit();
  if(g < 0) return x;
  if(i < g) g = i;
  if(g > 0) {
    x.rShiftTo(g,x);
    y.rShiftTo(g,y);
  }
  while(x.signum() > 0) {
    if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);
    if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);
    if(x.compareTo(y) >= 0) {
      x.subTo(y,x);
      x.rShiftTo(1,x);
    }
    else {
      y.subTo(x,y);
      y.rShiftTo(1,y);
    }
  }
  if(g > 0) y.lShiftTo(g,y);
  return y;
}
function bnpModInt(n) {
  if(n <= 0) return 0;
  var d = this.DV%n, r = (this.s<0)?n-1:0;
  if(this.t > 0)
    if(d == 0) r = this.data[0]%n;
    else for(var i = this.t-1; i >= 0; --i) r = (d*r+this.data[i])%n;
  return r;
}
function bnModInverse(m) {
  var ac = m.isEven();
  if((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
  var u = m.clone(), v = this.clone();
  var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
  while(u.signum() != 0) {
    while(u.isEven()) {
      u.rShiftTo(1,u);
      if(ac) {
        if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }
        a.rShiftTo(1,a);
      }
      else if(!b.isEven()) b.subTo(m,b);
      b.rShiftTo(1,b);
    }
    while(v.isEven()) {
      v.rShiftTo(1,v);
      if(ac) {
        if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }
        c.rShiftTo(1,c);
      }
      else if(!d.isEven()) d.subTo(m,d);
      d.rShiftTo(1,d);
    }
    if(u.compareTo(v) >= 0) {
      u.subTo(v,u);
      if(ac) a.subTo(c,a);
      b.subTo(d,b);
    }
    else {
      v.subTo(u,v);
      if(ac) c.subTo(a,c);
      d.subTo(b,d);
    }
  }
  if(v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
  if(d.compareTo(m) >= 0) return d.subtract(m);
  if(d.signum() < 0) d.addTo(m,d); else return d;
  if(d.signum() < 0) return d.add(m); else return d;
}
var lowprimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];
var lplim = (1<<26)/lowprimes[lowprimes.length-1];
function bnIsProbablePrime(t) {
  var i, x = this.abs();
  if(x.t == 1 && x.data[0] <= lowprimes[lowprimes.length-1]) {
    for(i = 0; i < lowprimes.length; ++i)
      if(x.data[0] == lowprimes[i]) return true;
    return false;
  }
  if(x.isEven()) return false;
  i = 1;
  while(i < lowprimes.length) {
    var m = lowprimes[i], j = i+1;
    while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];
    m = x.modInt(m);
    while(i < j) if(m%lowprimes[i++] == 0) return false;
  }
  return x.millerRabin(t);
}
function bnpMillerRabin(t) {
  var n1 = this.subtract(BigInteger.ONE);
  var k = n1.getLowestSetBit();
  if(k <= 0) return false;
  var r = n1.shiftRight(k);
  t = (t+1)>>1;
  if(t > lowprimes.length) t = lowprimes.length;
  var a = nbi();
  for(var i = 0; i < t; ++i) {
    a.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);
    var y = a.modPow(r,this);
    if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
      var j = 1;
      while(j++ < k && y.compareTo(n1) != 0) {
        y = y.modPowInt(2,this);
        if(y.compareTo(BigInteger.ONE) == 0) return false;
      }
      if(y.compareTo(n1) != 0) return false;
    }
  }
  return true;
}
BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.toRadix = bnpToRadix;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.fromNumber = bnpFromNumber;
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
BigInteger.prototype.changeBit = bnpChangeBit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
BigInteger.prototype.modInt = bnpModInt;
BigInteger.prototype.millerRabin = bnpMillerRabin;
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.byteValue = bnByteValue;
BigInteger.prototype.shortValue = bnShortValue;
BigInteger.prototype.signum = bnSigNum;
BigInteger.prototype.toByteArray = bnToByteArray;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.min = bnMin;
BigInteger.prototype.max = bnMax;
BigInteger.prototype.and = bnAnd;
BigInteger.prototype.or = bnOr;
BigInteger.prototype.xor = bnXor;
BigInteger.prototype.andNot = bnAndNot;
BigInteger.prototype.not = bnNot;
BigInteger.prototype.shiftLeft = bnShiftLeft;
BigInteger.prototype.shiftRight = bnShiftRight;
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
BigInteger.prototype.bitCount = bnBitCount;
BigInteger.prototype.testBit = bnTestBit;
BigInteger.prototype.setBit = bnSetBit;
BigInteger.prototype.clearBit = bnClearBit;
BigInteger.prototype.flipBit = bnFlipBit;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.remainder = bnRemainder;
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.modInverse = bnModInverse;
BigInteger.prototype.pow = bnPow;
BigInteger.prototype.gcd = bnGCD;
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
BigInteger.prototype.square = bnSquare;
BigInteger.prototype.am = am3;
dbits = 28;
DV = (1<<dbits);
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1<<dbits)-1);
BigInteger.prototype.DV = (1<<dbits);
BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2,BI_FP);
BigInteger.prototype.F1 = BI_FP-dbits;
BigInteger.prototype.F2 = 2*dbits-BI_FP;
BigInteger.nbv = nbv;
BigInteger.nbi = nbi;
return BigInteger;
}();
var h$nbv = BigInteger.nbv;
var h$nbi = BigInteger.nbi;
if(typeof exports !== 'undefined') {
  if(typeof WeakMap === 'undefined' && typeof global !== 'undefined') {
    global.WeakMap = exports.WeakMap;
  }
}
var COMPILED = false;
var goog = goog || {};
goog.global = this;
goog.DEBUG = true;
goog.LOCALE = 'en';
goog.provide = function(name) {
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    delete goog.implicitNamespaces_[name];
    var namespace = name;
    while ((namespace = namespace.substring(0, namespace.lastIndexOf('.')))) {
      if (goog.getObjectByName(namespace)) {
        break;
      }
      goog.implicitNamespaces_[namespace] = true;
    }
  }
  goog.exportPath_(name);
};
goog.setTestOnly = function(opt_message) {
  if (COMPILED && !goog.DEBUG) {
    opt_message = opt_message || '';
    throw Error('Importing test-only code into non-debug environment' +
                opt_message ? ': ' + opt_message : '.');
  }
};
if (!COMPILED) {
  goog.isProvided_ = function(name) {
    return !goog.implicitNamespaces_[name] && !!goog.getObjectByName(name);
  };
  goog.implicitNamespaces_ = {};
}
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split('.');
  var cur = opt_objectToExportTo || goog.global;
  if (!(parts[0] in cur) && cur.execScript) {
    cur.execScript('var ' + parts[0]);
  }
  for (var part; parts.length && (part = parts.shift());) {
    if (!parts.length && goog.isDef(opt_object)) {
      cur[part] = opt_object;
    } else if (cur[part]) {
      cur = cur[part];
    } else {
      cur = cur[part] = {};
    }
  }
};
goog.getObjectByName = function(name, opt_obj) {
  var parts = name.split('.');
  var cur = opt_obj || goog.global;
  for (var part; part = parts.shift(); ) {
    if (goog.isDefAndNotNull(cur[part])) {
      cur = cur[part];
    } else {
      return null;
    }
  }
  return cur;
};
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global;
  for (var x in obj) {
    global[x] = obj[x];
  }
};
goog.addDependency = function(relPath, provides, requires) {
  if (!COMPILED) {
    var provide, require;
    var path = relPath.replace(/\\/g, '/');
    var deps = goog.dependencies_;
    for (var i = 0; provide = provides[i]; i++) {
      deps.nameToPath[provide] = path;
      if (!(path in deps.pathToNames)) {
        deps.pathToNames[path] = {};
      }
      deps.pathToNames[path][provide] = true;
    }
    for (var j = 0; require = requires[j]; j++) {
      if (!(path in deps.requires)) {
        deps.requires[path] = {};
      }
      deps.requires[path][require] = true;
    }
  }
};
goog.ENABLE_DEBUG_LOADER = true;
goog.require = function(name) {
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      return;
    }
    if (goog.ENABLE_DEBUG_LOADER) {
      var path = goog.getPathFromDeps_(name);
      if (path) {
        goog.included_[path] = true;
        goog.writeScripts_();
        return;
      }
    }
    var errorMessage = 'goog.require could not find: ' + name;
    if (goog.global.console) {
      goog.global.console['error'](errorMessage);
    }
      throw Error(errorMessage);
  }
};
goog.basePath = '';
goog.global.CLOSURE_BASE_PATH;
goog.global.CLOSURE_NO_DEPS;
goog.global.CLOSURE_IMPORT_SCRIPT;
goog.nullFunction = function() {};
goog.identityFunction = function(opt_returnValue, var_args) {
  return opt_returnValue;
};
goog.abstractMethod = function() {
  throw Error('unimplemented abstract method');
};
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    if (goog.DEBUG) {
      goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor;
    }
    return ctor.instance_ = new ctor;
  };
};
goog.instantiatedSingletons_ = [];
if (!COMPILED && goog.ENABLE_DEBUG_LOADER) {
  goog.included_ = {};
  goog.dependencies_ = {
    pathToNames: {},
    nameToPath: {},
    requires: {},
    visited: {},
    written: {}
  };
  goog.inHtmlDocument_ = function() {
    var doc = goog.global.document;
    return typeof doc != 'undefined' &&
           'write' in doc;
  };
  goog.findBasePath_ = function() {
    if (goog.global.CLOSURE_BASE_PATH) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return;
    } else if (!goog.inHtmlDocument_()) {
      return;
    }
    var doc = goog.global.document;
    var scripts = doc.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; --i) {
      var src = scripts[i].src;
      var qmark = src.lastIndexOf('?');
      var l = qmark == -1 ? src.length : qmark;
      if (src.substr(l - 7, 7) == 'base.js') {
        goog.basePath = src.substr(0, l - 7);
        return;
      }
    }
  };
  goog.importScript_ = function(src) {
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT ||
        goog.writeScriptTag_;
    if (!goog.dependencies_.written[src] && importScript(src)) {
      goog.dependencies_.written[src] = true;
    }
  };
  goog.writeScriptTag_ = function(src) {
    if (goog.inHtmlDocument_()) {
      var doc = goog.global.document;
      if (doc.readyState == 'complete') {
        var isDeps = /\bdeps.js$/.test(src);
        if (isDeps) {
          return false;
        } else {
          throw Error('Cannot write "' + src + '" after document load');
        }
      }
      doc.write(
          '<script type="text/javascript" src="' + src + '"></' + 'script>');
      return true;
    } else {
      return false;
    }
  };
  goog.writeScripts_ = function() {
    var scripts = [];
    var seenScript = {};
    var deps = goog.dependencies_;
    function visitNode(path) {
      if (path in deps.written) {
        return;
      }
      if (path in deps.visited) {
        if (!(path in seenScript)) {
          seenScript[path] = true;
          scripts.push(path);
        }
        return;
      }
      deps.visited[path] = true;
      if (path in deps.requires) {
        for (var requireName in deps.requires[path]) {
          if (!goog.isProvided_(requireName)) {
            if (requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName]);
            } else {
              throw Error('Undefined nameToPath for ' + requireName);
            }
          }
        }
      }
      if (!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path);
      }
    }
    for (var path in goog.included_) {
      if (!deps.written[path]) {
        visitNode(path);
      }
    }
    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i]) {
        goog.importScript_(goog.basePath + scripts[i]);
      } else {
        throw Error('Undefined script input');
      }
    }
  };
  goog.getPathFromDeps_ = function(rule) {
    if (rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule];
    } else {
      return null;
    }
  };
  goog.findBasePath_();
  if (!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + 'deps.js');
  }
}
goog.typeOf = function(value) {
  var s = typeof value;
  if (s == 'object') {
    if (value) {
      if (value instanceof Array) {
        return 'array';
      } else if (value instanceof Object) {
        return s;
      }
      var className = Object.prototype.toString.call(
                                (value));
      if (className == '[object Window]') {
        return 'object';
      }
      if ((className == '[object Array]' ||
           typeof value.length == 'number' &&
           typeof value.splice != 'undefined' &&
           typeof value.propertyIsEnumerable != 'undefined' &&
           !value.propertyIsEnumerable('splice')
          )) {
        return 'array';
      }
      if ((className == '[object Function]' ||
          typeof value.call != 'undefined' &&
          typeof value.propertyIsEnumerable != 'undefined' &&
          !value.propertyIsEnumerable('call'))) {
        return 'function';
      }
    } else {
      return 'null';
    }
  } else if (s == 'function' && typeof value.call == 'undefined') {
    return 'object';
  }
  return s;
};
goog.isDef = function(val) {
  return val !== undefined;
};
goog.isNull = function(val) {
  return val === null;
};
goog.isDefAndNotNull = function(val) {
  return val != null;
};
goog.isArray = function(val) {
  return goog.typeOf(val) == 'array';
};
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return type == 'array' || type == 'object' && typeof val.length == 'number';
};
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == 'function';
};
goog.isString = function(val) {
  return typeof val == 'string';
};
goog.isBoolean = function(val) {
  return typeof val == 'boolean';
};
goog.isNumber = function(val) {
  return typeof val == 'number';
};
goog.isFunction = function(val) {
  return goog.typeOf(val) == 'function';
};
goog.isObject = function(val) {
  var type = typeof val;
  return type == 'object' && val != null || type == 'function';
};
goog.getUid = function(obj) {
  return obj[goog.UID_PROPERTY_] ||
      (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.removeUid = function(obj) {
  if ('removeAttribute' in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_);
  }
  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
};
goog.UID_PROPERTY_ = 'closure_uid_' +
    Math.floor(Math.random() * 2147483648).toString(36);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if (type == 'object' || type == 'array') {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == 'array' ? [] : {};
    for (var key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }
    return clone;
  }
  return obj;
};
goog.bindNative_ = function(fn, selfObj, var_args) {
  return (fn.call.apply(fn.bind, arguments));
};
goog.bindJs_ = function(fn, selfObj, var_args) {
  if (!fn) {
    throw new Error();
  }
  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };
  } else {
    return function() {
      return fn.apply(selfObj, arguments);
    };
  }
};
goog.bind = function(fn, selfObj, var_args) {
  if (Function.prototype.bind &&
      Function.prototype.bind.toString().indexOf('native code') != -1) {
    goog.bind = goog.bindNative_;
  } else {
    goog.bind = goog.bindJs_;
  }
  return goog.bind.apply(null, arguments);
};
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    var newArgs = Array.prototype.slice.call(arguments);
    newArgs.unshift.apply(newArgs, args);
    return fn.apply(this, newArgs);
  };
};
goog.mixin = function(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }
};
goog.now = Date.now || (function() {
  return +new Date();
});
goog.globalEval = function(script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, 'JavaScript');
  } else if (goog.global.eval) {
    if (goog.evalWorksForGlobals_ == null) {
      goog.global.eval('var _et_ = 1;');
      if (typeof goog.global['_et_'] != 'undefined') {
        delete goog.global['_et_'];
        goog.evalWorksForGlobals_ = true;
      } else {
        goog.evalWorksForGlobals_ = false;
      }
    }
    if (goog.evalWorksForGlobals_) {
      goog.global.eval(script);
    } else {
      var doc = goog.global.document;
      var scriptElt = doc.createElement('script');
      scriptElt.type = 'text/javascript';
      scriptElt.defer = false;
      scriptElt.appendChild(doc.createTextNode(script));
      doc.body.appendChild(scriptElt);
      doc.body.removeChild(scriptElt);
    }
  } else {
    throw Error('goog.globalEval not available');
  }
};
goog.evalWorksForGlobals_ = null;
goog.cssNameMapping_;
goog.cssNameMappingStyle_;
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  };
  var renameByParts = function(cssName) {
    var parts = cssName.split('-');
    var mapped = [];
    for (var i = 0; i < parts.length; i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join('-');
  };
  var rename;
  if (goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == 'BY_WHOLE' ?
        getMapping : renameByParts;
  } else {
    rename = function(a) {
      return a;
    };
  }
  if (opt_modifier) {
    return className + '-' + rename(opt_modifier);
  } else {
    return rename(className);
  }
};
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
};
goog.global.CLOSURE_CSS_NAME_MAPPING;
if (!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING) {
  goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING;
}
goog.getMsg = function(str, opt_values) {
  var values = opt_values || {};
  for (var key in values) {
    var value = ('' + values[key]).replace(/\$/g, '$$$$');
    str = str.replace(new RegExp('\\{\\$' + key + '\\}', 'gi'), value);
  }
  return str;
};
goog.getMsgWithFallback = function(a, b) {
  return a;
};
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo);
};
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
};
goog.inherits = function(childCtor, parentCtor) {
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  childCtor.prototype.constructor = childCtor;
};
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if (caller.superClass_) {
    return caller.superClass_.constructor.apply(
        me, Array.prototype.slice.call(arguments, 1));
  }
  var args = Array.prototype.slice.call(arguments, 2);
  var foundCaller = false;
  for (var ctor = me.constructor;
       ctor; ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = true;
    } else if (foundCaller) {
      return ctor.prototype[opt_methodName].apply(me, args);
    }
  }
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  } else {
    throw Error(
        'goog.base called from a method of one name ' +
        'to a method of a different name');
  }
};
goog.scope = function(fn) {
  fn.call(goog.global);
};
goog.provide('goog.math.Long');
goog.math.Long = function(low, high) {
  this.low_ = low | 0;
  this.high_ = high | 0;
};
goog.math.Long.IntCache_ = {};
goog.math.Long.fromInt = function(value) {
  if (-128 <= value && value < 128) {
    var cachedObj = goog.math.Long.IntCache_[value];
    if (cachedObj) {
      return cachedObj;
    }
  }
  var obj = new goog.math.Long(value | 0, value < 0 ? -1 : 0);
  if (-128 <= value && value < 128) {
    goog.math.Long.IntCache_[value] = obj;
  }
  return obj;
};
goog.math.Long.fromNumber = function(value) {
  if (isNaN(value) || !isFinite(value)) {
    return goog.math.Long.ZERO;
  } else if (value <= -goog.math.Long.TWO_PWR_63_DBL_) {
    return goog.math.Long.MIN_VALUE;
  } else if (value + 1 >= goog.math.Long.TWO_PWR_63_DBL_) {
    return goog.math.Long.MAX_VALUE;
  } else if (value < 0) {
    return goog.math.Long.fromNumber(-value).negate();
  } else {
    return new goog.math.Long(
        (value % goog.math.Long.TWO_PWR_32_DBL_) | 0,
        (value / goog.math.Long.TWO_PWR_32_DBL_) | 0);
  }
};
goog.math.Long.fromBits = function(lowBits, highBits) {
  return new goog.math.Long(lowBits, highBits);
};
goog.math.Long.fromString = function(str, opt_radix) {
  if (str.length == 0) {
    throw Error('number format error: empty string');
  }
  var radix = opt_radix || 10;
  if (radix < 2 || 36 < radix) {
    throw Error('radix out of range: ' + radix);
  }
  if (str.charAt(0) == '-') {
    return goog.math.Long.fromString(str.substring(1), radix).negate();
  } else if (str.indexOf('-') >= 0) {
    throw Error('number format error: interior "-" character: ' + str);
  }
  var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 8));
  var result = goog.math.Long.ZERO;
  for (var i = 0; i < str.length; i += 8) {
    var size = Math.min(8, str.length - i);
    var value = parseInt(str.substring(i, i + size), radix);
    if (size < 8) {
      var power = goog.math.Long.fromNumber(Math.pow(radix, size));
      result = result.multiply(power).add(goog.math.Long.fromNumber(value));
    } else {
      result = result.multiply(radixToPower);
      result = result.add(goog.math.Long.fromNumber(value));
    }
  }
  return result;
};
goog.math.Long.TWO_PWR_16_DBL_ = 1 << 16;
goog.math.Long.TWO_PWR_24_DBL_ = 1 << 24;
goog.math.Long.TWO_PWR_32_DBL_ =
    goog.math.Long.TWO_PWR_16_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;
goog.math.Long.TWO_PWR_31_DBL_ =
    goog.math.Long.TWO_PWR_32_DBL_ / 2;
goog.math.Long.TWO_PWR_48_DBL_ =
    goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_16_DBL_;
goog.math.Long.TWO_PWR_64_DBL_ =
    goog.math.Long.TWO_PWR_32_DBL_ * goog.math.Long.TWO_PWR_32_DBL_;
goog.math.Long.TWO_PWR_63_DBL_ =
    goog.math.Long.TWO_PWR_64_DBL_ / 2;
goog.math.Long.ZERO = goog.math.Long.fromInt(0);
goog.math.Long.ONE = goog.math.Long.fromInt(1);
goog.math.Long.NEG_ONE = goog.math.Long.fromInt(-1);
goog.math.Long.MAX_VALUE =
    goog.math.Long.fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0);
goog.math.Long.MIN_VALUE = goog.math.Long.fromBits(0, 0x80000000 | 0);
goog.math.Long.TWO_PWR_24_ = goog.math.Long.fromInt(1 << 24);
goog.math.Long.prototype.toInt = function() {
  return this.low_;
};
goog.math.Long.prototype.toNumber = function() {
  return this.high_ * goog.math.Long.TWO_PWR_32_DBL_ +
         this.getLowBitsUnsigned();
};
goog.math.Long.prototype.toString = function(opt_radix) {
  var radix = opt_radix || 10;
  if (radix < 2 || 36 < radix) {
    throw Error('radix out of range: ' + radix);
  }
  if (this.isZero()) {
    return '0';
  }
  if (this.isNegative()) {
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      var radixLong = goog.math.Long.fromNumber(radix);
      var div = this.div(radixLong);
      var rem = div.multiply(radixLong).subtract(this);
      return div.toString(radix) + rem.toInt().toString(radix);
    } else {
      return '-' + this.negate().toString(radix);
    }
  }
  var radixToPower = goog.math.Long.fromNumber(Math.pow(radix, 6));
  var rem = this;
  var result = '';
  while (true) {
    var remDiv = rem.div(radixToPower);
    var intval = rem.subtract(remDiv.multiply(radixToPower)).toInt();
    var digits = intval.toString(radix);
    rem = remDiv;
    if (rem.isZero()) {
      return digits + result;
    } else {
      while (digits.length < 6) {
        digits = '0' + digits;
      }
      result = '' + digits + result;
    }
  }
};
goog.math.Long.prototype.getHighBits = function() {
  return this.high_;
};
goog.math.Long.prototype.getLowBits = function() {
  return this.low_;
};
goog.math.Long.prototype.getLowBitsUnsigned = function() {
  return (this.low_ >= 0) ?
      this.low_ : goog.math.Long.TWO_PWR_32_DBL_ + this.low_;
};
goog.math.Long.prototype.getNumBitsAbs = function() {
  if (this.isNegative()) {
    if (this.equals(goog.math.Long.MIN_VALUE)) {
      return 64;
    } else {
      return this.negate().getNumBitsAbs();
    }
  } else {
    var val = this.high_ != 0 ? this.high_ : this.low_;
    for (var bit = 31; bit > 0; bit--) {
      if ((val & (1 << bit)) != 0) {
        break;
      }
    }
    return this.high_ != 0 ? bit + 33 : bit + 1;
  }
};
goog.math.Long.prototype.isZero = function() {
  return this.high_ == 0 && this.low_ == 0;
};
goog.math.Long.prototype.isNegative = function() {
  return this.high_ < 0;
};
goog.math.Long.prototype.isOdd = function() {
  return (this.low_ & 1) == 1;
};
goog.math.Long.prototype.equals = function(other) {
  return (this.high_ == other.high_) && (this.low_ == other.low_);
};
goog.math.Long.prototype.notEquals = function(other) {
  return (this.high_ != other.high_) || (this.low_ != other.low_);
};
goog.math.Long.prototype.lessThan = function(other) {
  return this.compare(other) < 0;
};
goog.math.Long.prototype.lessThanOrEqual = function(other) {
  return this.compare(other) <= 0;
};
goog.math.Long.prototype.greaterThan = function(other) {
  return this.compare(other) > 0;
};
goog.math.Long.prototype.greaterThanOrEqual = function(other) {
  return this.compare(other) >= 0;
};
goog.math.Long.prototype.compare = function(other) {
  if (this.equals(other)) {
    return 0;
  }
  var thisNeg = this.isNegative();
  var otherNeg = other.isNegative();
  if (thisNeg && !otherNeg) {
    return -1;
  }
  if (!thisNeg && otherNeg) {
    return 1;
  }
  if (this.subtract(other).isNegative()) {
    return -1;
  } else {
    return 1;
  }
};
goog.math.Long.prototype.negate = function() {
  if (this.equals(goog.math.Long.MIN_VALUE)) {
    return goog.math.Long.MIN_VALUE;
  } else {
    return this.not().add(goog.math.Long.ONE);
  }
};
goog.math.Long.prototype.add = function(other) {
  var a48 = this.high_ >>> 16;
  var a32 = this.high_ & 0xFFFF;
  var a16 = this.low_ >>> 16;
  var a00 = this.low_ & 0xFFFF;
  var b48 = other.high_ >>> 16;
  var b32 = other.high_ & 0xFFFF;
  var b16 = other.low_ >>> 16;
  var b00 = other.low_ & 0xFFFF;
  var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
  c00 += a00 + b00;
  c16 += c00 >>> 16;
  c00 &= 0xFFFF;
  c16 += a16 + b16;
  c32 += c16 >>> 16;
  c16 &= 0xFFFF;
  c32 += a32 + b32;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c48 += a48 + b48;
  c48 &= 0xFFFF;
  return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
};
goog.math.Long.prototype.subtract = function(other) {
  return this.add(other.negate());
};
goog.math.Long.prototype.multiply = function(other) {
  if (this.isZero()) {
    return goog.math.Long.ZERO;
  } else if (other.isZero()) {
    return goog.math.Long.ZERO;
  }
  if (this.equals(goog.math.Long.MIN_VALUE)) {
    return other.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
  } else if (other.equals(goog.math.Long.MIN_VALUE)) {
    return this.isOdd() ? goog.math.Long.MIN_VALUE : goog.math.Long.ZERO;
  }
  if (this.isNegative()) {
    if (other.isNegative()) {
      return this.negate().multiply(other.negate());
    } else {
      return this.negate().multiply(other).negate();
    }
  } else if (other.isNegative()) {
    return this.multiply(other.negate()).negate();
  }
  if (this.lessThan(goog.math.Long.TWO_PWR_24_) &&
      other.lessThan(goog.math.Long.TWO_PWR_24_)) {
    return goog.math.Long.fromNumber(this.toNumber() * other.toNumber());
  }
  var a48 = this.high_ >>> 16;
  var a32 = this.high_ & 0xFFFF;
  var a16 = this.low_ >>> 16;
  var a00 = this.low_ & 0xFFFF;
  var b48 = other.high_ >>> 16;
  var b32 = other.high_ & 0xFFFF;
  var b16 = other.low_ >>> 16;
  var b00 = other.low_ & 0xFFFF;
  var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
  c00 += a00 * b00;
  c16 += c00 >>> 16;
  c00 &= 0xFFFF;
  c16 += a16 * b00;
  c32 += c16 >>> 16;
  c16 &= 0xFFFF;
  c16 += a00 * b16;
  c32 += c16 >>> 16;
  c16 &= 0xFFFF;
  c32 += a32 * b00;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c32 += a16 * b16;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c32 += a00 * b32;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
  c48 &= 0xFFFF;
  return goog.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
};
goog.math.Long.prototype.div = function(other) {
  if (other.isZero()) {
    throw Error('division by zero');
  } else if (this.isZero()) {
    return goog.math.Long.ZERO;
  }
  if (this.equals(goog.math.Long.MIN_VALUE)) {
    if (other.equals(goog.math.Long.ONE) ||
        other.equals(goog.math.Long.NEG_ONE)) {
      return goog.math.Long.MIN_VALUE;
    } else if (other.equals(goog.math.Long.MIN_VALUE)) {
      return goog.math.Long.ONE;
    } else {
      var halfThis = this.shiftRight(1);
      var approx = halfThis.div(other).shiftLeft(1);
      if (approx.equals(goog.math.Long.ZERO)) {
        return other.isNegative() ? goog.math.Long.ONE : goog.math.Long.NEG_ONE;
      } else {
        var rem = this.subtract(other.multiply(approx));
        var result = approx.add(rem.div(other));
        return result;
      }
    }
  } else if (other.equals(goog.math.Long.MIN_VALUE)) {
    return goog.math.Long.ZERO;
  }
  if (this.isNegative()) {
    if (other.isNegative()) {
      return this.negate().div(other.negate());
    } else {
      return this.negate().div(other).negate();
    }
  } else if (other.isNegative()) {
    return this.div(other.negate()).negate();
  }
  var res = goog.math.Long.ZERO;
  var rem = this;
  while (rem.greaterThanOrEqual(other)) {
    var approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber()));
    var log2 = Math.ceil(Math.log(approx) / Math.LN2);
    var delta = (log2 <= 48) ? 1 : Math.pow(2, log2 - 48);
    var approxRes = goog.math.Long.fromNumber(approx);
    var approxRem = approxRes.multiply(other);
    while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
      approx -= delta;
      approxRes = goog.math.Long.fromNumber(approx);
      approxRem = approxRes.multiply(other);
    }
    if (approxRes.isZero()) {
      approxRes = goog.math.Long.ONE;
    }
    res = res.add(approxRes);
    rem = rem.subtract(approxRem);
  }
  return res;
};
goog.math.Long.prototype.modulo = function(other) {
  return this.subtract(this.div(other).multiply(other));
};
goog.math.Long.prototype.not = function() {
  return goog.math.Long.fromBits(~this.low_, ~this.high_);
};
goog.math.Long.prototype.and = function(other) {
  return goog.math.Long.fromBits(this.low_ & other.low_,
                                 this.high_ & other.high_);
};
goog.math.Long.prototype.or = function(other) {
  return goog.math.Long.fromBits(this.low_ | other.low_,
                                 this.high_ | other.high_);
};
goog.math.Long.prototype.xor = function(other) {
  return goog.math.Long.fromBits(this.low_ ^ other.low_,
                                 this.high_ ^ other.high_);
};
goog.math.Long.prototype.shiftLeft = function(numBits) {
  numBits &= 63;
  if (numBits == 0) {
    return this;
  } else {
    var low = this.low_;
    if (numBits < 32) {
      var high = this.high_;
      return goog.math.Long.fromBits(
          low << numBits,
          (high << numBits) | (low >>> (32 - numBits)));
    } else {
      return goog.math.Long.fromBits(0, low << (numBits - 32));
    }
  }
};
goog.math.Long.prototype.shiftRight = function(numBits) {
  numBits &= 63;
  if (numBits == 0) {
    return this;
  } else {
    var high = this.high_;
    if (numBits < 32) {
      var low = this.low_;
      return goog.math.Long.fromBits(
          (low >>> numBits) | (high << (32 - numBits)),
          high >> numBits);
    } else {
      return goog.math.Long.fromBits(
          high >> (numBits - 32),
          high >= 0 ? 0 : -1);
    }
  }
};
goog.math.Long.prototype.shiftRightUnsigned = function(numBits) {
  numBits &= 63;
  if (numBits == 0) {
    return this;
  } else {
    var high = this.high_;
    if (numBits < 32) {
      var low = this.low_;
      return goog.math.Long.fromBits(
          (low >>> numBits) | (high << (32 - numBits)),
          high >>> numBits);
    } else if (numBits == 32) {
      return goog.math.Long.fromBits(high, 0);
    } else {
      return goog.math.Long.fromBits(high >>> (numBits - 32), 0);
    }
  }
};
function h$Set(s) {
    this._vals = [];
    this._keys = [];
    this._size = 0;
}
h$Set.prototype.size = function() {
    return this._size;
}
h$Set.prototype.add = function(o) {
    if((typeof o !== 'object' && typeof o !== 'function') || typeof o._key !== 'number') throw ("h$Set.add: invalid element: " + o);
    if(this._size > 0) {
    } else {
        this._storedProto = o.prototype;
    }
    if(this._keys[o._key] !== undefined && this._vals[this._keys[o._key]] !== o) throw ("h$Set.add: duplicate key: " + o);
    var k = this._keys, v = this._vals;
    if(k[o._key] === undefined) {
        k[o._key] = this._size;
        v[this._size++] = o;
    }
}
h$Set.prototype.remove = function(o) {
    var k = this._keys, v = this._vals, x = k[o._key];
    if(x !== undefined) {
        delete k[o._key];
        var ls = --this._size;
        if(ls !== x) {
            var l = v[ls];
            v[x] = l;
            k[l._key] = x;
        }
        v[ls] = null;
        if(v.length > 10 && 2 * v.length > 3 * ls) this._vals = v.slice(0, ls);
    }
}
h$Set.prototype.has = function(o) {
    return this.keys[o._key] !== undefined;
}
h$Set.prototype.iter = function() {
    return new h$SetIter(this);
}
h$Set.prototype.values = function() {
    return this._vals;
}
function h$SetIter(s) {
    this._n = 0;
    this._s = s;
    this._r = true;
}
h$SetIter.prototype.next = function() {
    if(this._n < this._s._size) {
        this._r = false;
        return this._s._vals[this._n++];
    } else {
        this._r = true;
        return null;
    }
}
h$SetIter.prototype.peek = function() {
    if(this._n < this._s._size) {
        return this._s.vals[this._n];
    } else {
        return null;
    }
}
h$SetIter.prototype.remove = function() {
    if(!this._r) {
        this._s.remove(this._s._vals[--this._n]);
        this._r = true;
    }
}
function h$Map() {
    this._pairsKeys = [];
    this._pairsValues = [];
    this._keys = [];
    this._size = 0;
}
h$Map.prototype.size = function() {
    return this._size;
}
h$Map.prototype.put = function(k,v) {
    if((typeof k !== 'object' && typeof k !== 'function') || typeof k._key !== 'number') throw ("h$Map.add: invalid key: " + k);
    if(this._size > 0) {
        if(this._storedProto !== k.prototype) throw ("h$Map.add: unexpected key prototype: " + k)
    } else {
        this._storedProto = k.prototype;
    }
    if(this._keys[k._key] !== undefined && this._pairsKeys[this._keys[k._key]] !== k) throw ("h$Map.add: duplicate key: " + k);
    var ks = this._keys, pk = this._pairsKeys, pv = this._pairsValues, x = ks[k._key];
    if(x === undefined) {
        var n = this._size++;
        ks[k._key] = n;
        pk[n] = k;
        pv[n] = v;
    } else {
        pv[x] = v;
    }
}
h$Map.prototype.remove = function(k) {
    var kk = k._key, ks = this._keys, pk = this._pairsKeys, pv = this._pairsValues, x = ks[kk];
    if(x !== undefined) {
        delete ks[kk];
        var ss = --this._size;
        if(ss !== x) {
            pks = pk[ss];
            pk[x] = pks;
            pv[x] = pv[ss];
            ks[pks._key] = x;
        }
        pv[ss] = null;
        pk[ss] = null;
        if(pk.length > 10 && 2 * pk.length > 3 * this._size) {
            this._pairsKeys = pk.slice(0,ss);
            this._pairsValues = pv.slice(0,ss);
        }
    }
}
h$Map.prototype.has = function(k) {
    return this._keys[k._key] !== undefined;
}
h$Map.prototype.get = function(k) {
    var n = this._keys[k._key];
    if(n !== undefined) {
        return this._pairsValues[n];
    } else {
        return null;
    }
}
h$Map.prototype.iter = function() {
    return new h$MapIter(this);
}
h$Map.prototype.keys = function () {
    return this._pairsKeys;
}
h$Map.prototype.values = function() {
    return this._pairsValues;
}
function h$MapIter(m) {
    this._n = 0;
    this._m = m;
}
h$MapIter.prototype.next = function() {
    return this._n < this._m._size ? this._m._pairsKeys[this._n++] : null;
}
h$MapIter.prototype.nextVal = function() {
    return this._n < this._m._size ? this._m._pairsValues[this._n++] : null;
}
h$MapIter.prototype.peek = function() {
    return this._n < this._m._size ? this._m._pairsKeys[this._n] : null;
}
h$MapIter.prototype.peekVal = function() {
    return this._n < this._m._size ? this._m._pairsValues[this._n] : null;
}
function h$Queue() {
    var b = { b: [], n: null };
    this._blocks = 1;
    this._first = b;
    this._fp = 0;
    this._last = b;
    this._lp = 0;
}
h$Queue.prototype.length = function() {
    return 1000 * (this._blocks - 1) + this._lp - this._fp;
}
h$Queue.prototype.isEmpty = function() {
    return this._blocks === 1 && this._lp >= this._fp;
}
h$Queue.prototype.enqueue = function(o) {
    if(this._lp === 1000) {
        var newBlock = { b: [o], n: null };
        this._blocks++;
        this._last.n = newBlock;
        this._last = newBlock;
        this._lp = 1;
    } else {
        this._last.b[this._lp++] = o;
    }
}
h$Queue.prototype.dequeue = function() {
    if(this._blocks === 1 && this._fp >= this._lp) {
        return null;
    } else {
        var qfb = this._first.b, r = qfb[this._fp];
        qfb[this._fp] = null;
        if(++this._fp === 1000) {
            if(this._blocks === 1) {
                this._lp = 0;
            } else {
                this._blocks--;
                this._first = this._first.n;
            }
            this._fp = 0;
        } else if(this._blocks === 1 && this._fp >= this._lp) {
            this._lp = this._fp = 0;
        }
        return r;
    }
}
h$Queue.prototype.peek = function() {
    if(this._blocks === 0 || (this._blocks === 1 && this._fp >= this._lp)) {
        return null;
    } else {
        return this._first.b[this._fp];
    }
}
h$Queue.prototype.iter = function() {
    var b = this._first, bp = this._fp, lb = this._last, lp = this._lp;
    return function() {
        if(b === null || (b === lb && bp >= lp)) {
            return null;
        } else {
            var r = b.b[bp];
            if(++bp === 1000) {
                b = b.n;
                bp = 0;
                if(b === null) lb = null;
            }
            return r;
        }
    }
}
function h$HeapSet() {
    this._keys = [];
    this._prios = [];
    this._vals = [];
    this._size = 0;
}
h$HeapSet.prototype.size = function() {
    return this._size;
}
h$HeapSet.prototype.add = function(op,o) {
    if((typeof o !== 'object' && typeof o !== 'function') || typeof o._key !== 'number') throw ("h$HeapSet.add: invalid element: " + o);
    if(this._size > 0) {
        if(this._storedProto !== o.prototype) throw ("h$HeapSet.add: unexpected element prototype: " + o)
    } else {
        this._storedProto = o.prototype;
    }
    if(this._keys[o._key] !== undefined && this._vals[this._keys[o._key]] !== o) throw ("h$Set.add: duplicate key: " + o);
    var p = this._prios, k = this._keys, v = this._vals, x = k[o._key];
    if(x !== undefined) {
        var oop = p[x];
        if(oop !== op) {
            p[x] = op;
            if(op < oop) {
                this._upHeap(x);
            } else {
                this._downHeap(x);
            }
        }
    } else {
        var s = this._size++;
        k[o._key] = s;
        p[s] = op;
        v[s] = o;
        this._upHeap(s);
    }
}
h$HeapSet.prototype.has = function(o) {
    return this._keys[o._key] !== undefined;
}
h$HeapSet.prototype.prio = function(o) {
    var x = this._keys[o._key];
    if(x !== undefined) {
        return this._prios[x];
    } else {
        return null;
    }
}
h$HeapSet.prototype.peekPrio = function() {
    return this._size > 0 ? this._prios[0] : null;
}
h$HeapSet.prototype.peek = function() {
    return this._size > 0 ? this._vals[0] : null;
}
h$HeapSet.prototype.pop = function() {
    if(this._size > 0) {
        var v = this._vals[0];
        this._removeNode(0);
        return v;
    } else {
        return null;
    }
}
h$HeapSet.prototype.remove = function(o) {
    var x = this._keys[o._key];
    if(x !== undefined) this._removeNode(x);
}
h$HeapSet.prototype.iter = function() {
    var n = 0, v = this._vals, s = this._size;
    return function() {
        return n < s ? v[n++] : null;
    }
}
h$HeapSet.prototype.values = function() {
    return this._vals;
}
h$HeapSet.prototype._removeNode = function(i) {
    var p = this._prios, v = this._vals, s = --this._size, k = this._keys;
    delete k[v[i]._key];
    if(i !== s) {
        v[i] = v[s];
        p[i] = p[s];
        k[v[i]._key] = i;
    }
    v[s] = null;
    p[s] = null;
    this._downHeap(i,s);
}
h$HeapSet.prototype._downHeap = function(i,s) {
    var p = this._prios, v = this._vals, k = this._keys;
    var j,l,r,ti,tj;
    while(true) {
        j = i, r = 2*(i+1), l = r-1;
        if(l < s && p[l] < p[i]) i = l;
        if(r < s && p[r] < p[i]) i = r;
        if(i !== j) {
            ti = v[i];
            tj = v[j];
            v[j] = ti;
            v[i] = tj;
            k[ti._key] = j;
            k[tj._key] = i;
            ti = p[i];
            p[i] = p[j];
            p[j] = ti;
        } else {
            break;
        }
    }
}
h$HeapSet.prototype._upHeap = function(i) {
    var ti, tj, j, p = this._prios, v = this._vals, k = this._keys;
    while(i !== 0) {
        j = (i-1) >> 1;
        if(p[i] < p[j]) {
            ti = v[i];
            tj = v[j];
            v[j] = ti;
            v[i] = tj;
            k[ti._key] = j;
            k[tj._key] = i;
            ti = p[i];
            p[i] = p[j];
            p[j] = ti;
            i = j;
        } else {
            break;
        }
    }
}
function h$sti(i,c,xs) {
    i.f = c;
    h$init_closure(i,xs);
}
function h$stc(i,c) {
    i.f = c;
    h$init_closure(i,[]);
    h$CAFs.push(i);
    h$CAFsReset.push(i.f);
}
function h$stl(o, xs, t) {
    var r = t ? t : h$ghczmprimZCGHCziTypesziZMZN;
    var x;
    if(xs.length > 0) {
        for(var i=xs.length-1;i>=0;i--) {
            x = xs[i];
            if(!x && x !== false && x !== 0) throw "h$toHsList: invalid element";
            r = h$c2(h$ghczmprimZCGHCziTypesziZC_con_e, x, r);
        }
    }
    o.f = r.f;
    o.d1 = r.d1;
    o.d2 = r.d2;
    o.m = r.m;
}
var h$staticDelayed = [];
function h$d() {
    var c = h$c(null);
    h$staticDelayed.push(c);
    return c;
}
function h$di(c) {
    h$staticDelayed.push(c);
}
function h$p(x) {
    h$staticDelayed.push(x);
    return x;
}
var h$entriesStack = [];
var h$staticsStack = [];
var h$labelsStack = [];
function h$scheduleInit(entries, objs, lbls, infos, statics) {
    var d = h$entriesStack.length;
    h$entriesStack.push(entries);
    h$staticsStack.push(objs);
    h$labelsStack.push(lbls);
    h$initStatic.push(function() {
        h$initInfoTables(d, entries, objs, lbls, infos, statics);
    });
}
function h$runInitStatic() {
    if(h$initStatic.length > 0) {
        for(var i=h$initStatic.length - 1;i>=0;i--) {
            h$initStatic[i]();
        }
        h$initStatic = [];
    }
    h$entriesStack = null;
    h$staticsStack = null;
}
function h$initInfoTables ( depth
                          , funcs
                          , objects
                          , lbls
                          , infoMeta
                          , infoStatic
                          ) {
  ;
  var n, i, j, o, pos = 0, info;
  function code(c) {
    if(c < 34) return c - 32;
    if(c < 92) return c - 33;
    return c - 34;
  }
  function next() {
    var c = info.charCodeAt(pos);
    if(c < 124) {
      ;
      pos++;
      return code(c);
    }
    if(c === 124) {
      pos+=3;
      var r = 90 + 90 * code(info.charCodeAt(pos-2))
                  + code(info.charCodeAt(pos-1));
      ;
      return r;
    }
    if(c === 125) {
      pos+=4;
      var r = 8190 + 8100 * code(info.charCodeAt(pos-3))
                   + 90 * code(info.charCodeAt(pos-2))
                   + code(info.charCodeAt(pos-1));
      ;
      return r;
    }
    throw ("h$initInfoTables: invalid code in info table: " + c + " at " + pos)
  }
  function nextCh() {
        return next();
  }
    function nextInt() {
        var n = next();
        var r;
        if(n === 0) {
            var n1 = next();
            var n2 = next();
            r = n1 << 16 | n2;
        } else {
            r = n - 12;
        }
        ;
        return r;
    }
    function nextSignificand() {
        var n = next();
        var n1, n2, n3, n4, n5;
        var r;
        if(n < 2) {
            n1 = next();
            n2 = next();
            n3 = next();
            n4 = next();
            n5 = n1 * 281474976710656 + n2 * 4294967296 + n3 * 65536 + n4;
            r = n === 0 ? -n5 : n5;
        } else {
            r = n - 12;
        }
        ;
        return r;
    }
    function nextEntry(o) { return nextIndexed("nextEntry", h$entriesStack, o); }
    function nextObj(o) { return nextIndexed("nextObj", h$staticsStack, o); }
    function nextLabel(o) { return nextIndexed("nextLabel", h$labelsStack, o); }
    function nextIndexed(msg, stack, o) {
        var n = (o === undefined) ? next() : o;
        var i = depth;
        while(n > stack[i].length) {
            n -= stack[i].length;
            i--;
            if(i < 0) throw (msg + ": cannot find item " + n + ", stack length: " + stack.length + " depth: " + depth);
        }
        return stack[i][n];
    }
    function nextArg() {
        var o = next();
        var n, n1, n2;
        switch(o) {
        case 0:
            ;
            return false;
        case 1:
            ;
            return true;
        case 2:
            ;
            return 0;
        case 3:
            ;
            return 1;
        case 4:
            ;
            return nextInt();
        case 5:
            ;
            return null;
        case 6:
            ;
            n = next();
            switch(n) {
            case 0:
                return -0.0;
            case 1:
                return 0.0;
            case 2:
                return 1/0;
            case 3:
                return -1/0;
            case 4:
                return 0/0;
            case 5:
                n1 = nextInt();
                return nextSignificand() * Math.pow(2, n1)
            default:
                n1 = n - 36;
                return nextSignificand() * Math.pow(2, n1);
            }
        case 7:
            ;
            throw "string arg";
            return "";
        case 8:
            ;
            n = next();
            var ba = h$newByteArray(n);
            var b8 = ba.u8;
            var p = 0;
            while(n > 0) {
                switch(n) {
                case 1:
                    d0 = next();
                    d1 = next();
                    b8[p] = ((d0 << 2) | (d1 >> 4));
                    break;
                case 2:
                    d0 = next();
                    d1 = next();
                    d2 = next();
                    b8[p++] = ((d0 << 2) | (d1 >> 4));
                    b8[p] = ((d1 << 4) | (d2 >> 2));
                    break;
                default:
                    d0 = next();
                    d1 = next();
                    d2 = next();
                    d3 = next();
                    b8[p++] = ((d0 << 2) | (d1 >> 4));
                    b8[p++] = ((d1 << 4) | (d2 >> 2));
                    b8[p++] = ((d2 << 6) | d3);
                    break;
                }
                n -= 3;
            }
            return ba;
        case 9:
            var isFun = next() === 1;
            var lbl = nextLabel();
            return h$initPtrLbl(isFun, lbl);
        case 10:
            var c = { f: nextEntry(), d1: null, d2: null, m: 0 };
            var n = next();
            var args = [];
            while(n--) {
                args.push(nextArg());
            }
            return h$init_closure(c, args);
        default:
            ;
            return nextObj(o-11);
        }
    }
    info = infoMeta; pos = 0;
  for(i=0;i<funcs.length;i++) {
    o = funcs[i];
    var ot;
    var oa = 0;
    var oregs = 256;
    switch(next()) {
      case 0:
        ot = 0;
        break;
      case 1:
        ot = 1
        var arity = next();
        var skipRegs = next();
        var skip = skipRegs & 1;
        var regs = skipRegs >>> 1;
        oregs = (regs << 8) | skip;
        oa = arity + ((regs-1+skip) << 8);
        break;
      case 2:
        ot = 2;
        oa = next();
        break;
      case 3:
        ot = -1;
        oa = 0;
        oregs = next();
        oregs = ((oregs >>> 1) << 8) | (oregs & 1);
        break;
      default: throw ("h$initInfoTables: invalid closure type")
    }
    var size = next() - 1;
    var nsrts = next();
    var srt = null;
    if(nsrts > 0) {
      srt = [];
      for(var j=0;j<nsrts;j++) {
          srt.push(nextObj());
      }
    }
    o.t = ot;
    o.i = [];
    o.n = "";
    o.a = oa;
    o.r = oregs;
    o.s = srt;
    o.m = 0;
    o.size = size;
  }
    info = infoStatic;
    pos = 0;
    for(i=0;i<objects.length;i++) {
      ;
      o = objects[i];
      var nx = next();
      ;
      switch(nx) {
      case 0:
          break;
      case 1:
          o.f = nextEntry();
          ;
          break;
      case 2:
          ;
          o.f = nextEntry();
          h$CAFs.push(o);
          h$CAFsReset.push(o.f);
          break;
      case 3:
          ;
          break;
      case 4:
          ;
          break;
      case 5:
          ;
          break;
      case 6:
          ;
          break;
      case 7:
          ;
          n = next();
          var b = h$newByteArray(n);
          for(j=0;j>n;j++) {
              b.u8[j] = next();
          }
          break;
      case 8:
          ;
          o.f = h$ghczmprimZCGHCziTypesziZMZN.f;
          break;
      case 9:
          ;
          n = next();
          var hasTail = next();
          var c = (hasTail === 1) ? nextObj() : h$ghczmprimZCGHCziTypesziZMZN;
          ;
          while(n--) {
              c = h$c2(h$ghczmprimZCGHCziTypesziZC_con_e, nextArg(), c);
          }
          o.f = c.f;
          o.d1 = c.d1;
          o.d2 = c.d2;
          break;
      case 10:
          ;
          n = next();
          ;
          o.f = nextEntry();
          for(j=0;j<n;j++) {
              h$setField(o, j, nextArg());
          }
          break;
      case 11:
          ;
          o.f = nextEntry();
          break;
      case 12:
          ;
          o.f = nextEntry();
          o.d1 = nextArg();
          break;
      case 13:
          ;
          o.f = nextEntry();
          o.d1 = nextArg();
          o.d2 = nextArg();
          break;
      case 14:
          ;
          o.f = nextEntry();
          o.d1 = nextArg();
          o.d2 = { d1: nextArg(), d2: nextArg()};
          break;
      case 15:
          ;
          o.f = nextEntry();
          o.d1 = nextArg();
          o.d2 = { d1: nextArg(), d2: nextArg(), d3: nextArg() };
          break;
      case 16:
          ;
          o.f = nextEntry();
          o.d1 = nextArg();
          o.d2 = { d1: nextArg(), d2: nextArg(), d3: nextArg(), d4: nextArg() };
          break;
      case 17:
          ;
          o.f = nextEntry();
          o.d1 = nextArg();
          o.d2 = { d1: nextArg(), d2: nextArg(), d3: nextArg(), d4: nextArg(), d5: nextArg() };
          break;
      default:
          throw ("invalid static data initializer: " + nx);
      }
  }
  h$staticDelayed = null;
}
function h$initPtrLbl(isFun, lbl) {
    return lbl;
}
function h$callDynamic(f) {
    return f.apply(f, Array.prototype.slice.call(arguments, 2));
}
function h$sliceArray(a, start, n) {
  return a.slice(start, start+n);
}
function h$memcpy() {
  if(arguments.length === 3) {
    var dst = arguments[0];
    var src = arguments[1];
    var n = arguments[2];
    for(var i=n-1;i>=0;i--) {
      dst.u8[i] = src.u8[i];
    }
    ret1 = 0;
    return dst;
  } else if(arguments.length === 5) {
    var dst = arguments[0];
    var dst_off = arguments[1]
    var src = arguments[2];
    var src_off = arguments[3];
    var n = arguments[4];
    for(var i=n-1;i>=0;i--) {
      dst.u8[i+dst_off] = src.u8[i+src_off];
    }
    ret1 = dst_off;
    return dst;
  } else {
    throw "h$memcpy: unexpected argument";
  }
}
function h$setField(o,n,v) {
    if(n > 0 && !o.d2) o.d2 = {};
    switch(n) {
    case 0:
        o.d1 = v;
        return;
    case 1:
        o.d2.d1 = v;
        return;
    case 2:
        o.d2.d2 = v;
        return;
    case 3:
        o.d2.d3 = v;
        return;
    case 4:
        o.d2.d4 = v;
        return;
    case 5:
        o.d2.d5 = v;
        return;
    case 6:
        o.d2.d6 = v;
        return;
    case 7:
        o.d2.d7 = v;
        return;
    case 8:
        o.d2.d8 = v;
        return;
    case 9:
        o.d2.d9 = v;
        return;
    case 10:
        o.d2.d10 = v;
        return;
    case 11:
        o.d2.d11 = v;
        return;
    case 12:
        o.d2.d12 = v;
        return;
    case 13:
        o.d2.d13 = v;
        return;
    case 14:
        o.d2.d14 = v;
        return;
    case 15:
        o.d2.d15 = v;
        return;
    case 16:
        o.d2.d16 = v;
        return;
    case 17:
        o.d2.d17 = v;
        return;
    case 18:
        o.d2.d18 = v;
        return;
    case 19:
        o.d2.d19 = v;
        return;
    case 20:
        o.d2.d20 = v;
        return;
    case 21:
        o.d2.d21 = v;
        return;
    case 22:
        o.d2.d22 = v;
        return;
    case 23:
        o.d2.d23 = v;
        return;
    case 24:
        o.d2.d24 = v;
        return;
    case 25:
        o.d2.d25 = v;
        return;
    case 26:
        o.d2.d26 = v;
        return;
    case 27:
        o.d2.d27 = v;
        return;
    case 28:
        o.d2.d28 = v;
        return;
    case 29:
        o.d2.d29 = v;
        return;
    case 30:
        o.d2.d30 = v;
        return;
    case 31:
        o.d2.d31 = v;
        return;
    case 32:
        o.d2.d32 = v;
        return;
    case 33:
        o.d2.d33 = v;
        return;
    case 34:
        o.d2.d34 = v;
        return;
    case 35:
        o.d2.d35 = v;
        return;
    case 36:
        o.d2.d36 = v;
        return;
    case 37:
        o.d2.d37 = v;
        return;
    case 38:
        o.d2.d38 = v;
        return;
    case 39:
        o.d2.d39 = v;
        return;
    case 40:
        o.d2.d40 = v;
        return;
    case 41:
        o.d2.d41 = v;
        return;
    case 42:
        o.d2.d42 = v;
        return;
    case 43:
        o.d2.d43 = v;
        return;
    case 44:
        o.d2.d44 = v;
        return;
    case 45:
        o.d2.d45 = v;
        return;
    case 45:
        o.d2.d45 = v;
        return;
    case 46:
        o.d2.d46 = v;
        return;
    case 47:
        o.d2.d47 = v;
        return;
    case 48:
        o.d2.d48 = v;
        return;
    case 49:
        o.d2.d49 = v;
        return;
    case 50:
        o.d2.d50 = v;
        return;
    case 51:
        o.d2.d51 = v;
        return;
    case 52:
        o.d2.d52 = v;
        return;
    case 53:
        o.d2.d53 = v;
        return;
    case 54:
        o.d2.d54 = v;
        return;
    case 55:
        o.d2.d55 = v;
        return;
    case 56:
        o.d2.d56 = v;
        return;
    case 57:
        o.d2.d57 = v;
        return;
    case 58:
        o.d2.d58 = v;
        return;
    case 59:
        o.d2.d59 = v;
        return;
    case 60:
        o.d2.d60 = v;
        return;
    case 61:
        o.d2.d61 = v;
        return;
    case 62:
        o.d2.d62 = v;
        return;
    case 63:
        o.d2.d63 = v;
        return;
    case 64:
        o.d2.d64 = v;
        return;
    case 65:
        o.d2.d65 = v;
        return;
    case 66:
        o.d2.d66 = v;
        return;
    case 67:
        o.d2.d67 = v;
        return;
    case 68:
        o.d2.d68 = v;
        return;
    case 69:
        o.d2.d69 = v;
        return;
    case 70:
        o.d2.d70 = v;
        return;
    case 71:
        o.d2.d71 = v;
        return;
    case 72:
        o.d2.d72 = v;
        return;
    case 73:
        o.d2.d73 = v;
        return;
    case 74:
        o.d2.d74 = v;
        return;
    case 75:
        o.d2.d75 = v;
        return;
    case 76:
        o.d2.d76 = v;
        return;
    case 77:
        o.d2.d77 = v;
        return;
    case 78:
        o.d2.d78 = v;
        return;
    case 79:
        o.d2.d79 = v;
        return;
    case 80:
        o.d2.d80 = v;
        return;
    case 81:
        o.d2.d81 = v;
        return;
    case 82:
        o.d2.d82 = v;
        return;
    case 83:
        o.d2.d83 = v;
        return;
    case 84:
        o.d2.d84 = v;
        return;
    case 85:
        o.d2.d85 = v;
        return;
    case 86:
        o.d2.d86 = v;
        return;
    case 87:
        o.d2.d87 = v;
        return;
    case 88:
        o.d2.d88 = v;
        return;
    case 89:
        o.d2.d89 = v;
        return;
    case 90:
        o.d2.d90 = v;
        return;
    case 91:
        o.d2.d91 = v;
        return;
    case 92:
        o.d2.d92 = v;
        return;
    case 93:
        o.d2.d93 = v;
        return;
    case 94:
        o.d2.d94 = v;
        return;
    case 95:
        o.d2.d95 = v;
        return;
    case 96:
        o.d2.d96 = v;
        return;
    case 97:
        o.d2.d97 = v;
        return;
    case 98:
        o.d2.d98 = v;
        return;
    case 99:
        o.d2.d99 = v;
        return;
    case 100:
        o.d2.d100 = v;
        return;
    default:
        throw ("h$setField: setter not implemented for field: " + n);
    }
}
function h$mkExportDyn(t, f) {
    h$log("making dynamic export: " + t);
    h$log("haskell fun: " + f + " " + h$collectProps(f));
    var ff = function() {
        h$log("running some haskell for you");
        return 12;
    };
    return h$mkPtr(ff, 0);
}
function h$memchr(a_v, a_o, c, n) {
  for(var i=0;i<n;i++) {
    if(a_v.u8[a_o+i] === c) {
      h$ret1 = a_o+i;
      return a_v;
    }
  }
  h$ret1 = 0;
  return null;
}
function h$strlen(a_v, a_o) {
  var i=0;
  while(true) {
    if(a_v.u8[a_o+i] === 0) { return i; }
    i++;
  }
}
function h$newArray(len, e) {
    var r = [];
    r.__ghcjsArray = true;
    r.m = 0;
    if(e === null) e = r;
    for(var i=0;i<len;i++) r[i] = e;
    return r;
}
function h$roundUpToMultipleOf(n,m) {
  var rem = n % m;
  return rem === 0 ? n : n - rem + m;
}
function h$newByteArray(len) {
  var len0 = Math.max(h$roundUpToMultipleOf(len, 8), 8);
  var buf = new ArrayBuffer(len0);
  return { buf: buf
         , len: len
         , i3: new Int32Array(buf)
         , u8: new Uint8Array(buf)
         , u1: new Uint16Array(buf)
         , f3: new Float32Array(buf)
         , f6: new Float64Array(buf)
         , dv: new DataView(buf)
         }
}
function h$wrapBuffer(buf, unalignedOk, offset, length) {
  if(!unalignedOk && offset && offset % 8 !== 0) {
    throw ("h$wrapBuffer: offset not aligned:" + offset);
  }
  if(!buf || !(buf instanceof ArrayBuffer))
    throw "h$wrapBuffer: not an ArrayBuffer"
  if(!offset) { offset = 0; }
  if(!length || length < 0) { length = buf.byteLength - offset; }
  return { buf: buf
         , len: length
         , i3: (offset%4) ? null : new Int32Array(buf, offset, length >> 2)
         , u8: new Uint8Array(buf, offset, length)
         , u1: (offset%2) ? null : new Uint16Array(buf, offset, length >> 1)
         , f3: (offset%4) ? null : new Float32Array(buf, offset, length >> 2)
         , f6: (offset%8) ? null : new Float64Array(buf, offset, length >> 3)
         , dv: new DataView(buf, offset, length)
         };
}
var h$stableNameN = 1;
function h$StableName(m) {
    this.m = m;
    this.s = null;
}
function h$makeStableName(x) {
    if(typeof x === 'object') {
        if(typeof x.m !== 'object') {
            x.m = new h$StableName(x.m);
        }
        return x.m;
    } else {
        return new h$StableName(0);
    }
}
function h$stableNameInt(s) {
    var x = s.s;
    if(x === null) {
        x = s.s = h$stableNameN = (h$stableNameN+1)|0;
    }
    return x;
}
function h$eqStableName(s1o,s2o) {
    return s1o === s2o ? 1 : 0;
}
function h$makeStablePtr(v) {
  var buf = h$newByteArray(4);
  buf.arr = [v];
  h$ret1 = 0;
  return buf;
}
function h$hs_free_stable_ptr(stable) {
}
function h$malloc(n) {
  h$ret1 = 0;
  return h$newByteArray(n);
}
function h$free() {
}
function h$memset() {
  var buf_v, buf_off, chr, n;
  buf_v = arguments[0];
  if(arguments.length == 4) {
    buf_off = arguments[1];
    chr = arguments[2];
    n = arguments[3];
  } else if(arguments.length == 3) {
    buf_off = 0;
    chr = arguments[1];
    n = arguments[2];
  } else {
    throw("h$memset: unexpected argument")
  }
  var end = buf_off + n;
  for(var i=buf_off;i<end;i++) {
    buf_v.u8[i] = chr;
  }
  ret1 = buf_off;
  return buf_v;
}
function h$memcmp(a_v, a_o, b_v, b_o, n) {
  for(var i=0;i<n;i++) {
    var a = a_v.u8[a_o+i];
    var b = b_v.u8[b_o+i];
    var c = a-b;
    if(c !== 0) { return c; }
  }
  return 0;
}
function h$memmove(a_v, a_o, b_v, b_o, n) {
  if(n > 0) {
    var tmp = new Uint8Array(b_v.buf.slice(b_o,b_o+n));
    for(var i=0;i<n;i++) {
      a_v.u8[a_o+i] = tmp[i];
    }
  }
  h$ret1 = a_o;
  return a_v;
}
function h$mkPtr(v, o) {
  return h$c2(h$baseZCGHCziPtrziPtr_con_e, v, o);
};
function h$mkFunctionPtr(f) {
  var d = h$newByteArray(4);
  d.arr = [f];
  return d;
}
var h$freeHaskellFunctionPtr = function () {
}
var h$extraRootsN = 0;
var h$extraRoots = new h$Set();
var h$domRoots = new h$Set();
function h$makeCallback(retain, f, extraArgs, action) {
    var args = extraArgs.slice(0);
    args.unshift(action);
    var c = function() {
        return f.apply(this, args);
    }
    if(retain === true) {
        c._key = ++h$extraRootsN;
        c.root = action;
        h$extraRoots.add(c);
    } else if(retain) {
    }
    return c;
}
function h$makeCallbackApply(retain, n, f, extraArgs, fun) {
  var c;
  if(n === 1) {
    c = function(x) {
      var args = extraArgs.slice(0);
      var action = h$c2(h$ap1_e, fun, h$mkJSRef(x));
      args.unshift(action);
      return f.apply(this, args);
    }
  } else if (n === 2) {
    c = function(x,y) {
      var args = extraArgs.slice(0);
      var action = h$c3(h$ap2_e, fun, h$mkJSRef(x), h$mkJSRef(y));
      args.unshift(action);
      return f.apply(this, args);
    }
  } else {
    throw "h$makeCallbackApply: unsupported arity";
  }
  if(retain === true) {
      c.root = fun;
      c._key = ++h$extraRootsN;
      h$extraRoots.add(c);
  } else if(retain) {
  } else {
  }
  return c;
}
function h$mkJSRef(x) {
  return h$c1(h$ghcjszmprimZCGHCJSziPrimziJSRef_con_e, x);
}
function h$retain(c) {
  h$extraRoots.add(c);
}
function h$retainDom(d, c) {
  h$domRoots.add(c);
  c.domRoots = new h$Set();
}
function h$releasePermanent(c) {
  h$extraRoots.remove(c);
}
function h$release(c) {
  h$extraRoots.remove(c);
  h$domRoots.remove(c);
}
function h$releaseDom(c,d) {
  if(c.domRoots) c.domRoots.remove(d);
  if(!c.domRoots || c.domRoots.size() == 0) h$domRoots.remove(c);
}
function h$isInstanceOf(o,c) {
  return o instanceof c;
}
function h$getpagesize() {
  return 4096;
}
var h$MAP_ANONYMOUS = 0x20;
function h$mmap(addr_d, addr_o, len, prot, flags, fd, offset1, offset2) {
  if(flags & h$MAP_ANONYMOUS || fd === -1) {
    h$ret1 = 0;
    return h$newByteArray(len);
  } else {
    throw "h$mmap: mapping a file is not yet supported";
  }
}
function h$mprotect(addr_d, addr_o, size, prot) {
  return 0;
}
function h$munmap(addr_d, addr_o, size) {
  if(addr_d && addr_o === 0 && size >= addr_d.len) {
    addr_d.buf = null;
    addr_d.i3 = null;
    addr_d.u8 = null;
    addr_d.u1 = null;
    addr_d.f3 = null;
    addr_d.f6 = null;
    addr_d.dv = null;
  }
  return 0;
}
var h$gcMark = 2;
var h$retainCAFs = false;
var h$CAFs = [];
var h$CAFsReset = [];
function h$isMarked(obj) {
  return (typeof obj === 'object' || typeof obj === 'function') &&
        ((typeof obj.m === 'number' && (obj.m & 3) === h$gcMark) || (obj.m && typeof obj.m === 'object' && obj.m.m === h$gcMark));
}
function h$gcQuick(t) {
    if(h$currentThread !== null) throw "h$gcQuick: GC can only run when no thread is running";
    h$resetRegisters();
    h$resetResultVars();
    var i;
    if(t !== null) {
        if(t instanceof h$Thread) {
            h$resetThread(t);
        } else {
            for(var i=0;i<t.length;i++) h$resetThread(t[i]);
        }
    } else {
        var nt, runnable = h$threads.iter();
        while((nt = runnable()) !== null) h$resetThread(nt);
        var iter = h$blocked.iter();
        while((nt = iter.next()) !== null) h$resetThread(nt);
    }
}
function h$gc(t) {
    if(h$currentThread !== null) throw "h$gc: GC can only be run when no thread is running";
    ;
    var start = Date.now();
    h$resetRegisters();
    h$resetResultVars();
    h$gcMark = 5-h$gcMark;
    var i;
    ;
    if(t !== null) h$markThread(t);
    var nt, runnable = h$threads.iter();
    while((nt = runnable()) !== null) h$markThread(nt);
    var iter = h$blocked.iter();
    while((nt = iter.next()) !== null) {
        if(!(nt.blockedOn instanceof h$MVar) || (nt.stack && nt.stack[nt.sp] === h$unboxFFIResult)) {
            h$markThread(nt);
        }
    }
    iter = h$extraRoots.iter();
    while((nt = iter.next()) !== null) h$follow(nt.root);
    h$markRetained();
    var killedThread;
    while(killedThread = h$finalizeMVars()) {
        h$markThread(killedThread);
        h$markRetained();
    }
    iter = h$blocked.iter();
    while((nt = iter.next()) !== null) h$markThread(nt);
    h$markRetained();
    finalizers = h$finalizeWeaks();
    h$clearWeaks();
    for(i=0;i<finalizers.length;i++) {
        var fin = finalizers[i].finalizer;
        if(fin !== null && !((typeof fin.m === 'number' && (fin.m & 3) === mark) || (typeof fin.m === 'object' && ((fin.m.m & 3) === mark)))) h$follow(fin);
    }
    h$markRetained();
    h$clearWeaks();
    h$scannedWeaks = [];
    h$finalizeDom();
    h$finalizeCAFs();
    var now = Date.now();
    h$lastGc = now;
}
function h$markRetained() {
    var marked, c, mark = h$gcMark;
    do {
        ;
        marked = false;
        iter = h$finalizers.iter();
        while((c = iter.next()) !== null) {
            if(!((typeof c.finalizer.m === 'number' && (c.finalizer.m & 3) === mark) || (typeof c.finalizer.m === 'object' && ((c.finalizer.m.m & 3) === mark))) && c.m.m === mark) {
                ;
                h$follow(c.finalizer);
                marked = true;
            }
        }
        iter = h$domRoots.iter();
        while((c = iter.next()) !== null) {
            if(!h$isMarked(c.root) && c.domRoots && c.domRoots.size() > 0) {
                var dr, domRetainers = c.domRoots.iter();
                while((dr = domRetainers.next()) !== null) {
                    if(h$isReachableDom(dr)) {
                        ;
                        h$follow(c.root);
                        marked = true;
                    }
                }
            }
        }
        for(var i=h$scannedWeaks.length-1;i>=0;i--) {
            var w = h$scannedWeaks[i];
            if(w.keym.m === mark && w.val !== null && !((typeof w.val.m === 'number' && (w.val.m & 3) === mark) || (typeof w.val.m === 'object' && ((w.val.m.m & 3) === mark)))) {
                ;
                h$follow(w.val);
                marked = true;
            }
        }
    } while(marked);
}
function h$markThread(t) {
    var mark = h$gcMark;
    ;
    if(((typeof t.m === 'number' && (t.m & 3) === mark) || (typeof t.m === 'object' && ((t.m.m & 3) === mark)))) return;
    if(typeof t.m === 'number') { t.m = (t.m & -4)|mark; } else { t.m.m = (t.m.m & -4)|mark; };
    if(t.stack === null) return;
    h$follow(t.stack, t.sp);
    h$resetThread(t);
}
function h$followObjGen(c, work) {
   work.push(c.d1);
   var d = c.d2;
   for(var x in d) {
     work.push(d[x]);
   }
}
function h$follow(obj, sp) {
    var i, ii, iter, c, work;
    ;
    var work, mark = h$gcMark;
    if(typeof sp === 'number') {
        work = obj.slice(0, sp+1);
    } else {
        work = [obj];
    }
    while(work.length > 0) {
        ;
        c = work.pop();
        ;
        if(c !== null && typeof c === 'object' && ((typeof c.m === 'number' && (c.m&3) !== mark) || (typeof c.m === 'object' && c.m !== null && typeof c.m.m === 'number' && (c.m.m&3) !== mark))) {
            var doMark = false;
            var cf = c.f;
            ;
            if(typeof cf === 'function' && (typeof c.m === 'number' || typeof c.m === 'object')) {
                ;
                if(typeof c.m === 'number') { c.m = (c.m & -4)|mark; } else { c.m.m = (c.m.m & -4)|mark; };
                var d = c.d2;
                switch(cf.size) {
                case 0: break;
                case 1: work.push(c.d1); break;
                case 2: work.push(c.d1, d); break;
                case 3: var d3=c.d2; work.push(c.d1, d3.d1, d3.d2); break;
                case 4: var d4=c.d2; work.push(c.d1, d4.d1, d4.d2, d4.d3); break;
                case 5: var d5=c.d2; work.push(c.d1, d5.d1, d5.d2, d5.d3, d5.d4); break;
                case 6: var d6=c.d2; work.push(c.d1, d6.d1, d6.d2, d6.d3, d6.d4, d6.d5); break;
                case 7: var d7=c.d2; work.push(c.d1, d7.d1, d7.d2, d7.d3, d7.d4, d7.d5, d7.d6); break;
                case 8: var d8=c.d2; work.push(c.d1, d8.d1, d8.d2, d8.d3, d8.d4, d8.d5, d8.d6, d8.d7); break;
                case 9: var d9=c.d2; work.push(c.d1, d9.d1, d9.d2, d9.d3, d9.d4, d9.d5, d9.d6, d9.d7, d9.d8); break;
                case 10: var d10=c.d2; work.push(c.d1, d10.d1, d10.d2, d10.d3, d10.d4, d10.d5, d10.d6, d10.d7, d10.d8, d10.d9); break;
                case 11: var d11=c.d2; work.push(c.d1, d11.d1, d11.d2, d11.d3, d11.d4, d11.d5, d11.d6, d11.d7, d11.d8, d11.d9, d11.d10); break;
                case 12: var d12=c.d2; work.push(c.d1, d12.d1, d12.d2, d12.d3, d12.d4, d12.d5, d12.d6, d12.d7, d12.d8, d12.d9, d12.d10, d12.d11); break;
                default: h$followObjGen(c,work);
                }
                var s = cf.s;
                if(s !== null) {
                    ;
                    for(var i=0;i<s.length;i++) work.push(s[i]);
                }
            } else if(c instanceof h$Weak) {
                ;
                if(c.keym.m === mark) {
                    if(c.val !== null && !((typeof c.val.m === 'number' && (c.val.m & 3) === mark) || (typeof c.val.m === 'object' && ((c.val.m.m & 3) === mark)))) work.push(c.val);
                } else {
                    if(c.val !== null) h$scannedWeaks.push(c);
                }
                if(typeof c.m === 'number') { c.m = (c.m & -4)|mark; } else { c.m.m = (c.m.m & -4)|mark; };
            } else if(c instanceof h$MVar) {
                ;
                if(typeof c.m === 'number') { c.m = (c.m & -4)|mark; } else { c.m.m = (c.m.m & -4)|mark; };
                iter = c.writers.iter();
                while((ii = iter()) !== null) work.push(ii[1]);
                if(c.val !== null && !((typeof c.val.m === 'number' && (c.val.m & 3) === mark) || (typeof c.val.m === 'object' && ((c.val.m.m & 3) === mark)))) work.push(c.val);
            } else if(c instanceof h$MutVar) {
                ;
                if(typeof c.m === 'number') { c.m = (c.m & -4)|mark; } else { c.m.m = (c.m.m & -4)|mark; };
                work.push(c.val);
            } else if(c instanceof h$TVar) {
                ;
                if(typeof c.m === 'number') { c.m = (c.m & -4)|mark; } else { c.m.m = (c.m.m & -4)|mark; };
                work.push(c.val);
            } else if(c instanceof h$Thread) {
                ;
                if(typeof c.m === 'number') { c.m = (c.m & -4)|mark; } else { c.m.m = (c.m.m & -4)|mark; };
                if(c.stack) work.push.apply(work, c.stack.slice(0, c.sp));
            } else if(c instanceof h$Transaction) {
                ;
                if(typeof c.m === 'number') { c.m = (c.m & -4)|mark; } else { c.m.m = (c.m.m & -4)|mark; };
                work.push.apply(work, c.invariants);
                work.push(c.action);
                iter = c.tvars.iter();
                while((ii = iter.next()) !== null) work.push(ii);
            } else if(c instanceof Array && c.__ghcjsArray) {
                if(typeof c.m === 'number') { c.m = (c.m & -4)|mark; } else { c.m.m = (c.m.m & -4)|mark; };
                ;
                for(i=0;i<c.length;i++) {
                    var x = c[i];
                    if(typeof x === 'object' && x !== null && !((typeof x.m === 'number' && (x.m & 3) === mark) || (typeof x.m === 'object' && ((x.m.m & 3) === mark)))) work.push(x);
                }
            } else {
            }
        }
    }
    ;
}
function h$resetThread(t) {
    var stack = t.stack;
    var sp = t.sp;
    if(stack.length - sp > sp && stack.length > 100) {
        t.stack = t.stack.slice(0,sp+1);
    } else {
        for(var i=sp+1;i<stack.length;i++) {
            stack[i] = null;
        }
    }
    ;
}
function h$finalizeMVars() {
    ;
    var i, t, iter = h$blocked.iter();
    while((t = iter.next()) !== null) {
        if(t.status === h$threadBlocked && t.blockedOn instanceof h$MVar) {
            if(t.blockedOn.m !== h$gcMark && t.stack[t.sp] !== h$unboxFFIResult) {
                h$killThread(t, h$ghcjszmprimZCGHCJSziPrimziInternalziblockedIndefinitelyOnMVar);
                return t;
            }
        }
    }
    return null;
}
function h$finalizeDom() {
}
function h$finalizeCAFs() {
    if(h$retainCAFs) return;
    var mark = h$gcMark;
    for(var i=0;i<h$CAFs.length;i++) {
        var c = h$CAFs[i];
        if(c.m & 3 !== mark) {
            var cr = h$CAFsReset[i];
            if(c.f !== cr) {
                ;
                c.f = cr;
                c.d1 = null;
                c.d2 = null;
            }
        }
    }
    ;
}
var h$errno = 0;
function h$__hscore_get_errno() {
  ;
  return h$errno;
}
function h$setErrno(e) {
  ;
  var es = e.toString();
  var getErr = function() {
      if(es.indexOf('ENOTDIR') !== -1) return 20;
      if(es.indexOf('ENOENT') !== -1) return 2;
      if(es.indexOf('EEXIST') !== -1) return 17;
      if(es.indexOf('ENETUNREACH') !== -1) return 22;
      if(es.indexOf('EPERM') !== -1) return 1;
      if(es.indexOf('EMFILE') !== -1) return 24;
      if(es.indexOf('EPIPE') !== -1) return 32;
      if(es.indexOf('EAGAIN') !== -1) return 35;
      if(es.indexOf('Bad argument') !== -1) return 2;
      throw ("setErrno not yet implemented: " + e);
  }
  h$errno = getErr();
}
var h$errorStrs = { 7: "too big"
                   , CONST_EACCESS: "no access"
                   , 22: "invalid"
                   , 9: "bad file descriptor"
                   , 20: "not a directory"
                   , 2: "no such file or directory"
                   , 1: "operation not permitted"
                   , 17: "file exists"
                   , 24: "too many open files"
                   , 32: "broken pipe"
                   , 35: "resource temporarily unavailable"
                   }
function h$strerror(err) {
    ;
    h$ret1 = 0;
    return h$encodeUtf8(h$errorStrs[err] || "unknown error");
}
function h$handleErrno(r_err, f) {
  try {
    return f();
  } catch(e) {
    h$setErrno(e);
    return r_err;
  }
}
function h$handleErrnoS(r_err, r_success, f) {
  try {
    f();
    return r_success;
  } catch(e) {
    h$setErrno(e);
    return r_err;
  }
}
function h$handleErrnoC(err, r_err, r_success, c) {
    if(err) {
        h$setErrno(err);
        c(r_err);
    } else {
        c(r_success);
    }
}
function h$MD5Init(ctx, ctx_off) {
  if(!ctx.arr) { ctx.arr = []; }
  ctx.arr[ctx_off] = new goog.crypt.Md5();
}
var h$__hsbase_MD5Init = h$MD5Init;
function h$MD5Update(ctx, ctx_off, data, data_off, len) {
  var arr = new Uint8Array(data.buf, data_off);
  ctx.arr[ctx_off].update(arr, len);
}
var h$__hsbase_MD5Update = h$MD5Update;
function h$MD5Final(dst, dst_off, ctx, ctx_off) {
  var digest = ctx.arr[ctx_off].digest();
  for(var i=0;i<16;i++) {
    dst.u8[dst_off+i] = digest[i];
  }
}
var h$__hsbase_MD5Final = h$MD5Final;
function h$hs_eqWord64(a1,a2,b1,b2) {
  return (a1===b1 && a2===b2) ? 1 : 0;
}
function h$hs_neWord64(a1,a2,b1,b2) {
  return (a1 !== b1 || a2 !== b2) ? 1 : 0;
}
function h$hs_word64ToWord(a1,a2) {
  return a2;
}
function h$hs_wordToWord64(w) {
  h$ret1 = w;
  return 0;
}
function h$hs_intToInt64(a) {
  h$ret1 = a;
  return (a < 0) ? -1 : 0;
}
function h$hs_int64ToWord64(a1,a2) {
  h$ret1 = a2;
  return a1;
}
function h$hs_word64ToInt64(a1,a2) {
  h$ret1 = a2;
  return a1;
}
function h$hs_int64ToInt(a1,a2) {
  return a2;
}
function h$hs_negateInt64(a1,a2) {
  var c = goog.math.Long.fromBits(a2,a1).negate();
  h$ret1 = c.getLowBits();
  return c.getHighBits();
}
function h$hs_not64(a1,a2) {
  h$ret1 = ~a2;
  return ~a1;
}
function h$hs_xor64(a1,a2,b1,b2) {
  h$ret1 = a2 ^ b2;
  return a1 ^ b1;
}
function h$hs_and64(a1,a2,b1,b2) {
  h$ret1 = a2 & b2;
  return a1 & b1;
}
function h$hs_or64(a1,a2,b1,b2) {
  h$ret1 = a2 | b2;
  return a1 | b1;
}
function h$hs_eqInt64(a1,a2,b1,b2) {
  return (a1 === b1 && a2 === b2) ? 1 : 0;
}
function h$hs_neInt64(a1,a2,b1,b2) {
  return (a1 !== b1 || a2 !== b2) ? 1 : 0;
}
function h$hs_leInt64(a1,a2,b1,b2) {
  if(a1 === b1) {
    var a2s = a2 >>> 1;
    var b2s = b2 >>> 1;
    return (a2s < b2s || (a2s === b2s && ((a2&1) <= (b2&1)))) ? 1 : 0;
  } else {
    return (a1 < b1) ? 1 : 0;
  }
}
function h$hs_ltInt64(a1,a2,b1,b2) {
  if(a1 === b1) {
    var a2s = a2 >>> 1;
    var b2s = b2 >>> 1;
    return (a2s < b2s || (a2s === b2s && ((a2&1) < (b2&1)))) ? 1 : 0;
  } else {
    return (a1 < b1) ? 1 : 0;
  }
}
function h$hs_geInt64(a1,a2,b1,b2) {
  if(a1 === b1) {
    var a2s = a2 >>> 1;
    var b2s = b2 >>> 1;
    return (a2s > b2s || (a2s === b2s && ((a2&1) >= (b2&1)))) ? 1 : 0;
  } else {
    return (a1 > b1) ? 1 : 0;
  }
}
function h$hs_gtInt64(a1,a2,b1,b2) {
  if(a1 === b1) {
    var a2s = a2 >>> 1;
    var b2s = b2 >>> 1;
    return (a2s > b2s || (a2s === b2s && ((a2&1) > (b2&1)))) ? 1 : 0;
  } else {
    return (a1 > b1) ? 1 : 0;
  }
}
function h$hs_quotWord64(a1,a2,b1,b2) {
  var a = h$bigFromWord64(a1,a2);
  var b = h$bigFromWord64(b1,b2);
  var c = a.divide(b);
  h$ret1 = c.intValue();
  return c.shiftRight(32).intValue();
}
function h$hs_timesInt64(a1,a2,b1,b2) {
  var c = goog.math.Long.fromBits(a2,a1).multiply(goog.math.Long.fromBits(b2,b1));
  h$ret1 = c.getLowBits();
  return c.getHighBits();
}
function h$hs_quotInt64(a1,a2,b1,b2) {
  var c = goog.math.Long.fromBits(a2,a1).div(goog.math.Long.fromBits(b2,b1));
  h$ret1 = c.getLowBits();
  return c.getHighBits();
}
function h$hs_remInt64(a1,a2,b1,b2) {
  var c = goog.math.Long.fromBits(a2,a1).modulo(goog.math.Long.fromBits(b2,b1));
  h$ret1 = c.getLowBits();
  return c.getHighBits();
}
function h$hs_plusInt64(a1,a2,b1,b2) {
  var c = goog.math.Long.fromBits(a2,a1).add(goog.math.Long.fromBits(b2,b1));
  h$ret1 = c.getLowBits();
  return c.getHighBits();
}
function h$hs_minusInt64(a1,a2,b1,b2) {
  var c = goog.math.Long.fromBits(a2,a1).subtract(goog.math.Long.fromBits(b2,b1));
  h$ret1 = c.getLowBits();
  return c.getHighBits();
}
function h$hs_leWord64(a1,a2,b1,b2) {
  if(a1 === b1) {
    var a2s = a2 >>> 1;
    var b2s = b2 >>> 1;
    return (a2s < b2s || (a2s === b2s && ((a2&1) <= (b2&1)))) ? 1 : 0;
  } else {
    var a1s = a1 >>> 1;
    var b1s = b1 >>> 1;
    return (a1s < b1s || (a1s === b1s && ((a1&1) <= (b1&1)))) ? 1 : 0;
  }
}
function h$hs_ltWord64(a1,a2,b1,b2) {
  if(a1 === b1) {
    var a2s = a2 >>> 1;
    var b2s = b2 >>> 1;
    return (a2s < b2s || (a2s === b2s && ((a2&1) < (b2&1)))) ? 1 : 0;
  } else {
    var a1s = a1 >>> 1;
    var b1s = b1 >>> 1;
    return (a1s < b1s || (a1s === b1s && ((a1&1) < (b1&1)))) ? 1 : 0;
  }
}
function h$hs_geWord64(a1,a2,b1,b2) {
  if(a1 === b1) {
    var a2s = a2 >>> 1;
    var b2s = b2 >>> 1;
    return (a2s > b2s || (a2s === b2s && ((a2&1) >= (b2&1)))) ? 1 : 0;
  } else {
    var a1s = a1 >>> 1;
    var b1s = b1 >>> 1;
    return (a1s > b1s || (a1s === b1s && ((a1&1) >= (b1&1)))) ? 1 : 0;
  }
}
function h$hs_gtWord64(a1,a2,b1,b2) {
  if(a1 === b1) {
    var a2s = a2 >>> 1;
    var b2s = b2 >>> 1;
    return (a2s > b2s || (a2s === b2s && ((a2&1) > (b2&1)))) ? 1 : 0;
  } else {
    var a1s = a1 >>> 1;
    var b1s = b1 >>> 1;
    return (a1s > b1s || (a1s === b1s && ((a1&1) > (b1&1)))) ? 1 : 0;
  }
}
function h$hs_remWord64(a1,a2,b1,b2) {
  var a = h$bigFromWord64(a1,a2);
  var b = h$bigFromWord64(b1,b2);
  var c = a.mod(b);
  h$ret1 = c.intValue();
  return c.shiftRight(32).intValue();
}
function h$hs_uncheckedIShiftL64(a1,a2,n) {
  var num = new goog.math.Long(a2,a1).shiftLeft(n);
  h$ret1 = num.getLowBits();
  return num.getHighBits();
}
function h$hs_uncheckedIShiftRA64(a1,a2,n) {
  var num = new goog.math.Long(a2,a1).shiftRight(n);
  h$ret1 = num.getLowBits();
  return num.getHighBits();
}
function h$hs_uncheckedShiftL64(a1,a2,n) {
  n &= 63;
  if(n == 0) {
    h$ret1 = a2;
    return a1;
  } else if(n < 32) {
    h$ret1 = a2 << n;
    return (a1 << n) | (a2 >>> (32-n));
  } else {
    h$ret1 = 0;
    return ((a2 << (n-32))|0);
  }
}
function h$hs_uncheckedShiftRL64(a1,a2,n) {
  n &= 63;
  if(n == 0) {
    h$ret1 = a2;
    return a1;
  } else if(n < 32) {
    h$ret1 = (a2 >>> n ) | (a1 << (32-n));
    return a1 >>> n;
  } else {
    h$ret1 = a1 >>> (n-32);
    return 0;
  }
}
function h$imul_shim(a, b) {
    var ah = (a >>> 16) & 0xffff;
    var al = a & 0xffff;
    var bh = (b >>> 16) & 0xffff;
    var bl = b & 0xffff;
    return (((al * bl)|0) + (((ah * bl + al * bh) << 16) >>> 0)|0);
}
var h$mulInt32 = Math.imul ? Math.imul : h$imul_shim;
function h$mulWord32(a,b) {
  return goog.math.Long.fromBits(a,0).multiply(goog.math.Long.fromBits(b,0)).getLowBits();
}
function h$mul2Word32(a,b) {
  var c = goog.math.Long.fromBits(a,0).multiply(goog.math.Long.fromBits(b,0))
  h$ret1 = c.getLowBits();
  return c.getHighBits();
}
function h$quotWord32(a,b) {
  return goog.math.Long.fromBits(a,0).div(goog.math.Long.fromBits(b,0)).getLowBits();
}
function h$remWord32(a,b) {
  return goog.math.Long.fromBits(a,0).modulo(goog.math.Long.fromBits(b,0)).getLowBits();
}
function h$quotRem2Word32(a1,a2,b) {
  var a = h$bigFromWord64(a1,a2);
  var b = h$bigFromWord(b);
  var d = a.divide(b);
  h$ret1 = a.subtract(b.multiply(d)).intValue();
  return d.intValue();
}
function h$wordAdd2(a,b) {
  var c = goog.math.Long.fromBits(a,0).add(goog.math.Long.fromBits(b,0));
  h$ret1 = c.getLowBits();
  return c.getHighBits();
}
function h$uncheckedShiftRL64(a1,a2,n) {
  if(n < 0) throw "unexpected right shift";
  n &= 63;
  if(n == 0) {
    h$ret1 = a2;
    return a1;
  } else if(n < 32) {
    h$ret1 = (a2 >>> n) | (a1 << (32 - n));
    return (a1 >>> n);
  } else {
    h$ret1 = a2 >>> (n - 32);
    return 0;
  }
}
function h$isDoubleNegativeZero(d) {
  ;
  return (d===0 && (1/d) === -Infinity) ? 1 : 0;
}
function h$isFloatNegativeZero(d) {
  ;
  return (d===0 && (1/d) === -Infinity) ? 1 : 0;
}
function h$isDoubleInfinite(d) {
  return (d === Number.NEGATIVE_INFINITY || d === Number.POSITIVE_INFINITY) ? 1 : 0;
}
function h$isFloatInfinite(d) {
  return (d === Number.NEGATIVE_INFINITY || d === Number.POSITIVE_INFINITY) ? 1 : 0;
}
function h$isFloatFinite(d) {
  return (d !== Number.NEGATIVE_INFINITY && d !== Number.POSITIVE_INFINITY && !isNaN(d)) ? 1 : 0;
}
function h$isDoubleFinite(d) {
  return (d !== Number.NEGATIVE_INFINITY && d !== Number.POSITIVE_INFINITY && !isNaN(d)) ? 1 : 0;
}
function h$isDoubleNaN(d) {
  return (isNaN(d)) ? 1 : 0;
}
function h$isFloatNaN(d) {
  return (isNaN(d)) ? 1 : 0;
}
function h$isDoubleDenormalized(d) {
  return (d !== 0 && Math.abs(d) < 2.2250738585072014e-308) ? 1 : 0;
}
function h$isFloatDenormalized(d) {
  return (d !== 0 && Math.abs(d) < 2.2250738585072014e-308) ? 1 : 0;
}
function h$decodeFloatInt(d) {
    if(isNaN(d)) {
      h$ret1 = 105;
      return -12582912;
    }
    var exponent = h$integer_cmm_decodeDoublezh(d)+29;
    var significand = h$ret1.shiftRight(29).intValue();
    if(exponent > 105) {
      exponent = 105;
      significand = significand > 0 ? 8388608 : -8388608;
    } else if(exponent < -151) {
      significand = 0;
      exponent = 0;
    }
    h$ret1 = exponent;
    return significand;
}
function h$decodeDouble2Int(d) {
   var exponent = h$integer_cmm_decodeDoublezh(d);
   var significand = h$ret1;
   var sign = d<0?-1:1;
   h$ret1 = significand.shiftRight(32).intValue();
   h$ret2 = significand.intValue();
   return sign;
}
function h$rintDouble(a) {
  var rounda = Math.round(a);
  if(a >= 0) {
    if(a%1===0.5 && rounda%2===1) {
      return rounda-1;
    } else {
      return rounda;
    }
  } else {
    if(a%1===-0.5 && rounda%2===-1) {
      return rounda-1;
    } else {
      return rounda;
    }
  }
}
var h$rintFloat = h$rintDouble;
function h$acos(d) { return Math.acos(d); }
function h$acosf(f) { return Math.acos(f); }
function h$asin(d) { return Math.asin(d); }
function h$asinf(f) { return Math.asin(f); }
function h$atan(d) { return Math.atan(d); }
function h$atanf(f) { return Math.atan(f); }
function h$atan2(x,y) { return Math.atan2(x,y); }
function h$atan2f(x,y) { return Math.atan2(x,y); }
function h$cos(d) { return Math.cos(d); }
function h$cosf(f) { return Math.cos(f); }
function h$sin(d) { return Math.sin(d); }
function h$sinf(f) { return Math.sin(f); }
function h$tan(d) { return Math.tan(d); }
function h$tanf(f) { return Math.tan(f); }
function h$cosh(d) { return (Math.exp(d)+Math.exp(-d))/2; }
function h$coshf(f) { return h$cosh(f); }
function h$sinh(d) { return (Math.exp(d)-Math.exp(-d))/2; }
function h$sinhf(f) { return h$sinh(f); }
function h$tanh(d) { return (Math.exp(2*d)-1)/(Math.exp(2*d)+1); }
function h$tanhf(f) { return h$tanh(f); }
var h$popCntTab =
   [0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,
    1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,
    1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,
    2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,
    1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,
    2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,
    2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,
    3,4,4,5,4,5,5,6,4,5,5,6,5,6,6,7,4,5,5,6,5,6,6,7,5,6,6,7,6,7,7,8];
function h$popCnt32(x) {
   return h$popCntTab[x&0xFF] +
          h$popCntTab[(x>>>8)&0xFF] +
          h$popCntTab[(x>>>16)&0xFF] +
          h$popCntTab[(x>>>24)&0xFF]
}
function h$popCnt64(x1,x2) {
   return h$popCntTab[x1&0xFF] +
          h$popCntTab[(x1>>>8)&0xFF] +
          h$popCntTab[(x1>>>16)&0xFF] +
          h$popCntTab[(x1>>>24)&0xFF] +
          h$popCntTab[x2&0xFF] +
          h$popCntTab[(x2>>>8)&0xFF] +
          h$popCntTab[(x2>>>16)&0xFF] +
          h$popCntTab[(x2>>>24)&0xFF];
}
function h$bswap64(x1,x2) {
  h$ret1 = (x1 >>> 24) | (x1 << 24) | ((x1 & 0xFF00) << 8) | ((x1 & 0xFF0000) >> 8);
  return (x2 >>> 24) | (x2 << 24) | ((x2 & 0xFF00) << 8) | ((x2 & 0xFF0000) >> 8);
}
h$printRanges = "f|!-f=|/q'--1$J|(]5p'1q&/| 73Y--EO'|$9| ('| ?'|!9?| ?-| %'AZ'|#V|!`0(2'''O0$)+'5'''+3*','O-).+''O0&&&'$-+''))0+$1C9)4(N0&,'7(('@+'7$A)2'''O0&,'5''')3'+','G7'.))*)'$&)')));+-))*'.>M/)2(P6,)3(*1'&/+'733''2(P6,'5(*1'1$+'7&A'2(u'3(,32+'C)1''F)S4$'1)*/$2G);| =+^n'$''$'.+0( #''<('-$.'7''h| Yk+rk@<n|$G7| #)|'?*'1$*'v*'f*'1$*'A| :*'| O'd)W/| t9|.r)| lA=09Q5K;=(&;| 1't'7/7/A6/| z3z-| U7^);+;+(x'-9|  +W/9)| E'| K]'9/7/?| n| b+| #)z);/| 13| A)A)| /| jj=|%/M|&;'/'p'/'3 $a'| 3@>'/H')48-S1| +C''Y<)WOfA|#)/|-Y;rU9M|.x|$N$|3s)7|#b| '| &|#81| #7| 55'?S510000000| m| fW| {;|$hW;+| I| u'|!=-v)|!+y-l;| '|$y} ^y7}%0h| 1|9t)| 75|'fK| 13[3| z3|#3&?7| j| -+7/| 93| S5;/[+| r9`)| f8+'d| 75?'7'd+| OS-f/'/'/510|#7| %'7/}!e;;Q+| +}!'n|&d'| E'|!Cp1;--W,$&&|!gE|(-C| I'| 5t?'W/15jH*+-|#!+|$7)/'/'/'))10='';VH&@'?h|!f-)+| #)| r-;| 1| %|!t^)| +| 'b*;Y| 3`m+?x|#Q'7|3 /'$|  &)&Q4|#U[)Y-|$:+&-3(X+)+5351d|!p| 5)^'Y-3|!p| [|+tb|(U| f+`C| C*|wd|3S|#7|!5=+|bb|7l}#8j|,^}$Dz'}!!#|%M7r'| ^3|!5h| U|$/| x5G|#1| t| V&'&''+:$0| J*'30Z*,$)1|'T'|&O'| -} NS|  +|!7;A'?'A@d9-b| </z| `^=z-51'|#rfA/| T)K;n,MEA| G$|$&*)| EGS|#;-B( $(.'+$'+:+9| )| U| =|!W|P[}*Q/v} !59|$x}$#I|,'#,|3U|%A";
h$alnumRanges = "| +71W/W| '0'$)'(Pa|*2+;?-1$D|!Y&'+3$)$J| o|#*|#_5p'0r5| #$&&$3Y-)^9-| ^+|!;2'7H'B| ?'|!9?| 5+,| %G[|#^|!7'700(2'''O0$)+'5'''+3*',';'/1).+''O0&&&'$-+''))0+$1C9)4(N0&,'7(('@+'7E)2'''O0&,'5''')3'+','707'.))*)'$&)')));+-))*'.>=?)2(P6,)3(*1'&/+'731)'2(P6,'5(*1'1$+'7&A'2(u'3(,32+'C+/''F)S4$'1)*/$2G'=| =-A6r'$''$'.+0( #''<('-$.'7''hP'/K $+7k+KFk5| :| ^/| f'p7z$)|'?*'1$*'v*'f*'1$*'A| :*'| O')5K)CC| t;|-j'EV-| `))A=09M9K;=(&;| 1'`)*''7/7E)'7/| z3z-| U7^);+;7t'-9|  +W/9n[+| G]'9/7=| y| b+7E5;z);/| 1;| 937)| +| n)a=|%/M|&;'/'p'/'3 $a'| 30$))0)+'/+=-)0|!U''/-9/=| /fE*&7$)-/ $+8'+--+$| =|0/| A| fO|.#`|91| '| &|!y/19&p7| 55@S510000000c| '|*H)UA,'-+| v''')|!!*-v)|!+)+7Y| 3Cd7rAd7rA|'-} X;| ^}%/A| 1|9t| O| %'|& )[K| /5'T3| nn5'|!='+&?7| j| %3/7| 1;| S97/S)*| %'l;^)| K?9p| 75?'7/Q)'+| OS)j/'/'/510|#7z&'7/}!e;;Q+| +}!'n|&d'| E'|!Cp1;--;<,$&&|!Ff|()G| I'| 5t;+CC1| [-|#!I71W/W9|! )/'/'/')j;VH&@'?h|!f;| #;| ;E|!R|!s^)| +| 'b*;Y| 3`'l+3,x|#Q'7|3 /'$|  &)&Q'3|#U[+W|$G+&-3(X+)+5Sb|!r| 57O'Y-3|!p| [|+tb|(U| W9`C| ?|wr|3S|#7|!5|c)|7l}#8j|,^}$Dz'}!)x-)/33'1`+|#=)|&=G|#1| t| V&'&''+:$0| J*'30Z*,$)1|'T'UTaTaTaTaT2'| -} T79|v+}*Q/v} !59|$x}$#I|,'#,|3U|%A";
h$lowerRanges = "|!3W| '6*kS2 <& (& 8' #)'$&('+&()'& #&$'$'($&'')/&& )' )&'$( >1'&'$+ %| SX|$=$(()GXj&)) ,,$'&'| /| ) 25 ;& '' M| ;r} KQ|  | 5Og|!; l5 Q43/73333/73333?'333333-&/()&3+''337)&|&+(')X**&'3++| 2|]a| ''(' $+$'0+ R'1$Dp}'Zz 7H ,|#* ') @2 #' %*$&@ %| i}%6<1;-|7`W|;?t}-,+WW1FWWW+$08WWWWWWWWWWWWWWWWW[[U.WU.WU.WU.WU.$";
h$upperRanges = "| MW|!9Q0f <& (& 8' #)'$&('+&()'& #&$'$'($&)0'&& )' )&'$( >1'&'$+ %|&I$(@$)$&D4j&)) ,,&$''| /| ) 14 <' '' L6p|a5p|l9 l4 Q433/73333/9 $23S333333-9-9+;-9-|%l*()')'(-/ $+'+7'-| B|[]| '| +$)' $+$'2) R3$}']2 7H ,|#* '( ?6 #' %+$&@ %}%OXW|;/t}-,GWWWWWW$''&''+2WWW'*'30Y'*,$)1YWWWWWWWWWWW`UfUfUfUfUf%";
h$alphaRanges = "| MW/W| '6*,Qa|*2+;?-1$|!q-&'+3$)$J| o|#*3|#Q5p'0r| YY-)| #zj'|!4$A'1'7)'B$`^|! 9Rf5'+,O+4(PU|#l| 5)F07A10-3'''O0$)+)B<'(?'I/+''O0&&&b+$I)C5(N0&,)F@'j3'''O0&,)_'(AD$/))*)'$&)')));O| 03(P6,)V'/'j3(P6,)c$'A'G3(u'BD'S/-G)S4$'1| =| )&;1| ='$''$'.+0( #''*&5&-$M'h| F3kY-|!UzKB/++)('1)+=;Dp7z$)|'?*'1$*'v*'f*'1$*'A| :*'| OnCC| t;|-j'EV-| `M=*?G?G?=(A| 1j*| N| z3v$-| U7^| /`'-9|  M1| 9Q5| 3| n|!(| 'E1| 7`='CpWlv)7l|!E+*?|$;| I|&3'/'p'/'3 $a'| 30$))0)+'/+=-)0|!W<B=|!9*&7$)-/ $+8'+--+| 0'|[[| '| &|!y/+Ep7| 55BQ510000000| j|*H'x--'+| v/)|!!*-v)|!+EY| 3C|+E} X;| ^}%/A| 1|9t| O| %'|& )C7'K| 'CU3| U| +5'|!='+&?7| j3(*P^| 1?| -| E/)>[7QU^1| '[| (vQ)2KQ),| )$)''-'$R)j/'/'/510|#7j^}!e;;Q+| +}!'n|&d'| E'|!Cp1;--$7<,$&&|!Ff|()G| I'| 5t;|!W-|#!lW/W9|! )/'/'/')j;VH&@'?h|!f|(^^)| +| 'bEE2| 5`'l+3| )|#Q|39/'$|  &)&Q|#jO7W|$G@+(X|  ^|!v| 57O7I|#/| [|55| 3| `| #|x-|3S|hO|7l}#8j|,^}$Dz'}!8h| t| V&'&''+:$0| J*'30Z*,$)1|'T'UTaTaTaTaT2}!Pd}*Q/v} !59|$x}$#I|,'";
h$toLowerMapping = "| K Wb|!9 Qb!1bf  9#  !|$F  ## &'  (# &'  8#  !|!_# # #)  !|$^# ! # ! |$U !# '|$S&'  !| f|$M !|$O# ! |$S !|$W  !|$`|$[&)  !|$`|$d ! |$f $#  !|$n# ! |$n'  !#  !|$n#!'|$l ##  !|$p#) &1  !%# ! % !#  !%# ) #'  )# &'  !%# ! # ! |!. !| 6# 4 # ! |!q * #1  !}![r# ! |#X}%=]'  !#  !|$>| Q !| U# % #|&I  !# &) &A  !n )l ! | G!'| E!Eb!5bj B3  ,# &- |!]'  !#  !.#' )|!qC| hdb| )  1# &5  <#  !?# ' #'  L# &7 p| '|a5 p} hG|l9  l# &5  !} p4  P# &5 303 /07 303 303 /09  $0 @3 30S 303 303 303 '0'| ZD9 +| sD9 '0'|!4; '0'|!L<9 '|!m'|!iD|&Y }#a()  !}!&:}!#V/ | 8| # CAI &|23 WU|Ht | '| '| +  !#  !}!Zc|ue}%:e'  $#  !}![R}!Zo !}![X}![V ! #' &3 '}!]> R# &3  !# &}']3  7# &I  ,# &|#+  '# &)  ?# &7  ##  !}(b.# % #+  !# }4p*' &A  %# &}%OY Wb|;/ tr#0}'wA ";
h$toUpperMapping = "|!1 Wa| = |A$x Qa!1a !|!`  9!  !|%.  #! $'  (! $'  7! $'  #!  !!|&]|(_'  !! $' $) $- $' |$>)  !!|#Y) |%i'  #! $' $+ $' $)  !! $' $)  !! |!N-  !!$ ! ! !$  !!$ ) ! !| e  )! $'  !!$ ! !)  4! $)  )! $3 $' '}!]? ! !+  %!  !!}![Y !}![S}![W !|$]|$T!'|$R ! |$L ! |$N+ |)*'  !|$V }4p,'  !|$Z|$_ ! }!Zd)  !|$_  !}!Zp|$c' |)N1 }%:g' |)_' |)_+  !|$m| P'|$k|#.- |)c|#z |#ez  !! $) $) )|!r| % | _)k!Ea| B5a|!m'| D ! | B|!P)  !| $| 2 !0  ,!  !!| s !| g/' |$8' $' $| 1 daC| g 2 !5  ;! $'  '!  !!> M !| ; p| &} N7 }1H>) } pP|!v  l! $- |!X-  P! $313 /17 313 313 /19  $1 B3 313 '| [+| t'|!5'|!n'|!M'|!j' 313 313 313 '1 ! 37 }#R4+ F; '1? '1) >= F|'b | 6f C@+ $|2f WT|IE | '| &' $)  !}![q}![k $ !/ $' $7  R! $3  !! $E p} hF}'Zz  7! $I  ,! $|#+  '! $)  ?! $7  !! $'  %! $+ $+ $A  %! $}%P= Wa|;? tq#0}'vt ";
h$catMapping = "d;P)3J)3 !/0 !34 !3.'37*'3)4'3W! !/3 !06 !-6W# !/4 !04f; !83+5'7 !67 !#1 !4< !76 !74', !6# !73 !6, !#2),FQ!H1!S#H3# <!#$'# (!#$'# 8!#'! ##!)#'! !#!&'!&)!'#+!&'!&)!)#'!&'! ##!&'! !#!'# !!#'!&)! !#!&'!'# !&!)#+& !!$ !#! !$# !!$ )#!'# )!#$'# !!$ !#!&)! >#!1#'!&'!'# !!#+! %#!| S#,Y#G%+6;%?6-%16 !%6*E6|!O' #!# !%6 !!#' *)#F- '6 !!3)! ! !!'!&E!!5!j#$'#)!)# ,!#$-# !!# !4!&'!'#| /!| )# 2!#N-'') <!#'! '#!'# M!#5 p!' */3!r# ! 3</ | #' !.'F''F'' !3'3 Y&- )&'39 +<' )4'3J'3'79'F' '3d&*7&M'7*+3'&.|!5& !3&1' !<7/''%''N+''&7*)&'7,?3 ! < !&'`&Y'' |! &9',? 7*f&5''%N)3*- O&+'*5'*)'*-'' A3!U&)'' F|#W )'0| 5& !'( !'&)(3'+(.'(,1'7&'''37* !3%/&!1& ! ''(!3&' '&' O&!1& ! &) +&'  !'&)(+'' '(' '( !'&3 0+ '&!)&''' 7*'&'5/, !75- '' !( /&+ '&' O&!1&!'&!'&!'&'  !' )(''+ ''' )') .1 +& ! &1 7*'')&.9 '' !( 5&!)&!O&!1&!'&!-&'  !'&)(-'!'' !( '(.' ,A '&''' 7* ! 5A .'(!3&' '&' O&!1&!'&!-&'  !'& !('0+'' '(' '(.3  !'(+ '&!)&''' 7* !7&/,7  !'&!/&) )&!+&) '& ! &!'&) '&) )&) ;&+ '(.'() )(!)(.' ,/ 0? 7*),/7 !57/ )(!3&!)&!Q&!7&!-&) ,)'+(!)'!+'1 ''!'&/ '&''' 7*3 1,N' '(!3&!)&!Q&!7&!-&'  !'& !('-( ! ''(!'(''1 '(1  !& '&''' 7*!'&A '(!3&!)&!v&' ,)(+'!)(!)( !'&3 03 '&''' 7*/,) N/&' '(!G&) S&!5& ! &' 1&) .+ )()' ! '!3(G '(F; | )&.'&1'+ J/&*3'F7*'3n '& ! &' '& ! &' ,/ +&!1&!)& # &' '&!+&.'&/'!'',' -& ! %!/'' 7*' '&h ,)7A3-7''/77*7, $7' #/0'(3&!l&+ ?'0-'F''-&9'!l'!37./7!'7-3+7'3n z&'(+'0/'0'''('',7*/3/&'(''+&)',)('&1()&+'=&.'(''/( !'&07*)(.'7p!7 z& !3%) |'?&!+&' 1& ! &!+&' v&!+&' f&!+&' 1& ! &!+&' A&!| ;&!+&' | O&' )'N33K,) C&77/ | t&9 <|-j&'3E&PW& !/0) | `&)3)+A =&!+&)'9 G&)''35 G&''; =&!)&!''; | 1&'<01'3(.'(9')3*)3 !5&.' 7*/ 7,/ /3<+3)' !8 7*/ j&*| 1&3 v& !'&- | U&7 ^&) )'+('')(+ '(./()'+ N) '37*`&' -&9 |  &+ E(1&'(/ 7*8) h7Q&'')(' '3| 3& !('01' ! ' !(''(3'/(7'' .7*/ 7*/ 13*/3| n +'0| '& !'(-' !('-(.'(1&+ 7*13775'57) ''0`&0+''(''0) '&7*/ p& !'('')( !'()''(3 +3l&3(3''('') -37*) )&7*`&/%'3| j )'F='01'+&.+&0= |  #| 5%O#*h#n%r'M +' l!#$5# Q!#$5#3!/#' /!' 3#3!3#3!/#' /!' 3# % !3#3!?#' 3#3$3#3$3#3$-#!'#+! !$6&)6)#!'#+!()6+#' '#+!!)63#-!)6' )#!'#+!('6!98-</.'3 !12>'1 !2/B33 !9:-<P53 !12+3'-)3 !4/@93 !43:73P-<- /< !,%' /,)4 !/0*7,)4 !/0!=%) W5O ='+).));'A '7$+7$'7&)!'#)! !#7$'7H-!/7 $!7+! !7#+!&+&&'7'#'!-4$+# !74'7 !#7C,j+ !!#++8/ -4-7'4+7H'7H'7H17Hb7'4'7 !47Hb7|%z437+4K7'417 !/0| l7H`7U4t7/4G7; r7U 97M | A,| f7O,|$)7H57H| 5734|!M7H|#57!|!=7 (/0`,|  7-4 !/0+4 ! 4!S4 &/0C4|%b7|!v4 ,/0| G4 #/0d4 !/0|%f4| )7M4'7/4) 77|#b | '!!| '# ! !&)!'# $!#+! !#!'#$1#*)! R#!'#/7 #!#)'1 +38'3p#7 | 5&5  !%3? .Q&5 1&!1&!1&!1&!1&!1&!1&!1&!d''3 #12)3 !12 !31D53<'3 !.3 !12'3 !12 %/0-3*'3| f W7!|! 7; |$h7W ;7+ P)3 !7% !&+ &/0'7 %/0 !./'0N5+/'<-%'7)+ !%&F'7!| v&' '''6'% !&.|!#&F)%,- v&) |!+&!'7+,77Y&- l7; C&b7!7,r7A,d77,r7A,| G7!|%b7} X;&7 | I7}%/A&| 1 M&*|9G&) | 775 t&/%'3|%z&*)3C&7*'&K  8!# !&'))F3 '' !3% -!#3 | U&7+''/33 Q65%'6 '!#$)# @!#*3# #!#'! %#! !#%'6 #!# ! !&?  &!#| j &1&.)&.+&.Q&'(''0+7+ /,'7 !57/ | 1&+33 '(| -&C(.5 '37*/ G'/&)3,+ 7*[&3''3Q&9''(9 F^&) )'0| '&.'(+''(.+(=3 ! %7*+ '3d v&/''('''(''5 )&.3& !'(' 7*' +3C&*/&)7 !&(+ | )& !'&)''&''-&'' !&',S '&*'3f /&' /&' /&5 1&!1&|#7 j&'(.'(.'( !3(.' 7*/ }!e;&; Q&+ | +&+ |MQ=} T7 |&d&' | E&' |!C&p 1#; -#-  !&'7&H=&!-& ! &!'&!'&!|!G&C6E |()& !/0C | I&' | 5&t ;& !57' C'13 !/0F/ 1'5 F'.'- )/0'3 !/0+3)-)3!+3 !./ #0/@)3 !4.)4 ! 3J'3+ -&!|##&'  !< )3J)3 !/0 !34 !3.'37*'3)4'3W! !/3 !06 !-6W# !/4 !04 !/0 !3/@'37&*| #&'%b&) /&' /&' /&' )&) '5 !46N'5 ! 7+4'77 )<'7' ;&!W&!I&!'&!A&' ?&h |!f&- '3N+ | #,) 57| 3++,E78- ;7| 1 | #7.|!t ^&) | +&| ' b&!+,; E&63&6| 3 `& ! 3l&+ 3&F-+x t!t#| f&' 7*|3  /&'  !& |  &!'&) ,' Q& ! 33,|#U O&/,) FW&- F|$; ,)'!''- +'+&!)&!Y&+ )'+ .3,3 531 ^&',F|!p | 5&) 13O&' 3,I&- 3,|!p | [&|+t b,|(U  !('0| 3&A'13+ K,7*C ''0| #&)(+''('''3X+3|wd |3S&|#7 |!5+= +3|bb |7l&}#8j |,^&}$Dz '&}!!# |%M77 r7' | A7'()')7/(3<3''71'`7+'| )7h | M7)'N|$/ | x75 G,|#1 W!W#W!1#!G#W!W# !! '!' $' '!' +!!3!+# ! #!1#!9#W!W#'!!+!' 3!!1!!W#'!!+!!-! ! !) 1!!W#W!W#W!W#W!W#W!W#W!W#W![#' U!HU#H/#U!HU#H/#U!HU#H/#U!HU#H/#U!HU#H/# !!#' | -*} NS |  7+ |!77; A7' ?7' A7!A7d 9,- b7!| =7/ z7| ` ^7= z7- 571 '7|#r f7A /7!| U7) K7; n7!-7M E7A | G7 ! 7!|$'7!+7) | E7G S7|#; -7!C7!)7 $ 7!)7!/7' +7 ! 7' +7!;7+ 97| ) | U7| = |!W7|P[ }*Q/&v } !5&9 |$x&}$#I |,'&#,|0e X` |!/<|!p |%A'}PF' ";
function h$str(s) {
  var enc = null;
  return function() {
    if(enc === null) {
      enc = h$encodeUtf8(s);
    }
    return enc;
  }
}
function h$rstr(d) {
  var enc = null;
  return function() {
    if(enc === null) {
      enc = h$rawStringData(d);
    }
    return enc;
  }
}
function h$strt(str) { return h$c1(h$lazy_e, function() { return h$toHsString(str); }); }
function h$strta(str) { return h$c1(h$lazy_e, function() { return h$toHsStringA(str); }); }
function h$strtb(arr) { return h$c1(h$lazy_e, function() { return h$toHsStringMU8(arr); }); }
function h$ustra(str) { return h$toHsStringA(str); }
function h$ustr(str) { return h$toHsString(str); }
function h$urstra(arr) { return h$toHsList(arr); }
function h$urstr(arr) { return h$toHsStringMU8(arr); }
function h$caseMapping(x) {
    return (x%2)?-((x+1)>>1):(x>>1);
}
var h$toUpper = null;
function h$u_towupper(ch) {
    if(h$toUpper == null) { h$toUpper = h$decodeMapping(h$toUpperMapping, h$caseMapping); }
    return ch+(h$toUpper[ch]|0);
}
var h$toLower = null;
function h$u_towlower(ch) {
    if(h$toLower == null) { h$toLower = h$decodeMapping(h$toLowerMapping, h$caseMapping); }
    return ch+(h$toLower[ch]|0);
}
var h$alpha = null;
function h$u_iswalpha(a) {
    if(h$alpha == null) { h$alpha = h$decodeRLE(h$alphaRanges); }
    return h$alpha[a]|0;
}
var h$alnum = null;
function h$u_iswalnum(a) {
  if(h$alnum == null) { h$alnum = h$decodeRLE(h$alnumRanges); }
  return h$alnum[a] == 1 ? 1 : 0;
}
function h$u_iswspace(a) {
    return '\t\n\v\f\r \u0020\u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000'
        .indexOf(String.fromCharCode(a)) !== -1 ? 1 : 0;
}
var h$lower = null;
function h$u_iswlower(a) {
    if(h$lower == null) { h$lower = h$decodeRLE(h$lowerRanges); }
    return h$lower[a]|0;
}
var h$upper = null;
function h$u_iswupper(a) {
    if(h$upper == null) { h$upper = h$decodeRLE(h$upperRanges); }
    return h$upper[a]|0;
}
var h$cntrl = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159];
function h$u_iswcntrl(a) {
  return (h$cntrl.indexOf(a) !== -1) ? 1 : 0;
}
var h$print = null;
function h$u_iswprint(a) {
    if(h$print == null) { h$print = h$decodeRLE(h$printRanges); }
    return h$print[a]|0;
}
function h$decodePacked(s) {
    function f(o) {
        var c = s.charCodeAt(o);
        return c<34?c-32:c<92?c-33:c-34;
    }
    var r=[], i=0;
    while(i < s.length) {
        var c = s.charCodeAt(i);
        if(c < 124) r.push(f(i++));
        else if(c === 124) {
            i += 3; r.push(90+90*f(i-2)+f(i-1));
        } else if(c === 125) {
            i += 4;
            r.push(8190+8100*f(i-3)+90*f(i-2)+f(i-1));
        } else throw ("h$decodePacked: invalid: " + c);
    }
    return r;
}
function h$decodeRLE(str) {
    var r = [], x = 0, i = 0, j = 0, v, k, a = h$decodePacked(str);
    while(i < a.length) {
        v = a[i++];
        if(v === 0) {
            k = a[i++];
            while(k--) {
                r[j++] = x;
                r[j++] = 1-x;
            }
        } else {
            if(v <= 2) {
                k = (a[i]<<16)+a[i+1];
                i+=2;
            } else k = (v-1)>>1;
            if(v%2) {
                r[j++] = x;
                x = 1-x;
            }
            if(x) while(k--) r[j++] = x; else j+=k;
            x = 1-x;
        }
    }
    r.shift();
    return r;
}
function h$decodeMapping(str, f) {
    var r = [], i = 0, j = 0, k, v, v2, a = h$decodePacked(str);
    while(i < a.length) {
        v = a[i++];
        if(v === 0) {
            k = a[i];
            v = f(a[i+1]);
            v2 = f(a[i+2]);
            while(k--) {
                r[j++] = v;
                r[j++] = v2;
            }
            i+=3;
        } else {
            if(v === 2) {
                k = (a[i] << 16) + a[i+1];
                v = a[i+2];
                i += 3;
            } else if(v%2) {
                k = 1;
                v = v>>1;
            } else {
                k = (v>>1)-1;
                v = a[i++];
            }
            v = f(v);
            if(v) while(k--) r[j++] = v; else j+=k;
        }
    }
    return r;
}
var h$unicodeCat = null;
function h$u_gencat(a) {
    if(h$unicodeCat == null) h$unicodeCat = h$decodeMapping(h$catMapping, function(x) { return x; });
    if(a >= 0xE000 && a <= 0xF8FF || a >= 0xF0000 & a <= 0xFFFFD || a >= 0x100000 && a <= 0x10FFFD) return 28;
    var c = h$unicodeCat[a]|0;
    return c?c-1:29;
}
function h$localeEncoding() {
   h$ret1 = 0;
   return h$encodeUtf8("UTF-8");
}
function h$rawStringData(str) {
    var v = h$newByteArray(str.length+1);
    var u8 = v.u8;
    for(var i=0;i<str.length;i++) {
       u8[i] = str[i];
    }
    u8[str.length] = 0;
    return v;
}
function h$encodeUtf8(str) {
  var i, low;
  var n = 0;
  for(i=0;i<str.length;i++) {
    var c = str.charCodeAt(i);
    if (0xD800 <= c && c <= 0xDBFF) {
      low = str.charCodeAt(i+1);
      c = ((c - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
      i++;
    }
    if(c <= 0x7F) {
      n++;
    } else if(c <= 0x7FF) {
      n+=2;
    } else if(c <= 0xFFFF) {
      n+=3;
    } else if(c <= 0x1FFFFF) {
      n+=4;
    } else if(c <= 0x3FFFFFF) {
      n+=5;
    } else {
      n+=6;
    }
  }
  var v = h$newByteArray(n+1);
  var u8 = v.u8;
  n = 0;
  for(i=0;i<str.length;i++) {
    var c = str.charCodeAt(i);
    if (0xD800 <= c && c <= 0xDBFF) {
      low = str.charCodeAt(i+1);
      c = ((c - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
      i++;
    }
    if(c <= 0x7F) {
      u8[n] = c;
      n++;
    } else if(c <= 0x7FF) {
      u8[n] = (c >> 6) | 0xC0;
      u8[n+1] = (c & 0x3F) | 0x80;
      n+=2;
    } else if(c <= 0xFFFF) {
      u8[n] = (c >> 12) | 0xE0;
      u8[n+1] = ((c >> 6) & 0x3F) | 0x80;
      u8[n+2] = (c & 0x3F) | 0x80;
      n+=3;
    } else if(c <= 0x1FFFFF) {
      u8[n] = (c >> 18) | 0xF0;
      u8[n+1] = ((c >> 12) & 0x3F) | 0x80;
      u8[n+2] = ((c >> 6) & 0x3F) | 0x80;
      u8[n+3] = (c & 0x3F) | 0x80;
      n+=4;
    } else if(c <= 0x3FFFFFF) {
      u8[n] = (c >> 24) | 0xF8;
      u8[n+1] = ((c >> 18) & 0x3F) | 0x80;
      u8[n+2] = ((c >> 12) & 0x3F) | 0x80;
      u8[n+3] = ((c >> 6) & 0x3F) | 0x80;
      u8[n+4] = (c & 0x3F) | 0x80;
      n+=5;
    } else {
      u8[n] = (c >>> 30) | 0xFC;
      u8[n+1] = ((c >> 24) & 0x3F) | 0x80;
      u8[n+2] = ((c >> 18) & 0x3F) | 0x80;
      u8[n+3] = ((c >> 12) & 0x3F) | 0x80;
      u8[n+4] = ((c >> 6) & 0x3F) | 0x80;
      u8[n+5] = (c & 0x3F) | 0x80;
      n+=6;
    }
  }
  u8[v.len-1] = 0;
  return v;
}
function h$encodeUtf16(str) {
  var n = 0;
  var i;
  for(i=0;i<str.length;i++) {
    var c = str.charCodeAt(i);
    if(c <= 0xFFFF) {
      n += 2;
    } else {
      n += 4;
    }
  }
  var v = h$newByteArray(n+1);
  var dv = v.dv;
  n = 0;
  for(i=0;i<str.length;i++) {
    var c = str.charCodeAt(i);
    if(c <= 0xFFFF) {
      dv.setUint16(n, c, true);
      n+=2;
    } else {
      var c0 = c - 0x10000;
      dv.setUint16(n, c0 >> 10, true);
      dv.setUint16(n+2, c0 & 0x3FF, true);
      n+=4;
    }
  }
  dv.setUint8(v.len-1,0);
  return v;
}
function h$fromStr(s) {
  var l = s.length;
  var b = h$newByteArray(l * 2);
  var dv = b.dv;
  for(var i=l-1;i>=0;i--) {
    dv.setUint16(i<<1, s.charCodeAt(i), true);
  }
  h$ret1 = l;
  return b;
}
function h$toStr(b,o,l) {
  var a = [];
  var end = 2*(o+l);
  var k = 0;
  var dv = b.dv;
  for(var i=2*o;i<end;i+=2) {
    var cc = dv.getUint16(i,true);
    a[k++] = cc;
  }
  return String.fromCharCode.apply(this, a);
}
function h$decodeUtf16l(v, byteLen, start) {
  var a = [];
  for(var i=0;i<byteLen;i+=2) {
    a[i>>1] = v.dv.getUint16(i+start,true);
  }
  return String.fromCharCode.apply(this, a);
}
var h$dU16 = h$decodeUtf16;
function h$decodeUtf8z(v,start) {
  var n = start;
  var max = v.len;
  while(n < max) {
    if(v.u8[n] === 0) { break; }
    n++;
  }
  return h$decodeUtf8(v,n,start);
}
function h$decodeUtf8(v,n0,start) {
  var n = n0 || v.len;
  var arr = [];
  var i = start || 0;
  var code;
  var u8 = v.u8;
  while(i < n) {
    var c = u8[i];
    while((c & 0xC0) === 0x80) {
      c = u8[++i];
    }
    if((c & 0x80) === 0) {
      code = (c & 0x7F);
      i++;
    } else if((c & 0xE0) === 0xC0) {
      code = ( ((c & 0x1F) << 6)
             | (u8[i+1] & 0x3F)
             );
      i+=2;
    } else if((c & 0xF0) === 0xE0) {
      code = ( ((c & 0x0F) << 12)
             | ((u8[i+1] & 0x3F) << 6)
             | (u8[i+2] & 0x3F)
             );
      i+=3;
    } else if ((c & 0xF8) === 0xF0) {
      code = ( ((c & 0x07) << 18)
             | ((u8[i+1] & 0x3F) << 12)
             | ((u8[i+2] & 0x3F) << 6)
             | (u8[i+3] & 0x3F)
             );
      i+=4;
    } else if((c & 0xFC) === 0xF8) {
      code = ( ((c & 0x03) << 24)
             | ((u8[i+1] & 0x3F) << 18)
             | ((u8[i+2] & 0x3F) << 12)
             | ((u8[i+3] & 0x3F) << 6)
             | (u8[i+4] & 0x3F)
             );
      i+=5;
    } else {
      code = ( ((c & 0x01) << 30)
             | ((u8[i+1] & 0x3F) << 24)
             | ((u8[i+2] & 0x3F) << 18)
             | ((u8[i+3] & 0x3F) << 12)
             | ((u8[i+4] & 0x3F) << 6)
             | (u8[i+5] & 0x3F)
             );
      i+=6;
    }
    if(code > 0xFFFF) {
      var offset = code - 0x10000;
      arr.push(0xD800 + (offset >> 10), 0xDC00 + (offset & 0x3FF));
    } else {
      arr.push(code);
    }
  }
  return String.fromCharCode.apply(this, arr);
}
function h$decodeUtf16(v) {
  var n = v.len;
  var arr = [];
  var dv = v.dv;
  for(var i=0;i<n;i+=2) {
    arr.push(dv.getUint16(i,true));
  }
  return String.fromCharCode.apply(this, arr);
}
function h$hs_iconv_open(to,to_off,from,from_off) {
  h$errno = h$EINVAL;
  return -1;
}
function h$hs_iconv_close(iconv) {
  return 0;
}
function h$derefPtrA(ptr, ptr_off) {
  return ptr.arr[ptr_off][0];
}
function h$derefPtrO(ptr, ptr_off) {
  return ptr.arr[ptr_off][1];
}
function h$readPtrPtrU32(ptr, ptr_off, x, y) {
  x = x || 0;
  y = y || 0;
  var arr = ptr.arr[ptr_off + 4 * x];
  return arr[0].dv.getInt32(arr[1] + 4 * y, true);
}
function h$readPtrPtrU8(ptr, ptr_off, x, y) {
  x = x || 0;
  y = y || 0;
  var arr = ptr.arr[ptr_off + 4 * x];
  return arr[0].dv.getUint8(arr[1] + y);
}
function h$writePtrPtrU32(ptr, ptr_off, v, x, y) {
  x = x || 0;
  y = y || 0;
  var arr = ptr.arr[ptr_off + 4 * x];
  arr[0].dv.putInt32(arr[1] + y, v);
}
function h$writePtrPtrU8(ptr, ptr_off, v, x, y) {
  x = x || 0;
  y = y || 0;
  var arr = ptr.arr[ptr_off+ 4 * x];
  arr[0].dv.putUint8(arr[1] + y, v);
}
function h$toHsString(str) {
  if(typeof str !== 'string') return h$ghczmprimZCGHCziTypesziZMZN;
  var i = str.length - 1;
  var r = h$ghczmprimZCGHCziTypesziZMZN;
  while(i>=0) {
    var cp = str.charCodeAt(i);
    if(cp >= 0xDC00 && cp <= 0xDFFF && i > 0) {
      --i;
      cp = (cp - 0xDC00) + (str.charCodeAt(i) - 0xD800) * 1024 + 0x10000;
    }
    r = h$c2(h$ghczmprimZCGHCziTypesziZC_con_e, cp, r);
    --i;
  }
  return r;
}
function h$fromHsString(str) {
    var xs = '';
    while(str.f.a === 2) {
        if(typeof str.d1 === 'number') {
            xs += String.fromCharCode(str.d1);
        } else {
            xs += String.fromCharCode(str.d1.d1);
        }
        str = str.d2;
    }
    return xs;
}
function h$fromHsListJSRef(xs) {
    var arr = [];
    while(xs.f.a === 2) {
        arr.push(xs.d1.d1);
        xs = xs.d2;
    }
    return arr;
}
function h$toHsStringA(str) {
  if(typeof str !== 'string') return h$ghczmprimZCGHCziTypesziZMZN;
  var i = str.length - 1;
  var r = h$ghczmprimZCGHCziTypesziZMZN;
  while(i>=0) {
    r = h$c2(h$ghczmprimZCGHCziTypesziZC_con_e, str.charCodeAt(i), r);
    --i;
  }
  return r;
}
function h$toHsStringMU8(arr) {
    var accept = false, b, n = 0, cp = 0, r = h$ghczmprimZCGHCziTypesziZMZN, i = arr.length - 1;
    while(i >= 0) {
        b = arr[i];
        if(!(b & 128)) {
            cp = b;
            accept = true;
        } else if((b & 192) === 128) {
            cp += (b & 32) * Math.pow(64, n)
        } else {
            cp += (b&((1<<(6-n))-1)) * Math.pow(64, n);
            accept = true;
        }
        if(accept) {
            r = h$c2(h$ghczmprimZCGHCziTypesziZC_con_e, cp, r);
            cp = 0
            n = 0;
        } else {
            n++;
        }
        accept = false;
        i--;
    }
    return r;
}
function h$toHsList(arr) {
  var r = h$ghczmprimZCGHCziTypesziZMZN;
  for(var i=arr.length-1;i>=0;i--) {
    r = h$c2(h$ghczmprimZCGHCziTypesziZC_con_e, arr[i], r);
  }
  return r;
}
function h$toHsListJSRef(arr) {
    var r = h$ghczmprimZCGHCziTypesziZMZN;
    for(var i=arr.length-1;i>=0;i--) {
        r = h$c2(h$ghczmprimZCGHCziTypesziZC_con_e, h$mkJSRef(arr[i]), r);
    }
    return r;
}
function h$appendToHsStringA(str, appendTo) {
  var i = str.length - 1;
  var r = appendTo;
  while(i>=0) {
    r = h$c2(h$ghczmprimZCGHCziTypesziZC_con_e, str.charCodeAt(i), r);
    --i;
  }
  return r;
}
function h$throwJSException(e) {
  var jsE = h$c2(h$ghcjszmprimZCGHCJSziPrimziJSException_con_e,e,h$toHsString(e.toString()));
  var someE = h$c2(h$baseZCGHCziExceptionziSomeException_con_e,
     h$ghcjszmprimZCGHCJSziPrimzizdfExceptionJSException, jsE);
  return h$throw(someE, true);
}
var h$bigZero = h$nbv(0);
var h$bigOne = h$nbv(1);
var h$bigCache = [];
(function() {
  for(var i=0;i<=100;i++) {
    h$bigCache.push(h$nbv(i));
  }
})();
function h$bigFromInt(v) {
  ;
  var v0 = v|0;
  if(v0 >= 0) {
    if(v0 <= 100) {
      return h$bigCache[v0];
    } else if(v0 < 268435456) {
      return h$nbv(v0);
    }
    var r1 = h$nbv(v0 >>> 16);
    var r2 = h$nbi();
    r1.lShiftTo(16,r2);
    r1.fromInt(v0 & 0xffff);
    var r3 = r1.or(r2);
    ;
    return r3;
  } else {
    v0 = -v0;
    if(v0 < 268435456) {
      return h$nbv(v0).negate();
    }
    var r1 = h$nbv(v0 >>> 16);
    var r2 = h$nbi();
    r1.lShiftTo(16,r2);
    r1.fromInt(v0 & 0xffff);
    var r3 = r1.or(r2);
    BigInteger.ZERO.subTo(r3,r2);
    ;
    return r2;
  }
}
function h$bigFromWord(v) {
  var v0 = v|0;
  if(v0 >= 0) {
    if(v0 <= 100) {
      return h$bigCache[v0];
    } else if(v0 < 268435456) {
      return h$nbv(v0);
    }
  }
  var r1 = h$nbv(v0 >>> 16);
  var r2 = h$nbv(0);
  r1.lShiftTo(16,r2);
  r1.fromInt(v0 & 0xffff);
  return r1.or(r2);
}
function h$bigFromInt64(v1,v2) {
  ;
  var v10 = v1|0;
  var v20 = v2|0;
  var r = new BigInteger([ v10 >> 24, (v10 & 0xff0000) >> 16, (v10 & 0xff00) >> 8, v10 & 0xff
                         , v20 >>> 24, (v20 & 0xff0000) >> 16, (v20 & 0xff00) >> 8, v20 & 0xff
                         ]);
  ;
  return r;
}
function h$bigFromWord64(v1,v2) {
  ;
  var v10 = v1|0;
  var v20 = v2|0;
  var arr = [ 0, v10 >>> 24, (v10 & 0xff0000) >> 16, (v10 & 0xff00) >> 8, v10 & 0xff
                         , v20 >>> 24, (v20 & 0xff0000) >> 16, (v20 & 0xff00) >> 8, v20 & 0xff
                         ];
  ;
  var r = new BigInteger([ 0, v10 >>> 24, (v10 & 0xff0000) >> 16, (v10 & 0xff00) >> 8, v10 & 0xff
                         , v20 >>> 24, (v20 & 0xff0000) >> 16, (v20 & 0xff00) >> 8, v20 & 0xff
                         ]);
  ;
  return r;
}
function h$bigFromNumber(n) {
  var ra = [];
  var s = 0;
  if(n < 0) {
    n = -n;
    s = -1;
  }
  var b = 1;
  while(n >= b) {
    ra.unshift((n/b)&0xff);
    b *= 256;
  }
  ra.unshift(s);
  return new BigInteger(ra);
}
function h$encodeNumber(big,e) {
  var m = Math.pow(2,e);
  if(m === Infinity) {
    switch(big.signum()) {
      case 1: return Infinity;
      case 0: return 0;
      default: return -Infinity;
    }
  }
  var b = big.toByteArray();
  var l = b.length;
  var r = 0;
  ;
  for(var i=l-1;i>=1;i--) {
  ;
    r += m * Math.pow(2,(l-i-1)*8) * (b[i] & 0xff);
    ;
  }
  if(b[0] != 0) {
    r += m * Math.pow(2,(l-1)*8) * b[0];
  }
  ;
  return r;
}
function h$integer_cmm_cmpIntegerzh(sa, abits, sb, bbits) {
  ;
  var c = abits.compareTo(bbits);
  return c == 0 ? 0 : c > 0 ? 1 : -1;
}
function h$integer_cmm_cmpIntegerIntzh(sa, abits, b) {
  ;
  var c = abits.compareTo(h$bigFromInt(b));
  return c == 0 ? 0 : c > 0 ? 1 : -1;
}
function h$integer_cmm_plusIntegerzh(sa, abits, sb, bbits) {
    ;
    return abits.add(bbits);
}
function h$integer_cmm_plusIntegerIntzh(sa, abits, b) {
  ;
  return abits.add(h$bigFromInt(b));
}
function h$integer_cmm_minusIntegerzh(sa, abits, sb, bbits) {
    ;
    return abits.subtract(bbits);
}
function h$integer_cmm_minusIntegerIntzh(sa, abits, b) {
   ;
   return abits.subtract(h$bigFromInt(b));
}
function h$integer_cmm_timesIntegerzh(sa, abits, sb, bbits) {
    ;
    return abits.multiply(bbits);
}
function h$integer_cmm_timesIntegerIntzh(sa, abits, b) {
  ;
  return abits.multiply(h$bigFromInt(b));
}
function h$integer_cmm_quotRemIntegerzh(sa, abits, sb, bbits) {
    ;
    var q = abits.divide(bbits);
    ;
    var r = abits.subtract(q.multiply(bbits));
    ;
    h$ret1 = r;
    return q;
}
function h$integer_cmm_quotRemIntegerWordzh(sa, abits, b) {
    var bbits = h$bigFromWord(b);
    ;
    var q = abits.divide(bbits);
    h$ret1 = abits.subtract(q.multiply(bbits));
    return q;
}
function h$integer_cmm_quotIntegerzh(sa, abits, sb, bbits) {
    ;
    return abits.divide(bbits);
}
function h$integer_cmm_quotIntegerWordzh(sa, abits, b) {
    ;
    return abits.divide(h$bigFromWord(b));
}
function h$integer_cmm_remIntegerzh(sa, abits, sb, bbits) {
    ;
    return abits.subtract(bbits.multiply(abits.divide(bbits)));
}
function h$integer_cmm_remIntegerWordzh(sa, abits, b) {
    ;
    var bbits = h$bigFromWord(b);
    return abits.subtract(bbits.multiply(abits.divide(bbits)));
}
function h$integer_cmm_divModIntegerzh(sa, abits, sb, bbits) {
    ;
    var d = abits.divide(bbits);
    var m = abits.subtract(d.multiply(bbits));
    if(abits.signum()!==bbits.signum() && m.signum() !== 0) {
        d = d.subtract(h$bigOne);
        m.addTo(bbits, m);
    }
    h$ret1 = m;
    return d;
}
function h$integer_cmm_divModIntegerWordzh(sa, abits, b) {
    ;
    return h$integer_cmm_divModIntegerzh(sa, abits, 0, h$bigFromWord(b));
}
function h$integer_cmm_divIntegerzh(sa, abits, sb, bbits) {
    ;
    var d = abits.divide(bbits);
    var m = abits.subtract(d.multiply(bbits));
    if(abits.signum()!==bbits.signum() && m.signum() !== 0) {
        d = d.subtract(h$bigOne);
    }
    return d;
}
function h$integer_cmm_divIntegerWordzh(sa, abits, b) {
    ;
    return h$integer_cmm_divIntegerzh(sa, abits, 0, h$bigFromWord(b));
}
function h$integer_cmm_modIntegerzh(sa, abits, sb, bbits) {
    ;
    var d = abits.divide(bbits);
    var m = abits.subtract(d.multiply(bbits));
    if(abits.signum()!==bbits.signum() && m.signum() !== 0) {
        m.addTo(bbits, m);
    }
    return m;
}
function h$integer_cmm_modIntegerWordzh(sa, abits, b) {
    ;
    return h$integer_cmm_modIntegerzh(sa, abits, 0, h$bigFromWord(b));
}
function h$integer_cmm_divExactIntegerzh(sa, abits, sb, bbits) {
    ;
    return abits.divide(bbits);
}
function h$integer_cmm_divExactIntegerWordzh(sa, abits, b) {
    ;
    return abits.divide(h$bigFromWord(b));
}
function h$gcd(a, b) {
    var x = a.abs();
    var y = b.abs();
    var big, small;
    if(x.compareTo(y) < 0) {
        small = x;
        big = y;
    } else {
        small = y;
        big = x;
    }
    while(small.signum() !== 0) {
        var q = big.divide(small);
        var r = big.subtract(q.multiply(small));
        big = small;
        small = r;
    }
    return big;
}
function h$integer_cmm_gcdIntegerzh(sa, abits, sb, bbits) {
    ;
    return h$gcd(abits, bbits);
}
function h$integer_cmm_gcdIntegerIntzh(sa, abits, b) {
    ;
    var r = h$gcd(abits, h$bigFromInt(b));
    return r.intValue();
}
function h$integer_cmm_gcdIntzh(a, b) {
        var x = a<0 ? -a : a;
        var y = b<0 ? -b : b;
        var big, small;
        if(x<y) {
            small = x;
            big = y;
        } else {
            small = y;
            big = x;
        }
        while(small!==0) {
            var r = big % small;
            big = small;
            small = r;
        }
        return big;
}
function h$integer_cmm_powIntegerzh(sa, abits, b) {
    ;
    if(b >= 0) {
      return abits.pow(b);
    } else {
      return abits.pow(b + 2147483648);
    }
}
function h$integer_cmm_powModIntegerzh(sa, abits, sb, bbits, sc, cbits) {
    ;
    return abits.modPow(bbits, cbits);
}
function h$integer_cmm_powModSecIntegerzh(sa, abits, sb, bbits, sc, cbits) {
    ;
    return h$integer_cmm_powModIntegerzh(sa, abits, sb, bbits, sc, cbits);
}
function h$integer_cmm_recipModIntegerzh(sa, abits, sb, bbits) {
    ;
    return abits.modInverse(bbits);
}
function h$integer_cmm_nextPrimeIntegerzh(sa, abits) {
    ;
    var n = abits.add(BigInteger.ONE);
    while(true) {
      if(n.isProbablePrime(50)) return n;
      n.addTo(BigInteger.ONE, n);
    }
}
function h$integer_cmm_testPrimeIntegerzh(sa, abits, b) {
    ;
    return abits.isProbablePrime(b) ? 1 : 0;
}
function h$integer_cmm_sizeInBasezh(sa, abits, b) {
    ;
    return Math.ceil(abits.bitLength() * Math.log(2) / Math.log(b));
}
var h$oneOverLog2 = 1 / Math.log(2);
function h$integer_cmm_decodeDoublezh(x) {
    ;
    if(isNaN(x)) {
      h$ret1 = h$bigFromInt(3).shiftLeft(51).negate();
      return 972;
    }
    if( x < 0 ) {
        var result = h$integer_cmm_decodeDoublezh(-x);
        h$ret1 = h$ret1.negate();
        return result;
    }
    if(x === Number.POSITIVE_INFINITY) {
        h$ret1 = h$bigOne.shiftLeft(52);
        return 972;
    }
    var exponent = (Math.floor(Math.log(x) * h$oneOverLog2)-52)|0;
    var n;
    if(exponent < -1000) {
      n = x * Math.pow(2,-exponent-128) * Math.pow(2,128);
    } else if(exponent > 900) {
      n = x * Math.pow(2,-exponent+128) * Math.pow(2,-128);
    } else {
      n = x * Math.pow(2,-exponent);
    }
    if(Math.abs(n - Math.floor(n) - 0.5) < 0.0001) {
      exponent--;
      n *= 2;
    }
    h$ret1 = h$bigFromNumber(n);
    return exponent;
}
function h$integer_cmm_int2Integerzh(i) {
    ;
    h$ret1 = h$bigFromInt(i);
    return 0;
}
function h$integer_cmm_word2Integerzh(i) {
    ;
    h$ret1 = h$bigFromWord(i);
    return 0;
}
function h$integer_cmm_andIntegerzh(sa, abits, sb, bbits) {
    ;
    return abits.and(bbits);
}
function h$integer_cmm_orIntegerzh(sa, abits, sb, bbits) {
    ;
    return abits.or(bbits);
}
function h$integer_cmm_xorIntegerzh(sa, abits, sb, bbits) {
    ;
    return abits.xor(bbits);
}
function h$integer_cmm_testBitIntegerzh(sa, abits, bit) {
    return abits.testBit(bit)?1:0;
}
function h$integer_cmm_mul2ExpIntegerzh(sa, abits, b) {
    ;
    return abits.shiftLeft(b);
}
function h$integer_cmm_fdivQ2ExpIntegerzh(sa, abits, b) {
    ;
    return abits.shiftRight(b);
}
function h$integer_cmm_complementIntegerzh(sa, abits) {
    ;
    return abits.not();
}
function h$integer_cmm_int64ToIntegerzh(a0, a1) {
    ;
    h$ret1 = h$bigFromInt64(a0,a1);
    return 0;
}
function h$integer_cmm_word64ToIntegerzh(a0, a1) {
    ;
    h$ret1 = h$bigFromWord64(a0,a1);
    return 0;
}
function h$hs_integerToInt64(as, abits) {
    ;
    h$ret1 = abits.intValue();
    return abits.shiftRight(32).intValue();
}
function h$hs_integerToWord64(as, abits) {
    ;
    h$ret1 = abits.intValue();
    return abits.shiftRight(32).intValue();
}
function h$integer_cmm_integer2Intzh(as, abits) {
   ;
   return abits.intValue();
}
function h$integer_cbits_encodeDouble(as,abits,e) {
    ;
   return h$encodeNumber(abits,e);
}
function h$integer_cbits_encodeFloat(as,abits,e) {
    ;
   return h$encodeNumber(abits,e);
}
function h$__int_encodeDouble(i,e) {
   return i * Math.pow(2,e);
}
function h$__int_encodeFloat(i,e) {
   return i * Math.pow(2,e);
}
var h$glbl;
function h$getGlbl() { h$glbl = this; }
h$getGlbl();
function h$log() {
  if(h$glbl) {
    if(h$glbl.console && h$glbl.console.log) {
      h$glbl.console.log.apply(h$glbl.console,arguments);
    } else {
      h$glbl.print.apply(this,arguments);
    }
  } else {
    console.log.apply(console, arguments);
  }
  if(typeof(jQuery) !== 'undefined') {
    var x = '';
    for(var i=0;i<arguments.length;i++) { x = x + arguments[i]; }
    var xd = jQuery("<div></div>");
    xd.text(x);
    jQuery('#output').append(xd);
  }
}
function h$collectProps(o) {
  var props = [];
  for(var p in o) { props.push(p); }
  return("{"+props.join(",")+"}");
}
var h$programArgs;
if(typeof scriptArgs !== 'undefined') {
  h$programArgs = scriptArgs.slice(0);
  h$programArgs.unshift("a.js");
} else if(typeof process !== 'undefined' && process.argv) {
  h$programArgs = process.argv.slice(1);
} else if(typeof snarf !== 'undefined' && typeof arguments !== 'undefined') {
  h$programArgs = arguments.slice(0);
  h$programArgs.unshift("a.js");
} else {
  h$programArgs = [ "a.js" ];
}
function h$getProgArgv(argc_v,argc_off,argv_v,argv_off) {
  ;
  var c = h$programArgs.length;
  if(c === 0) {
    argc_v.dv.setInt32(argc_off, 0, true);
  } else {
    argc_v.dv.setInt32(argc_off, c, true);
    var argv = h$newByteArray(4*c);
    argv.arr = [];
    for(var i=0;i<h$programArgs.length;i++) {
      argv.arr[4*i] = [ h$encodeUtf8(h$programArgs[i]), 0 ];
    }
    if(!argv_v.arr) { argv_v.arr = []; }
    argv_v.arr[argv_off] = [argv, 0];
  }
}
function h$setProgArgv(n, ptr_d, ptr_o) {
  args = [];
  for(var i=0;i<n;i++) {
    var p = ptr_d.arr[ptr_o+4*i];
    var arg = h$decodeUtf8z(p[0], p[1]);
    args.push(arg);
  }
  h$programArgs = args;
}
function h$getpid() {
  if(this['process']) return process.id;
  return 0;
}
function h$__hscore_environ() {
  h$ret1 = 0;
  return null;
}
function h$getenv() {
    ;
    h$ret1 = 0;
    return null;
}
function h$errorBelch() {
  h$log("### errorBelch: do we need to handle a vararg function here?");
}
function h$errorBelch2(buf1, buf_offset1, buf2, buf_offset2) {
  h$errorMsg(h$decodeUtf8z(buf1, buf_offset1), h$decodeUtf8z(buf2, buf_offset2));
}
function h$debugBelch2(buf1, buf_offset1, buf2, buf_offset2) {
  h$errorMsg(h$decodeUtf8z(buf1, buf_offset1), h$decodeUtf8z(buf2, buf_offset2));
}
function h$errorMsg(pat) {
  var str = pat;
  for(var i=1;i<arguments.length;i++) {
    str = str.replace(/%s/, arguments[i]);
  }
  if(typeof process !== 'undefined' && process && process.stderr) {
    process.stderr.write(str);
  } else if (typeof printErr !== 'undefined') {
    printErr(str);
  } else if (typeof putstr !== 'undefined') {
    putstr(str);
  } else if(typeof(console) !== 'undefined') {
    console.log(str);
  }
}
function h$performMajorGC() {
    var t = h$currentThread, err = null;
    t.sp = h$sp;
    h$currentThread = null;
    try {
        h$gc(t);
    } catch(e) {
        err = e;
    }
    h$currentThread = t;
    h$sp = t.sp;
    h$stack = t.stack;
    if(err) throw err;
}
function h$baseZCSystemziCPUTimeZCgetrusage() {
  return 0;
}
function h$getrusage() {
  return 0;
}
function h$gettimeofday(tv_v,tv_o,tz_v,tz_o) {
  var now = Date.now();
  tv_v.dv.setInt32(tv_o, (now / 1000)|0, true);
  tv_v.dv.setInt32(tv_o + 4, ((now % 1000) * 1000)|0, true);
  if(tv_v.len >= tv_o + 12) {
    tv_v.dv.setInt32(tv_o + 8, ((now % 1000) * 1000)|0, true);
  }
  return 0;
}
function h$traceEvent(ev_v,ev_o) {
  h$errorMsg(h$decodeUtf8z(ev_v, ev_o));
}
function h$traceMarker(ev_v,ev_o) {
  h$errorMsg(h$decodeUtf8z(ev_v, ev_o));
}
var h$__hscore_gettimeofday = h$gettimeofday;
var h$myTimeZone = h$encodeUtf8("UTC");
function h$localtime_r(timep_v, timep_o, result_v, result_o) {
  var t = timep_v.i3[timep_o];
  var d = new Date(t * 1000);
  result_v.dv.setInt32(result_o , d.getSeconds(), true);
  result_v.dv.setInt32(result_o + 4 , d.getMinutes(), true);
  result_v.dv.setInt32(result_o + 8 , d.getHours(), true);
  result_v.dv.setInt32(result_o + 12, d.getDate(), true);
  result_v.dv.setInt32(result_o + 16, d.getMonth(), true);
  result_v.dv.setInt32(result_o + 20, d.getFullYear()-1900, true);
  result_v.dv.setInt32(result_o + 24, d.getDay(), true);
  result_v.dv.setInt32(result_o + 28, 0, true);
  result_v.dv.setInt32(result_o + 32, -1, true);
  result_v.dv.setInt32(result_o + 40, 0, true);
  if(!result_v.arr) result_v.arr = [];
  result_v.arr[result_o + 40] = [h$myTimeZone, 0];
  result_v.arr[result_o + 48] = [h$myTimeZone, 0];
  h$ret1 = result_o;
  return result_v;
}
var h$__hscore_localtime_r = h$localtime_r;
var h$finalizers = new h$Set();
var h$scannedWeaks = [];
function h$finalizeWeaks() {
    var mark = h$gcMark;
    ;
    var i, w, toFinalize = [];
    var iter = h$finalizers.iter();
    while((w = iter.next()) !== null) {
        ;
        ;
        if((w.m.m&3) !== mark) {
            iter.remove();
            toFinalize.push(w);
            ;
        }
    }
    ;
    if(toFinalize.length > 0) {
        var t = new h$Thread();
        for(i=0;i<toFinalize.length;i++) {
            w = toFinalize[i];
            t.sp += 6;
            t.stack[t.sp-5] = 0;
            t.stack[t.sp-4] = h$noop;
            t.stack[t.sp-3] = h$catch_e;
            t.stack[t.sp-2] = h$ap_1_0;
            t.stack[t.sp-1] = w.finalizer;
            t.stack[t.sp] = h$return;
            w.finalizer = null;
        }
        h$wakeupThread(t);
    }
    return toFinalize;
}
function h$clearWeaks() {
    var mark = h$gcMark;
    ;
    for(var i=h$scannedWeaks.length-1;i>=0;i--) {
        w = h$scannedWeaks[i];
        if(w.keym.m !== mark && w.val !== null) {
            ;
            w.val = null;
        }
    }
}
var h$weakFinalizerN = 0;
function h$Weak(key, val, finalizer) {
    if(typeof key !== 'object') {
        ;
        this.keym = new h$StableName(0);
    } else {
        if(typeof key.m !== 'object') key.m = new h$StableName(key.m);
        this.keym = key.m;
    }
    ;
    this.keym = key.m;
    this.val = val;
    this.finalizer = null;
    if(finalizer !== null) {
        var fin = { m: this.keym, finalizer: finalizer, _key: ++h$weakFinalizerN };
        h$finalizers.add(fin);
        this.finalizer = fin;
    }
    this.m = 0;
}
function h$makeWeak(key, val, fin) {
    ;
    return new h$Weak(key, val, fin)
}
function h$makeWeakNoFinalizer(key, val) {
    ;
    return new h$Weak(key, val, null);
}
function h$finalizeWeak(w) {
    ;
    w.val = null;
    if(w.finalizer === null || w.finalizer.finalizer === null) {
        h$ret1 = 0;
        return null;
    } else {
        var r = w.finalizer.finalizer;
        h$finalizers.remove(w.finalizer);
        w.finalizer = null;
        h$ret1 = 1;
        return r;
    }
}
var h$threadRunning = 0;
var h$threadBlocked = 1;
var h$threadFinished = 16;
var h$threadDied = 17;
var h$threadIdN = 0;
var h$threads = new h$Queue();
var h$blocked = new h$Set();
function h$Thread() {
    this.tid = ++h$threadIdN;
    this.status = h$threadRunning;
    this.stack = [h$done, 0, h$baseZCGHCziConcziSynczireportError, h$catch_e];
    this.sp = 3;
    this.mask = 0;
    this.interruptible = false;
    this.excep = [];
    this.delayed = false;
    this.blockedOn = null;
    this.retryInterrupted = null;
    this.transaction = null;
    this.isSynchronous = false;
    this.continueAsync = false;
    this.m = 0;
    this._key = this.tid;
}
function h$rts_getThreadId(t) {
  return t.tid;
}
function h$cmp_thread(t1,t2) {
  if(t1.tid < t2.tid) return -1;
  if(t1.tid > t2.tid) return 1;
  return 0;
}
function h$threadString(t) {
  if(t === null) {
    return "<no thread>";
  } else if(t.label) {
    var str = h$decodeUtf8z(t.label[0], t.label[1]);
    return str + " (" + t.tid + ")";
  } else {
    return (""+t.tid);
  }
}
function h$fork(a, inherit) {
  var t = new h$Thread();
  ;
  if(inherit && h$currentThread) {
    t.mask = h$currentThread.mask;
  }
  t.stack[4] = h$ap_1_0;
  t.stack[5] = a;
  t.stack[6] = h$return;
  t.sp = 6;
  h$wakeupThread(t);
  return t;
}
function h$threadStatus(t) {
  h$ret1 = 1;
  h$ret2 = 0;
  return t.status;
}
function h$waitRead(fd) {
  h$fds[fd].waitRead.push(h$currentThread);
  h$currentThread.interruptible = true;
  h$blockThread(h$currentThread,fd,[h$waitRead,fd]);
  return h$reschedule;
}
function h$waitWrite(fd) {
  h$fds[fd].waitWrite.push(h$currentThread);
  h$currentThread.interruptible = true;
  h$blockThread(h$currentThread,fd,[h$waitWrite,fd]);
  return h$reschedule;
}
var h$delayed = new h$HeapSet();
function h$wakeupDelayed(now) {
    while(h$delayed.size() > 0 && h$delayed.peekPrio() < now) {
        var t = h$delayed.pop();
        ;
        if(t.delayed) {
            t.delayed = false;
            h$wakeupThread(t);
        }
    }
}
function h$delayThread(time) {
  var now = Date.now();
  var ms = time/1000;
  ;
  h$delayed.add(now+ms, h$currentThread);
  h$currentThread.delayed = true;
  h$blockThread(h$currentThread, h$delayed,[h$resumeDelayThread]);
  return h$reschedule;
}
function h$resumeDelayThread() {
  h$r1 = false;
  return h$stack[h$sp];
}
function h$yield() {
  h$sp += 2;
  h$stack[h$sp-1] = h$r1;
  h$stack[h$sp] = h$return;
  h$currentThread.sp = h$sp;
  return h$reschedule;
}
function h$killThread(t, ex) {
  ;
  if(t === h$currentThread) {
    h$sp += 2;
    h$stack[h$sp-1] = h$r1;
    h$stack[h$sp] = h$return;
    return h$throw(ex,true);
  } else {
    ;
    if(t.mask === 0 || (t.mask === 2 && t.interruptible)) {
      if(t.stack) {
        h$forceWakeupThread(t);
        t.sp += 2;
        t.stack[t.sp-1] = ex;
        t.stack[t.sp] = h$raiseAsync_frame;
      }
      return h$stack ? h$stack[h$sp] : null;
    } else {
      t.excep.push([h$currentThread,ex]);
      h$blockThread(h$currentThread,t,null);
      h$currentThread.interruptible = true;
      h$sp += 2;
      h$stack[h$sp-1] = h$r1;
      h$stack[h$sp] = h$return;
      return h$reschedule;
    }
  }
}
function h$maskStatus() {
  ;
  return h$currentThread.mask;
}
function h$maskAsync(a) {
  ;
  if(h$currentThread.mask !== 2) {
    if(h$currentThread.mask === 0 && h$stack[h$sp] !== h$maskFrame && h$stack[h$sp] !== h$maskUnintFrame) {
      h$stack[++h$sp] = h$unmaskFrame;
    }
    if(h$currentThread.mask === 1) {
      h$stack[++h$sp] = h$maskUnintFrame;
    }
    h$currentThread.mask = 2;
  }
  h$r1 = a;
  return h$ap_1_0_fast();
}
function h$maskUnintAsync(a) {
  ;
  if(h$currentThread.mask !== 1) {
    if(h$currentThread.mask === 2) {
      h$stack[++h$sp] = h$maskFrame;
    } else {
      h$stack[++h$sp] = h$unmaskFrame;
    }
    h$currentThread.mask = 1;
  }
  h$r1 = a;
  return h$ap_1_0_fast();
}
function h$unmaskAsync(a) {
  ;
  if(h$currentThread.excep.length > 0) {
    h$currentThread.mask = 0;
    h$sp += 3;
    h$stack[h$sp-2] = h$ap_1_0;
    h$stack[h$sp-1] = a;
    h$stack[h$sp] = h$return;
    return h$reschedule;
  }
  if(h$currentThread.mask !== 0) {
    if(h$stack[h$sp] !== h$unmaskFrame) {
      if(h$currentThread.mask === 2) {
        h$stack[++h$sp] = h$maskFrame;
      } else {
        h$stack[++h$sp] = h$maskUnintFrame;
      }
    }
    h$currentThread.mask = 0;
  }
  h$r1 = a;
  return h$ap_1_0_fast();
}
function h$pendingAsync() {
  var t = h$currentThread;
  return (t.excep.length > 0 && (t.mask === 0 || (t.mask === 2 && t.interruptible)));
}
function h$postAsync(alreadySuspended,next) {
  var t = h$currentThread;
  if(h$pendingAsync()) {
    ;
    var v = t.excep.shift();
    var tposter = v[0];
    var ex = v[1];
    if(v !== null && tposter !== null) {
      h$wakeupThread(tposter);
    }
    if(!alreadySuspended) {
      h$suspendCurrentThread(next);
    }
    h$sp += 2;
    h$stack[h$sp-1] = ex;
    h$stack[h$sp] = h$raiseAsync_frame;
    t.sp = h$sp;
    return true;
  } else {
    return false;
  }
}
function h$wakeupThread(t) {
    ;
    if(t.status === h$threadBlocked) {
        t.blockedOn = null;
        t.status = h$threadRunning;
        h$blocked.remove(t);
    }
    t.interruptible = false;
    t.retryInterrupted = null;
    h$threads.enqueue(t);
}
function h$forceWakeupThread(t) {
  ;
  if(t.status === h$threadBlocked) {
    h$removeThreadBlock(t);
    h$wakeupThread(t);
  }
}
function h$removeThreadBlock(t) {
  if(t.status === h$threadBlocked) {
    var o = t.blockedOn;
    if(o === null || o === undefined) {
      throw ("h$removeThreadBlock: blocked on null or undefined: " + h$threadString(t));
    } else if(o === h$delayed) {
      h$delayed.remove(t);
      t.delayed = false;
    } else if(o instanceof h$MVar) {
      ;
      ;
      var r, rq = new h$Queue();
      while((r = o.readers.dequeue()) !== null) {
          if(r !== t) rq.enqueue(r);
      }
      var w, wq = new h$Queue();
      while ((w = o.writers.dequeue()) !== null) {
        if(w[0] !== t) wq.enqueue(w);
      }
      o.readers = rq;
      o.writers = wq;
      ;
    } else if(o instanceof h$Thread) {
      ;
      for(var i=0;i<o.excep.length;i++) {
        if(o.excep[i][0] === t) {
          o.excep[i][0] = null;
          break;
        }
      }
    } else if (o instanceof h$TVarsWaiting) {
      h$stmRemoveBlockedThread(o.tvars, t)
    } else if(o.f && o.f.t === h$BLACKHOLE_CLOSURE) {
      ;
      h$removeFromArray(o.d2,t);
    } else {
      throw ("h$removeThreadBlock: blocked on unknown object: " + h$collectProps(o));
    }
    if(t.retryInterrupted) {
      t.sp+=2;
      t.stack[t.sp-1] = t.retryInterrupted;
      t.stack[t.sp] = h$retryInterrupted;
    }
  }
}
function h$removeFromArray(a,o) {
  var i;
  while((i = a.indexOf(o)) !== -1) {
    a.splice(i,1);
  }
}
function h$finishThread(t) {
    ;
    t.status = h$threadFinished;
    h$blocked.remove(t);
    t.stack = null;
    t.mask = 0;
    for(var i=0;i<t.excep.length;i++) {
        var v = t.excep[i];
        var tposter = v[0];
        if(v !== null && tposter !== null) {
            h$wakeupThread(tposter);
        }
    }
    t.excep = [];
}
function h$blockThread(t,o,resume) {
    ;
    if(o === undefined || o === null) {
        throw ("h$blockThread, no block object: " + h$threadString(t));
    }
    t.status = h$threadBlocked;
    t.blockedOn = o;
    t.retryInterrupted = resume;
    t.sp = h$sp;
    h$blocked.add(t);
}
var h$lastGc = Date.now();
var h$gcInterval = 1000;
function h$scheduler(next) {
    ;
    var now = Date.now();
    h$wakeupDelayed(now);
    if(h$currentThread && h$pendingAsync()) {
        ;
        if(h$currentThread.status !== h$threadRunning) {
            h$forceWakeupThread(h$currentThread);
            h$currentThread.status = h$threadRunning;
        }
        h$postAsync(next === h$reschedule, next);
        return h$stack[h$sp];
    }
    var t;
    while(t = h$threads.dequeue()) {
        if(t.status === h$threadRunning) { break; }
    }
    if(t === null) {
        ;
        if(h$currentThread && h$currentThread.status === h$threadRunning) {
            if(now - h$lastGc > h$gcInterval) {
                if(next !== h$reschedule && next !== null) {
                    h$suspendCurrentThread(next);
                    next = h$stack[h$sp];
                }
                var ct = h$currentThread;
                h$currentThread = null;
                h$gc(ct);
                h$currentThread = ct;
                h$stack = h$currentThread.stack;
                h$sp = h$currentThread.sp
            }
            ;
            return (next===h$reschedule || next === null)?h$stack[h$sp]:next;
        } else {
            ;
            h$currentThread = null;
            if(now - h$lastGc > h$gcInterval)
                h$gc(null);
            return null;
        }
    } else {
        ;
        if(h$currentThread !== null) {
            if(h$currentThread.status === h$threadRunning) {
                h$threads.enqueue(h$currentThread);
            }
            if(next !== h$reschedule && next !== null) {
                ;
                h$suspendCurrentThread(next);
            } else {
                ;
                h$currentThread.sp = h$sp;
            }
            h$postAsync(true, next);
        } else {
            ;
        }
        if(now - h$lastGc > h$gcInterval) {
            h$currentThread = null;
            h$gc(t);
        }
        h$currentThread = t;
        h$stack = t.stack;
        h$sp = t.sp;
        ;
        return h$stack[h$sp];
    }
}
var h$yieldRun;
if(false) {
  (function() {
    var handler = function(ev) {
      if(ev.data === "h$mainLoop") { h$mainLoop(); }
    };
    if(window.addEventListener) {
      window.addEventListener("message", handler);
    } else {
      window.attachEvent("message", handler);
    }
    h$yieldRun = function() { h$running = false; window.postMessage("h$mainLoop", "*"); }
  })();
} else if(typeof process !== 'undefined' && process.nextTick) {
  h$yieldRun = function() {
    ;
      h$running = false;
      setImmediate(h$mainLoop);
  }
} else if(typeof setTimeout !== 'undefined') {
  h$yieldRun = function() {
    ;
    h$running = false;
    setTimeout(h$mainLoop, 0);
  }
} else {
  h$yieldRun = null;
}
function h$startMainLoop() {
  if(h$yieldRun) {
    h$yieldRun();
  } else {
    h$mainLoop();
  }
}
var h$running = false;
var h$next = null;
function h$mainLoop() {
    if(h$running) return;
    h$running = true;
    h$runInitStatic();
    h$currentThread = h$next;
    if(h$next !== null) {
        h$stack = h$currentThread.stack;
        h$sp = h$currentThread.sp;
    }
    var c = null;
    var count;
    var start = Date.now();
    do {
        c = h$scheduler(c);
        var scheduled = Date.now();
        if(c === null) {
            h$running = false;
            if(typeof setTimeout !== 'undefined') {
                h$next = null;
                setTimeout(h$mainLoop, 20);
                return;
            } else {
                while(c === null) { c = h$scheduler(c); }
            }
        }
        if(Date.now() - start > 500) {
            ;
            if(h$yieldRun) {
                if(c !== h$reschedule) {
                    h$suspendCurrentThread(c);
                }
                h$next = h$currentThread;
                h$currentThread = null;
                return h$yieldRun();
            }
        }
            while(c !== h$reschedule && Date.now() - scheduled < 25) {
                count = 0;
                while(c !== h$reschedule && ++count < 1000) {
                    c = c();
                    c = c();
                    c = c();
                    c = c();
                    c = c();
                    c = c();
                    c = c();
                    c = c();
                    c = c();
                    c = c();
                }
            }
    } while(true);
}
function h$run(a) {
  ;
  var t = h$fork(a, false);
  h$startMainLoop();
  return t;
}
function h$runSync(a, cont) {
  h$runInitStatic();
  var c = h$return;
  var t = new h$Thread();
  t.isSynchronous = true;
  t.continueAsync = cont;
  var ct = h$currentThread;
  var csp = h$sp;
  var cr1 = h$r1;
  t.stack[4] = h$ap_1_0;
  t.stack[5] = a;
  t.stack[6] = h$return;
  t.sp = 6;
  t.status = h$threadRunning;
  var excep = null;
  var blockedOn = null;
  h$currentThread = t;
  h$stack = t.stack;
  h$sp = t.sp;
  try {
    while(true) {
      ;
      while(c !== h$reschedule) {
        c = c();
        c = c();
        c = c();
        c = c();
        c = c();
        c = c();
        c = c();
        c = c();
        c = c();
        c = c();
      }
      ;
      if(t.status === h$threadFinished) {
        ;
        break;
      } else {
        ;
      }
      var b = t.blockedOn;
      if(typeof b === 'object' && b && b.f && b.f.t === h$BLACKHOLE_CLOSURE) {
        var bhThread = b.d1;
        if(bhThread === ct || bhThread === t) {
          ;
          c = h$throw(h$baseZCControlziExceptionziBasezinonTermination, false);
        } else {
          if(h$runBlackholeThreadSync(b)) {
            ;
            c = h$stack[h$sp];
          } else {
            ;
            blockedOn = b;
            throw false;
          }
        }
      } else {
        ;
        blockedOn = b;
        throw false;
      }
    }
  } catch(e) { excep = e; }
  if(ct !== null) {
    h$currentThread = ct;
    h$stack = ct.stack;
    h$sp = csp;
    h$r1 = cr1;
  }
  if(t.status !== h$threadFinished && !cont) {
    h$removeThreadBlock(t);
    h$finishThread(t);
  }
  if(excep) {
    throw excep;
  }
  return blockedOn;
  ;
}
function h$runBlackholeThreadSync(bh) {
  ;
  var ct = h$currentThread;
  var sp = h$sp;
  var success = false;
  var bhs = [];
  var currentBh = bh;
  if(bh.d1.excep.length > 0) {
    return false;
  }
  h$currentThread = bh.d1;
  h$stack = h$currentThread.stack;
  h$sp = h$currentThread.sp;
  var c = (h$currentThread.status === h$threadRunning)?h$stack[h$sp]:h$reschedule;
  ;
  try {
    while(true) {
      while(c !== h$reschedule && currentBh.f.t === h$BLACKHOLE_CLOSURE) {
        c = c();
        c = c();
        c = c();
        c = c();
        c = c();
      }
      if(c === h$reschedule) {
        if(typeof h$currentThread.blockedOn === 'object' &&
           h$currentThread.blockedOn.f &&
           h$currentThread.blockedOn.f.t === h$BLACKHOLE_CLOSURE) {
          ;
          bhs.push(currentBh);
          currentBh = h$currentThread.blockedOn;
          h$currentThread = h$currentThread.blockedOn.d1;
          if(h$currentThread.excep.length > 0) {
            break;
          }
          h$stack = h$currentThread.stack;
          h$sp = h$currentThread.sp;
          c = (h$currentThread.status === h$threadRunning)?h$stack[h$sp]:h$reschedule;
        } else {
          ;
          break;
        }
      } else {
        ;
        ;
        h$suspendCurrentThread(c);
        if(bhs.length > 0) {
          ;
          currentBh = bhs.pop();
          h$currentThread = currentBh.d1;
          h$stack = h$currentThread.stack;
          h$sp = h$currentThread.sp;
        } else {
          ;
          success = true;
          break;
        }
      }
    }
  } catch(e) { }
  h$sp = sp;
  h$stack = ct.stack;
  h$currentThread = ct;
  return success;
}
function h$syncThreadState(tid) {
  return (tid.isSynchronous ? 1 : 0) |
         (tid.continueAsync ? 2 : 0);
}
function h$main(a) {
  var t = new h$Thread();
  t.stack[0] = h$doneMain;
  if((typeof process !== 'undefined' && process.exit) || typeof quit !== 'undefined') {
    t.stack[2] = h$baseZCGHCziTopHandlerzitopHandler;
  }
  t.stack[4] = h$ap_1_0;
  t.stack[5] = h$flushStdout;
  t.stack[6] = h$return;
  t.stack[7] = h$ap_1_0;
  t.stack[8] = a;
  t.stack[9] = h$return;
  t.sp = 9;
  t.label = [h$encodeUtf8("main"), 0];
  h$wakeupThread(t);
  h$startMainLoop();
  return t;
}
var h$mvarId = 0;
function h$MVar() {
  ;
  this.val = null;
  this.readers = new h$Queue();
  this.writers = new h$Queue();
  this.waiters = null;
  this.m = 0;
  this.id = ++h$mvarId;
}
function h$notifyMVarEmpty(mv) {
  var w = mv.writers.dequeue();
  if(w !== null) {
    var thread = w[0];
    var val = w[1];
    ;
    mv.val = val;
    if(thread !== null) {
      h$wakeupThread(thread);
    }
  } else {
    ;
    mv.val = null;
  }
  ;
}
function h$notifyMVarFull(mv,val) {
  if(mv.waiters && mv.waiters.length > 0) {
    for(var i=0;i<mv.waiters.length;i++) {
      var w = mv.waiters[i];
      w.sp += 2;
      w.stack[w.sp-1] = val;
      w.stack[w.sp] = h$return;
      h$wakeupThread(w);
    }
    mv.waiters = null;
  }
  var r = mv.readers.dequeue();
  if(r !== null) {
    ;
    r.sp += 2;
    r.stack[r.sp-1] = val;
    r.stack[r.sp] = h$return;
    h$wakeupThread(r);
    mv.val = null;
  } else {
    ;
    mv.val = val;
  }
  ;
}
function h$takeMVar(mv) {
  ;
  if(mv.val !== null) {
    h$r1 = mv.val;
    h$notifyMVarEmpty(mv);
    return h$stack[h$sp];
  } else {
    mv.readers.enqueue(h$currentThread);
    h$currentThread.interruptible = true;
    h$blockThread(h$currentThread,mv,[h$takeMVar,mv]);
    return h$reschedule;
  }
}
function h$tryTakeMVar(mv) {
  ;
  if(mv.val === null) {
    h$ret1 = null;
    return 0;
  } else {
    h$ret1 = mv.val;
    h$notifyMVarEmpty(mv);
    return 1;
  }
}
function h$readMVar(mv) {
  ;
  if(mv.val === null) {
    if(mv.waiters) {
      mv.waiters.push(h$currentThread);
    } else {
      mv.waiters = [h$currentThread];
    }
    h$currentThread.interruptible = true;
    h$blockThread(h$currentThread,mv,[h$readMVar,mv]);
    return h$reschedule;
  } else {
    h$r1 = mv.val;
    return h$stack[h$sp];
  }
}
function h$putMVar(mv,val) {
  ;
  if(mv.val !== null) {
    mv.writers.enqueue([h$currentThread,val]);
    h$currentThread.interruptible = true;
    h$blockThread(h$currentThread,mv,[h$putMVar,mv,val]);
    return h$reschedule;
  } else {
    h$notifyMVarFull(mv,val);
    return h$stack[h$sp];
  }
}
function h$tryPutMVar(mv,val) {
  ;
  if(mv.val !== null) {
    return 0;
  } else {
    h$notifyMVarFull(mv,val);
    return 1;
  }
}
function h$writeMVarJs1(mv,val) {
  var v = h$c1(h$data1_e, val);
  if(mv.val !== null) {
    ;
    mv.writers.enqueue([null,v]);
  } else {
    ;
    h$notifyMVarFull(mv,v);
  }
}
function h$writeMVarJs2(mv,val1,val2) {
  var v = h$c2(h$data1_e, val1, val2);
  if(mv.val !== null) {
    ;
    mv.writers.enqueue([null,v]);
  } else {
    ;
    h$notifyMVarFull(mv,v);
  }
}
function h$MutVar(v) {
    this.val = v;
    this.m = 0;
}
function h$atomicModifyMutVar(mv, fun) {
  var thunk = h$c2(h$ap1_e, fun, mv.val);
  mv.val = h$c1(h$select1_e, thunk);
  return h$c1(h$select2_e, thunk);
}
function h$blockOnBlackhole(c) {
  ;
  if(c.d1 === h$currentThread) {
    ;
    return h$throw(h$baseZCControlziExceptionziBasezinonTermination, false);
  }
  ;
  if(c.d2 === null) {
    c.d2 = [h$currentThread];
  } else {
    c.d2.push(h$currentThread);
  }
  h$blockThread(h$currentThread,c,[h$resumeBlockOnBlackhole,c]);
  return h$reschedule;
}
function h$resumeBlockOnBlackhole(c) {
  h$r1 = c;
  return h$ap_0_0_fast();
}
function h$makeResumable(bh,start,end,extra) {
  var s = h$stack.slice(start,end+1);
  if(extra) {
    s = s.concat(extra);
  }
  bh.f = h$resume_e;
  bh.d1 = s;
  bh.d2 = null;
}
var h$enabled_capabilities = h$newByteArray(4);
h$enabled_capabilities.i3[0] = 1;
function h$rtsSupportsBoundThreads() {
  return 0;
}
function h$mkForeignCallback(x) {
    return function() {
        if(x.mv === null) {
            x.mv = arguments;
        } else {
            h$notifyMVarFull(x.mv, h$c1(h$data1_e, arguments));
            h$mainLoop();
        }
    }
}
function h$makeMVarListener(mv, stopProp, stopImmProp, preventDefault) {
  var f = function(event) {
    ;
    h$writeMVarJs1(mv,event);
    if(stopProp) { event.stopPropagation(); }
    if(stopImmProp) { event.stopImmediatePropagation(); }
    if(preventDefault) { event.preventDefault(); }
  }
  f.root = mv;
  return f;
}
var h$stmTransactionActive = 0;
var h$stmTransactionWaiting = 4;
function h$Transaction(o, parent) {
    ;
    this.action = o;
    this.tvars = new h$Map();
    this.accessed = parent===null?new h$Map():parent.accessed;
    this.checkRead = parent===null?null:parent.checkRead;
    this.parent = parent;
    this.state = h$stmTransactionActive;
    this.invariants = [];
    this.m = 0;
}
var h$stmInvariantN = 0;
function h$StmInvariant(a) {
    this.action = a;
    this._key = ++h$stmInvariantN;
}
function h$WrittenTVar(tv,v) {
    this.tvar = tv;
    this.val = v;
}
var h$TVarN = 0;
function h$TVar(v) {
    ;
    this.val = v;
    this.blocked = new h$Set();
    this.invariants = null;
    this.m = 0;
    this._key = ++h$TVarN;
}
function h$TVarsWaiting(s) {
  this.tvars = s;
}
function h$LocalInvariant(o) {
  this.action = o;
  this.dependencies = new h$Set();
}
function h$LocalTVar(v) {
  ;
  this.readVal = v.val;
  this.val = v.val;
  this.tvar = v;
}
function h$atomically(o) {
  h$p3(o, h$atomically_e, h$checkInvariants_e);
  return h$stmStartTransaction(o);
}
function h$stmStartTransaction(o) {
  ;
  var t = new h$Transaction(o, null);
  h$currentThread.transaction = t;
  h$r1 = o;
  return h$ap_1_0_fast();
}
function h$stmUpdateInvariantDependencies(inv) {
    var ii, iter = h$currentThread.transaction.checkRead.iter();
    if(inv instanceof h$LocalInvariant) {
        while((ii = iter.next()) !== null) inv.dependencies.add(ii);
    } else {
        while((ii = iter.next()) !== null) h$stmAddTVarInvariant(ii, inv);
    }
}
function h$stmAddTVarInvariant(tv, inv) {
    if(tv.invariants === null) tv.invariants = new h$Set();
    tv.invariants.add(inv);
}
function h$stmCommitTransaction() {
    var t = h$currentThread.transaction;
    var tvs = t.tvars;
    var wtv, i = tvs.iter();
    if(t.parent === null) {
        ;
        while((wtv = i.nextVal()) !== null) h$stmCommitTVar(wtv.tvar, wtv.val);
        for(var j=0;j<t.invariants.length;j++) {
            h$stmCommitInvariant(t.invariants[j]);
        }
    } else {
        ;
        var tpvs = t.parent.tvars;
        while((wtv = i.nextVal()) !== null) tpvs.put(wtv.tvar, wtv);
        t.parent.invariants = t.parent.invariants.concat(t.invariants);
    }
    h$currentThread.transaction = t.parent;
}
function h$stmValidateTransaction() {
    var ltv, i = h$currentThread.transaction.accessed.iter();
    while((ltv = i.nextVal()) !== null) {
        if(ltv.readVal !== ltv.tvar.val) return false;
    }
    return true;
}
function h$stmAbortTransaction() {
  h$currentThread.transaction = h$currentThread.transaction.parent;
}
function h$stmCheck(o) {
  h$currentThread.transaction.invariants.push(new h$LocalInvariant(o));
  return false;
}
function h$stmRetry() {
  while(h$sp > 0) {
    var f = h$stack[h$sp];
    if(f === h$atomically_e || f === h$stmCatchRetry_e) {
      break;
    }
    var size;
    if(f === h$ap_gen) {
      size = ((h$stack[h$sp-1] >> 8) + 2);
    } else {
      var tag = f.gtag;
      if(tag < 0) {
        size = h$stack[h$sp-1];
      } else {
        size = (tag & 0xff) + 1;
      }
    }
    h$sp -= size;
  }
  if(h$sp > 0) {
    if(f === h$atomically_e) {
      return h$stmSuspendRetry();
    } else {
      var b = h$stack[h$sp-1];
      h$stmAbortTransaction();
      h$sp -= 2;
      h$r1 = b;
      return h$ap_1_0_fast();
    }
  } else {
    throw "h$stmRetry: STM retry outside a transaction";
  }
}
function h$stmSuspendRetry() {
    var tv, i = h$currentThread.transaction.accessed.iter();
    var tvs = new h$Set();
    while((tv = i.next()) !== null) {
        ;
        tv.tvar.blocked.add(h$currentThread);
        tvs.add(tv.tvar);
    }
    waiting = new h$TVarsWaiting(tvs);
    h$blockThread(h$currentThread, waiting);
    h$p2(waiting, h$stmResumeRetry_e);
    return h$reschedule;
}
function h$stmCatchRetry(a,b) {
    h$currentThread.transaction = new h$Transaction(b, h$currentThread.transaction);
    h$p2(b, h$stmCatchRetry_e);
    h$r1 = a;
    return h$ap_1_0_fast();
}
function h$catchStm(a,handler) {
    h$p4(h$currentThread.transaction, h$currentThread.mask, handler, h$catchStm_e);
    h$r1 = a;
    return h$ap_1_0_fast();
}
function h$newTVar(v) {
  return new h$TVar(v);
}
function h$readTVar(tv) {
  return h$readLocalTVar(h$currentThread.transaction,tv);
}
function h$readTVarIO(tv) {
  return tv.val;
}
function h$writeTVar(tv, v) {
  h$setLocalTVar(h$currentThread.transaction, tv, v);
}
function h$sameTVar(tv1, tv2) {
  return tv1 === tv2;
}
function h$readLocalTVar(t, tv) {
  if(t.checkRead !== null) {
    t.checkRead.add(tv);
  }
  var t0 = t;
  while(t0 !== null) {
    var v = t0.tvars.get(tv);
    if(v !== null) {
      ;
      return v.val;
    }
    t0 = t0.parent;
  }
  var lv = t.accessed.get(tv);
  if(lv !== null) {
    ;
    return lv.val;
  } else {
    ;
    t.accessed.put(tv, new h$LocalTVar(tv));
    return tv.val;
  }
}
function h$setLocalTVar(t, tv, v) {
    if(!t.accessed.has(tv)) t.accessed.put(tv, new h$LocalTVar(tv));
    if(t.tvars.has(tv)) {
        t.tvars.get(tv).val = v;
    } else {
        t.tvars.put(tv, new h$WrittenTVar(tv, v))
    }
}
function h$stmCheckInvariants() {
    var t = h$currentThread.transaction;
    function addCheck(inv) {
        h$p5(inv, h$stmCheckInvariantResult_e, t, inv, h$stmCheckInvariantStart_e);
    }
    h$p2(h$r1, h$return);
    var wtv, i = t.tvars.iter();
    while((wtv = i.nextVal()) !== null) {
        ;
        var ii = wtv.tvar.invariants;
        if(ii) {
            var iv, iii = ii.iter();
            while((iv = iii.next()) !== null) addCheck(iv);
        }
    }
    for(j=0;j<t.invariants.length;j++) {
        addCheck(t.invariants[j]);
    }
    return h$stack[h$sp];
}
function h$stmCommitTVar(tv, v) {
    ;
    if(v !== tv.val) {
        var thr, iter = tv.blocked.iter();
        while((thr = iter.next()) !== null) {
            if(thr.status === h$threadBlocked) {
                ;
                h$wakeupThread(thr);
            }
        }
        tv.val = v;
    }
}
function h$stmRemoveBlockedThread(s, thread) {
    var tv, i = s.tvars.iter();
    while((tv = i.next()) !== null) {
        tv.blocked.remove(thread);
    }
}
function h$stmCommitInvariant(localInv) {
    var inv = new h$StmInvariant(localInv.action);
    var dep, i = localInv.dependencies.iter();
    while((dep = i.next()) !== null) {
        h$stmAddTVarInvariant(dep, inv);
    }
}
goog.provide('goog.crypt.Hash');
goog.crypt.Hash = function() {};
goog.crypt.Hash.prototype.reset = goog.abstractMethod;
goog.crypt.Hash.prototype.update = goog.abstractMethod;
goog.crypt.Hash.prototype.digest = goog.abstractMethod;
goog.provide('goog.crypt.Md5');
goog.require('goog.crypt.Hash');
goog.crypt.Md5 = function() {
  goog.base(this);
  this.chain_ = new Array(4);
  this.block_ = new Array(64);
  this.blockLength_ = 0;
  this.totalLength_ = 0;
  this.reset();
};
goog.inherits(goog.crypt.Md5, goog.crypt.Hash);
goog.crypt.Md5.prototype.reset = function() {
  this.chain_[0] = 0x67452301;
  this.chain_[1] = 0xefcdab89;
  this.chain_[2] = 0x98badcfe;
  this.chain_[3] = 0x10325476;
  this.blockLength_ = 0;
  this.totalLength_ = 0;
};
goog.crypt.Md5.prototype.compress_ = function(buf, opt_offset) {
  if (!opt_offset) {
    opt_offset = 0;
  }
  var X = new Array(16);
  if (goog.isString(buf)) {
    for (var i = 0; i < 16; ++i) {
      X[i] = (buf.charCodeAt(opt_offset++)) |
             (buf.charCodeAt(opt_offset++) << 8) |
             (buf.charCodeAt(opt_offset++) << 16) |
             (buf.charCodeAt(opt_offset++) << 24);
    }
  } else {
    for (var i = 0; i < 16; ++i) {
      X[i] = (buf[opt_offset++]) |
             (buf[opt_offset++] << 8) |
             (buf[opt_offset++] << 16) |
             (buf[opt_offset++] << 24);
    }
  }
  var A = this.chain_[0];
  var B = this.chain_[1];
  var C = this.chain_[2];
  var D = this.chain_[3];
  var sum = 0;
  sum = (A + (D ^ (B & (C ^ D))) + X[0] + 0xd76aa478) & 0xffffffff;
  A = B + (((sum << 7) & 0xffffffff) | (sum >>> 25));
  sum = (D + (C ^ (A & (B ^ C))) + X[1] + 0xe8c7b756) & 0xffffffff;
  D = A + (((sum << 12) & 0xffffffff) | (sum >>> 20));
  sum = (C + (B ^ (D & (A ^ B))) + X[2] + 0x242070db) & 0xffffffff;
  C = D + (((sum << 17) & 0xffffffff) | (sum >>> 15));
  sum = (B + (A ^ (C & (D ^ A))) + X[3] + 0xc1bdceee) & 0xffffffff;
  B = C + (((sum << 22) & 0xffffffff) | (sum >>> 10));
  sum = (A + (D ^ (B & (C ^ D))) + X[4] + 0xf57c0faf) & 0xffffffff;
  A = B + (((sum << 7) & 0xffffffff) | (sum >>> 25));
  sum = (D + (C ^ (A & (B ^ C))) + X[5] + 0x4787c62a) & 0xffffffff;
  D = A + (((sum << 12) & 0xffffffff) | (sum >>> 20));
  sum = (C + (B ^ (D & (A ^ B))) + X[6] + 0xa8304613) & 0xffffffff;
  C = D + (((sum << 17) & 0xffffffff) | (sum >>> 15));
  sum = (B + (A ^ (C & (D ^ A))) + X[7] + 0xfd469501) & 0xffffffff;
  B = C + (((sum << 22) & 0xffffffff) | (sum >>> 10));
  sum = (A + (D ^ (B & (C ^ D))) + X[8] + 0x698098d8) & 0xffffffff;
  A = B + (((sum << 7) & 0xffffffff) | (sum >>> 25));
  sum = (D + (C ^ (A & (B ^ C))) + X[9] + 0x8b44f7af) & 0xffffffff;
  D = A + (((sum << 12) & 0xffffffff) | (sum >>> 20));
  sum = (C + (B ^ (D & (A ^ B))) + X[10] + 0xffff5bb1) & 0xffffffff;
  C = D + (((sum << 17) & 0xffffffff) | (sum >>> 15));
  sum = (B + (A ^ (C & (D ^ A))) + X[11] + 0x895cd7be) & 0xffffffff;
  B = C + (((sum << 22) & 0xffffffff) | (sum >>> 10));
  sum = (A + (D ^ (B & (C ^ D))) + X[12] + 0x6b901122) & 0xffffffff;
  A = B + (((sum << 7) & 0xffffffff) | (sum >>> 25));
  sum = (D + (C ^ (A & (B ^ C))) + X[13] + 0xfd987193) & 0xffffffff;
  D = A + (((sum << 12) & 0xffffffff) | (sum >>> 20));
  sum = (C + (B ^ (D & (A ^ B))) + X[14] + 0xa679438e) & 0xffffffff;
  C = D + (((sum << 17) & 0xffffffff) | (sum >>> 15));
  sum = (B + (A ^ (C & (D ^ A))) + X[15] + 0x49b40821) & 0xffffffff;
  B = C + (((sum << 22) & 0xffffffff) | (sum >>> 10));
  sum = (A + (C ^ (D & (B ^ C))) + X[1] + 0xf61e2562) & 0xffffffff;
  A = B + (((sum << 5) & 0xffffffff) | (sum >>> 27));
  sum = (D + (B ^ (C & (A ^ B))) + X[6] + 0xc040b340) & 0xffffffff;
  D = A + (((sum << 9) & 0xffffffff) | (sum >>> 23));
  sum = (C + (A ^ (B & (D ^ A))) + X[11] + 0x265e5a51) & 0xffffffff;
  C = D + (((sum << 14) & 0xffffffff) | (sum >>> 18));
  sum = (B + (D ^ (A & (C ^ D))) + X[0] + 0xe9b6c7aa) & 0xffffffff;
  B = C + (((sum << 20) & 0xffffffff) | (sum >>> 12));
  sum = (A + (C ^ (D & (B ^ C))) + X[5] + 0xd62f105d) & 0xffffffff;
  A = B + (((sum << 5) & 0xffffffff) | (sum >>> 27));
  sum = (D + (B ^ (C & (A ^ B))) + X[10] + 0x02441453) & 0xffffffff;
  D = A + (((sum << 9) & 0xffffffff) | (sum >>> 23));
  sum = (C + (A ^ (B & (D ^ A))) + X[15] + 0xd8a1e681) & 0xffffffff;
  C = D + (((sum << 14) & 0xffffffff) | (sum >>> 18));
  sum = (B + (D ^ (A & (C ^ D))) + X[4] + 0xe7d3fbc8) & 0xffffffff;
  B = C + (((sum << 20) & 0xffffffff) | (sum >>> 12));
  sum = (A + (C ^ (D & (B ^ C))) + X[9] + 0x21e1cde6) & 0xffffffff;
  A = B + (((sum << 5) & 0xffffffff) | (sum >>> 27));
  sum = (D + (B ^ (C & (A ^ B))) + X[14] + 0xc33707d6) & 0xffffffff;
  D = A + (((sum << 9) & 0xffffffff) | (sum >>> 23));
  sum = (C + (A ^ (B & (D ^ A))) + X[3] + 0xf4d50d87) & 0xffffffff;
  C = D + (((sum << 14) & 0xffffffff) | (sum >>> 18));
  sum = (B + (D ^ (A & (C ^ D))) + X[8] + 0x455a14ed) & 0xffffffff;
  B = C + (((sum << 20) & 0xffffffff) | (sum >>> 12));
  sum = (A + (C ^ (D & (B ^ C))) + X[13] + 0xa9e3e905) & 0xffffffff;
  A = B + (((sum << 5) & 0xffffffff) | (sum >>> 27));
  sum = (D + (B ^ (C & (A ^ B))) + X[2] + 0xfcefa3f8) & 0xffffffff;
  D = A + (((sum << 9) & 0xffffffff) | (sum >>> 23));
  sum = (C + (A ^ (B & (D ^ A))) + X[7] + 0x676f02d9) & 0xffffffff;
  C = D + (((sum << 14) & 0xffffffff) | (sum >>> 18));
  sum = (B + (D ^ (A & (C ^ D))) + X[12] + 0x8d2a4c8a) & 0xffffffff;
  B = C + (((sum << 20) & 0xffffffff) | (sum >>> 12));
  sum = (A + (B ^ C ^ D) + X[5] + 0xfffa3942) & 0xffffffff;
  A = B + (((sum << 4) & 0xffffffff) | (sum >>> 28));
  sum = (D + (A ^ B ^ C) + X[8] + 0x8771f681) & 0xffffffff;
  D = A + (((sum << 11) & 0xffffffff) | (sum >>> 21));
  sum = (C + (D ^ A ^ B) + X[11] + 0x6d9d6122) & 0xffffffff;
  C = D + (((sum << 16) & 0xffffffff) | (sum >>> 16));
  sum = (B + (C ^ D ^ A) + X[14] + 0xfde5380c) & 0xffffffff;
  B = C + (((sum << 23) & 0xffffffff) | (sum >>> 9));
  sum = (A + (B ^ C ^ D) + X[1] + 0xa4beea44) & 0xffffffff;
  A = B + (((sum << 4) & 0xffffffff) | (sum >>> 28));
  sum = (D + (A ^ B ^ C) + X[4] + 0x4bdecfa9) & 0xffffffff;
  D = A + (((sum << 11) & 0xffffffff) | (sum >>> 21));
  sum = (C + (D ^ A ^ B) + X[7] + 0xf6bb4b60) & 0xffffffff;
  C = D + (((sum << 16) & 0xffffffff) | (sum >>> 16));
  sum = (B + (C ^ D ^ A) + X[10] + 0xbebfbc70) & 0xffffffff;
  B = C + (((sum << 23) & 0xffffffff) | (sum >>> 9));
  sum = (A + (B ^ C ^ D) + X[13] + 0x289b7ec6) & 0xffffffff;
  A = B + (((sum << 4) & 0xffffffff) | (sum >>> 28));
  sum = (D + (A ^ B ^ C) + X[0] + 0xeaa127fa) & 0xffffffff;
  D = A + (((sum << 11) & 0xffffffff) | (sum >>> 21));
  sum = (C + (D ^ A ^ B) + X[3] + 0xd4ef3085) & 0xffffffff;
  C = D + (((sum << 16) & 0xffffffff) | (sum >>> 16));
  sum = (B + (C ^ D ^ A) + X[6] + 0x04881d05) & 0xffffffff;
  B = C + (((sum << 23) & 0xffffffff) | (sum >>> 9));
  sum = (A + (B ^ C ^ D) + X[9] + 0xd9d4d039) & 0xffffffff;
  A = B + (((sum << 4) & 0xffffffff) | (sum >>> 28));
  sum = (D + (A ^ B ^ C) + X[12] + 0xe6db99e5) & 0xffffffff;
  D = A + (((sum << 11) & 0xffffffff) | (sum >>> 21));
  sum = (C + (D ^ A ^ B) + X[15] + 0x1fa27cf8) & 0xffffffff;
  C = D + (((sum << 16) & 0xffffffff) | (sum >>> 16));
  sum = (B + (C ^ D ^ A) + X[2] + 0xc4ac5665) & 0xffffffff;
  B = C + (((sum << 23) & 0xffffffff) | (sum >>> 9));
  sum = (A + (C ^ (B | (~D))) + X[0] + 0xf4292244) & 0xffffffff;
  A = B + (((sum << 6) & 0xffffffff) | (sum >>> 26));
  sum = (D + (B ^ (A | (~C))) + X[7] + 0x432aff97) & 0xffffffff;
  D = A + (((sum << 10) & 0xffffffff) | (sum >>> 22));
  sum = (C + (A ^ (D | (~B))) + X[14] + 0xab9423a7) & 0xffffffff;
  C = D + (((sum << 15) & 0xffffffff) | (sum >>> 17));
  sum = (B + (D ^ (C | (~A))) + X[5] + 0xfc93a039) & 0xffffffff;
  B = C + (((sum << 21) & 0xffffffff) | (sum >>> 11));
  sum = (A + (C ^ (B | (~D))) + X[12] + 0x655b59c3) & 0xffffffff;
  A = B + (((sum << 6) & 0xffffffff) | (sum >>> 26));
  sum = (D + (B ^ (A | (~C))) + X[3] + 0x8f0ccc92) & 0xffffffff;
  D = A + (((sum << 10) & 0xffffffff) | (sum >>> 22));
  sum = (C + (A ^ (D | (~B))) + X[10] + 0xffeff47d) & 0xffffffff;
  C = D + (((sum << 15) & 0xffffffff) | (sum >>> 17));
  sum = (B + (D ^ (C | (~A))) + X[1] + 0x85845dd1) & 0xffffffff;
  B = C + (((sum << 21) & 0xffffffff) | (sum >>> 11));
  sum = (A + (C ^ (B | (~D))) + X[8] + 0x6fa87e4f) & 0xffffffff;
  A = B + (((sum << 6) & 0xffffffff) | (sum >>> 26));
  sum = (D + (B ^ (A | (~C))) + X[15] + 0xfe2ce6e0) & 0xffffffff;
  D = A + (((sum << 10) & 0xffffffff) | (sum >>> 22));
  sum = (C + (A ^ (D | (~B))) + X[6] + 0xa3014314) & 0xffffffff;
  C = D + (((sum << 15) & 0xffffffff) | (sum >>> 17));
  sum = (B + (D ^ (C | (~A))) + X[13] + 0x4e0811a1) & 0xffffffff;
  B = C + (((sum << 21) & 0xffffffff) | (sum >>> 11));
  sum = (A + (C ^ (B | (~D))) + X[4] + 0xf7537e82) & 0xffffffff;
  A = B + (((sum << 6) & 0xffffffff) | (sum >>> 26));
  sum = (D + (B ^ (A | (~C))) + X[11] + 0xbd3af235) & 0xffffffff;
  D = A + (((sum << 10) & 0xffffffff) | (sum >>> 22));
  sum = (C + (A ^ (D | (~B))) + X[2] + 0x2ad7d2bb) & 0xffffffff;
  C = D + (((sum << 15) & 0xffffffff) | (sum >>> 17));
  sum = (B + (D ^ (C | (~A))) + X[9] + 0xeb86d391) & 0xffffffff;
  B = C + (((sum << 21) & 0xffffffff) | (sum >>> 11));
  this.chain_[0] = (this.chain_[0] + A) & 0xffffffff;
  this.chain_[1] = (this.chain_[1] + B) & 0xffffffff;
  this.chain_[2] = (this.chain_[2] + C) & 0xffffffff;
  this.chain_[3] = (this.chain_[3] + D) & 0xffffffff;
};
goog.crypt.Md5.prototype.update = function(bytes, opt_length) {
  if (!goog.isDef(opt_length)) {
    opt_length = bytes.length;
  }
  var lengthMinusBlock = opt_length - 64;
  var block = this.block_;
  var blockLength = this.blockLength_;
  var i = 0;
  while (i < opt_length) {
    if (blockLength == 0) {
      while (i <= lengthMinusBlock) {
        this.compress_(bytes, i);
        i += 64;
      }
    }
    if (goog.isString(bytes)) {
      while (i < opt_length) {
        block[blockLength++] = bytes.charCodeAt(i++);
        if (blockLength == 64) {
          this.compress_(block);
          blockLength = 0;
          break;
        }
      }
    } else {
      while (i < opt_length) {
        block[blockLength++] = bytes[i++];
        if (blockLength == 64) {
          this.compress_(block);
          blockLength = 0;
          break;
        }
      }
    }
  }
  this.blockLength_ = blockLength;
  this.totalLength_ += opt_length;
};
goog.crypt.Md5.prototype.digest = function() {
  var pad = new Array((this.blockLength_ < 56 ? 64 : 128) - this.blockLength_);
  pad[0] = 0x80;
  for (var i = 1; i < pad.length - 8; ++i) {
    pad[i] = 0;
  }
  var totalBits = this.totalLength_ * 8;
  for (var i = pad.length - 8; i < pad.length; ++i) {
    pad[i] = totalBits & 0xff;
    totalBits /= 0x100;
  }
  this.update(pad);
  var digest = new Array(16);
  var n = 0;
  for (var i = 0; i < 4; ++i) {
    for (var j = 0; j < 32; j += 8) {
      digest[n++] = (this.chain_[i] >>> j) & 0xff;
    }
  }
  return digest;
};
if(typeof module !== 'undefined' && module.exports) {
  var h$fs = require('fs');
}
function h$base_access(file, file_off, mode, c) {
    ;
    h$fs.stat(fd, function(err, fs) {
        if(err) {
            h$handleErrnoC(err, -1, 0, c);
        } else {
            c(mode & fs.mode);
        }
    });
}
function h$base_chmod(file, file_off, mode, c) {
    ;
    h$fs.chmod(h$decodeUtf8z(file, file_off), mode, function(err) {
        h$handleErrnoC(err, -1, 0, c);
    });
}
function h$base_close(fd, c) {
    ;
    var fdo = h$base_fds[fd];
    if(fdo && fdo.close) {
        fdo.close(fd, fdo, c);
    } else {
        h$errno = 22;
        c(-1);
    }
}
function h$base_dup(fd, something, c) {
    throw "h$base_dup";
}
function h$base_dup2(fd, c) {
    throw "h$base_dup2";
}
function h$base_fstat(fd, stat, stat_off, c) {
    ;
    h$fs.fstat(fd, function(err, fs) {
        if(err) {
            h$handlErrnoC(err, -1, 0, c);
        } else {
            h$base_fillStat(fs, stat, stat_off);
            c(0);
        }
    });
}
function h$base_isatty(fd) {
    ;
    if(typeof process !== 'undefined') {
        if(fd === 0) return process.stdin.isTTY?1:0;
        if(fd === 1) return process.stdout.isTTY?1:0;
        if(fd === 2) return process.stderr.isTTY?1:0;
    }
    if(fd === 1 || fd === 2) return 1;
    return 0;
}
function h$base_lseek(fd, pos_1, pos_2, whence, c) {
    ;
    var p = goog.math.Long.fromBits(pos_2, pos_1), p1;
    var o = h$base_fds[fd];
    if(!o) {
        h$errno = CONST_BADF;
        c(-1,-1);
    } else {
        switch(whence) {
        case 0:
            o.pos = p.toNumber();
            c(p.getHighBits(), p.getLowBits());
            break;
        case 1:
            o.pos += p.toNumber();
            p1 = goog.math.Long.fromNumber(o.pos);
            c(p1.getHighBits(), p1.getLowBits());
            break;
        case 2:
            h$fs.fstat(fd, function(err, fs) {
                if(err) {
                    h$setErrno(err);
                    c(-1,-1);
                } else {
                    o.pos = fs.size + p.toNumber();
                    p1 = goog.math.Long.fromNumber(o.pos);
                    c(p1.getHighBits(), p1.getLowBits());
                }
            });
            break;
        default:
            h$errno = 22;
            c(-1,-1);
        }
    }
}
function h$base_lstat(file, file_off, stat, stat_off, c) {
    ;
    h$fs.lstat(h$decodeUtf8z(file, file_off), function(err, fs) {
        if(err) {
            h$handleErrnoC(err, -1, 0, c);
        } else {
            h$base_fillStat(fs, stat, stat_off);
            c(0);
        }
    });
}
function h$base_open(file, file_off, how, mode, c) {
    var flagStr, off;
    var fp = h$decodeUtf8z(file, file_off);
    ;
    var acc = how & h$base_o_accmode;
    var excl = (how & h$base_o_excl) ? 'x' : '';
    if(acc === h$base_o_rdonly) {
        read = true;
        flagStr = 'r' + excl;
        off = 0;
    } else if(acc === h$base_o_wronly) {
        write = true;
        flagStr = (how & h$base_o_trunc ? 'w' : 'a') + excl + '+';
        off = -1;
    } else {
        off = 0;
        read = true;
        write = true;
        if(how & h$base_o_creat) {
            flagStr = ((how & h$base_o_trunc) ? 'w' : 'a') + excl + '+';
        } else {
            flagStr = 'r+';
        }
    }
    h$fs.open(fp, flagStr, mode, function(err, fd) {
        if(err) {
            h$handleErrnoC(err, -1, 0, c);
        } else {
            var f = function(p) {
                h$base_fds[fd] = { read: h$base_readFile
                                 , write: h$base_writeFile
                                 , close: h$base_closeFile
                                 , pos: p
                                 };
                c(fd);
            }
            if(off === -1) {
                h$fs.stat(fp, function(err, fs) {
                    if(err) h$handleErrnoC(err, -1, 0, c); else f(fs.size);
                });
            } else {
                f(0);
            }
        }
    });
}
function h$base_read(fd, buf, buf_off, n, c) {
    ;
    var fdo = h$base_fds[fd];
    if(fdo && fdo.read) {
        fdo.read(fd, fdo, buf, buf_off, n, c);
    } else {
        h$errno = 22;
        c(-1);
    }
}
function h$base_stat(file, file_off, stat, stat_off, c) {
    ;
    h$fs.stat(h$decodeUtf8z(file, file_off), function(err, fs) {
        if(err) {
            h$handlErrnoC(err, -1, 0, c);
        } else {
            h$base_fillStat(fs, stat, stat_off);
            c(0);
        }
    });
}
function h$base_umask(mode) {
    ;
    return process.umask(mode);
}
function h$base_write(fd, buf, buf_off, n, c) {
    ;
    var fdo = h$base_fds[fd];
    if(fdo && fdo.write) {
        fdo.write(fd, fdo, buf, buf_off, n, c);
    } else {
        h$errno = 22;
        c(-1);
    }
}
function h$base_ftruncate(fd, pos_1, pos_2, c) {
    ;
    h$fs.ftruncate(fd, goog.math.Long.fromBits(pos_2, pos_1).toNumber(), function(err) {
        h$handleErrnoC(err, -1, 0, c);
    });
}
function h$base_unlink(file, file_off, c) {
    ;
    h$fs.unlink(h$decodeUtf8z(file, file_off), function(err) {
        h$handleErrnoC(err, -1, 0, c);
    });
}
function h$base_getpid() {
    ;
    return process.pid;
}
function h$base_link(file1, file1_off, file2, file2_off, c) {
    ;
    h$fs.link(h$decodeUtf8z(file1, file1_off), h$decodeUtf8z(file2, file2_off), function(err) {
        h$handleErrnoC(err, -1, 0, c);
    });
}
function h$base_mkfifo(file, file_off, mode, c) {
    throw "h$base_mkfifo";
}
function h$base_sigemptyset(sigset, sigset_off) {
    return 0;
}
function h$base_sigaddset(sigset, sigset_off, sig) {
    return 0;
}
function h$base_sigprocmask(sig, sigset1, sigset1_off, sigset2, sigset2_off) {
    return 0;
}
function h$base_tcgetattr(attr, termios, termios_off) {
    return 0;
}
function h$base_tcsetattr(attr, val, termios, termios_off) {
    return 0;
}
function h$base_utime(file, file_off, timbuf, timbuf_off, c) {
    ;
    h$fs.fstat(h$decodeUtf8z(file, file_off), function(err, fs) {
        if(err) {
            h$handleErrnoC(err, 0, -1, c);
        } else {
            var atime = goog.math.Long.fromNumber(fs.atime.getTime());
            var mtime = goog.math.Long.fromNumber(fs.mtime.getTime());
            var ctime = goog.math.Long.fromNumber(fs.ctime.getTime());
            timbuf.i3[0] = atime.getHighBits();
            timbuf.i3[1] = atime.getLowBits();
            timbuf.i3[2] = mtime.getHighBits();
            timbuf.i3[3] = mtime.getLowBits();
            timbuf.i3[4] = ctime.getHighBits();
            timbuf.i3[5] = ctime.getLowBits();
            c(0);
        }
    });
}
function h$base_waitpid(pid, stat, stat_off, options, c) {
    throw "h$base_waitpid";
}
var h$base_o_rdonly = 0x00000;
var h$base_o_wronly = 0x00001;
var h$base_o_rdwr = 0x00002;
var h$base_o_accmode = 0x00003;
var h$base_o_append = 0x00008;
var h$base_o_creat = 0x00200;
var h$base_o_trunc = 0x00400;
var h$base_o_excl = 0x00800;
var h$base_o_noctty = 0x20000;
var h$base_o_nonblock = 0x00004;
var h$base_o_binary = 0x00000;
function h$base_c_s_isreg(mode) {
    return 1;
}
function h$base_c_s_ischr(mode) {
    return 0;
}
function h$base_c_s_isblk(mode) {
    return 0;
}
function h$base_c_s_isdir(mode) {
    return 0;
}
function h$base_c_s_isfifo(mode) {
    return 0;
}
function h$base_fillStat(fs, b, off) {
    if(off%4) throw "h$base_fillStat: not aligned";
    var o = off>>2;
    b.i3[o+0] = fs.mode;
    var s = goog.math.Long.fromNumber(fs.size);
    b.i3[o+1] = s.getHighBits();
    b.i3[o+2] = s.getLowBits();
    b.i3[o+3] = 0;
    b.i3[o+4] = 0;
    b.i3[o+5] = fs.dev;
    b.i3[o+6] = fs.ino;
    b.i3[o+7] = fs.uid;
    b.i3[o+8] = fs.gid;
}
var h$base_sizeof_stat = 36;
function h$base_st_mtime(stat, stat_off) {
    h$ret1 = stat.i3[(stat_off>>2)+4];
    return stat.i3[(stat_off>>2)+3];
}
function h$base_st_size(stat, stat_off) {
    h$ret1 = stat.i3[(stat_off>>2)+2];
    return stat.i3[(stat_off>>2)+1];
}
function h$base_st_mode(stat, stat_off) {
    return stat.i3[stat_off>>2];
}
function h$base_st_dev(stat, stat_off) {
    return stat.i3[(stat_off>>2)+5];
}
function h$base_st_ino(stat, stat_off) {
    return stat.i3[(stat_off>>2)+6];
}
var h$base_echo = 1;
var h$base_tcsanow = 2;
var h$base_icanon = 4;
var h$base_vmin = 8;
var h$base_vtime = 16;
var h$base_sigttou = 0;
var h$base_sig_block = 0;
var h$base_sig_setmask = 0;
var h$base_f_getfl = 0;
var h$base_f_setfl = 0;
var h$base_f_setfd = 0;
var h$base_fd_cloexec = 0;
var h$base_sizeof_termios = 4;
var h$base_sizeof_sigset_t = 4;
var h$base_lflag = 0;
function h$base_poke_lflag(termios, termios_off, flag) {
    return 0;
}
function h$base_ptr_c_cc(termios, termios_off) {
    h$ret1 = 0;
    return h$newByteArray(8);
}
var h$base_default_buffer_size = 32768;
function h$base_c_s_issock(mode) {
    return 0;
}
var h$base_SEEK_SET = 0;
var h$base_SEEK_CUR = 1;
var h$base_SEEK_END = 2;
function h$base_set_saved_termios(a, b, c) {
    h$ret1 = 0
    return null;
}
function h$base_get_saved_termios(r) {
    h$ret1 = 0;
    return null;
}
function h$lockFile(fd, dev, ino, for_writing) {
    ;
    return 0;
}
function h$unlockFile(fd) {
    ;
    return 0;
}
var h$base_readStdin, h$base_writeStderr, h$base_writeStdout;
var h$base_readFile, h$base_writeFile, h$base_closeFile;
if(typeof module !== 'undefined' && module.exports) {
    var h$base_stdin_waiting = new h$Queue();
    var h$base_stdin_chunk = { buf: null
                               , pos: 0
                               , processing: false
                               };
    var h$base_stdin_eof = false;
    var h$base_process_stdin = function() {
        var c = h$base_stdin_chunk;
        var q = h$base_stdin_waiting;
        if(!q.length() || c.processing) return;
        c.processing = true;
        if(!c.buf) { c.pos = 0; c.buf = process.stdin.read(); }
        while(c.buf && q.length()) {
            var x = q.dequeue();
            var n = Math.min(c.buf.length - c.pos, x.n);
            for(var i=0;i<n;i++) {
                x.buf.u8[i+x.off] = c.buf[c.pos+i];
            }
            c.pos += n;
            x.c(n);
            if(c.pos >= c.buf.length) c.buf = null;
            if(!c.buf && q.length()) { c.pos = 0; c.buf = process.stdin.read(); }
        }
        while(h$base_stdin_eof && q.length()) q.dequeue().c(0);
        c.processing = false;
    }
    h$base_closeFile = function(fd, fdo, c) {
        h$fs.close(fd, function(err) {
            delete h$base_fds[fd];
            h$handleErrnoC(err, -1, 0, c);
        });
    }
    h$base_readFile = function(fd, fdo, buf, buf_offset, n, c) {
        var pos = typeof fdo.pos === 'number' ? fdo.pos : null;
        ;
        h$fs.read(fd, new Buffer(n), buf_offset, n, pos, function(err, bytesRead, nbuf) {
            if(err) {
                h$setErrno(err);
                c(-1);
            } else {
                for(var i=bytesRead-1;i>=0;i--) buf.u8[buf_offset+i] = nbuf[i];
                if(typeof fdo.pos === 'number') fdo.pos += bytesRead;
                c(bytesRead);
            }
        });
    }
    h$base_readStdin = function(fd, fdo, buf, buf_offset, n, c) {
        ;
        h$base_stdin_waiting.enqueue({buf: buf, off: buf_offset, n: n, c: c});
        h$base_process_stdin();
    }
    h$base_writeFile = function(fd, fdo, buf, buf_offset, n, c) {
        var pos = typeof fdo.pos === 'number' ? fdo.pos : null;
        ;
        var nbuf = new Buffer(n);
        for(var i=0;i<n;i++) nbuf[i] = buf.u8[i+buf_offset];
        if(typeof fdo.pos === 'number') fdo.pos += n;
        h$fs.write(fd, nbuf, 0, n, pos, function(err, bytesWritten) {
            ;
            if(err) {
                h$setErrno(err);
                if(typeof fdo.pos === 'number') fdo.pos -= n;
                if(h$errno === 35)
                    setTimeout(function() { h$base_writeFile(fd, fdo, buf, buf_offset, n, c); }, 20);
                else c(-1);
            } else {
                if(typeof fdo.pos === 'number') fdo.pos += bytesWritten - n;
                c(bytesWritten);
            }
        });
    }
    h$base_writeStdout = function(fd, fdo, buf, buf_offset, n, c) {
        ;
        h$base_writeFile(1, fdo, buf, buf_offset, n, c);
    }
    h$base_writeStderr = function(fd, fdo, buf, buf_offset, n, c) {
        ;
        h$base_writeFile(2, fdo, buf, buf_offset, n, c);
    }
    process.stdin.on('readable', h$base_process_stdin);
    process.stdin.on('end', function() { h$base_stdin_eof = true; h$base_process_stdin(); });
} else if (typeof putstr !== 'undefined' && typeof printErr !== 'undefined') {
    h$base_readStdin = function(fd, fdo, buf, buf_offset, n, c) {
        c(0);
    }
    h$base_writeStdout = function(fd, fdo, buf, buf_offset, n, c) {
        putstr(h$decodeUtf8(buf, n, buf_offset));
        c(n);
    }
    h$base_writeStderr = function(fd, fdo, buf, buf_offset, n, c) {
        printErr(h$decodeUtf8(buf, n, buf_offset));
        c(n);
    }
} else {
    h$base_readStdin = function(fd, fdo, buf, buf_offset, n, c) {
        c(0);
    }
    h$base_writeStdout = function(fd, fdo, buf, buf_offset, n, c) {
        console.log(h$decodeUtf8(buf, n, buf_offset));
        c(n);
    }
    h$base_writeStderr = function(fd, fdo, buf, buf_offset, n, c) {
        console.log(h$decodeUtf8(buf, n, buf_offset));
        c(n);
    }
}
var h$base_stdin_fd = { read: h$base_readStdin };
var h$base_stdout_fd = { write: h$base_writeStdout };
var h$base_stderr_fd = { write: h$base_writeStderr };
var h$base_fdN = -1;
var h$base_fds = [h$base_stdin_fd, h$base_stdout_fd, h$base_stderr_fd];
function h$shutdownHaskellAndExit(code, fast) {
    if(typeof process !== 'undefined' && process.exit) {
        process.exit(code);
    } else if(typeof quit !== 'undefined') {
        quit(code);
    }
}
function h$fps_reverse(a_v, a_o, b_v, b_o, n) {
    if(n > 0) {
        var au8 = a_v.u8, bu8 = b_v.u8;
        for(var i=0;i<n;i++) {
            au8[a_o+n-i-1] = bu8[b_o+i];
        }
    }
}
function h$fps_intersperse(a_v,a_o,b_v,b_o,n,c) {
    if(n > 0) {
        var au8 = a_v.u8, bu8 = b_v.u8, dst_o = a_o;
        for(var i=0;i<n-1;i++) {
            au8[dst_o] = bu8[b_o+i];
            au8[dst_o+1] = c;
            dst_o += 2;
        }
        au8[dst_o] = bu8[b_o+n-1];
    }
}
function h$fps_maximum(a_v,a_o,n) {
    if(n > 0) {
        var au8 = a_v.u8, max = au8[a_o];
        for(var i=1;i<n;i++) {
            var c = au8[a_o+i];
            if(c > max) { max = c; }
        }
        return max;
    }
    return 0;
}
function h$fps_minimum(a_v,a_o,n) {
    if(n > 0) {
        var au8 = a_v.u8, min = a_v.u8[a_o];
        for(var i=1;i<n;i++) {
            var c = au8[a_o+i];
            if(c < min) { min = c; }
        }
        return min;
    }
    return 255;
}
function h$fps_count(a_v,a_o,n,c) {
    if(n > 0) {
        var au8 = a_v.u8, count = 0;
        for(var i=0;i<n;i++) {
            if(au8[a_o+i] === c) { count++; }
        }
        return count|0;
    }
    return 0;
}
function h$fps_memcpy_offsets(dst_d, dst_o, dst_off
                              , src_d, src_o, src_off, n) {
    return memcpy(dst_d, dst_o + dst_off, src_d, src_o + src_off, n);
}
var h$_hs_bytestring_digits = [48,49,50,51,52,53,54,55,56,57,97,98,99,100,101,102];
var h$_hs_bytestring_l10 = goog.math.Long.fromBits(10, 0);
var h$_hs_bytestring_b10 = h$bigFromInt(10);
function h$_hs_bytestring_int_dec(x, buf_d, buf_o) {
    var c, ptr = buf_o, next_free, x_tmp;
    var bu8 = buf_d.u8;
    if(x < 0) {
        bu8[ptr++] = 45;
        buf_o++;
        x_tmp = x;
        x = (x / 10) | 0;
        bu8[ptr++] = h$_hs_bytestring_digits[x * 10 - x_tmp];
        if(x === 0) {
            h$ret1 = ptr;
            return buf_d;
        } else {
            x = -x;
        }
    }
    do {
        x_tmp = x;
        x = (x / 10) | 0;
        bu8[ptr++] = h$_hs_bytestring_digits[x_tmp - x * 10];
    } while (x);
    next_free = ptr--;
    while(buf_o < ptr) {
        c = bu8[ptr];
        bu8[ptr--] = bu8[buf_o];
        bu8[buf_o++] = c;
    }
    h$ret1 = next_free;
    return buf_d;
}
function h$_hs_bytestring_long_long_int_dec(x_a, x_b, buf_d, buf_o) {
    var l10 = h$_hs_bytestring_l10;
    var x = goog.math.Long.fromBits(x_b, x_a);
    var c, ptr = buf_o, next_free;
    var bu8 = buf_d.u8;
    if(x.isNegative()) {
        bu8[ptr++] = 45;
        buf_o++;
        x_tmp = x;
        x = x.div(l10);
        bu8[ptr++] = h$_hs_bytestring_digits[x.multiply(l10).subtract(x_tmp).getLowBits()];
        if(x.isZero()) {
            h$ret1 = ptr;
            return buf_d;
        } else {
            x = x.negate();
        }
    }
    do {
        x_tmp = x;
        x = x.div(l10);
        bu8[ptr++] = h$_hs_bytestring_digits[x_tmp.subtract(x.multiply(l10))];
    } while (!x.isZero());
    next_free = ptr--;
    while(buf_o < ptr) {
        c = bu8[ptr];
        bu8[ptr--] = bu8[buf_o];
        bu8[buf_o++] = c;
    }
    h$ret1 = next_free;
    return buf_d;
}
function h$_hs_bytestring_uint_dec(x, buf_d, buf_o) {
    var c, ptr = buf_o, next_free;
    var bu8 = buf_d.u8;
    var x_tmp;
    if(x < 0) x += 4294967296;
    do {
        x_tmp = x;
        x = (x / 10) | 0;
        bu8[ptr++] = h$_hs_bytestring_digits[x_tmp - x * 10];
    } while(x);
    next_free = ptr--;
    while(buf_o < ptr) {
        c = bu8[ptr];
        bu8[ptr--] = bu8[buf_o];
        bu8[buf_o++] = c;
    }
    h$ret1 = next_free;
    return buf_d;
}
function h$_hs_bytestring_long_long_uint_dec(x_a, x_b, buf_d, buf_o) {
    var b10 = h$_hs_bytestring_b10;
    var c, ptr = buf_o, next_free;
    var bu8 = buf_d.u8;
    var x = h$bigFromWord64(x_a, x_b), x_tmp;
    do {
        x_tmp = x;
        x = x.divide(b10);
        bu8[ptr++] = h$_hs_bytestring_digits[x_tmp.subtract(x.multiply(b10))];
    } while(x.signum() !== 0);
    next_free = ptr--;
    while(buf_o < ptr) {
        c = bu8[ptr];
        bu8[ptr--] = bu8[buf_o];
        bu8[buf_o++] = c;
    }
    h$ret1 = next_free;
    return buf_d;
}
function h$_hs_bytestring_int_dec_padded9(x, buf_d, buf_o) {
    var max_width_int32_dec = 9;
    var ptr = buf_o + max_width_int32_dec;
    var bu8 = buf_d.u8;
    var x_tmp;
    do {
        x_tmp = x;
        x = (x / 10) | 0;
        bu8[--ptr] = h$_hs_bytestring_digits[x_tmp - x * 10];
    } while(x);
    while (buf_o < ptr) { bu8[--ptr] = 48; }
}
function h$_hs_bytestring_long_long_int_dec_padded18(x_a, x_b, buf_d, buf_o) {
    var l10 = h$_hs_bytestring_l10;
    var max_width_int64_dec = 18;
    var ptr = buf_o + max_width_int64_dec;
    var bu8 = buf_d.u8;
    var x = goog.math.Long.fromBits(x_b, x_a);
    do {
        x_tmp = x;
        x = x.div(l10);
        bu8[--ptr] = h$_hs_bytestring_digits[x_tmp.subtract(x.multiply(l10))];
    } while (!x.isZero());
    while (buf_o < ptr) { bu8[--ptr] = 48; }
}
function h$_hs_bytestring_uint_hex(x, buf_d, buf_o) {
    var c, ptr = buf_o, next_free;
    var bu8 = buf_d.u8;
    do {
        bu8[ptr++] = h$_hs_bytestring_digits[x & 0xf];
        x >>>= 4;
    } while(x);
    next_free = ptr--;
    while(buf_o < ptr) {
        c = bu8[ptr];
        bu8[ptr--] = bu8[buf_o];
        bu8[buf_o++] = c;
    }
    h$ret1 = next_free;
    return buf_d;
}
function h$_hs_bytestring_long_long_uint_hex(x_a, x_b, buf_d, buf_o) {
    var c, ptr = buf_o, next_free;
    var bu8 = buf_d.u8;
    if(x_a === 0 && x_b === 0) {
        bu8[ptr++] = 48;
    } else {
        while(x_b !== 0) {
            bu8[ptr++] = h$_hs_bytestring_digits[x_b & 0xf];
            x_b >>>= 4;
        }
        while(x_a !== 0) {
            bu8[ptr++] = h$_hs_bytestring_digits[x_a & 0xf];
            x_a >>>= 4;
        }
    }
    next_free = ptr--;
    while(buf_o < ptr) {
        c = bu8[ptr];
        bu8[ptr--] = bu8[buf_o];
        bu8[buf_o++] = c;
    }
    h$ret1 = next_free;
    return buf_d;
}
function h$isFloat (n) {
  return n===+n && n!==(n|0);
}
function h$isInteger (n) {
  return n===+n && n===(n|0);
}
function h$typeOf(o) {
    if (!(o instanceof Object)) {
        if (o == null) {
            return 0;
        } else if (typeof o == 'number') {
            if (h$isInteger(o)) {
                return 1;
            } else {
                return 2;
            }
        } else if (typeof o == 'boolean') {
            return 3;
        } else {
            return 4;
        }
    } else {
        if (Object.prototype.toString.call(o) == '[object Array]') {
            return 5;
        } else if (!o) {
            return 0;
        } else {
            return 6;
        }
    }
}
function h$listprops(o) {
    if (!(o instanceof Object)) {
        return [];
    }
    var l = [];
    for (var prop in o) {
        l.push(prop);
    }
    return l;
}
function h$flattenObj(o) {
    var l = [];
    for (var prop in o) {
        l.push([prop, o[prop]]);
    }
    return l;
}
function h$ghcjs_setLineDash(arr, ctx) {
    if (typeof ctx.setLineDash !== 'undefined' ) {
        ctx.setLineDash(arr);
    } else if (typeof ctx.mozDash !== 'undefined' ) {
        ctx.mozDash = arr;
    }
};
function h$ghcjs_lineDashOffset(off, ctx) {
    if (typeof ctx.setLineDash !== 'undefined' ) {
        ctx.lineDashOffset = off;
    } else if (typeof ctx.mozDash !== 'undefined' ) {
        ctx.mozDashOffset = off;
    }
};
function h$ghcjs_currentWindow() {
  return window;
};
function h$ghcjs_currentDocument() {
  return document;
};
function h$hashable_fnv_hash_offset(str_a, o, len, hash) {
  return h$hashable_fnv_hash(str_a, o, len, hash);
}
function h$hashable_fnv_hash(str_d, str_o, len, hash) {
  if(len > 0) {
    var d = str_d.u8;
    for(var i=0;i<len;i++) {
      hash = h$mulInt32(hash, 16777619) ^ d[str_o+i];
    }
  }
  return hash;
}
function h$hashable_getRandomBytes(dest_d, dest_o, len) {
  if(len > 0) {
    var d = dest_d.u8;
    for(var i=0;i<len;i++) {
      d[dest_o+i] = Math.floor(Math.random() * 256);
    }
  }
  return len;
}
function h$_hs_text_memcpy(dst_v,dst_o2,src_v,src_o2,n) {
  return h$memcpy(dst_v,2*dst_o2,src_v,2*src_o2,2*n);
}
function h$_hs_text_memcmp(a_v,a_o2,b_v,b_o2,n) {
  return h$memcmp(a_v,2*a_o2,b_v,2*b_o2,2*n);
}
var h$_text_UTF8_ACCEPT = 0;
var h$_text_UTF8_REJECT = 12
var h$_text_utf8d =
   [
   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
   1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1, 9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,
   7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7, 7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
   8,8,2,2,2,2,2,2,2,2,2,2,2,2,2,2, 2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
  10,3,3,3,3,3,3,3,3,3,3,3,3,4,3,3, 11,6,6,6,5,8,8,8,8,8,8,8,8,8,8,8,
   0,12,24,36,60,96,84,12,12,12,48,72, 12,12,12,12,12,12,12,12,12,12,12,12,
  12, 0,12,12,12,12,12, 0,12, 0,12,12, 12,24,12,12,12,12,12,24,12,24,12,12,
  12,12,12,12,12,12,12,24,12,12,12,12, 12,24,12,12,12,12,12,12,12,24,12,12,
  12,12,12,12,12,12,12,36,12,36,12,12, 12,36,12,12,12,12,12,36,12,36,12,12,
  12,36,12,12,12,12,12,12,12,12,12,12];
function h$_hs_text_decode_utf8_internal ( dest_v
                                         , destoff_v, destoff_o
                                         , src_v, src_o
                                         , src_end_v, src_end_o
                                         , s
                                         ) {
  if(src_v === null || src_end_v === null) {
    h$ret1 = src_end_o;
    return null;
  }
  var dsto = destoff_v.dv.getUint32(destoff_o,true) << 1;
  var srco = src_o;
  var state = s.state;
  var codepoint = s.codepoint;
  var ddv = dest_v.dv;
  var sdv = src_v.dv;
  function decode(b) {
    var type = h$_text_utf8d[b];
    codepoint = (state !== h$_text_UTF8_ACCEPT) ?
      (b & 0x3f) | (codepoint << 6) :
      (0xff >>> type) & b;
    state = h$_text_utf8d[256 + state + type];
    return state;
  }
  while (srco < src_end_o) {
    if(decode(sdv.getUint8(srco++)) !== h$_text_UTF8_ACCEPT) {
      if(state !== h$_text_UTF8_REJECT) {
        continue;
      } else {
        break;
      }
    }
    if (codepoint <= 0xffff) {
      ddv.setUint16(dsto,codepoint,true);
      dsto += 2;
    } else {
      ddv.setUint16(dsto,(0xD7C0 + (codepoint >>> 10)),true);
      ddv.setUint16(dsto+2,(0xDC00 + (codepoint & 0x3FF)),true);
      dsto += 4;
    }
    s.last = srco;
  }
  s.state = state;
  s.codepoint = codepoint;
  destoff_v.dv.setUint32(destoff_o,dsto>>1,true);
  h$ret1 = srco;
  return src_v;
}
function h$_hs_text_decode_utf8_state( dest_v
                                     , destoff_v, destoff_o
                                     , src_v, src_o
                                     , srcend_v, srcend_o
                                     , codepoint0_v, codepoint0_o
                                     , state0_v, state0_o
                                     ) {
  var s = { state: state0_v.dv.getUint32(state0_o, true)
          , codepoint: codepoint0_v.dv.getUint32(codepoint0_o, true)
          , last: src_o
          };
  var ret = h$_hs_text_decode_utf8_internal ( dest_v
                                            , destoff_v, destoff_o
                                            , src_v.arr[src_o][0], src_v.arr[src_o][1]
                                            , srcend_v, srcend_o
                                            , s
                                            );
  src_v.arr[src_o][1] = s.last;
  state0_v.dv.setUint32(state0_o, s.state, true);
  codepoint0_v.dv.setUint32(codepoint0_o, s.codepoint, true);
  if(s.state === h$_text_UTF8_REJECT)
    h$ret1--;
  return ret;
}
function h$_hs_text_decode_utf8( dest_v
                               , destoff_v, destoff_o
                               , src_v, src_o
                               , srcend_v, srcend_o
                               ) {
  var s = { state: h$_text_UTF8_ACCEPT
          , codepoint: 0
          , last: src_o
          };
  var ret = h$_hs_text_decode_utf8_internal ( dest_v
                                            , destoff_v, destoff_o
                                            , src_v, src_o
                                            , srcend_v, srcend_o
                                            , s
                                            );
  if (s.state !== h$_text_UTF8_ACCEPT)
    h$ret1--;
  return ret;
}
function h$_hs_text_decode_latin1(dest_d, src_d, src_o, srcend_d, srcend_o) {
  var p = src_o;
  var d = 0;
  var su8 = src_d.u8;
  var su3 = src_d.u3;
  var du1 = dest_d.u1;
  while(p != srcend_o && p & 3) {
    du1[d++] = su8[p++];
  }
  if(su3) {
    while (p < srcend_o - 3) {
      var w = su3[p>>2];
      du1[d++] = w & 0xff;
      du1[d++] = (w >>> 8) & 0xff;
      du1[d++] = (w >>> 16) & 0xff;
      du1[d++] = (w >>> 32) & 0xff;
      p += 4;
    }
  }
  while (p != srcend_o)
    du1[d++] = su8[p++];
}
function h$_hs_text_encode_utf8(destp_v, destp_o, src_v, srcoff, srclen) {
  var dest_v = destp_v.arr[destp_o][0];
  var dest_o = destp_v.arr[destp_o][1];
  var src = srcoff;
  var dest = dest_o;
  var srcend = src + srclen;
  var srcu1 = src_v.u1;
  if(!srcu1) throw "h$_hs_text_encode_utf8: invalid alignment for source";
  var srcu3 = src_v.u3;
  var destu8 = dest_v.u8;
  while(src < srcend) {
    while(srcu3 && !(src & 1) && srcend - src >= 2) {
      var w = srcu3[src>>1];
      if(w & 0xFF80FF80) break;
      destu8[dest++] = w & 0xFFFF;
      destu8[dest++] = w >>> 16;
      src += 2;
    }
    while(src < srcend) {
      var w = srcu1[src++];
      if(w <= 0x7F) {
        destu8[dest++] = w;
        break;
      } else if(w <= 0x7FF) {
        destu8[dest++] = (w >> 6) | 0xC0;
        destu8[dest++] = (w & 0x3f) | 0x80;
      } else if(w < 0xD800 || w > 0xDBFF) {
        destu8[dest++] = (w >>> 12) | 0xE0;
        destu8[dest++] = ((w >> 6) & 0x3F) | 0x80;
        destu8[dest++] = (w & 0x3F) | 0x80;
      } else {
        var c = ((w - 0xD800) << 10) + (srcu1[src++] - 0xDC00) + 0x10000;
        destu8[dest++] = (c >>> 18) | 0xF0;
        destu8[dest++] = ((c >> 12) & 0x3F) | 0x80;
        destu8[dest++] = ((c >> 6) & 0x3F) | 0x80;
        destu8[dest++] = (c & 0x3F) | 0x80;
      }
    }
  }
  destp_v.arr[destp_o][1] = dest;
}
