const gulp       = require("gulp");
const del        = require("del");
const concat     = require('gulp-concat');
const typescript = require("gulp-typescript");
const tslint     = require("gulp-tslint");
const sourcemaps = require("gulp-sourcemaps");
const SysBuilder = require('systemjs-builder');
const tscConfig  = require("./tsconfig.json");

// clean the contents of the distribution directory
gulp.task("clean", () => {
  return del("dist/**/*");
});

// concatenate non-angular2 libs, shims & systemjs-config
gulp.task("concat:libs", ["clean"], () => {
  return gulp.src([
            'node_modules/es6-shim/es6-shim.min.js',
            'node_modules/es6-promise/dist/es6-promise.min.js',
            'node_modules/zone.js/dist/zone.js',
            'node_modules/reflect-metadata/Reflect.js',
            'node_modules/systemjs/dist/system-polyfills.js',
            'node_modules/systemjs/dist/system.src.js',
            'system.config.js',
        ])
        .pipe(concat('env.js'))
    .pipe(gulp.dest("dist/libs"))
});

// generate systemjs-based builds
gulp.task('systemjs:build', [ 'compile' ], () => {
    var builder = new SysBuilder();
    return builder.loadConfig('./system.config.js')
        .then(() => builder.buildStatic('app', 'dist/libs/bundle.js'))
        .then(() => del('build'));
});

// copy static assets
gulp.task("copy:assets", ["clean"], () => {
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

// compile typescript
gulp.task("compile", ["clean","tslint"], () => {
  return gulp
    .src(tscConfig.files)
    .pipe(sourcemaps.init())
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/app"));
});

gulp.task("build", ["systemjs:build", "concat:libs", "copy:assets", "copy:templates"]);
gulp.task("default", ["build"]);
