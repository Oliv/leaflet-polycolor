module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'polycolor.min.js': '**/polycolor.js'
      }
    }
  },
  plugins: {
    uglify: {
      mangle: false,
      compress: {
        global_defs: {
          DEBUG: true
        }
      }
    }
  },
  paths: {
    watched: [
      'src'
    ],
    public: 'dist'
  },
  modules: {
    nameCleaner: path => path.replace(/^src(\/|\\)/, '')
  }
};