var express = require('express');
var router = express.Router();
var fs = require('fs');
var lineReader = require('line-reader');
var LineByLineReader = require('line-by-line');

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index');
});

router.post('/parse', function (req, res) {
  if (req.file) {
    // Create a readable stream
    var readerStream = fs.createReadStream(req.file.path);
    // Set the encoding to be utf8. 
    readerStream.setEncoding('UTF8');
    // Create a writable stream
    var writerStream = fs.createWriteStream('input.txt');
    // Pipe the read and write operations
    readerStream.on('data', function (chunk) {
      writerStream.write(chunk);
    });
    readerStream.on('end', function () {
      var writerOutputStream = fs.createWriteStream('output.txt');
      var lineArr = [];
      var lineObj = {};
      lr = new LineByLineReader('input.txt');
      lr.on('line', function (line) {
        lr.pause();
        var lineSplit = line.split('');
        if (lineSplit.length === 0) {
          lr.pause();
          var keys = Object.keys(lineObj);
          var finalOutput = [];
          Object.keys(lineObj).forEach(function (value) {
            var a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = 0;
            for (var j = 0; j < 3; j++) {
              for (var k = 0; k < 3; k++) {
                if (j === 0 && (lineObj[value][j][1] == '_' || lineObj[value][j][1] == '|')) {
                  a = 1;
                }
                if (j === 1 && (lineObj[value][j][0] == '_' || lineObj[value][j][0] == '|')) {
                  f = 1;
                }
                if (j === 1 && (lineObj[value][j][1] == '_' || lineObj[value][j][1] == '|')) {
                  g = 1
                }
                if (j === 1 && (lineObj[value][j][2] == '_' || lineObj[value][j][2] == '|')) {
                  b = 1;
                }
                if (j === 2 && (lineObj[value][j][0] == '_' || lineObj[value][j][0] == '|')) {
                  e = 1;
                }
                if (j === 2 && (lineObj[value][j][1] == '_' || lineObj[value][j][1] == '|')) {
                  d = 1;
                }
                if (j === 2 && (lineObj[value][j][2] == '_' || lineObj[value][j][2] == '|')) {
                  c = 1;
                }
              }
            }
            finalOutput.push(decode(a, b, c, d, e, f, g));
          });
          writerOutputStream.write(finalOutput.toString() + '\n');
          lineObj = {};
          finalOutput = [];
          lr.resume();
        }

        for (var i = 0; i < lineSplit.length;) {
          var arr = [];
          arr.push(lineSplit[i]);
          arr.push(lineSplit[i + 1]);
          arr.push(lineSplit[i + 2]);
          if (lineObj[i]) {
            lineObj[i].push(arr);
          } else {
            lineObj[i] = [];
            lineObj[i].push(arr);
          }
          i += 3;
        }

        if (lineSplit.length !== 0) {
          lr.resume();
        }

        function decode(a, b, c, d, e, f, g) {
          var arr = [a, b, c, d, e, f, g];
          var segDisp = {
            '1': [0, 1, 1, 0, 0, 0, 0],
            '2': [1, 1, 0, 1, 1, 0, 1],
            '3': [1, 1, 1, 1, 0, 0, 1],
            '4': [0, 1, 1, 0, 0, 1, 1],
            '5': [1, 0, 1, 1, 0, 1, 1],
            '6': [1, 0, 1, 1, 1, 1, 1],
            '7': [1, 1, 1, 0, 0, 0, 0],
            '8': [1, 1, 1, 1, 1, 1, 1],
            '9': [1, 1, 1, 1, 0, 1, 1],
            '0': [1, 1, 1, 1, 1, 1, 0],
          }
          var keys = Object.keys(segDisp);
          var flag = false;
          for (var i = 0; i < keys.length; i++) {
            if (segDisp[i].toString() == arr.toString()) {
              // return i;
              flag = true;
              break;
            }
          }
          if (flag) {
            return i;
          } else {
            return '?'
          }
        }
      });
      lr.on('end', function () {
        const readStream = fs.createReadStream('output.txt');
        readStream.on('open', function () {
          // This just pipes the read stream to the response object
          readStream.pipe(res);
        });
      })
    });
    // readerStream.pipe(writerStream);

  } else {
    return res.status(400).send({
      error: true,
      message: 'File is required'
    });
  }

});

module.exports = router;
