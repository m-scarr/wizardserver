var Parser = require('binary-parser').Parser;
var StringOptions = { length: 99, zeroTerminated: true };

module.exports = PacketModels = {
    header: new Parser().skip(1)
        .string("command", StringOptions),
    login: new Parser().skip(1)
        .string("command", StringOptions)
        .string("username", StringOptions)
        .string("password", StringOptions),
    register: new Parser().skip(1)
        .string("command", StringOptions)
        .string("username", StringOptions)
        .string("password", StringOptions),
    pos: new Parser().skip(1)
        .string("command", StringOptions)
        .int32le("target_x", StringOptions)
        .int32le("target_y", StringOptions),
    dir: new Parser().skip(1)
        .string("command", StringOptions)
        .string("dir", StringOptions),
    action: new Parser().skip(1)
        .string("command", StringOptions)
        .string("action", StringOptions),
    state: new Parser().skip(1)
        .string("command", StringOptions)
        .string("state", StringOptions),
    hp: new Parser().skip(1)
        .string("command", StringOptions)
        .string("hp", StringOptions),
    projectile_create: new Parser().skip(1)
        .string("command", StringOptions)
        .string("id", StringOptions)
        .int32le("target_x", StringOptions)
        .int32le("target_y", StringOptions)
        .int32le("dir", StringOptions)
        .string("room", StringOptions)
        .string("type", StringOptions),
    projectile_pos: new Parser().skip(1)
        .string("command", StringOptions)
        .string("id", StringOptions)
        .int32le("target_x", StringOptions)
        .int32le("target_y", StringOptions),
    projectile_destroy: new Parser().skip(1)
        .string("command", StringOptions)
        .string("id", StringOptions)
}