var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleware geos here
var middlewareObj = {}


middlewareObj.checkCampgroundOwnership = function(req, res, next){
	//is user logged in 
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", "Campground not found");
				res.redirect("back");
				} else {
					// does user own the campground?
					if(foundCampground.author.id.equals(req.user._id)){
						next();
					} else {
						req.flash("error", "You don't have permission to do that.");
						res.redirect("back");
					}
				}
			});
	} else {
		req.flash("error", "You Need to be logged in to do that.");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	//is user logged in 
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.flash("error", "Something went wrong.");
				res.redirect("back");
				} else {
					// does user own the campground?
					if(foundComment.author.id.equals(req.user._id)){
						next();
					} else {
						req.flash("error", "You don't have permission to do that.");
						res.redirect("back");
					}
				}
			});
	} else {
		req.flash("error", "You Need to be logged in to do that.");
		res.redirect("back");
	}
}

middlewareObj.isloggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	};
	req.flash("error", "You Need to be logged in to do that.");
	res.redirect("/login");
};

module.exports = middlewareObj