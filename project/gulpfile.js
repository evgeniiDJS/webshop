const gulp = require('gulp');
const clean = require('gulp-clean');
const fileInclude = require('gulp-file-include'); //html
const less = require('gulp-less'); //less
const server = require('gulp-server-livereload');
const sourceMaps = require('gulp-sourcemaps'); // inspect
const plumber = require('gulp-plumber'); // inspect
const notify = require('gulp-notify'); // inspect
const fs = require('fs'); 
const { dest } = require('gulp');
const webpack = require('webpack-stream');


// inspect
const plumberNotify = (title) => {
    return {
       errorHandler: notify.onError({
            title: title,
            message: 'Error <%= error.message %>',
            sound: false,
       })
    }
}


/*  HTML */
gulp.task('html', function() {
    return gulp.src('./src/**/*.html')
        .pipe(plumber(plumberNotify('Html')))
        .pipe(fileInclude( { prefix: '@@', basepath: '@file'} ) )
        .pipe(dest('./dist/'))
});

/* LESS */
gulp.task('less', function() {
    return gulp.src('./src/less/**/*.less')
        .pipe(plumber(plumberNotify('Less')))
        .pipe(sourceMaps.init())
        .pipe(less())
        .pipe(sourceMaps.write())
        .pipe(dest('./dist/css'))
});

/* JS WEBPACK */
gulp.task('js', function() {
    return gulp.src('./src/js/*.js')
            .pipe(plumber(plumberNotify('JS')))
            .pipe(webpack(require('./webpack.config.js')))
            .pipe(gulp.dest('./dist/js'))
})

/* IMG */
gulp.task('images', function() {
    return gulp.src('./src/img/**/*')
            .pipe(gulp.dest('./dist/img/'))
})

/* START SERVER */
gulp.task('start', function() {
    return gulp.src('./dist/')
            .pipe(server({
                livereload: true,
                open: true
            }))
});

/* CLEAN ./dist */
gulp.task('clean', function(done) {
    if(fs.existsSync('./dist/', { read: false } )) {
        return gulp.src('./dist/')
            .pipe(clean( { force: true} ))
    }

    done();
} );

/* WATCH */
gulp.task('watch', function() {
    gulp.watch('./src/less/**/*.less', gulp.parallel('less'));
    gulp.watch('./src/**/*.html', gulp.parallel('html'));
    gulp.watch('./src/img/**/*', gulp.parallel('images'));
    gulp.watch('./src/js/**/*.js', gulp.parallel('js'));
});

/* DEFAULT */
gulp.task('default', gulp.series('clean',
    gulp.parallel('html', 'less', 'images', 'js'),
    gulp.parallel('start', 'watch')
));