const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/v1',
    createProxyMiddleware({
      target: 'https://api.test.aqua-delivery.ru',
      changeOrigin: true,
      secure: false,
    })
  );
};
