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
      assert.equal(this.api.config.host, 'base.com');
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

      describe('when it is instantiated with an object that does not specfy a path nor a group', function() {
        it('throws the appropriate error', function() {
          assert.throws(
            function() {
              return new Api({});
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
});
