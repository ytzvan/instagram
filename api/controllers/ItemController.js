/**
 * ItemController
 *
 * @description :: Server-side logic for managing items
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var http = require('http');
var ig = require('instagram-node').instagram();

ig.use({ client_id: 'b80cccd26d214e76a0f0ac80ea2abd03',
		         client_secret: '9d0b2dafc8054a34aec67011391033ad' });
var redirect_uri = 'http://localhost:1337/item/handleauth';
var access_token;
var user;
var userId;

module.exports = {

	restricted:function(req,res){
		return res.ok("If You can see this you are authenticated");
	},	
	open:function(req,res){
		return res.ok("This is open to all!!!");
	},

   	authorize : function(req, res) {
   		ig.use({ client_id: 'b80cccd26d214e76a0f0ac80ea2abd03',
		         client_secret: '9d0b2dafc8054a34aec67011391033ad' });
  		res.redirect(ig.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
	},

	handleauth : function(req, res) {
		console.log("Is authenticated", req.session.authenticated);
	      console.log("user: ", req.session.user);
	  ig.authorize_user(req.query.code, redirect_uri, function(err, result) {
	    if (err) {
	      console.log(err.body);
	      res.send("Didn't work");
	    } else {
	      req.session.access_token = result.access_token;
	      user = result.username;
	      userId = result.id;
	      console.log('Yay! Access token is ', result);
	      
	      res.send('You made it!!');
	    }
	  });

	},

	getMedia : function (req, res) {
		

		ig.use({ access_token: req.session.access_token });
		ig.user_self_media_recent(function(err, medias, pagination, remaining, limit) {
			var data = {};
			if (!medias) {
				return console.log("err", err);
			} else {
				for (var i=0; i<medias.length; i++ ){
					console.log("lenght", medias.length);
					console.log(medias[i].images.standard_resolution);
					 data[i] = medias[i].images.low_resolution;
				}
				return res.view({fotos: data});
			}
		});


	}


};