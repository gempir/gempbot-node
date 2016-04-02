const gulp = require('gulp');
const babel = require('gulp-babel');
const shell = require('gulp-shell')

gulp.task('test', () => {
	gulp.src('./')
		.pipe(shell([
	  		'npm test'
		]));
});

gulp.task('build', () => {

	gulp.src('src/**/*.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('build/src'));

	gulp.src('gempbot.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('build'));

	gulp.src('cfg.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('build'));

	gulp.src('src/overlay/views/**/*.jade')
		.pipe(gulp.dest('build/src/overlay/views'));

	gulp.src('src/overlay/public/**/*.css')
		.pipe(gulp.dest('build/src/overlay/public'));

	gulp.src('TLDs.txt')
		.pipe(gulp.dest('build/'));
});

gulp.task('default', ['test', 'build']);
