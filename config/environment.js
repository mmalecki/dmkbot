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
      colors: true,
      interval: 15000,
      repos: ['joyent/node', 'joyent/libuv']
    },
    eval: {
      stderr: false
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

