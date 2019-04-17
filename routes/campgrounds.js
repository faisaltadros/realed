var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var request = require("request");

require('dotenv').config()

// Google Maps Configuration
var NodeGeocoder = require('node-geocoder');
var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: GEOCODER_API_KEY,
    formatter: null
};
var geocoder = NodeGeocoder(options);

// Image Upload configuration
var multer = require('multer');
var storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter })

var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dfesdiu1m',
    api_key: '594556956132896',
    // api_secret: 'E7zSsCbJYa9ClEe-tmksf1Q3-qE'
    api_secret: CLOUDINARY_API_SECRET
});

//INDEX - show all campgrounds
router.get("/", function (req, res) {
    if (req.query.locationSearch && req.query.roomSearch && req.query.bathSearch) {
        const regexLocation = new RegExp(escapeRegex(req.query.locationSearch), 'gi');
        Campground.find(
            { $and: 
                [ 
                    {location: regexLocation}, 
                    { baths: { $gt: (req.query.bathSearch -0.1) } }, 
                    { rooms: { $gt: (req.query.roomSearch -0.1) } } 
                ] 
        }, function(err, allCampgrounds){

            if (err || !allCampgrounds.length) {
                req.flash('error', 'No campgrounds found. Please try again.');
                res.redirect("back");
            } else {
                res.render("campgrounds/index", { campgrounds: allCampgrounds, page: 'campgrounds' });
            }
        });
    } else if (req.query.locationSearch && req.query.roomSearch) {
        const regexLocation = new RegExp(escapeRegex(req.query.locationSearch), 'gi');
        Campground.find(
            { $and: 
                [ 
                    {location: regexLocation}, 
                    { rooms: { $gt: (req.query.roomSearch -0.1) } } 
                ] 
        }, function(err, allCampgrounds){

            if (err || !allCampgrounds.length) {
                req.flash('error', 'No campgrounds found. Please try again.');
                res.redirect("back");
            } else {
                res.render("campgrounds/index", { campgrounds: allCampgrounds, page: 'campgrounds' });
            }
        });
    } else if (req.query.locationSearch && req.query.bathSearch) {
        const regexLocation = new RegExp(escapeRegex(req.query.locationSearch), 'gi');
        Campground.find(
            { $and: 
                [ 
                    {location: regexLocation}, 
                    { baths: { $gt: (req.query.bathSearch -0.1) } } 
                ] 
        }, function(err, allCampgrounds){

            if (err || !allCampgrounds.length) {
                req.flash('error', 'No campgrounds found. Please try again.');
                res.redirect("back");
            } else {
                res.render("campgrounds/index", { campgrounds: allCampgrounds, page: 'campgrounds' });
            }
        });
    } else if (req.query.roomSearch && req.query.bathSearch) {
        Campground.find(
            { $and: 
                [ 
                    { rooms: { $gt: (req.query.roomSearch -0.1) } } ,
                    { baths: { $gt: (req.query.bathSearch -0.1)} } 
                ] 
        }, function(err, allCampgrounds){

            if (err || !allCampgrounds.length) {
                req.flash('error', 'No campgrounds found. Please try again.');
                res.redirect("back");
            } else {
                res.render("campgrounds/index", { campgrounds: allCampgrounds, page: 'campgrounds' });
            }
        });
    
    } else if (req.query.locationSearch) {
        const regexLocation = new RegExp(escapeRegex(req.query.locationSearch), 'gi');
        Campground.find(
            { $and: 
                [ 
                    {location: regexLocation}
                ] 
        }, function(err, allCampgrounds){

            if (err || !allCampgrounds.length) {
                req.flash('error', 'No campgrounds found. Please try again.');
                res.redirect("back");
            } else {
                res.render("campgrounds/index", { campgrounds: allCampgrounds, page: 'campgrounds' });
            }
        });
    } else if (req.query.roomSearch) {
        Campground.find(
            { $and: 
                [ 
                    { rooms: { $gt: (req.query.roomSearch -0.1) } } 
                ] 
        }, function(err, allCampgrounds){

            if (err || !allCampgrounds.length) {
                req.flash('error', 'No campgrounds found. Please try again.');
                res.redirect("back");
            } else {
                res.render("campgrounds/index", { campgrounds: allCampgrounds, page: 'campgrounds' });
            }
        });
    } else if (req.query.bathSearch) {
        Campground.find(
            { $and: 
                [ 
                    { baths: { $gt: (req.query.bathSearch -0.1) } }
                ] 
        }, function(err, allCampgrounds){

            if (err || !allCampgrounds.length) {
                req.flash('error', 'No campgrounds found. Please try again.');
                res.redirect("back");
            } else {
                res.render("campgrounds/index", { campgrounds: allCampgrounds, page: 'campgrounds' });
            }
        });
    } else {
    // Get all campgrounds from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
        }
    });
}
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, upload.single('image'), function (req, res) {
    // get data from form and add to campgrounds array
    var name = req.body.campground.name;
    var image = req.body.campground.image;
    var imageId = req.body.campground.imageId;
    var cost = req.body.campground.cost;
    var desc = req.body.campground.description;
    var rooms = req.body.campground.rooms;
    var baths = req.body.campground.baths;
    var meters = req.body.campground.meters;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.campground.location, function (err, data) {
        if (err || !data.length) {
            console.log(data)
            console.log(err)
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        campground = { name: name, image: image, imageId: imageId, cost: cost, description: desc, rooms: rooms, baths: baths, meters: meters, author: author, location: location, lat: lat, lng: lng };
        // Create a new campground and save to DB
        cloudinary.v2.uploader.upload(req.file.path, function (err, result) {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('back');
            }
            // add cloudinary url for the image to the campground object under image property
            campground.image = result.secure_url;
            campground.imageId = result.public_id;
            // Moderate images
            moderation: "webpurify";
            // add author to campground
            campground.author = {
                id: req.user._id,
                username: req.user.username
            }
            Campground.create(campground, function (err, campground) {
                if (err) {
                    req.flash('error', err.message);
                    return res.redirect('back');
                }
                res.redirect('/campgrounds/' + campground.id);
            });
        });
    });
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

// SHOW - shows more info about one campground
router.get("/:id", function (req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            // console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, upload.single('image'), function (req, res) {
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        Campground.findById(req.params.id, async function (err, campground) {
            console.log(req.body.campground);
            if (err) {
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                if (req.file) {
                    try {
                        await cloudinary.v2.uploader.destroy(campground.imageId);
                        var result = await cloudinary.v2.uploader.upload(req.file.path);
                        campground.imageId = result.public_id;
                        campground.image = result.secure_url;
                    } catch (err) {
                        req.flash("error", err.message);
                        return res.redirect("back");
                    }
                }
                campground.name = req.body.campground.name;
                campground.description = req.body.campground.description;
                campground.rooms = req.body.campground.rooms;
                campground.baths = req.body.campground.baths;
                campground.meters = req.body.campground.meters;
                campground.cost = req.body.campground.cost;
                campground.lat = data[0].latitude;
                campground.lng = data[0].longitude;
                campground.location = data[0].formattedAddress;
                campground.save();
                req.flash("success", "Successfully Updated!");
                res.redirect("/campgrounds/" + campground._id);
            }
        });
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, async function (err, campground) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        try {
            await cloudinary.v2.uploader.destroy(campground.imageId);
            campground.remove();
            req.flash("success", "Campground deleted successfully!")
            res.redirect("/campgrounds");
        } catch (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;