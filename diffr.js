#!/usr/bin/env node

// Globals
require('colors')

// Locals
var StringDecoder = require('string_decoder').StringDecoder
var program = require('commander')
var diff = require('line-diff')
var pkg = require('./package.json')
var fs = require('fs')

// Pipes
var descriptors = 0

// Options
var strings = []

// Helpers
function push (item, list) {
  list.push(item)
  return list
}

function json (item, list) {
  list.push(JSON.stringify(JSON.parse(item), null, 2))
  return list
}

function file (item) {
  var str = ""

  descriptors++

  var readStream = fs.createReadStream(item)
    .on('readable', function () {
      var decoder = new StringDecoder('utf8')
      var chunk

      while (null !== (chunk = readStream.read())) {
        str += decoder.write(chunk)
      }
    })
    .on('end', function () {
      push(str, strings)
      descriptors--

      if (descriptors <= 0)
        return output()
    })
}

program
  .version(pkg.version)
  .usage  ('[options] <file ...>')
  .option ('-t, --text [value]', 'Add text string to be diff\'d', push, strings)
  .option ('-j, --json [string]', 'Add json string to be diff\'d', json, strings)
  .option ('-f, --file <file>', 'Add file to be diff\'d', file)
  .parse  (process.argv)

for (var index in program.args)
  file(program.args[index])

diff.prototype.toString = function () {
  var self = this
  var str = "\n"
  var cDiff = { added: "", removed: "" }

  self.changes.forEach(function (cChange) {
    if (!cChange.modified) {
      str += "   " + cChange._[1].grey + "\n"
    } else {
      str += " - ".red + cChange._[0].red + "\n"

      if (cChange._[1]) {
        str += " + ".green + cChange._[1].green + "\n"
      }
    }
  })

  return str.replace(/\s+$/,'')
}

function output () {
  console.log(diff(strings[0], strings[1]).toString())
}

if (!descriptors) {
  if (!strings.length) {
    program.help()
  }

  output()
}