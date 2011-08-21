exports.common = {
  irc: {
    nick: "dmkbot",
    channels: ["#node.js", "#bots"],
  },
  modules: {
    ping: {},
    docs: {},
    up: {},
    github: { interval: 5000}
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

