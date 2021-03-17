let publicPath = process.env.NODE_ENV === 'production' ? 'light-blue-vue-admin/' : '/';

module.exports = {
  publicPath,
  productionSourceMap: false,
  devServer: {
    public: 'painel.brat.com.br:80'
  }
};
