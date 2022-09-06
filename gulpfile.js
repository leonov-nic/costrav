var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require('gulp-imagemin');
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");
var webpackStream = require('webpack-stream');
var webpackConfig = require('./webpack.config.js');
var pug = require('gulp-pug');
var cached = require('gulp-cached');
var svgstore = require('gulp-svgstore');

gulp.task("pugToHTML", function () {
  return gulp.src('source/pug/pages/*.pug')
    .pipe(plumber())
    .pipe(pug({ pretty: true }))
    .pipe(cached('pug'))
    .pipe(gulp.dest('build'));
});

gulp.task("css", function () {
  return gulp.src('source/sass/style.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer({
      grid: true,
      flexbox: true,
    })]))
    .pipe(gulp.dest('build/css'))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('source/pug/**/*.pug', gulp.series("pugToHTML", "refresh"));
  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css", "refresh"));
  gulp.watch("source/js/**/*.js", gulp.series("js", "refresh"));
  gulp.watch('source/img/**/*.svg', gulp.series("sprite", "pugToHTML", "refresh"));
  gulp.watch('source/img/**/*.{png,jpg}', gulp.series("copyimg","pugToHTML", "refresh"));
});

gulp.task("copyimg", function () {
  return gulp.src('source/img/**/*.{png,jpg}', {base: 'source'})
      .pipe(gulp.dest('build'));
    });

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("js", function () {
  return gulp.src(['source/js/main.js'])
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest('build/js'));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task("svg", function () {
  return gulp.src('source/img/**/*.{svg}')
    .pipe(imagemin([
      imagemin.svgo({
          plugins: [
            {removeViewBox: false},
            {removeRasterImages: true},
            {removeUselessStrokeAndFill: false},
          ]
        }),
    ]))
    .pipe(gulp.dest('source/img'));
});

gulp.task("sprite", function () {
  return gulp.src('source/img/sprite/*.svg')
    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename('sprite_auto.svg'))
    .pipe(gulp.dest('build/img'));
});


gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**"
    ], {
      base: "source"
    })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("imagemin", function () {
  return gulp.src('build/img/**/*.{png,jpg}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      // imagemin.mozjpeg({quality: 75, progressive: true}),
    ]))
    .pipe(gulp.dest('build/img'));
});

gulp.task("build", gulp.series("clean", "css", "svg", "copy", "sprite", "js", "pugToHTML"));
gulp.task("start", gulp.series("build", "server"));
