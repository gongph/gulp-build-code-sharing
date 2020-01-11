/*!
 * 静态页面自动化构建工具 Gulp website: https://gulpjs.com/ 
 * @author gongph<gongpenghui@cyou-inc.com>
 * @date 2020/01/08
 */
(function(){
  'user strict';
  
  const { series, src, dest } = require('gulp');
  const rimraf = require('gulp-rimraf'); // 文件重命名暂时未用到
  const uglify = require('gulp-uglify');
  const rename = require('gulp-rename');
  const cleanCSS = require('gulp-clean-css');
  const rev = require('gulp-rev');
  const revCollector = require('gulp-rev-collector');
  const clean = require('gulp-clean');
  const htmlmin = require('gulp-html-minifier2');
  const zip = require('gulp-zip');
  const pkg = require('./package.json');
  
  // 源文件映射文件目录
  const revDir = process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
  // ZIP压缩包名
  zipName = pkg.name + '.zip';
  
  /**
   * 删除 `dist` 和 `rev`
   * 避免生产重复文件
   */
  function clear() {
    return src(['dist', 'rev'], { allowEmpty: true }).pipe(clean());
  }
  
  /**
   * 拷贝静态资源文件
   */
  function assets() {
    return src('src/assets/**/*.*').pipe(dest('dist/assets/'));
  }
  
  /**
   * 拷贝 css 文件
   */
  function css() {
    return src(['src/css/**/*.css']).pipe(dest('dist/css'));
  }
  
  /**
   * 拷贝 js 文件
   */
  function js() {
    return src(['src/js/**/*.js']).pipe(dest('dist/js'));
  }
  
  /**
   * 拷贝 html 文件
   */
  function html() {
    return src('src/views/**/*.html').pipe(dest('dist/views/'));
  }
  
  /**
   * 压缩 html 页面
   */
  function htmlMinify() {
    return src('dist/views/**/*.html')
      .pipe(htmlmin({
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true
      }))
      .pipe(dest('dist/views/'));
  }
  
  /**
   *  Css 文件后面加 hash 值
   */
  function cssRevHash() {
    if (process.env.NODE_ENV === 'production') {
      return src('dist/css/**/*.css')
        .pipe(rev())
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(dest('dist/css/'))
        .pipe(rev.manifest())
        .pipe(dest(`rev/${revDir}/css`));
    } else {
      return src('dist/css/**/*.css')
        .pipe(rev())
        .pipe(dest('dist/css/'))
        .pipe(rev.manifest())
        .pipe(dest(`rev/${revDir}/css`));
    }
  }
  
  /**
   * Js 文件后面加 hash 值
   */
  function jsRevHash() {
    if (process.env.NODE_ENV === 'production') {
      return src('dist/js/**/*.js')
        .pipe(rev())
        .pipe(uglify())
        .pipe(dest('dist/js/'))
        .pipe(rev.manifest())
        .pipe(dest(`rev/${revDir}/js`));
    } else {
      return src('dist/js/**/*.js')
        .pipe(rev())
        .pipe(dest('dist/js/'))
        .pipe(rev.manifest())
        .pipe(dest(`rev/${revDir}/js`));
    }
  }
  
  /**
   * 将 rev 目录下的 hash 文件替换掉 html 中对应的源文件链接
   */
  function htmlRevInject() {
    return src([`rev/${revDir}/**/*.json`, 'dist/views/**/*.html'])
      .pipe(revCollector({ replaceReved: true }))
      .pipe(dest('dist/views/'));
  }
  
  /**
   * 打包
   */
  function zipiupiu() {
    return src('dist/**/*')
    .pipe(zip(zipName))
    .pipe(dest('dist'));
  }
  
  // 生产环境下执行
  if (process.env.NODE_ENV === 'production') {
    exports.build = series(
      clear,
      assets,
      css,
      js,
      html,
      cssRevHash,
      jsRevHash,
      htmlRevInject,
      htmlMinify,
      zipiupiu
    );
  }
  // 开发环境下执行
  else {
    exports.build = series(
      clear,
      assets,
      css,
      js,
      html,
      cssRevHash,
      jsRevHash,
      htmlRevInject,
      zipiupiu
    );
  }
}());