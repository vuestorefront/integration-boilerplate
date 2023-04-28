module.exports = {
  title: 'Integration Boilerplate',
  base: '/integration-boilerplate/',
  description: 'Documentation for the new Integration boilerplate',
  head: [['link', { rel: 'icon', href: '/favicon.png' }]],
  theme: 'vsf-docs',
  configureWebpack: (config) => {
    config.module.rules = config.module.rules.map((rule) => ({
      ...rule,
      use:
        rule.use &&
        rule.use.map((useRule) => ({
          ...useRule,
          options:
            useRule.loader === 'url-loader'
              ? /**
           Hack for loading images properly.
           ref: https://github.com/vuejs/vue-loader/issues/1612#issuecomment-559366730
           */
                { ...useRule.options, esModule: false }
              : useRule.options
        }))
    }));
  },
  themeConfig: {
    nav: [
      { text: 'Vue Storefront', link: 'https://vuestorefront.io/' },
      { text: 'Core Documentation', link: 'https://docs.vuestorefront.io/v2/' }
    ],
    sidebar: {
      '/': [
        {
          title: 'Reference',
          collapsable: false,
          children: [['/reference/api/', 'API Reference']]
        }
      ]
    }
  }
};
