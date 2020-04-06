var now = require('performance-now');
var _ = require('underscore');

module.exports = function(){

    var client = this;
    this.spell = {
        create: function(obj) {
            client.spell.list += obj;
        },
        destroy: function(id) {
            for (var i = 0; i < client.spell.list.length; i++) {
                if (id == client.spell.list[i].id) {
                    client.spell.list.splice(i,1)
                }
            }
        },
        list: []
        //this.list = []
    }

    //These objects will be added at runtime...
    //this.socket = {}
    //this.user = {}

    //Initialization
    this.initiate = function(){
        //Send the connection handshake packet to the client.
        client.socket.write(packet.build(["HELLO", now().toString()]));

        console.log('client initiated')
    };

    //Client Methods
    this.enterroom = function(selected_room){

        maps[selected_room].clients.forEach(function(otherClient){
            otherClient.socket.write(packet.build(["ENTER", client.user.username, client.user.pos_x, client.user.pos_y]))
        })

        maps[selected_room].clients.push(client);

    };

    this.broadcastroom = function(packetData){

        maps[client.user.current_room].clients.forEach(function(otherClient){

            if(otherClient.user.username != client.user.username){
                otherClient.socket.write(packetData);
            };

        })

    };

    //Socket Stuff
    this.data = function(data){
        packet.parse(client, data);
    };

    this.error = function(err){
        console.log("client error " + err.toString());
    };

    this.end = function(){
        client.user.save();
        console.log("client closed");
    };

}