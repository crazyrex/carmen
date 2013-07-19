#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var argv = process.argv;
var api = {
    '.s3': require('../api-s3'),
    '.mbtiles': require('../api-mbtiles')
};
var Carmen = require('../index.js');
var Queue = require('../queue');
var f = argv[2];

if (!f) {
    console.warn('Usage: carmen-index.js <file>');
    process.exit(1);
}
if (!fs.existsSync(f)) {
    console.warn('File %s does not exist.', f);
    process.exit(1);
}
if (!api[path.extname(f)]) {
    console.warn('File %s format not recognized.', f);
    process.exit(1);
}

console.log('Indexing %s ...', f);

var from = new api[path.extname(f)](f, function() {});
var carmen = new Carmen({ from: from });

carmen._open(function(err) {
    if (err) throw err;
    from.startWriting(function(err) {
        if (err) throw err;
        var index = function(pointer) {
            from.indexable(pointer, function(err, docs, pointer) {
                if (err) throw err;
                if (!docs.length) return from.stopWriting(function(err) {
                    if (err) throw err;
                    console.log('Done.');
                });
                var start = +new Date;
                carmen.index(from, docs, function(err) {
                    if (err) throw err;
                    console.log('Indexed %s docs @ %s/s', docs.length, Math.floor(docs.length * 1000 / (+new Date - start)));
                    index(pointer);
                });
            });
        };
        index();
    });
});
