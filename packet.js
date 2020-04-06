var zeroBuffer = Buffer.from('00', 'hex');

module.exports = packet = {

    //params: an array of javascript objects to be turned into buffers.
    build: function (params) {

        var packetParts = [];
        var packetSize = 0;

        params.forEach(function (param) {
            var buffer;

            if (typeof param === 'string') {
                buffer = Buffer.from(param, 'utf8');
                buffer = Buffer.concat([buffer, zeroBuffer], buffer.length + 1)
            }
            else if (typeof param === 'number') {
                buffer = Buffer.alloc(2);
                buffer.writeUInt16LE(param, 0);
            }
            else {
                console.log(param)
                console.log("WARNING: Unknown data type in packet builder!");
            }

            packetSize += buffer.length;
            packetParts.push(buffer);

        })
        var dataBuffer = Buffer.concat(packetParts, packetSize);

        var size = Buffer.alloc(1);
        size.writeUInt8(dataBuffer.length + 1, 0);

        var finalPacket = Buffer.concat([size, dataBuffer], size.length + dataBuffer.length);

        return finalPacket;

    },

    //Parse a packet to be handled for a client
    parse: function (c, data) {

        var idx = 0;

        while (idx < data.length) {

            var packetSize = data.readUInt8(idx);
            var extractedPacket = Buffer.alloc(packetSize);
            data.copy(extractedPacket, 0, idx, idx + packetSize)

            this.interpret(c, extractedPacket);

            idx += packetSize;

        }

    },
    interpret: function (c, datapacket) {
        var header = PacketModels.header.parse(datapacket);
        console.log("interpretting " + header.command)
        switch (header.command.toUpperCase()) {
            case "LOGIN":
                var data = PacketModels.login.parse(datapacket);
                User.login(data.username, data.password, function (result, user) {
                    console.log('Login Result ' + result)
                    if (result) {
                        c.user = user;
                        c.enterroom(c.user.current_room);
                        c.socket.write(packet.build(["LOGIN", "TRUE", c.user.current_room, c.user.pos_x, c.user.pos_y, c.user.username]))
                    } else {
                        c.socket.write(packet.build(["LOGIN", "FALSE"]))
                    }
                })
                break;

            case "REGISTER":
                var data = PacketModels.register.parse(datapacket);
                User.register(data.username, data.password, function (result) {
                    if (result) {
                        c.socket.write(packet.build(["REGISTER", "TRUE"]))
                    } else {
                        c.socket.write(packet.build(["REGISTER", "FALSE"]))
                    }
                })
                break;
            case "POS":
                var data = PacketModels.pos.parse(datapacket);
                c.user.pos_x = data.target_x;
                c.user.pos_y = data.target_y;
                c.broadcastroom(packet.build(["POS", c.user.username, data.target_x, data.target_y]));
                console.log(data);
                break;
            case "DIR":
                var data = PacketModels.dir.parse(datapacket);
                c.user.dir = data.dir;
                c.broadcastroom(packet.build(["DIR", c.user.username, data.dir]));
                break;
            case "ACTION":
                var data = PacketModels.action.parse(datapacket);
                c.user.action = data.action;
                c.broadcastroom(packet.build(["ACTION", c.user.username, data.action]));
                break;
            case "STATE":
                var data = PacketModels.state.parse(datapacket);
                c.user.state = data.state;
                c.broadcastroom(packet.build(["STATE", c.user.username, data.state]));
                break;
            case "HP":
                var data = PacketModels.hp.parse(datapacket);
                c.user.hp = data.hp;
                c.broadcastroom(packet.build(["HP", c.user.username, data.hp]));
                break;
            case "PROJECTILE_CREATE":
                console.log(datapacket)
                var data = PacketModels.projectile_create.parse(datapacket);
                c.spell.create(data) //hand this an object
                c.broadcastroom(packet.build(["PROJECTILE_CREATE", data.type, data.target_x, data.target_y, data.dir, data.room]));
                break;
            case "PROJECTILE_POS":
                console.log(datapacket)
                var data = PacketModels.projectile_pos.parse(datapacket);
                c.broadcastroom(packet.build(["PROJECTILE_POS", data.id, data.target_x, data.target_y]));
                break;
            case "PROJECTILE_DESTROY":
                var data = PacketModels.projectile_destroy.parse(datapacket);
                c.spell.destroy(data.id) //hand this an object
                c.broadcastroom(packet.build(["PROJECTILE_DESTROY", data.id]));
                break;
        }
        //if (header.command.toUpperCase() == "POS" || header.command.toUpperCase() == "DIR") {
        //    c.user.save();
        //}
    }
}