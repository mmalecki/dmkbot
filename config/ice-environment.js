exports.common = {
  irc: {
    nick: "icebot",
    //channel: ["#oulu", "#oulu-test"]
    channels: ["#node.js"]
  },
  modules: {
    ping: {},
    docs: {},
    up: {},
    talk: {
		interval: 15000,
		file:'./randomstuff.ini'
	},
/*    github: {
      interval: 15000,
      repo: 'jheusala/oulu'
    }
*/  }
}

exports.development = {
  irc: {
    host: "irc.kapsi.fi"
  },
}

exports.production = {
  irc: {
    host: "irc.kapsi.fi"
  }
}

