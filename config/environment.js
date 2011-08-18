exports.common = {
  irc: {
    nick: "dmkbot",
    channel: "#node.js",
  },
  modules: {
    ping: {},
    docs: {},
    up: {}
  }
}

exports.development = {
  irc: {
    host: "localhost"
  },
}

exports.production = {
  irc: {
    host: "irc.freenode.net"
  }
}

