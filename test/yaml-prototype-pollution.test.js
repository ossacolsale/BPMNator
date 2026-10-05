const assert = require('node:assert/strict');
const test = require('node:test');
const { YAMLParser } = require('../dist/parser/YAMLParser');

test('YAML merge keys cannot pollute object prototypes', () => {
  const yaml = `
process: Example
activities:
  Task:
    type: human
payload: &payload
  __proto__:
    polluted: true
merged:
  <<: *payload
`;

  const parser = new YAMLParser('content', yaml);

  assert.ok(parser.RawYaml, 'the YAML document should be parsed');
  assert.equal(Object.prototype.polluted, undefined);
  assert.equal(({}).polluted, undefined);
  assert.equal(Object.getPrototypeOf(parser.RawYaml.merged), Object.prototype);
  assert.equal(Object.hasOwn(parser.RawYaml.merged, '__proto__'), true);
  assert.equal(parser.RawYaml.merged.__proto__.polluted, true);
});
