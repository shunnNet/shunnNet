var fs = require("fs")
var browserify = require('browserify');
var babelify = require('babelify');
var babel_option = [
    "@babel/env", {
        "targets": {
            "browsers": "ie 11"
        },
        "useBuiltIns": "usage",
        "corejs" : 3      // needed when useBuiltInd : "usage"
    }
]

browserify({ entries:"./test.js",paths : ['./node_modules']})
            .transform("babelify", {presets: [babel_option]})
            .bundle()
            .pipe(fs.createWriteStream("bundle.js"));