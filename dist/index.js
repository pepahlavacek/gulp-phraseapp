// Generated by CoffeeScript 1.9.2
(function() {
  var es, gutil, merge, request, syncRequest;

  request = require('request');

  syncRequest = require('sync-request');

  gutil = require('gulp-util');

  es = require('event-stream');

  merge = require('deep-merge')(function(a, b) {
    return a;
  });

  module.exports = function(options) {
    var auth_token, base;
    base = options.base || 'en';
    auth_token = options.auth_token;
    return request("https://phraseapp.com/api/v1/locales/?auth_token=" + auth_token).pipe(es.parse()).pipe(es.through(function(locales) {
      var code, data, i, len, locale, out, res, text;
      data = {};
      for (i = 0, len = locales.length; i < len; i++) {
        locale = locales[i];
        res = syncRequest('GET', "https://phraseapp.com/api/v1/translations/download.nested_json?locale=" + locale.code + "&auth_token=" + auth_token);
        data[locale.code] = JSON.parse(res.getBody());
      }
      for (code in data) {
        text = data[code];
        out = text;
        if (options.base) {
          out = merge(text, data[options.base]);
        }
        gutil.log('gulp-locales', "Building " + code + ".json", gutil.colors.cyan(" translations"));
        this.emit('data', new gutil.File({
          cwd: "",
          base: "",
          path: code + ".json",
          contents: new Buffer(JSON.stringify(out, null, '  '))
        }));
      }
      return this.emit('end');
    }));
  };

}).call(this);
