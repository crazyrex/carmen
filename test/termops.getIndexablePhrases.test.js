var termops = require('../lib/util/termops');
var test = require('tape');

test('termops.getIndexablePhrases', function(assert) {
    var tokens;
    var freq;

    tokens = ['main', 'st'];
    freq = {};
    freq[0] = [101];
    freq[termops.encodeTerm(tokens[0])] = [1];
    freq[termops.encodeTerm(tokens[1])] = [100];

    assert.deepEqual(termops.getIndexablePhrases(tokens, freq), [
        {
            "degen": true,
            "relev": 1,
            "text": "m",
            "phrase": 3893112696,
        },
        {
            "degen": true,
            "relev": 1,
            "text": "ma",
            "phrase": 1680745560,
        },
        {
            "degen": true,
            "relev": 1,
            "text": "mai",
            "phrase": 3869440688,
        },
        {
            "degen": true,
            "relev": 1,
            "text": "main",
            "phrase": 3935363592,
        },
        {
            "degen": true,
            "relev": 1,
            "text": "main s",
            "phrase": 2290296530,
        },
        {
            "degen": true,
            "relev": 1,
            "text": "main st",
            "phrase": 2339755450,
        },
        {
            "degen": false,
            "relev": 1,
            "text": "main st",
            "phrase": 2339755451,
        },
        {
            "degen": false,
            "relev": 0.8,
            "text": "main",
            "phrase": 3935363593,
        }
    ]);

    assert.end();
});

test('termops.getIndexablePhrases (weight sieve)', function(assert) {
    var tokens;
    var freq;

    tokens = ['jose', 'de', 'la', 'casa'];
    freq = {};
    freq[0] = [202];
    freq[termops.encodeTerm(tokens[0])] = [1];
    freq[termops.encodeTerm(tokens[1])] = [100];
    freq[termops.encodeTerm(tokens[2])] = [100];
    freq[termops.encodeTerm(tokens[3])] = [1];

    assert.deepEqual(termops.getIndexablePhrases(tokens, freq).map(function(p) {
        return (p.relev) + '-' + (p.degen ? 1 : 0) + '-' + p.text;
    }), [
        '1-1-j',
        '1-1-jo',
        '1-1-jos',
        '1-1-jose',
        '1-1-jose d',
        '1-1-jose de',
        '1-1-jose de l',
        '1-1-jose de la',
        '1-1-jose de la c',
        '1-1-jose de la ca',
        '1-1-jose de la cas',
        '1-1-jose de la casa',
        '1-0-jose de la casa',
        '1-1-jose de c',
        '1-1-jose de ca',
        '1-1-jose de cas',
        '1-1-jose de casa',
        '1-0-jose de casa',
        '1-1-jose l',
        '1-1-jose la',
        '1-1-jose la c',
        '1-1-jose la ca',
        '1-1-jose la cas',
        '1-1-jose la casa',
        '1-0-jose la casa',
        '0.8-1-jose c',
        '0.8-1-jose ca',
        '0.8-1-jose cas',
        '0.8-1-jose casa',
        '0.8-0-jose casa'
    ]);

    assert.end();
});

test('termops.getIndexablePhrases (京都市)', function(assert) {
    var tokens;
    var freq;

    tokens = ['京都市'];
    freq = {};
    freq[0] = [1];
    freq[termops.encodeTerm(tokens[0])] = [1];

    assert.deepEqual(termops.getIndexablePhrases(tokens, freq), [
        { degen: true, phrase: 3106018848, relev: 1, text: '京' },
        { degen: true, phrase: 2523610322, relev: 1, text: '京都' },
        { degen: true, phrase: 3849941228, relev: 1, text: '京都市' },
        { degen: false, phrase: 3849941229, relev: 1, text: '京都市' }
    ]);

    assert.end();
});

test('termops.getIndexablePhrases (москва)', function(assert) {
    var tokens;
    var freq;

    tokens = ['москва'];
    freq = {};
    freq[0] = [1];
    freq[termops.encodeTerm(tokens[0])] = [1];

    assert.deepEqual(termops.getIndexablePhrases(tokens, freq), [
        { degen: true, phrase: 3893112696, relev: 1, text: 'м' },
        { degen: true, phrase: 1647190320, relev: 1, text: 'мо' },
        { degen: true, phrase: 3567149360, relev: 1, text: 'мос' },
        { degen: true, phrase: 240336664, relev: 1, text: 'моск' },
        { degen: true, phrase: 4195145872, relev: 1, text: 'москв' },
        { degen: true, phrase: 2553908032, relev: 1, text: 'москва' },
        { degen: false, phrase: 2553908033, relev: 1, text: 'москва' }
    ]);

    assert.end();
});

test('termops.getIndexablePhrases (josé)', function(assert) {
    var tokens;
    var freq;

    tokens = ['josé'];
    freq = {};
    freq[0] = [1];
    freq[termops.encodeTerm(tokens[0])] = [1];

    assert.deepEqual(termops.getIndexablePhrases(tokens, freq), [
        { degen: true, phrase: 4010556024, relev: 1, text: 'j' },
        { degen: true, phrase: 1648323152, relev: 1, text: 'jo' },
        { degen: true, phrase: 3470006328, relev: 1, text: 'jos' },
        { degen: true, phrase: 4058142120, relev: 1, text: 'josé' },
        { degen: false, phrase: 4058142121, relev: 1, text: 'josé' }
    ]);

    assert.end();
});
