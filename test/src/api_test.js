var assert = require('assert'),
    path = require('path'),
    Api = require('../../src/api');

describe('Api', function() {
  beforeEach(function() {
    this.api = new Api(
      'clientToken',
      'clientSecret',
      'accessToken',
      'base.com'
    );
  });

  describe('.config', function() {
    it('reports the client token', function() {
      assert.equal(this.api.config.client_token, 'clientToken');
    });

    it('reports the client secret', function() {
      assert.equal(this.api.config.client_secret, 'clientSecret');
    });

    it('reports the access token', function() {
      assert.equal(this.api.config.access_token, 'accessToken');
    });

    it('reports the API host', function() {
      assert.equal(this.api.config.host, 'https://base.com');
    });

    describe('when it is instantiated with an API host that already contains the protocol', function() {
      it('it does not double declare the protocol', function() {
        this.api = new Api(
          'clientToken',
          'clientSecret',
          'accessToken',
          'https://base.com'
        );

        assert.equal(this.api.config.host, 'https://base.com');
      });
    });

    describe('when it is instantiated with an object', function() {
      beforeEach(function() {
        this.api = new Api({
          path: path.resolve(__dirname, '../test_edgerc'),
          group: 'group'
        });
      });

      it('reports the client token from the edgerc associated with the specified group', function() {
        assert.equal(this.api.config.client_token, 'groupClientToken');
      });

      it('reports the client secret from the edgerc associated with the specified group', function() {
        assert.equal(this.api.config.client_secret, 'groupClientSecret');
      });

      it('reports the access token from the edgerc associated with the specified group', function() {
        assert.equal(this.api.config.access_token, 'groupAccessToken');
      });

      it('reports the API host from the edgerc associated with the specified group', function() {
        assert.equal(this.api.config.host, 'https://groupexample.luna.akamaiapis.net');
      });

      describe('when it is instantiated with an object that does not specfy a group', function() {
        beforeEach(function() {
          this.api = new Api({
            path: path.resolve(__dirname, '../test_edgerc')
          });
        });

        it('reports the client token from the edgerc associated with the default group', function() {
          assert.equal(this.api.config.client_token, 'clientToken');
        });

        it('reports the client secret from the edgerc associated with the default group', function() {
          assert.equal(this.api.config.client_secret, 'clientSecret');
        });

        it('reports the access token from the edgerc associated with the default group', function() {
          assert.equal(this.api.config.access_token, 'accessToken');
        });

        it('reports the API host from the edgerc associated with the default group', function() {
          assert.equal(this.api.config.host, 'https://example.luna.akamaiapis.net');
        });
      });

      describe('when it is instantiated with an object that does not specify a path nor a group', function() {
        it('throws the appropriate error', function() {
          assert.throws(
            function() {
              return new Api({});
            },
            /No edgerc path/
          );
        });
      });

      describe('when it is instantiated with an object that specifies an inadequate path', function() {
        it('throws the appropriate error', function() {
          assert.throws(
            function() {
              return new Api({path: ''});
            },
            /No edgerc path/
          );
        });
      });
    });
  });

  describe('when it is not instantiated with valid credentials', function() {
    it('throws the appropriate error', function() {
      assert.throws(
        function() {
          return new Api();
        },
        /Insufficient Akamai credentials/
      );
    });
  });

  describe('#auth', function() {
    describe('when minimal request options are passed', function() {
      beforeEach(function() {
        this.api.auth({
          path: '/foo'
        });
      });

      it('adds an Authorization header to the request it is passed', function() {
        assert.equal(typeof this.api.request.headers.Authorization === 'string', true);
      });

      it('ensures a default Content-Type of application/json', function() {
        assert.equal(this.api.request.headers['Content-Type'], 'application/json');
      });

      it('ensures a default GET method', function() {
        assert.equal(this.api.request.method, 'GET');
      });

      it('ensures a default empty body', function() {
        assert.equal(this.api.request.body, '');
      });
    });

    describe('when more specific request options are passed', function() {
      beforeEach(function() {
        this.api.auth({
          path: '/foo',
          method: 'POST',
          body: { foo: 'bar' },
          somethingArbitrary: 'someValue'
        });
      });

      it('adds an Authorization header to the request it is passed', function() {
        assert.equal(typeof this.api.request.headers.Authorization === 'string', true);
      });

      it('ensures a default Content-Type of application/json', function() {
        assert.equal(this.api.request.headers['Content-Type'], 'application/json');
      });

      it('uses the specified GET method', function() {
        assert.equal(this.api.request.method, 'POST');
      });

      it('uses the specified body parsed as a key/value pair string', function() {
        assert.equal(this.api.request.body, 'foo=%22bar%22&');
      });

      it('extends the default request options with any others specified', function() {
        assert.equal(this.api.request.somethingArbitrary, 'someValue');
      });
    });
  });
});
