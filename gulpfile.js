"use strict";
const gulp       = require("gulp");
const del        = require("del");
const concat     = require("gulp-concat");
const typescript = require("gulp-typescript");
const minifyJs   = require("gulp-uglify");
const minifyCss  = require("gulp-cssnano");
const merge      = require("merge2");
const tslint     = require("gulp-tslint");
const sourcemaps = require("gulp-sourcemaps");
const SysBuilder = require("systemjs-builder");
const tscConfig  = require("./tsconfig.json");

// clean the contents of the distribution directory
gulp.task("clean:all", () => {
  return del("dist/**/*");
});

// clean only javascripts
gulp.task("clean:js", () => {
  return del(["dist/app/**/*",
              "dist/lib/**/*"]);
});

// clean only assets
gulp.task("clean:assets", () => {
  return del("dist/styles/**/*");
});

// concatenate non-angular2 libs, shims & systemjs-config
gulp.task("concat:libs", ["clean:js"], () => {
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
gulp.task("systemjs:build", [ "compile" ], () => {
    let builder = new SysBuilder();
    return builder.loadConfig("./system.config.js")
        .then(() => builder.buildStatic("app", "dist/libs/bundle.js"))
        .then(() => del("build"));
});

// copy static assets
gulp.task("copy:assets", ["clean:assets"], () => {
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
gulp.task("copy:templates", () => {
    return gulp.src(["src/app/templates/**/*"])
        .pipe(gulp.dest("dist/app/templates"));
});

// lint typescript
gulp.task("tslint", () => {
  return gulp.src("src/app/**/*.ts")
    .pipe(tslint())
    .pipe(tslint.report("verbose"));
});

// minify sources
gulp.task("run:minifyJs", () => {
  let js = gulp.src(["dist/libs/env.js",
                    "dist/libs/bundle.js"])
        .pipe(minifyJs());

    return merge(js).pipe(concat('app.js'))
    .pipe(gulp.dest('dist'));
});

// minify css
gulp.task("run:minifyCss", () => {
    let css = gulp.src("dist/styles/**/*.css")
        .pipe(minifyCss());

    return merge(css).pipe(concat('app.css'))
    .pipe(gulp.dest('dist'));

});

// compile typescript
gulp.task("compile", ["clean:js","tslint"], () => {
  return gulp
    .src(tscConfig.files)
    .pipe(sourcemaps.init())
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/app"));
});

// watch for changes
gulp.task('watch', () => {
    var watchTs = gulp.watch('src/app/**/**.ts', [ "systemjs:build" ]),
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
gulp.task("build", ["systemjs:build", "concat:libs", "copy:assets", "copy:templates"]);
gulp.task("default", ["build"]);
