/**
 *
 * 需要支撑的库 underscore、moment、jq、bootstrap、(bootbox)、
 * Created by Ning on 2017/3/15.
 */

window.n9commons = {
};


/**
 快捷的文档流标签处理
 */
n9commons.docWork=function(){
    //点击关闭按钮
    $(document).on("click",".j-closeBtn",function () {
        var belong=$(this).data("belong");
        if(belong)
            $("#"+belong).hide();
    });

    /**
     * 切换按钮
     */
    $(document).on("click",".j-swBtn",function () {
        $(this).siblings().removeClass("z-sel");
        $(this).addClass("z-sel");
    });
    /**
     * 选择列表
     */
    $(document).on("click",".j-selTable tbody tr",function () {
        $(this).siblings().removeClass("z-sel");
        $(this).addClass("z-sel");
    });
    /**
     * 列表全选
     */
    $(document).on("click",".j-selTable thead tr th:first-child input[type='checkbox']",function () {
         $(".j-selTable tbody tr td:first-child input[type='checkbox']").prop("checked",$(this).prop("checked"))
    });
};

/**
 * 快速调用ajax
 * @param options
 * @return {*}
 */
n9commons.getJson=function (options) {
    options = _.extend({
        type:"POST",
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',//'application/json;charset=utf-8',
        dataType : 'json',
        async: true,
        error: function (err, err1, err2) {
            console.log("调用方法发生异常:" + JSON.stringify(err) + "err1" + JSON.stringify(err1) + "err2:" + JSON.stringify(err2));
        }
    }, options);
    return $.ajax(options);
}
/**
 * 快速进行同步调用
 * @param options
 * @return {*}
 */
n9commons.getSynJson=function (options) {
    var result=null;
    options.async=false;
    options.success=function (data) {
        result=data;
    }
    if(options.isPage)
        options.data=$.param(options.data).replace("pageSize","page.pageSize").replace("pageNo","page.pageNo");
    n9commons.getJson(options);
    if(!n9commons.isVoid(options.alert)&&(result==null||result.result==-1)){
        var alert=options.alert==""?"数据访问失败":options.alert;
        n9commons.alert(alert);
    }
    return result;
}

/**
 * 简单的文本格式化
 * @param str
 * @param args
 * @return {*}
 */
n9commons.strFormat = function (str,args) {
    var result = str;
    if (arguments.length > 1) {
        if (arguments.length == 2 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 1; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
                    var reg = new RegExp("({)" + (i-1) + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};
/**
 * 分割字符串
 * @param str
 * @return {*|Array}
 */
n9commons.splitWords= function (str) {
    return trim(str).split(/\s+/);
};
/**
 * 是否无效值
 * @param data
 * @return {*}
 */
n9commons.isVoid=function (data) {
    return _.isNull(data)||_.isUndefined(data)||_.isNaN(data);
}

/**
 * 快速的警告框
 * @param content
 */
n9commons.alert=function (content) {
    if(bootbox){
        bootbox.alert({
            buttons: {
                ok: {
                    label: '确定',
                }
            },
            message: content,
            title: "提示信息"
        });
    }
    else{
        alert(content);
    }

}

/**
 * 是否ie
 * @return {boolean}
 */
n9commons.isIE=function() {
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;
}
/**
 * 加入收藏夹
 */
n9commons.addFavorite=function() {
    var url = window.location;
    var title = document.title;
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("360se") > -1) {
        n9commons.alert("由于360浏览器功能限制，请按 Ctrl+D 手动收藏！");
    }
    else if (ua.indexOf("msie 8") > -1) {
        window.external.AddToFavoritesBar(url, title); //IE8
    }
    else if (document.all) {
        try{
            window.external.addFavorite(url, title);
        }catch(e){
            n9commons.alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
        }
    }
    else if (window.sidebar) {
        window.sidebar.addPanel(title, url, "");
    }
    else {
        n9commons.alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
    }
}
/**
 * 快速的格式化日期，仅支持格式化为YYYY-MM-DD HH:mm:ss
 * @param date
 */
n9commons.formatDate=function (date) {
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
}

/**
 *快速的字符串转日期，仅支持格式YYYY-MM-DD HH:mm:ss
 * @param date
 */
n9commons.str2Date=function (str) {
    return moment(str,"YYYY-MM-DD HH:mm:ss").toDate()
}

/**
 * 继承，可能与underscore中一致
 * @param dest
 * @return {*}
 */
n9commons.extends=function (dest) {
    var i, j, len, src;

    for (j = 1, len = arguments.length; j < len; j++) {
        src = arguments[j];
        for (i in src) {
            dest[i] = src[i];
        }
    }
    return dest;
};
/**
 * 创建对象
 */
n9commons.create=Object.create || (function () {
        function F() {}
        return function (proto) {
            F.prototype = proto;
            return new F();
        };
    })();

/**
 * 设置配置参数
 * @param obj
 * @param options
 * @return {*}
 */
n9commons.setOptions= function (obj, options) {
    if (!obj.hasOwnProperty('options')) {
        obj.options = obj.options ?n9commons.create(obj.options) : {};
    }
    for (var i in options) {
        obj.options[i] = options[i];
    }
    return obj.options;
};
/**
 * 返回唯一标记码
 * @param obj
 * @return {number|*}
 */
n9commons.stamp=function (obj) {
    obj._n9commons_id = obj._n9commons_id || _.uniqueId("n9commons_");
    return obj._n9commons_id;
}
n9commons.falseFn=function () { return false; }
n9commons.bind=function (fn, obj) {
    var slice = Array.prototype.slice;
    if (fn.bind) {
        return fn.bind.apply(fn, slice.call(arguments, 1));
    }
    var args = slice.call(arguments, 2);
    return function () {
        return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
    };
},

    /**
     * 类对象
     * @constructor
     */
    n9commons.Class = function () {};
n9commons.Class.extend = function (props) {
    var NewClass = function () {
        if (this.initialize) {
            this.initialize.apply(this, arguments);
        }
        this.callInitHooks();
    };
    var parentProto = NewClass.__super__ = this.prototype;
    var proto = n9commons.create(parentProto);
    proto.constructor = NewClass;
    NewClass.prototype = proto;
    for (var i in this) {
        if (this.hasOwnProperty(i) && i !== 'prototype') {
            NewClass[i] = this[i];
        }
    }
    if (props.statics) {
        n9commons.extends(NewClass, props.statics);
        delete props.statics;
    }
    if (props.includes) {
        n9commons.extends.apply(null, [proto].concat(props.includes));
        delete props.includes;
    }
    if (proto.options) {
        props.options = n9commons.extends(n9commons.create(proto.options), props.options);
    }
    n9commons.extends(proto, props);
    proto._initHooks = [];
    proto.callInitHooks = function () {
        if (this._initHooksCalled) { return; }
        if (parentProto.callInitHooks) {
            parentProto.callInitHooks.call(this);
        }
        this._initHooksCalled = true;

        for (var i = 0, len = proto._initHooks.length; i < len; i++) {
            proto._initHooks[i].call(this);
        }
    };
    return NewClass;
};
n9commons.Class.setOptions=n9commons.setOptions;
n9commons.Class.include = function (props) {
    n9commons.extends(this.prototype, props);
    return this;
};
n9commons.Class.mergeOptions = function (options) {
    n9commons.extends(this.prototype.options, options);
    return this;
};
n9commons.Class.addInitHook = function (fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    var init = typeof fn === 'function' ? fn : function () {
        this[fn].apply(this, args);
    };
    this.prototype._initHooks = this.prototype._initHooks || [];
    this.prototype._initHooks.push(init);
    return this;
};

n9commons.Evented = n9commons.Class.extend({
    on: function (types, fn, context) {
        if (typeof types === 'object') {
            for (var type in types) {
                this._on(type, types[type], fn);
            }
        } else {
            types =n9commons.splitWords(types);
            for (var i = 0, len = types.length; i < len; i++) {
                this._on(types[i], fn, context);
            }
        }
        return this;
    },

    off: function (types, fn, context) {
        if (!types) {
            delete this._events;
        } else if (typeof types === 'object') {
            for (var type in types) {
                this._off(type, types[type], fn);
            }
        } else {
            types = n9commons.splitWords(types);
            for (var i = 0, len = types.length; i < len; i++) {
                this._off(types[i], fn, context);
            }
        }
        return this;
    },
    _on: function (type, fn, context) {
        var events = this._events = this._events || {},
            contextId = context && context !== this && n9commons.stamp(context);
        if (contextId) {
            var indexKey = type + '_idx',
                indexLenKey = type + '_len',
                typeIndex = events[indexKey] = events[indexKey] || {},
                id = n9commons.stamp(fn) + '_' + contextId;
            if (!typeIndex[id]) {
                typeIndex[id] = {fn: fn, ctx: context};
                events[indexLenKey] = (events[indexLenKey] || 0) + 1;
            }
        } else {
            events[type] = events[type] || [];
            events[type].push({fn: fn});
        }
    },
    _off: function (type, fn, context) {
        var events = this._events,
            indexKey = type + '_idx',
            indexLenKey = type + '_len';
        if (!events) { return; }
        if (!fn) {
            delete events[type];
            delete events[indexKey];
            delete events[indexLenKey];
            return;
        }
        var contextId = context && context !== this && n9commons.stamp(context),
            listeners, i, len, listener, id;
        if (contextId) {
            id = n9commons.stamp(fn) + '_' + contextId;
            listeners = events[indexKey];
            if (listeners && listeners[id]) {
                listener = listeners[id];
                delete listeners[id];
                events[indexLenKey]--;
            }
        } else {
            listeners = events[type];
            if (listeners) {
                for (i = 0, len = listeners.length; i < len; i++) {
                    if (listeners[i].fn === fn) {
                        listener = listeners[i];
                        listeners.splice(i, 1);
                        break;
                    }
                }
            }
        }
        if (listener) {
            listener.fn = n9commons.falseFn;
        }
    },
    fire: function (type, data, propagate) {
        if (!this.listens(type, propagate)) { return this; }
        var event = n9commons.extends({}, data, {type: type, target: this}),
            events = this._events;
        if (events) {
            var typeIndex = events[type + '_idx'],
                i, len, listeners, id;
            if (events[type]) {
                listeners = events[type].slice();
                for (i = 0, len = listeners.length; i < len; i++) {
                    listeners[i].fn.call(this, event);
                }
            }
            for (id in typeIndex) {
                typeIndex[id].fn.call(typeIndex[id].ctx, event);
            }
        }
        if (propagate) {
            this._propagateEvent(event);
        }
        return this;
    },
    listens: function (type, propagate) {
        var events = this._events;
        if (events && (events[type] || events[type + '_len'])) { return true; }
        if (propagate) {
            for (var id in this._eventParents) {
                if (this._eventParents[id].listens(type, propagate)) { return true; }
            }
        }
        return false;
    },
    once: function (types, fn, context) {
        if (typeof types === 'object') {
            for (var type in types) {
                this.once(type, types[type], fn);
            }
            return this;
        }
        var handler = n9commons.bind(function () {
            this
                .off(types, fn, context)
                .off(types, handler, context);
        }, this);
        return this
            .on(types, fn, context)
            .on(types, handler, context);
    },
    addEventParent: function (obj) {
        this._eventParents = this._eventParents || {};
        this._eventParents[n9commons.stamp(obj)] = obj;
        return this;
    },
    removeEventParent: function (obj) {
        if (this._eventParents) {
            delete this._eventParents[n9commons.stamp(obj)];
        }
        return this;
    },
    _propagateEvent: function (e) {
        for (var id in this._eventParents) {
            this._eventParents[id].fire(e.type, n9commons.extends({target: e.target}, e), true);
        }
    }
});

n9commons.Evented.prototype.addEventListener = n9commons.Evented.prototype.on;
n9commons.Evented.prototype.removeEventListener = n9commons.Evented.prototype.clearAllEventListeners = n9commons.Evented.prototype.off;
n9commons.Evented.prototype.addOneTimeEventListener = n9commons.Evented.prototype.once;
n9commons.Evented.prototype.fireEvent = n9commons.Evented.prototype.fire;
n9commons.Evented.prototype.hasEventListeners = n9commons.Evented.prototype.listens;

n9commons.exports={
    getJson:n9commons.getJson,
    getSynJson:n9commons.getSynJson,
    strFormat:n9commons.strFormat,
    isVoid:n9commons.isVoid,
    alert:n9commons.alert,
    isIE:n9commons.isIE,
    docWork:n9commons.docWork,
    formatDate:n9commons.formatDate,
    str2Date:n9commons.str2Date,
    getTemplate:n9commons.getTemplate,
    extends:n9commons.extends,
    create:n9commons.create,
    setOptions:n9commons.setOptions,
    Class:n9commons.Class,
    Evented:n9commons.Evented,
    splitWords:n9commons.splitWords,
    stamp:n9commons.stamp,
    addFavorite:n9commons.addFavorite
}
_.mixin(n9commons.exports);






