let mongoose = require('mongoose');

let Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var MinecraftPunishment = new Schema({
    punisher: ObjectId,
    punished: ObjectId,

    ip: String,
    ip_ban: Boolean, 

    type: String,
    
    issued: Number,
    expires: Number,
    reason: String,
    reverted: Boolean
});

MinecraftPunishment.methods.isActive = function() {
    if (this.reverted == true) {
        return false;
    } else {
        if (this.expires == -1) {
            return true;
        } else {
            return this.expires > new Date().getTime()
        }
    }
};

MinecraftPunishment.methods.shouldKick = function() {
    return this.type.toLowerCase() === 'ban' || this.type.toLowerCase() === 'kick';
};

mongoose.model('minecraft_punishment', MinecraftPunishment);

var MinecraftUser = new Schema({
    name                    : String,
    nameLower               : String,
    uuid                    : String,

    initialJoinDate         : Number,
    lastOnlineDate          : Number,

    ranks                   : [ObjectId],
    ips                     : [String],



    kills                   : Number,
    deaths                  : Number,
    wins                    : Number,
    losses                  : Number,
    matches                 : [ObjectId],
    
    wool_destroys           : Number,
    punishments             : [MinecraftPunishment]
});
MinecraftUser.methods.toJSON = function() {
    let obj = this.toObject();
    delete obj.password;
    delete obj.ips;
    return obj;
};
MinecraftUser.methods.loadRanks = function (callback) {
    MinecraftRank.find({ _id: { $in: this.ranks } }, (err, ranks) => {
        if (err) console.log(err);
        
        callback(ranks);
    })
};
mongoose.model('minecraft_user', MinecraftUser);

let MinecraftRank = new Schema({
    name                : String,
    priority            : Number,
    prefix              : String,
    permissions         : [String],
    staff               : Boolean
});
mongoose.model('minecraft_rank', MinecraftRank);

var MinecraftServer = new Schema({
    name                : String,
    nameLower           : String,
    id                  : String,

    lastOnlineDate      : Number,
    players             : [ObjectId],
    playerNames         : [String],

    playerCount         : Number,
    spectatorCount      : Number,
    maxPlayers          : Number,
    map                 : String,
    gametype            : String
});
mongoose.model('minecraft_server', MinecraftServer);

let MinecraftDeath = new Schema({
    player          : ObjectId,
    killer          : ObjectId,

    playerItem      : String,
    killerItem      : String,

    map             : ObjectId,
    date            : Number,
    match           : ObjectId,

    playerLoaded    : MinecraftUser,
    killerLoaded    : MinecraftUser
});
mongoose.model('minecraft_death', MinecraftDeath);

let MinecraftMap = new Schema({
    name            : String,
    nameLower       : String,
    version         : String,
    authors         : [String],
    gametype        : String,
    thumbnail       : String,
    images          : [String],
    teams           : [{
        id: String,
        name: String,
        color: String,
        min: Number,
        max: Number,
    }]
});
mongoose.model('minecraft_map', MinecraftMap);

let MinecraftMatch = new Schema({
    map             : ObjectId,
    initializedDate : Number,
    startedDate     : Number,
    finishedDate    : Number,
    chat            : [{
        user: ObjectId,
        username: String,
        uuid: String,
        message: String,
        team: String,
        matchTime: Number,
        teamChat: Boolean
    }],
    deaths: [ObjectId],
    winners: [ObjectId],
    losers: [ObjectId],
    winningTeam: String,
    teamMappings: [{
        team: String,
        player: ObjectId
    }],
    finished: Boolean
});
mongoose.model('minecraft_match', MinecraftMatch);