var path = require('path');
var useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

module.exports = function () {
    var env = process.env.CONFIG ? process.env.CONFIG : 'local';
    useDefaultConfig[process.env.IONIC_ENV].resolve.alias = {
        "@environmentConfig": path.resolve(`./src/config/config.${env}.ts`)
    };

    return useDefaultConfig;
};