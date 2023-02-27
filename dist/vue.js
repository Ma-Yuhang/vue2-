(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
      var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;
      try {
        if (_x = (_i = _i.call(arr)).next, 0 === i) {
          if (Object(_i) !== _i) return;
          _n = !1;
        } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpan = new RegExp("^<".concat(qnameCapture));
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  // 匹配属性
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>']+)))?/;
  var startTagClose = /^\s*(\/?)>/;

  // 对模板进行编译处理
  function parseHTML(html) {
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3;
    var stack = []; // 用于存放元素的栈
    var currentParent; // 指向的是栈中的最后一个
    var root;
    function createASTElement(tag, attrs) {
      return {
        tag: tag,
        type: ELEMENT_TYPE,
        children: [],
        attrs: attrs,
        parent: null
      };
    }
    function start(tag, attrs) {
      var node = createASTElement(tag, attrs);
      if (!root) {
        // 一上来没有root时
        root = node;
      }
      if (currentParent) {
        node.parent = currentParent;
        currentParent.children.push(node);
      }
      stack.push(node); // 添加到栈中
      currentParent = node; // currentParent为栈中的最后一个
    }

    function chars(text) {
      text = text.replace(/\s/g, '');
      text && currentParent.children.push({
        type: TEXT_TYPE,
        text: text,
        parent: currentParent
      });
    }
    function end(tag) {
      stack.pop(); // 弹出最后一个
      currentParent = stack[stack.length - 1];
    }
    function advance(n) {
      html = html.slice(n);
    }
    function parseStartTag() {
      var start = html.match(startTagOpan);
      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); // <div
        // console.log(match, html);
        var attr, _end;
        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5] || true
          });
        }
        if (_end) {
          advance(_end[0].length);
        }
        // console.log(match);
        return match;
      }
      return false;
    }
    while (html) {
      // 如果textend等于0说明是开始标签
      // 如果textend > 0说明文本结束
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        var startTagMatch = parseStartTag(); // 开始标签的匹配结果
        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }
      if (textEnd > 0) {
        var text = html.substring(0, textEnd); // 文本内容
        if (text) {
          chars(text);
          advance(text.length);
        }
      }
    }
    return root;
  }

  function genProps(attrs) {
    // console.log(attrs, '1');
    var str = '';
    attrs.forEach(function (attr) {
      if (attr.name == 'style') {
        var obj = {};
        attr.value.split(';').forEach(function (item) {
          if (!item) return;
          var _item$split = item.split(':'),
            _item$split2 = _slicedToArray(_item$split, 2),
            key = _item$split2[0],
            value = _item$split2[1];
          obj[key] = value.trim();
        });
        attr.value = obj;
      }
      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    });
    return "{".concat(str.slice(0, -1), "}");
  }
  // 匹配{{}}
  var defaultTagClose = /\{\{((?:.|\r?\n)+?)\}\}/g;
  function gen(child) {
    if (child.type === 1) {
      // 是元素节点继续生成code
      return codegen(child);
    } else {
      // console.log(child);
      var text = child.text;
      if (!defaultTagClose.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      } else {
        var tokens = [];
        var match;
        defaultTagClose.lastIndex = 0;
        var lastIndex = 0;
        while (match = defaultTagClose.exec(text)) {
          var index = match.index; // 匹配的位置 {{name}} hello  {{name}}  hello
          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }
          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length;
        }
        if (lastIndex < text.length) {
          tokens.push(text.slice(lastIndex));
        }
        return "_v(".concat(tokens.join('+'), ")");
      }
    }
  }
  function genChildren(children) {
    return children.map(function (child) {
      return gen(child);
    }).join(',');
  }
  function codegen(ast) {
    var children = genChildren(ast.children);
    var code = "_c('".concat(ast.tag, "',").concat(ast.attrs.length > 0 ? genProps(ast.attrs) : null).concat(ast.children.length > 0 ? ",".concat(children) : '', ")");
    return code;
  }
  function compileToFunction(template) {
    // 1.将template转换成ast语法树
    var ast = parseHTML(template);
    // console.log(ast);
    // 2.根据ast生成render函数（render函数执行后的结果就是虚拟DOM）
    console.log(codegen(ast));

    // 3.生成真实DOM
  }

  // 重写数组的7个变异方法，并且保留数组原来的方法

  var oldArrayPrototype = Array.prototype;
  var newArrayPrototype = Object.create(oldArrayPrototype);
  var methods = ['push', 'pop', 'unshift', 'shift', 'reverse', 'sort', 'replace'];
  methods.forEach(function (method) {
    // 重写这7个方法
    newArrayPrototype[method] = function () {
      var _oldArrayPrototype$me;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var res = (_oldArrayPrototype$me = oldArrayPrototype[method]).call.apply(_oldArrayPrototype$me, [this].concat(args));
      console.log('调用了' + method);
      var inserted;
      var ob = this.__ob__;
      // 监测用户用push、unshift、splice方法添加数据
      switch (method) {
        case 'push':
        case 'unshift':
          // arr.push({a:1})
          inserted = args;
          break;
        case 'splice':
          // arr.splice(0,1,{a:1},{b:2})
          inserted = args.slice(2);
          break;
      }
      if (inserted) {
        ob.observeArray(inserted);
      }
      return res;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);
      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false // 不可枚举
      });

      if (Array.isArray(data)) {
        // 在这里重写数组中的7中变异方法
        data.__proto__ = newArrayPrototype;
        this.observeArray(data); // 如果数组中有对象，可以监测到变化
      } else {
        this.walk(data);
      }
    }
    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        // 循环对象 对属性依次劫持
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        // 对数组进行处理
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }]);
    return Observer;
  }();
  function defineReactive(target, key, value) {
    observe(value); // 递归调用 多层结构添加getter setter
    // 重新定义每个属性 对每个属性添加getter setter
    Object.defineProperty(target, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (value === newValue) return;
        observe(newValue); // 用户可能修改一整个对象 vm.adds = {}
        value = newValue;
      }
    });
  }
  function observe(data) {
    // 对这个对象进行劫持
    if (_typeof(data) !== 'object' || data == null) {
      return;
    }
    if (data.__ob__ instanceof Observer) {
      // 说明被观测过了
      return data.__ob__;
    }
    return new Observer(data);
  }

  function initState(vm) {
    var opts = vm.$options;
    if (opts.data) {
      initData(vm);
    }
  }

  // 当用户访问vm.xxx时 实际访问的是vm._data.xxx
  // 用户代理
  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key]; // vm.name => vm._data.name
      },
      set: function set(newValue) {
        vm[target][key] = newValue;
      }
    });
  }
  // 初始化data
  function initData(vm) {
    var data = vm.$options.data;
    data = typeof data === 'function' ? data.call(vm) : data;
    vm._data = data;
    observe(data);
    for (var key in data) {
      proxy(vm, '_data', key); // 用户代理
    }
  }

  function initMixin(Vue) {
    // 给Vue添加init方法
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; // 将用户的选项挂载到实例上

      // 初始化数据
      initState(vm);
      if (options.el) {
        vm.$mount(options.el);
      }
    };
    Vue.prototype.$mount = function (el) {
      var vm = this;
      el = document.querySelector(el);
      if (!el) {
        console.log('没有el');
      }
      var opts = vm.$options;
      if (!opts.render) {
        // 如果没有写render函数
        var template;
        if (!opts.template && el) {
          // 没有写template但是写了el
          template = el.outerHTML;
        } else if (opts.template && el) {
          template = opts.template;
        }
        var render = compileToFunction(template);
        opts.render = render;
      }
    };
  }

  function Vue(options) {
    this._init(options);
  }
  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
