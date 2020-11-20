const path = require('path');
const sane = require('sane');
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');

const serve = new Serve({ static: [path.resolve(__dirname, '.')] });
const watcher = sane(path.resolve(__dirname, '.'), { glob: [ '**/*.js', '**/*.css', '**/*.html' ] });

serve.on('listening', () => {
  watcher.on('change', (filePath, root, stat) => {
    serve.emit('reload', { source: 'config' });
  });
});

module.exports = {
  mode: 'development',

  plugins: [
    serve
  ],
  watch: true
}
