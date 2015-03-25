#!/usr/bin/env node

// Globals
require('colors')

// Locals
var StringDecoder = require('string_decoder').StringDecoder
var Table = require('cli-table')
var program = require('commander')
var diff = require('line-diff')
var pkg = require('./package.json')
var fs = require('fs')

// Pipes
var descriptors = 0

// Options
var strings = []

// Helpers
function setTrue () {
  return true
}

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
  .option ('-c, --column', 'Columnized output', setTrue, false)
  .parse  (process.argv)

for (var index in program.args)
  file(program.args[index])

diff.prototype.toString = function () {
  var self = this
  var str = "\n"

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

diff.prototype.toTable = function () {
  var self = this
  var table = new Table({
    chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
           , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
           , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
           , 'right': '' , 'right-mid': '' , 'middle': ' ' }
  })

  table.push([' ', ' '])

  function trim (str) {
    return str.replace(/(\r|\r\n|\t|\s)+$/g, '')
  }

  self.changes.forEach(function (cChange) {
    if (!cChange.modified) {
      table.push([
        trim(cChange._[1]).grey,
        trim(cChange._[1]).grey
      ])
    } else {
      var entry = []

      entry[0] = trim(cChange._[0]).red

      if (cChange._[1]) {
        entry[1] = trim(cChange._[1]).green
      }

      table.push(entry)
    }
  })

  while (table[table.length-1][0] === "\u001b[90m\u001b[39m") {
    table.pop()
  }

  return table
}

function output () {
  var difference = diff(strings[0], strings[1])

  if (program.column) {
    difference = difference.toTable()
  }

  console.log(difference.toString())
}

if (!descriptors) {
  if (!strings.length) {
    program.help()
  }

  output()
}