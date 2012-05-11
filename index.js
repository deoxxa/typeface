#!/usr/bin/node

var char = require('charmander')
  , fs = require('fs')
  , tty = require('tty')
  , argv = require('optimist')
            .usage('Usage: $0 [--replace characterMap] filepath')
            .check(function(argv) {
              if(!argv['_'][0])
                throw 'You need to specify a filepath'
            })
            .argv
  , position = 0
  , typeSpeed = 1
  , charMap = ''
  ;

process.stdin.resume()
tty.setRawMode(true)

//fill the charMap
if(argv.replace) {
  charMap = char(argv.replace)
}

fs.readFile(argv._[0], 'utf8', function(err, data) {
  process.stdin.on('keypress', function(char, key) {
    if(key && key.ctrl && key.name === 'c')
      process.exit()
    if(char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57)
      return typeSpeed = parseInt(char, 10)

    var substr = data.substr(position, typeSpeed)

    if(charMap.length) {
      substr = substr.replace(/[^\W]/g, function() {
        return charMap.charAt(random(0, charMap.length))
      })
    }

    process.stdout.write(substr)

    position += typeSpeed

    if(position > data.length)
      process.exit()
  })
})

var random = function(min, max) {
  return Math.floor(Math.random() * (max - min) + 1) + min;
}
