    module.exports = {
        devServer: {
            proxy:  {
                '/web4_0/webapi': {
                    target: 'http://localhost:8080',
                    ws: true,
                    changeOrigin: true
                }
            },
        }
    };