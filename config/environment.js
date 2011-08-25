exports.common = {
  irc: {
    nick: "dmkbot",
    channels: ["#node.js"],
  },
  modules: {
    ping: {},
    docs: {},
    up: {},
    github: {
      interval: 15000,
      repo: 'joyent/node'
    }
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

