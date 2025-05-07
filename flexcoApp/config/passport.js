const passport = require('passport')
const localStrategy = require('passport-local').Strategy;
const bcryt = require('bcryptjs')

const Owner = require('../controllers/ownerController')

/*
    * localstrategy - uses username and password
 */
passport.use(new localStrategy(
    {
        usernameField: "email",
        passwordField: "password"
    },
    async (email, password, done) => {
        const owner = new Owner();
        try {
            
            let user = await owner.getValue('email', email, ['id', 'name', 'password', 'uuid']);
            if (user === 0 || user.length === 0)
                return done(null, false, { message: "userName not found" })
            bcryt.compare(password, user.password, async (err, isMatch) => {
                if (isMatch) {
                    let temp = { id: user.id, name: user.name, uuid : user.uuid };
                    user = temp;
                    return done(null, user);
                }
                return done(null, false, { message: "Password Mismatch" })
            });
            // return done(null, user)
        }
        catch (err) {
            return done(null, false);
        }
    }

));

passport.serializeUser(async (user, done) => {
    return done(null, user)
});

passport.deserializeUser(async (user, done) => {
    // name = user.name
    // const owner = new Owner();
    // const userRecord = await owner.getValue('name' , name, ['name']);
    // if(!userRecord)
    //     done(new Error('unable to find user'), false)
    return done(null, user)
});

module.exports = passport;