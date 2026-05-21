const passport = require("passport");

const LocalStrategy =
    require("passport-local").Strategy;

const bcrypt = require("bcrypt");

const User = require("../models/User");

// --------------------
// LOCAL STRATEGY
// --------------------

passport.use(

    new LocalStrategy(

        async (username, password, done) => {

            try {

                // find user
                const user =
                    await User.findOne({ username });

                // user not found
                if (!user) {

                    return done(
                        null,
                        false,
                        { message: "User not found" }
                    );
                }

                // compare password
                const isMatch =
                    await bcrypt.compare(
                        password,
                        user.password
                    );

                // invalid password
                if (!isMatch) {

                    return done(
                        null,
                        false,
                        { message: "Invalid password" }
                    );
                }

                // authentication success
                return done(null, user);

            } catch (err) {

                return done(err);
            }
        }
    )
);

// --------------------
// SERIALIZE USER
// --------------------

passport.serializeUser((user, done) => {

    done(null, user.id);
});

// --------------------
// DESERIALIZE USER
// --------------------

passport.deserializeUser(

    async (id, done) => {

        try {

            const user =
                await User.findById(id);

            done(null, user);

        } catch (err) {

            done(err);
        }
    }
);

module.exports = passport;