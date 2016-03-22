'use strict';

System.register(['aurelia-templating', 'aurelia-loader', 'aurelia-dependency-injection', 'aurelia-path', 'aurelia-pal'], function (_export, _context) {
  var ViewResources, resource, ViewCompileInstruction, Loader, Container, relativeToFile, DOM, FEATURE, cssUrlMatcher, CSSResource, CSSViewEngineHooks;

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function fixupCSSUrls(address, css) {
    if (typeof css !== 'string') {
      throw new Error('Failed loading required CSS file: ' + address);
    }
    return css.replace(cssUrlMatcher, function (match, p1) {
      var quote = p1.charAt(0);
      if (quote === '\'' || quote === '"') {
        p1 = p1.substr(1, p1.length - 2);
      }
      return 'url(\'' + relativeToFile(p1, address) + '\')';
    });
  }

  return {
    setters: [function (_aureliaTemplating) {
      ViewResources = _aureliaTemplating.ViewResources;
      resource = _aureliaTemplating.resource;
      ViewCompileInstruction = _aureliaTemplating.ViewCompileInstruction;
    }, function (_aureliaLoader) {
      Loader = _aureliaLoader.Loader;
    }, function (_aureliaDependencyInjection) {
      Container = _aureliaDependencyInjection.Container;
    }, function (_aureliaPath) {
      relativeToFile = _aureliaPath.relativeToFile;
    }, function (_aureliaPal) {
      DOM = _aureliaPal.DOM;
      FEATURE = _aureliaPal.FEATURE;
    }],
    execute: function () {
      cssUrlMatcher = /url\((?!['"]data)([^)]+)\)/gi;

      CSSResource = function () {
        function CSSResource(address) {
          _classCallCheck(this, CSSResource);

          this.address = address;
          this._global = null;
          this._scoped = null;
        }

        CSSResource.prototype.initialize = function initialize(container, target) {
          this._global = new target('global');
          this._scoped = new target('scoped');
        };

        CSSResource.prototype.register = function register(registry, name) {
          registry.registerViewEngineHooks(name === 'scoped' ? this._scoped : this._global);
        };

        CSSResource.prototype.load = function load(container) {
          var _this = this;

          return container.get(Loader).loadText(this.address).catch(function (err) {
            return null;
          }).then(function (text) {
            text = fixupCSSUrls(_this.address, text);
            _this._global.css = text;
            _this._scoped.css = text;
          });
        };

        return CSSResource;
      }();

      CSSViewEngineHooks = function () {
        function CSSViewEngineHooks(mode) {
          _classCallCheck(this, CSSViewEngineHooks);

          this.mode = mode;
          this.css = null;
          this._alreadyGloballyInjected = false;
        }

        CSSViewEngineHooks.prototype.beforeCompile = function beforeCompile(content, resources, instruction) {
          if (this.mode === 'scoped') {
            if (instruction.targetShadowDOM) {
              DOM.injectStyles(this.css, content, true);
            } else if (FEATURE.scopedCSS) {
              var styleNode = DOM.injectStyles(this.css, content, true);
              styleNode.setAttribute('scoped', 'scoped');
            } else if (!this._alreadyGloballyInjected) {
              DOM.injectStyles(this.css);
              this._alreadyGloballyInjected = true;
            }
          } else if (!this._alreadyGloballyInjected) {
            DOM.injectStyles(this.css);
            this._alreadyGloballyInjected = true;
          }
        };

        return CSSViewEngineHooks;
      }();

      function _createCSSResource(address) {
        var _dec, _class;

        var ViewCSS = (_dec = resource(new CSSResource(address)), _dec(_class = function (_CSSViewEngineHooks) {
          _inherits(ViewCSS, _CSSViewEngineHooks);

          function ViewCSS() {
            _classCallCheck(this, ViewCSS);

            return _possibleConstructorReturn(this, _CSSViewEngineHooks.apply(this, arguments));
          }

          return ViewCSS;
        }(CSSViewEngineHooks)) || _class);

        return ViewCSS;
      }

      _export('_createCSSResource', _createCSSResource);
    }
  };
});