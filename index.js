
var querystring = require('querystring'),
    rp = require('request-promise'),
    Promise = require('bluebird');


function InstagramClient(client_id, client_secret) {
    this.client_id = client_id;
    this.client_secret = client_secret;

    this.media = new InstagramMediaClient(this);
    this.tags = new InstagramTagsClient(this);
    this.locations = new InstagramLocationsClient(this);
    this.users = new InstagramUsersClient(this);
}

InstagramClient.prototype.fetch = function (path, params) {

    params.client_id = this.client_id;

    var options = {
        url: 'https://api.instagram.com' + path + '?' + querystring.stringify(params)
    };

    return new Promise(function(resolve, reject){

        rp(options)
            .then(function(response){
                var data = JSON.parse(response);

                resolve({
                    meta: data['meta'],
                    data: data['data'],
                    pagination: data['pagination']
                });
            })
            .catch(function(err) {
                reject(err);
            });
    });
};

//###### Media Client ######//

function InstagramMediaClient(parent) {
    this.parent = parent;
}

InstagramMediaClient.prototype.id = function (id, params) {
    return this.parent.fetch('/v1/media/'+id, params);
};

InstagramMediaClient.prototype.popular = function (params) {
    return this.parent.fetch('/v1/media/popular/', params);
};

InstagramMediaClient.prototype.search = function (params) {
    return this.parent.fetch('/v1/media/search/', params);
};

//###### Tag Client ######//

function InstagramTagsClient (parent) {
    this.parent = parent;
}

InstagramTagsClient.prototype.search = function (query, params) {
    params.q = query;
    return this.parent.fetch('/v1/tags/search/', params);
};

InstagramTagsClient.prototype.media = function (tag, params) {
    return this.parent.fetch('/v1/tags/'+tag+'/media/recent/', params);
};

InstagramTagsClient.prototype.tag = function (tag, params) {
    return this.parent.fetch('/v1/tags/'+tag, params);
};

//###### Location Client ######//

function InstagramLocationsClient (parent) {
    this.parent = parent;
}

InstagramLocationsClient.prototype.id = function (id, params) {
    return this.parent.fetch('/v1/locations/'+id, params);
};

InstagramLocationsClient.prototype.media = function (id, params) {
    return this.parent.fetch('/v1/locations/'+id+'/media/recent', params);
};

InstagramLocationsClient.prototype.search = function (params) {
    return this.parent.fetch('/v1/locations/search', params);
};

//###### Users Client ######//

function InstagramUsersClient (parent) {
    this.parent = parent;
}

InstagramUsersClient.prototype.id = function (id, params) {
    return this.parent.fetch('/v1/users/'+id, params);
};

InstagramUsersClient.prototype.media = function (id, params) {
    return this.parent.fetch('/v1/users/'+id+'/media/recent', params);
};

InstagramUsersClient.prototype.self = function (params) {
    return this.parent.fetch('/v1/users/self/feed', params);
};

InstagramUsersClient.prototype.search = function (query, params) {
    params.q = query;
    return this.parent.fetch('/v1/users/search/', params);
};

exports.createClient = function (client_id, client_secret) {
    var instagram_client = new InstagramClient(client_id, client_secret);

    return instagram_client;
};
