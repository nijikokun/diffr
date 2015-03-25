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

   HTTP/1.1 200 OK
   Server: nginx
   Date: Wed, 25 Mar 2015 07:10:56 GMT
 - Content-Type: text/html; charset=utf-8
 + Content-Type: application/json
 - Content-Length: 11729
 + Content-Length: 32
   Connection: keep-alive
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Credentials: true

```

## License

MIT