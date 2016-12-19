module.exports = function(grunt) {
  var dist = 'dist'; // 发布目录distribution

  // 构建任务配置
  grunt.initConfig({
    // 读取package.json数据
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %>\n' +
            ' * Last Updated: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' * Copyright 2016-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' */\n',

    // 清空目录dist
    clean: {
      options: {
        force: true
      },
      build: dist
    },

    // 开启服务器localhost
    connect: {
      build: {
        options: {
          port: 9000,
          base: 'src'
        }
      }
    },

    // js规范检查
    // jshint: {
    //   options: {
    //     jshintrc: '.jshintrc'
    //   },
    //   build: ['Gruntfile.js', 'src/js/*.js']
    // },

    // js压缩
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      build: {
        files: [{
          expand: true, // 启用下面的选项
          cwd: 'src/js/', // 源文件目录
          src: '**/*.js', // 所有js文件
          dest: dist + '/js/', // 输出目录
          ext: '.min.js' // 填充后缀min
        }]
      }
    },

    // less编译
    less: {
      options: {
        banner: '<%= banner %>'
      },
      build: { 
        expand: true, 
        cwd: 'src/less/', 
        src: '**/<%=pkg.name%>.less', 
        dest: 'src/css/', 
        ext: '.css' 
      } 
    },

    // css压缩
    cssmin: {
      options: {
        keepSpecialComments: 1
      },
      build: {
        files: [{
          expand: true,
          cwd: 'src/css/',
          src: ['**/*.css', '**/!*.min.css'],
          dest: dist + '/css/',
          ext: '.min.css'
        }]
      }
    },

    // 拷贝引用库到dist
    copy: {
      main: {
        expand: true,
        cwd: 'src/libs/',
        src: '**',
        dest: 'dist/libs/',
      },
    },

    // watch监听
    watch: {
      build: {
        files: ['src/js/**/*.js', 'src/less/**/*.less', 'src/css/**/*.css'],
        tasks: ['less', 'uglify', 'cssmin'],
        options: {
          spawn: false
        }
      }
    }
  });

  // 加载Grunt插件
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // 默认被执行的Grunt任务列表,注意先后顺序
  grunt.registerTask('default', ['clean', 'connect', 'uglify', 'less', 'cssmin', 'copy', 'watch']);
};