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

module.exports = {

	restricted:function(req,res){
		return res.ok("If You can see this you are authenticated");
	},	
	open:function(req,res){
		return res.ok("This is open to all!!!");
	},

   	authorize : function(req, res) {
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
	      access_token = result.access_token;
	      console.log('Yay! Access token is ', result);
	      
	      res.send('You made it!!');
	    }
	  });
	}


};