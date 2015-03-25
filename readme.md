# Diffr

CLI diff tool for files, text, and JSON written in Node.js

## Install

```js
npm install diffr -g
```

## Usage

```bash

  Usage: diffr [options] <file ...>

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -t, --text [value]   Add text string to be diff'd
    -j, --json [string]  Add json string to be diff'd
    -f, --file <file>    Add file to be diff'd

```

## Examples


**Text**

```bash
$ diffr -t "hello\nworld" -t "hello\nnijiko"
```

**JSON**

```bash
$ diffr -j "{\"hello\":\"world\"}" -j "{\"hello\":\"nijiko\"}"
```

**File**

```bash
$ diffr diffr.js package.json
```

**File Descriptors / Streams**

```bash
$ diffr <(curl -Is https://httpbin.org/ip  2>&1) <(curl -Is https://httpbin.org  2>&1)
```

## License

MIT