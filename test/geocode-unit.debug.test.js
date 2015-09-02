var tape = require('tape');
var Carmen = require('..');
var index = require('../lib/index');
var context = require('../lib/context');
var mem = require('../lib/api-mem');
var queue = require('queue-async');
var addFeature = require('../lib/util/addfeature');

var conf = {
    province: new mem(null, function() {}),
    city: new mem(null, function() {}),
    street: new mem({ maxzoom:6, geocoder_address:1 }, function() {})
};
var c = new Carmen(conf);
tape('index province', function(t) {
    var province = {
        _id:1,
        _text:'new york, ny',
        _zxy:['6/32/32','6/33/32'],
        _center:[0,0]
    };
    addFeature(conf.province, province, t.end);
});
tape('index city 1', function(t) {
    var city = {
        _id:2,
        _text:'new york, ny',
        _zxy:['6/32/32'],
        _center:[0,0]
    };
    addFeature(conf.city, city, t.end);
});
tape('index city 2', function(t) {
    var city = {
        _id:3,
        _text:'tonawanda',
        _zxy:['6/33/32'],
        _center:[360/64+0.001,0]
    };
    addFeature(conf.city, city, t.end);
});
tape('index street 1', function(t) {
    var street = {
        _id:4,
        _text:'west st',
        _zxy:['6/32/32'],
        _center:[0,0]
    };
    addFeature(conf.street, street, t.end);
});
tape('index street 2', function(t) {
    var street = {
        _id:5,
        _text:'west st',
        _zxy:['6/33/32'],
        _center:[360/64+0.001,0]
    };
    addFeature(conf.street, street, t.end);
});
tape('west st, tonawanda, ny', function(t) {
    c.geocode('west st tonawanda ny', { limit_verify:1, debug:4 }, function(err, res) {
        t.ifError(err);
        t.equal(res.debug.id, 4, 'debugs id');
        t.equal(res.debug.extid, 4, 'debugs extid');

        t.deepEqual(Object.keys(res.debug), [
            'id',
            'extid',
            'phrasematch',
            'spatialmatch',
            'spatialmatch_position',
            'verifymatch',
            'verifymatch_position'
        ], 'debug keys');

        t.deepEqual(res.debug.phrasematch, {
            'province': { ny: 0.25 },
            'city': { ny: 0.25, tonawanda: 0.25 },
            'street': { 'west st': 0.5 }
        }, 'debugs matched phrases');

        // Found debug feature in spatialmatch results @ position 1
        t.deepEqual(res.debug.spatialmatch[0].text, 'west st');
        t.deepEqual(res.debug.spatialmatch[0].relev, 0.5);
        t.deepEqual(res.debug.spatialmatch[1].text, 'ny');
        t.deepEqual(res.debug.spatialmatch[1].relev, 0.25);
        t.deepEqual(res.debug.spatialmatch_position, 1);

        // Debug feature not found in verifymatch
        t.deepEqual(res.debug.verifymatch, null);
        t.end();
    });
});
tape('west st, tonawanda, ny', function(t) {
    c.geocode('west st tonawanda ny', { limit_verify:1, debug:5 }, function(err, res) {
        t.ifError(err);
        t.equal(res.debug.id, 5, 'debugs id');
        t.equal(res.debug.extid, 5, 'debugs extid');

        t.deepEqual(Object.keys(res.debug), [
            'id',
            'extid',
            'phrasematch',
            'spatialmatch',
            'spatialmatch_position',
            'verifymatch',
            'verifymatch_position'
        ], 'debug keys');

        t.deepEqual(res.debug.phrasematch, {
            'province': { ny: 0.25 },
            'city': { ny: 0.25, tonawanda: 0.25 },
            'street': { 'west st': 0.5 }
        }, 'debugs matched phrases');

        // Found debug feature in spatialmatch results @ position 1
        t.deepEqual(res.debug.spatialmatch[0].id, 5);
        t.deepEqual(res.debug.spatialmatch[0].text, 'west st');
        t.deepEqual(res.debug.spatialmatch[0].relev, 0.5);
        t.deepEqual(res.debug.spatialmatch[1].text, 'tonawanda');
        t.deepEqual(res.debug.spatialmatch[1].relev, 0.25);
        t.deepEqual(res.debug.spatialmatch[2].text, 'ny');
        t.deepEqual(res.debug.spatialmatch[2].relev, 0.25);
        t.deepEqual(res.debug.spatialmatch_position, 0);

        // Debug feature not found in verifymatch
        t.deepEqual(res.debug.verifymatch[0]._id, 5);
        t.deepEqual(res.debug.verifymatch[0]._text, 'west st');
        t.deepEqual(res.debug.verifymatch_position, 0);
        t.end();
    });
});

tape('index.teardown', function(assert) {
    index.teardown();
    context.getTile.cache.reset();
    assert.end();
});

