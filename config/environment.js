exports.common = {
  irc: {
    nick: "dmkbot",
    channels: ["#node.js"],
  },
  interval: 500,
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
  modules: {
    github: {
      interval: 5000
    }
  }
}

exports.production = {
  irc: {
    host: "irc.freenode.net"
  },
  modules: {
    github: {
      __digest: 300000
    }
  }
}

