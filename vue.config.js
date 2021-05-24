let publicPath = process.env.NODE_ENV === 'production' ? '' : '/';

module.exports = {
  publicPath,
  productionSourceMap: false,
  /*
  devServer: {
    public: 'painel.brat.com.br:80'
  }
  */
};
