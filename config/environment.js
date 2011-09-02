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
      colors: false,
      interval: 15000,
      repos: ['joyent/node', 'joyent/libuv']
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
  },
  modules: {
    github: {
      colors: true
    }
  }
}

