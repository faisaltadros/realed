<h1>Realed</h1>

> A Node.js web application project for listing real estate properties

<h2>Live Demo</h2>

To see the app in action, go to (https://realed.herokuapp.com)

<h2>Features</h2>

- Authentication:
  
  * User login with username and password

  * Admin sign-up with admin code

- Authorization:

  * One cannot manage posts and view user profile without being authenticated

  * One cannot edit or delete posts and comments created by other users

  * Admin can manage all posts and comments

- Manage campground posts with basic functionalities:

  * Create, edit and delete posts and comments

  * Upload campground photos

  * Display campground location on Google Maps
  
  * Search existing campgrounds

- Manage user account with basic functionalities:

  * Password reset via email confirmation

  * Profile page setup with sign-up

- Flash messages responding to users' interaction with the app

- Responsive web design

<h2>Custom Enhancements</h2>

* Update campground photos when editing campgrounds

* Query MongoDB with three seperate parameters (Location, Rooms, Bathrooms)

* Added a map to the index page which displays all listings and zooms in depending on search results
 
<h2>Getting Started</h2>

> This app contains API secrets and passwords that have been hidden deliberately, so the app cannot be run with its features on your local machine. However, feel free to clone this repository if necessary.

<h2>Built With</h2>

<h3>Front End</h3>

* [ejs](http://ejs.co/)
* [Google Maps APIs](https://developers.google.com/maps/)
* [Bootstrap](https://getbootstrap.com/docs/3.3/)

<h3>Back End</h3>

* [express](https://expressjs.com/)
* [mongoDB](https://www.mongodb.com/)
* [mongoose](http://mongoosejs.com/)
* [async](http://caolan.github.io/async/)
* [crypto](https://nodejs.org/api/crypto.html#crypto_crypto)
* [helmet](https://helmetjs.github.io/)
* [passport](http://www.passportjs.org/)
* [passport-local](https://github.com/jaredhanson/passport-local#passport-local)
* [express-session](https://github.com/expressjs/session#express-session)
* [method-override](https://github.com/expressjs/method-override#method-override)
* [nodemailer](https://nodemailer.com/about/)
* [moment](https://momentjs.com/)
* [cloudinary](https://cloudinary.com/)
* [geocoder](https://github.com/wyattdanger/geocoder#geocoder)
* [connect-flash](https://github.com/jaredhanson/connect-flash#connect-flash)

<h2>Platforms</h2>

* [Cloudinary](https://cloudinary.com/)
* [Heroku](https://www.heroku.com/)
* [Cloud9](https://aws.amazon.com/cloud9/?origin=c9io)
