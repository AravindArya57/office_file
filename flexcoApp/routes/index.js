/* checked */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const uuidv4 = require('uuid/v4');
const rateLimit = require("express-rate-limit");
const fs = require('fs')
const path = require('path');
const CloudS3 = require('../controllers/CloudS3')

const Owner = require('../controllers/ownerController');
const passport = require('../config/passport')
const { isLoggedIn, forwardAuthenticated } = require('../middleware/auth');
const e = require('express');
const sendEmail = require('../middleware/send-email');


// rate limiting
const apiLimiter = rateLimit({
  windowMs: 1 * 30 * 1000, // 30 seconds
  max: 3,
  headers: false,
  handler: function (req, res) {
    res.status(429);
    res.render('login', { message: 'You have reached max attempts. Try after 1 minute', messageColor: "red", url: "localhost:8000" });
  }

});


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'MindWoX' });
});

router.get('/login', (req, res) => {
  if (req.user)
{
    return res.redirect('/projects');
}
else
{  
res.render('login');
}
});

/*
//Old Lines
router.post('/login', apiLimiter, forwardAuthenticated, (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/projects',
    failureRedirect: '/login'
  })(req, res, next);
});
*/

router.post('/login', apiLimiter, forwardAuthenticated, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return res.render('login', { message: 'An error occurred. Please try again later.', messageColor: 'red' });
    }

    if (!user) {
      // Handle custom message based on info from Passport.js
      let errorMessage = 'Invalid username or password';
      
      if (info && info.message) {
        errorMessage = info.message;
      }

      return res.render('login', { message: errorMessage, messageColor: 'red' });
    }

    // Authentication successful, log the user in
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return res.render('login', { message: 'An error occurred during login. Please try again later.', messageColor: 'red' });
      }

      // Redirect to the desired page upon successful login
      return res.redirect('/projects');
    });
  })(req, res, next);
});


/* logout */
router.get('/logout', (req, res) => {
  req.logOut();
  // res.send("logged out");
  // res.status(429);
  // res.render('login', {message: "logout successful", messageColor : "green"});
  res.redirect('login');
})

router.get('/success', isLoggedIn, (req, res) => {
  res.end('loggedIn')
});

/* form to add new user */
router.get('/register', (req, res) => {
  // if (req.user.id)
  //   return res.redirect('/login');
  res.render('register');
});


/* to add new user */
router.post('/register', async(req, res) => {

  const owner = new Owner();

  const name = req.body.username;
  const password = bcrypt.hashSync(req.body.password, 10);
  const uuid = createUserDirectory();
  const email = req.body.email;
  const phone = req.body.phone;
  const website = req.body.website;

  const response = await owner.store(name, email, phone, password,website,uuid);



  const s3 = new CloudS3();
  s3.createFolder(uuid, '');

  if (response)
    /* create folder in uploads and in s3 */
    return res.end('user created sucessfully');

  return res.end("unable to create user");
})

router.get('/forgot-password', async(req, res) => {
  res.render('forgotPassword');
})

router.post('/forgot-password', async(req, res) => {
  const owner = new Owner();
  const ownerDetails = await owner.getValue('email', req.body.email, ['uuid']);
  
  if(ownerDetails!=0)
    await sendVerificationEmail(ownerDetails.uuid,req.body.email);
  else
    res.render('404', { projectName: 'Account not found' });

  console.log("Mail sent");
  return res.end("Reset Link Sent Successfully");
})

router.get('/test-mail', async(req, res) => {
  await sendVerificationEmail("Testing","vijay@madrasmindworks.in");
  return res.end("Mail Sent Successfully");
})

async function sendVerificationEmail(uuid,email) {
  let message;
  const verifyUrl = 'https://catalog.mindwox.com/reset-password/'+uuid;
  message = `<p>Please click the below link to rest password:</p>
                 <p><a href="${verifyUrl}">${verifyUrl}</a></p>`;
  
  // <p><code>${account.verificationToken}</code></p>`;
  await sendEmail({
      to: email,
      subject: 'Forgot password URL Email',
      html: `<h4>Reset Password using the following link</h4>
             ${message}`
  });
}

function createUserDirectory() {
  const uuid = uuidv4();
  let dir = path.resolve(__dirname, "../", 'uploads', uuid);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
    return uuid;
  }
  else {
    createUserDirectory();
  }

}

/* form to add new user */
router.get('/reset-password',isLoggedIn, async(req, res) => {
  const owner = new Owner();
  const ownerDetails = await owner.getValue('id', req.user.id, ['email']);
  res.render('resetPassword',{ email: ownerDetails.email });
});

/* form to add new user */
router.get('/reset-password/:uuid', async(req, res) => {
  const owner = new Owner();
  const ownerDetails = await owner.getValue('uuid', req.params.uuid, ['email']);
  res.render('resetPasswordforforgot',{ email: ownerDetails.email });
});


/* to add new user */
router.post('/reset-password', async(req, res) => {
  try {
    const owner = new Owner();
    const ownerDetails = await owner.getValue('email', req.body.email, ['password']);
    if(ownerDetails!=0)
    {
      if(req.body.confirmnewpassword!= req.body.newpassword)
        res.render('404', { projectName: 'New Password and Confirm Password do not match' })
      else
      {
        const password = bcrypt.hashSync(req.body.newpassword, 10);
        console.log(password);
        const response = await owner.updateField('email', req.body.email, 'password', password);

        if (response[0] !== 1) { 
          throw "Unable to Update at the moment";
        }
        else
        {
          req.logOut();
          return res.end('Password updated sucessfully. Logged Out of current session. Please login again');
        }
      }
    }
    else
    {
      res.render('404', { projectName: 'Account not found' })
    }
}
catch  {
  console.log("Error");
}
})


router.get('/.well-known/acme-challenge/wjhuZEFeGz77x--VkmBQ6qpOeGhdFj96GRO7t7VmBao', async(req, res) => {
  return res.end('wjhuZEFeGz77x--VkmBQ6qpOeGhdFj96GRO7t7VmBao.X57NQUunmNpOwIxiO0ZNd5k4DWmF5WzLqa5lIL_uQJA');
})

module.exports = router;



