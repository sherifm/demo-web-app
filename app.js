var express 		= require("express"),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	flash 			= require("connect-flash"),
	User 			= require("./models/user"),
//	seedDB 			= require("./seeds"),
	LocalStrategy 	= require("passport-local"),
	methodOverride	= require("method-override"),
	passport 		= require("passport")


//requiring routes
var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes	= require("./routes/campgrounds"),
	indexRoutes 		= require("./routes/index")

const port = 3000; 

const options = {
    autoIndex: false, // Don't build indexes
    reconnectTries: 30, // Retry up to 30 times
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
  }


 const connectWithRetry = () => {
  console.log('MongoDB connection with retry')
  mongoose.connect("mongodb://mongo:27017/yelp_camp", options).then(()=>{
    console.log('MongoDB is connected')
  }).catch(err=>{
    console.log('MongoDB connection unsuccessful, retry after 5 seconds.')
    console.log(err)
    setTimeout(connectWithRetry, 5000)
  })
}

connectWithRetry()

//Docker service connection
// mongoose.connect('mongodb://<docker_service>:27017/yelp_camp', { useNewUrlParser: true });

//Local-host connection 
// mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });

//Heroku-connection
//mongoose.connect('mongodb+srv://sherifm:XrayNT12010!@cluster0-uzzxj.mongodb.net/yelp_camp?retryWrites=true'); 
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB(); // Seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user; 
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(indexRoutes);

app.listen(port, function(){
 	console.log("YelpCamp server started");
 });

//app.listen(process.env.PORT, process.env.IP, function() {
//  console.log('Server listening on port: ' + process.env.PORT);
//});









