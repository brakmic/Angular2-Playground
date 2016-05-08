"use strict";
var gulp       = require("gulp");
var del        = require("del");
var concat     = require("gulp-concat");
var typescript = require("gulp-typescript");
var minifyJs   = require("gulp-uglify");
var minifyCss  = require("gulp-cssnano");
var merge      = require("merge2");
var tslint     = require("gulp-tslint");
var sourcemaps = require("gulp-sourcemaps");
var SysBuilder = require("systemjs-builder");
var tscConfig  = require("./tsconfig.json");

// clean the contents of the distribution directory
gulp.task("clean:all", function(){
  return del("dist/**/*");
});

// clean only javascripts
gulp.task("clean:js", function(){
  return del(["dist/app/**/*",
              "dist/lib/**/*"]);
});

// clean only assets
gulp.task("clean:assets", function() {
  return del("dist/styles/**/*");
});

// concatenate non-angular2 libs, shims & systemjs-config
gulp.task("concat:libs", ["clean:js"], function() {
  return gulp.src([
            "node_modules/es6-shim/es6-shim.min.js",
            "node_modules/es6-promise/dist/es6-promise.min.js",
            "node_modules/zone.js/dist/zone.js",
            "node_modules/reflect-metadata/Reflect.js",
            "node_modules/systemjs/dist/system-polyfills.js",
            "node_modules/systemjs/dist/system.src.js",
            "system.config.js",
        ])
        .pipe(concat("env.js"))
    .pipe(gulp.dest("dist/libs"))
});

// generate systemjs-based builds
gulp.task("systemjs:build", [ "compile" ], function() {
    var builder = new SysBuilder();
    return builder.loadConfig("./system.config.js")
        .then(function () { builder.buildStatic("app", "dist/libs/bundle.js"); })
        .then(function () { del("build"); });
});

// copy static assets
gulp.task("copy:assets", ["clean:assets"], function() {
  return gulp.src([
                  "index.html",
                  "app/**/*.css",
                  "app/**/*.html",
                  "!app/**/*.ts",
                  "styles/**/*"],
                  { base : "./" })
    .pipe(gulp.dest("dist"))
});

// copy templates
gulp.task("copy:templates", function() {
    return gulp.src(["src/app/templates/**/*"])
        .pipe(gulp.dest("dist/app/templates"));
});

// lint typescript
gulp.task("tslint", function() {
  return gulp.src("src/app/**/*.ts")
    .pipe(tslint())
    .pipe(tslint.report("verbose"));
});

// minify sources
gulp.task("run:minifyJs", function() {
  var js = gulp.src(["dist/libs/env.js",
                    "dist/libs/bundle.js"])
        .pipe(minifyJs());

    return merge(js).pipe(concat('app.js'))
    .pipe(gulp.dest('dist'));
});

// minify css
gulp.task("run:minifyCss", function() {
    var css = gulp.src("dist/styles/**/*.css")
        .pipe(minifyCss());

    return merge(css).pipe(concat('app.css'))
    .pipe(gulp.dest('dist'));

});

// compile typescript
gulp.task("compile", ["clean:js","tslint"], function() {
  return gulp
    .src(tscConfig.files)
    .pipe(sourcemaps.init())
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/app"));
});

// watch for changes
gulp.task('watch', function() {
    var watchTs = gulp.watch('src/app/**/**.ts', [ "build" ]),
        watchCss = gulp.watch(['./index.html','styles/**/*.css'], [ 'copy:assets' ]),
        watchTemplates = gulp.watch('src/app/templates/**/*.html', [ 'copy:templates' ]),
        onChanged = function(event) {
            console.log('File ' + event.path + ' was ' + event.type + '. Running tasks...');
        };

    watchTs.on('change', onChanged);
    watchCss.on('change', onChanged);
    watchTemplates.on('change', onChanged);
});

gulp.task("minify", ["run:minifyJs","run:minifyCss"]);
gulp.task("build", ["systemjs:build", "concat:libs", "copy:templates", "copy:assets"]);
gulp.task("default", ["build"]);
