var flag = true;

// nav
$('nav .nav-btn').on('click', function() {
  if (flag === true) {
    $('nav .nav').css('width','100%');
  } else {
    $('nav .nav').css('width','0');
  }
  flag = !flag;
});

$(window).resize(function() {
  if ($('nav .nav-btn').is(":hidden")) {
    $('nav .nav').removeAttr('style');
  }
});

// 不再支持IE9以下
var Tiny = {},
entityMap = {
  escape: {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  }
};
Tiny.hasOwn = function(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
Tiny.invert = function(obj) {
  var result = {};
  for (var key in obj) if (Tiny.hasOwn(obj, key)) result[obj[key]] = key;
  return result;
};
entityMap.unescape = Tiny.invert(entityMap.escape);

var entityRegexes = {
  escape:   new RegExp('[' + Object.keys(entityMap.escape).join('') + ']', 'g'),
  unescape: new RegExp('(' + Object.keys(entityMap.unescape).join('|') + ')', 'g')
};

['escape', 'unescape'].forEach(function (method) {
  Tiny[method] = function(string) {
    if (string == null) {
      return '';
    }
    return ('' + string).replace(entityRegexes[method], function (match) {
      return entityMap[method][match];
    });
  };
});

Tiny.defaults = function(obj) {
  Array.prototype.slice.call(arguments, 1).forEach(function (source) {
    if (source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    }
  });
  return obj;
};

Tiny.templateSettings = {
  evaluate    : /<%([\s\S]+?)%>/g,
  interpolate : /<%=([\s\S]+?)%>/g,
  escape      : /<%-([\s\S]+?)%>/g
};

var noMatch = /(.)^/;
var escapes = {
  "'":      "'",
  '\\':     '\\',
  '\r':     'r',
  '\n':     'n',
  '\t':     't',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};
var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

Tiny.template = function(text, data, settings) {
  var render;
  settings = Tiny.defaults({}, settings, Tiny.templateSettings);

  var matcher = new RegExp([
    (settings.escape || noMatch).source,
    (settings.interpolate || noMatch).source,
    (settings.evaluate || noMatch).source
  ].join('|') + '|$', 'g');

  var index = 0;
  var source = "__p+='";
  text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
    source += text.slice(index, offset).replace(escaper, function(match) {
      return '\\' + escapes[match];
    });
    if (escape) {
      source += "'+\n((__t=(" + escape + "))==null?'':Tiny.escape(__t))+\n'";
    }
    if (interpolate) {
      source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
    }
    if (evaluate) {
      source += "';\n" + evaluate + "\n__p+='";
    }
    index = offset + match.length;
    return match;
  });
  source += "';\n";

  if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

  source = "var __t,__p='',__j=Array.prototype.join," +
    "print=function(){__p+=__j.call(arguments,'');};\n" +
    source + "return __p;\n";

  try {
    render = new Function(settings.variable || 'obj', 'Tiny', source);
  } catch (e) {
    e.source = source;
    throw e;
  }

  if (data) return render(data, Tiny);
  var template = function(data) {
    return render.call(this, data, Tiny);
  };

  template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';
  return template;
};