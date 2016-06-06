var express = require('express');
var bodyParser= require('body-parser');
var Sequelize  =require('sequelize');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var watson = require('watson-developer-cloud');
var multiparty = require('connect-multiparty');
var uuid = require('uuid');
var s3 = require('s3');

var local = require('./local.json');
var app = express();
var db = new Sequelize('snapnote', local.db_user, local.db_password, { logging: false });
var s3Client = s3.createClient({
	s3Options: {
		accessKeyId: local.s3_id,
		secretAccessKey: local.s3_key
	}
});

var vision = watson.alchemy_vision({
  "api_key": "e91e7fdba2b5297e81bb0924a169d5dd5b54c931",
});

/** Middleware **/

app.use(bodyParser.json())
app.use(multiparty());
// Dirname === current directory, so /SnapNote
app.use(express.static(__dirname));

/** Models **/

var User = db.define('user', {
	username: {
		type: Sequelize.STRING,
		unique: true
	},
	password: Sequelize.STRING,
	name: Sequelize.STRING
}, {
	hooks: {
	  beforeCreate: function(user, options){
	    user.password = bcrypt.hashSync(user.password, 8)
	  }
	}
});

var Note = db.define('note', {
  name: Sequelize.STRING,
  img: Sequelize.STRING,
  keywords: Sequelize.TEXT,
  description: Sequelize.TEXT
});

User.hasMany(Note);

db.sync();

/** Routes **/

app.post('/signup', (req, res) => {
  User.create(req.body)
    .then((newUser) => {
      res.send(newUser);
    })
    .catch(err => {
      res.send(err)
    })
});

app.post('/login', (req, res) => {
  User.findOne({where: {username:req.body.username } })
    .then(foundUser => {
      if(foundUser) {
        if (bcrypt.compareSync(req.body.password, foundUser.get('password'))) {
          var token = jwt.sign({
            username: req.body.username
          }, local.webtoken_secret, {
            expiresIn: 1440
          });
          res.json({
            success: true,
            message: 'YOU get a token! YOU get a token! YOU get a token!',
            token: token
          });
        } else {
          res.send('Incorrect Password');
        }
      }else{
        res.send("User Not Found")
      }
    });
});

app.get('/note/:id', auth, (req, res) => {
  Note.findOne({where: {id: req.params.id}})
    .then(note => {
      res.send(note.get());
    });
});

app.post('/note', auth, (req, res) => {
  var body = req.body;
  var file = req.files.img;
  var unique = uuid.v4();

  var uploader = s3Client.uploadFile({
    localFile: file.path,
    s3Params: {
      Bucket: 'snapnoteapp',
      Key: unique,
      ACL: 'public-read'
    }
  });

  uploader.on('end', () => {
    var url = s3.getPublicUrlHttp('snapnoteapp', unique);

    // vision.getImageKeywords({image: url}, (err, keywords) => {
    //   Note.create({
    //     userId: req.user.id,
    //     name: body.name,
    //     img: url,
    //     description: body.description,
    //     keywords: keywords
    //   }).then(createdNote => {
    //     res.send(createdNote);
    //   })
    // });

    Note.create({
      userId: req.user.id,
      name: body.name,
      img: url,
      description: body.description,
      keywords: body.keywords
    }).then(createdNote => {
      res.send(createdNote);
    });

  });
});

app.get('/notes', auth, (req, res) => {
  Note.findAll({where: {
    userId: req.user.id
  }})
    .then(foundNotes => {
      res.send(foundNotes);
    });
});

app.listen(9000);

/** Helpers **/

function auth(req, res, next) {
  var token = req.body.token || req.param('token') || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, local.webtoken_secret, (err, decoded) => {
      if (err) res.status(403).send('Invalid Token');
      else {
        User.findOne({where: {username: decoded.username}})
          .then(foundUser => {
            if (!foundUser) res.status(403).send('Invalid Token');
            else {
              req.user = foundUser.get();
              next();
            }
          });
      }
    });
  } else {
    res.status(403).send('Unauthorized');
  }
}
