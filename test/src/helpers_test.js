// Copyright 2014 Akamai Technologies, Inc. All Rights Reserved
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var assert = require('assert'),
    helpers = require('../../src/helpers');

describe('helpers', function() {
  describe('#base64Sha256', function() {
    it('returns a base 64 encoded Sha256 of the string it is passed', function () {
      assert.equal(helpers.base64Sha256('foo'), 'LCa0a2j/xo/5m0U8HTBBNBNCLXBkg7+g+YpeiGJm564=');
    });
  });

  describe('#base64HmacSha256', function() {
    it('returns a base 64 encoded Hmac Sha256 of the message and key it is passed', function () {
      assert.equal(helpers.base64HmacSha256('message', 'secret'), 'i19IcCmVwVmMVz2x4hhmqbgl1KeU0WnXBgoDYFeWNgs=');
    });
  });

  describe('#canonicalizeHeaders', function() {
    it('turns the headers into a tab separate string of key/value pairs', function() {
      assert.equal(helpers.canonicalizeHeaders({
        headers: {
          Foo: 'bar',
          Baz: '  baz\t zoo   '
        }
      }), 'foo:bar\tbaz:baz zoo');
    });
  });

  describe('#signingKey', function() {
    it('returns the proper signing key', function() {
      assert.equal(helpers.signingKey('timestamp', 'secret'), 'ydMIxJIPPypuUya3KZGJ0qCRwkYcKrFn68Nyvpkf1WY=');
    });
  });

  describe('#isRedirect', function() {
    describe('when it is passed a status code indicating a redirect', function() {
      it('returns true when it is passed a 300', function() {
        assert.equal(helpers.isRedirect(300), true);
      });

      it('returns true when it is passed a 301', function() {
        assert.equal(helpers.isRedirect(301), true);
      });

      it('returns true when it is passed a 302', function() {
        assert.equal(helpers.isRedirect(302), true);
      });

      it('returns true when it is passed a 303', function() {
        assert.equal(helpers.isRedirect(303), true);
      });

      it('returns true when it is passed a 307', function() {
        assert.equal(helpers.isRedirect(307), true);
      });
    });

    describe('when it is passed a status code that does not indicate a redirect', function() {
      it('returns false when it is passed a 200', function() {
        assert.equal(helpers.isRedirect(200), false);
      });
    });
  });
});
