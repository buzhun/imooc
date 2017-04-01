//包装函数
module.exports = function(grunt){
  //任务配置，所有插件的配置信息
   grunt.initConfig({
     watch:{
       jade:{
         files:['views/**'],
         options:{
           livereload: true
         }
       },
       js:{
         files:['public/js**'],
         options:{
           livereload: true
         }
       }
     },
     nodemon: {
        dev: {
          options: {
            file: 'app.js',
            args: [],
            ignoredFiles:['README.md','node_modules/**','.DS_Store'],
            watchedExtensions:['js'],
            watchedFloders:['app','config'],
            debug: true,
            delayTime: 1,
            env:{
              PORT: 3000
            },
            cwd:__dirname
          }
        }
      },
     cuncurrent:{
       task:[],
       options:{
         logConcurrentOutput: true
       }
     }

   })
   grunt.loadNpmTasks('grunt-contrib-watch')
   grunt.loadNpmTasks('grunt-contrib-nodemon')
   grunt.loadNpmTasks('grunt-concurrent')

   grunt.option('force',true)
   grunt.registerTask('default',['concurrent','nodemon','watch'])
}
