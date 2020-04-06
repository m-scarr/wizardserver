var args = require('minimist')(process.argv.slice(2));
var extend = require('extend');

var environment = args.env || "production";

var common_conf = {
    name: "Wizard Duel",
    version: "0.0.1",
    max_players: 2,
    environment,
    data_paths: {
        maps: __dirname + "/Game_Data/Maps/"
    },
    starting_zone: "rm_duel_test",
}

var conf = {
    production: {
        ip: args.ip || "0.0.0.0",
        port: args.port || 8080,
        database: "mongodb://DB_user:db9461@ds263847.mlab.com:63847/heroku_j8vj4dfh"
    },
};

extend(false, conf.test, common_conf);

module.export = config = conf[environment];