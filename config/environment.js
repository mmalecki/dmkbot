exports.common = {
  irc: {
    nick: "dmkbot",
    channel: "#node.js",
    password: "dmkbot",
  }
}

exports.development = {
  irc: {
    host: "localhost"
  },
  modules: {
    ping: {}
  }
}

exports.production = {
  irc: {
    host: "irc.freenode.net"
  }
}

