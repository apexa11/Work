// dependencies
const gulp         = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const sass         = require('gulp-sass');
const browserSync  = require('browser-sync').create();
const rename       = require('gulp-rename');
const sourcemaps   = require('gulp-sourcemaps')
const babel = require('gulp-babel');
 

/* compiles sass and pipes to different destination folders, allows for
 sourcempas in browser back to sass file */
gulp.task('scss', () => {
  gulp.src('_/components/sass/styles.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        }))
  .pipe(gulp.dest('_/components/css/'))
  .pipe(sass({outputStyle:'compressed'}))
  .pipe(rename('styles.css'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('_css/'))
  .pipe(browserSync.stream());
  // .stream() auto injects changes into browser; affects page state instead and doesn't fully reload browser
});

// 'sync' starts up browser sync and 'watchers'
gulp.task('sync', () => {
  browserSync.init({
    server:{
      baseDir: '',
      directory: true
    },
    snippetOptions: {
      rule: {
        match: /<\/head>/i,
        fn: function (snippet, match) {
          return snippet + match;
        }
      }
    },
    open: false
  });
    // reload on saving .html pages
    gulp.watch(['*.html']).on('change', browserSync.reload);
    // stream css to browser after sass compiles
    gulp.watch(['_/components/sass/*.scss'], ['scss'])
});
// when gulp starts, it'll run 'sync', and 'sass'
gulp.task('default', ['sync', 'scss']);



gulp.task('babel', () => {
    return gulp.src('_/components/test.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('_/js/script.js'));
});
