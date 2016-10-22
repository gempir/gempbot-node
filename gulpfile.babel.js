const gulp = require('gulp');
const babel = require('gulp-babel');
const shell = require('gulp-shell')
const tar = require('gulp-tar');
const gzip = require('gulp-gzip');
const clean = require('gulp-clean');
const merge = require('merge-stream');

gulp.task('clean', function () {
    var build = gulp.src('build', {read: false})
        .pipe(clean());

	var release = gulp.src('release.tar.gz', {read: false})
		.pipe(clean());

	return merge(build, release)
});

gulp.task('transpile', ['clean'], () => {

	var js = gulp.src('src/**/*.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('build/src'));

	var root = gulp.src(['gempbot','cfg.js', 'package.json'])
		.pipe(gulp.dest('build'));	

	var jade = gulp.src('src/overlay/views/**/*.jade')
		.pipe(gulp.dest('build/src/overlay/views'));

	var css = gulp.src('src/overlay/public/**/*.css')
		.pipe(gulp.dest('build/src/overlay/public'));

	return merge(js, root, jade, css);
});

gulp.task('archive', ['transpile'], () =>
    gulp.src('build/**/*')
        .pipe(tar('release.tar'))
        .pipe(gzip())
        .pipe(gulp.dest('./'))
);

gulp.task('build', ['clean','transpile', 'archive']);
