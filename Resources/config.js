var args = require('minimist')(process.argv.slice(2));
var extend = require('extend');

var environment = args.env || "test";

var common_conf = {
    name: "Wizard Duel",
    version: "0.0.1",
    max_players: 2,
    environment,
    data_paths: {
        maps: __dirname + "\\Game Data\\" + "Maps\\"
    },
    starting_zone: "rm_duel_test",
}

var conf = {
    test: {
        ip: args.ip || "0.0.0.0",
        port: args.port || 8080,
        database: "mongodb://localhost:27017/wizard_duel"
    },
};

extend(false, conf.test, common_conf);

module.export = config = conf[environment];