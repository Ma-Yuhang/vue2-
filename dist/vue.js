(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  var strats = {};
  var LIFECYCLE = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];
  LIFECYCLE.forEach(function (hook) {
    strats[hook] = function (p, c) {
      if (c) {
        if (p) {
          return p.concat(c);
        } else {
          return [c];
        }
      } else {
        return p;
      }
    };
  });
  function mergeOptions(parent, child) {
    // 合并两个对象
    var options = {};
    for (var key in parent) {
      mergeField(key);
    }
    for (var _key in child) {
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    }
    function mergeField(key) {
      if (strats[key]) {
        // 证明是生命周期钩子 需要合并成数组
        options[key] = strats[key](parent[key], child[key]);
      } else {
        options[key] = child[key] || parent[key];
      }
    }
    return options;
  }

  function initGlobalAPI(Vue) {
    Vue.options = {};
    Vue.mixin = function (mixin) {
      // 合并mixin 其他属性以后边的为准 而生命周期函数需要都保存起来
      // 例如：{a: 1, created: f1} {a:2, created: f2} => {a: 2, created: [f1,f2]}
      this.options = mergeOptions(this.options, mixin);
      return this;
    };
  }

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
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
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
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
    var code = codegen(ast);
    // console.log(code);
    code = "with(this){return ".concat(code, "}");
    var render = new Function(code); // 根据代码生成render函数
    return render;
  }

  var id$1 = 0;
  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);
      this.id = id$1++;
      this.subs = []; // 这里对应着当前属性对应的watcher有哪些
    }
    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        // 不希望记录重复的watcher，而且刚才值是一个单向的关系 dep -> watcher
        // watcher 记录 dep
        // this.subs.push(Dep.target)

        Dep.target.addDep(this); // 让watcher记住dep
      }
    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "notify",
      value: function notify() {
        // console.log(this.subs);
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);
    return Dep;
  }();
  Dep.target = null;

  var id = 0;

  // 1.当我们创建渲染watcher时我们会把当前的渲染watcher放到Dep.target上
  // 2.调用_render() 会取值 走到get上
  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, fn, options) {
      _classCallCheck(this, Watcher);
      // 不同的组件有不同的watcher
      this.id = id++;
      this.renderWatcher = options; // true表示是一个渲染过程
      this.getter = fn;
      this.deps = []; // 记住dep 后边实现计算属性和清理工作需要用到
      this.depsId = new Set();
      this.get();
    }
    _createClass(Watcher, [{
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;
        if (!this.depsId.has(id)) {
          // 这里是为了去重dep {{name}} {{name}}只收集一次
          this.deps.push(dep);
          this.depsId.add(id);
          dep.addSub(this); // 让dep记住watcher
        }
      }
    }, {
      key: "get",
      value: function get() {
        Dep.target = this; // 静态属性只有一份
        this.getter(); // 会去vm上取值
        Dep.target = null;
      }
    }, {
      key: "update",
      value: function update() {
        // this.get() // 重新渲染
        // 把当前的watcher暂存起来 异步更新
        queueWatcher(this);
      }
    }, {
      key: "run",
      value: function run() {
        console.log('更新了');
        this.get();
      }
    }]);
    return Watcher;
  }();
  var queue = [];
  var watchers = new Set();
  var pending = false;
  function flushSchedulerQueue() {
    var flushQueue = _toConsumableArray(queue);
    queue = [];
    watchers.clear();
    pending = false;
    flushQueue.forEach(function (q) {
      return q.run();
    }); // 更新的时候可能有新的watcher产生，重新放到queue中
  }

  function queueWatcher(watcher) {
    var id = watcher.id;
    if (!watchers.has(id)) {
      queue.push(watcher);
      watchers.add(id);
      // 不管update执行多少次，最终只执行一次更新操作
      if (!pending) {
        nextTick(flushSchedulerQueue);
        pending = true;
      }
    }
  }
  // 优雅降级
  function timerFunc(flushCallbacks) {
    if (window.Promise) {
      Promise.resolve().then(flushCallbacks);
    } else if (window.MutationObserver) ; else if (window.setImmediate) {
      setImmediate(flushCallbacks);
    } else {
      setTimeout(flushCallbacks);
    }
  }
  var callbacks = [];
  var waiting = false;
  function flushCallbacks() {
    var cbs = _toConsumableArray(callbacks);
    waiting = false;
    callbacks = [];
    cbs.forEach(function (cb) {
      return cb();
    });
  }
  function nextTick(cb) {
    callbacks.push(cb);
    if (!waiting) {
      // setTimeout(flushCallbacks, 0);
      timerFunc(flushCallbacks); // 实现优雅降级策略
      waiting = true;
    }
  }

  function createElementVNode(vm, tag, data) {
    if (data == null) {
      data = {};
    }
    var key = data.key;
    if (key) {
      delete data.key;
    }
    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }
    return vnode(vm, tag, key, data, children);
  }
  function createTextVNode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }
  function vnode(vm, tag, key, data, children, text) {
    return {
      vm: vm,
      tag: tag,
      key: key,
      data: data,
      children: children,
      text: text
    };
  }

  function patchProps(el, props) {
    for (var key in props) {
      if (key === 'style') {
        for (var styleName in props.style) {
          el.style[styleName] = props.style[styleName];
        }
      } else {
        el.setAttribute(key, props[key]);
        // el[key] = props[key]
      }
    }
  }
  // 创建真实DOM
  function createElm(vnode) {
    var tag = vnode.tag,
      data = vnode.data,
      children = vnode.children,
      text = vnode.text;
    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag); // 这里将真实节点和虚拟节点对应起来
      patchProps(vnode.el, data);
      children.forEach(function (item) {
        vnode.el.appendChild(createElm(item));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }
    return vnode.el;
  }
  function patch(oldVNode, vnode) {
    // 判断是不是初始 是不是真实DOM
    var isRealElement = oldVNode.nodeType;
    if (isRealElement) {
      var parentElm = oldVNode.parentNode; // 拿到旧的真实DOM的父元素
      // 创建新的真实DOM
      var newElm = createElm(vnode);
      parentElm.removeChild(oldVNode);
      parentElm.insertBefore(newElm, oldVNode.nextsibiling);
      // console.log(vnode);
      // console.log(newElm);
      return newElm;
    }
  }
  function initLifeCycle(Vue) {
    Vue.prototype._c = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      // createElementVNode
      return createElementVNode.apply(void 0, [this].concat(args));
    };
    Vue.prototype._v = function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      // createTextVNode
      return createTextVNode.apply(void 0, [this].concat(args));
    };
    Vue.prototype._s = function (value) {
      // 变成字符串
      if (_typeof(value) !== 'object') return value;
      return JSON.stringify(value);
    };
    Vue.prototype._render = function () {
      return this.$options.render.call(this);
    };
    Vue.prototype._update = function (vnode) {
      var el = this.$el;
      // console.log(vnode, el);

      // 既有初始化的功能，又有更新的功能
      this.$el = patch(el, vnode);
    };
  }
  function mountComponent(vm, el) {
    vm.$el = el;
    // 1.调用render函数 生成虚拟节点 vm._render()调用的就是vm.$options
    // 2.根据虚拟DOM生成真实DOM vm._update()
    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    };
    new Watcher(vm, updateComponent, true);
    // console.log(watcher);
  }

  function callHook(vm, hook) {
    var handlers = vm.$options[hook];
    if (handlers) {
      handlers.forEach(function (hook) {
        return hook.call(vm);
      });
    }
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
    var dep = new Dep(); // 每一个属性都有一个dep
    // 重新定义每个属性 对每个属性添加getter setter
    Object.defineProperty(target, key, {
      get: function get() {
        if (Dep.target) {
          dep.depend(); // 让这个属性的收集器记住当前的watcher
        }

        return value;
      },
      set: function set(newValue) {
        if (value === newValue) return;
        observe(newValue); // 用户可能修改一整个对象 vm.adds = {}
        value = newValue;
        dep.notify(); // 通知更新
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
      vm.$options = mergeOptions(this.constructor.options, options); // 将用户的选项挂载到实例上
      callHook(vm, 'beforeCreate'); // 调用beforeCreate生命周期钩子

      // 初始化数据
      initState(vm);
      callHook(vm, 'created'); // 调用created生命周期钩子
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
      mountComponent(vm, el); // 组件挂载 调用render
    };
  }

  function Vue(options) {
    this._init(options);
  }
  Vue.prototype.$nextTick = nextTick;
  initMixin(Vue); // 扩展init方法
  initLifeCycle(Vue); // 
  initGlobalAPI(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
