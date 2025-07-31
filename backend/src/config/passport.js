const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User'); // Ajuste o caminho se necessário

module.exports = function (passport) {
  // Estratégia Local (Email e Senha)
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          return done(null, false, { message: 'Email não cadastrado.' });
        }

        if (!user.password) {
          return done(null, false, { message: 'Este email foi cadastrado via Google. Tente o login social.' });
        }

        const isMatch = await user.comparePassword(password);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Senha incorreta.' });
        }
      } catch (err) {
        return done(err);
      }
    })
  );

  // Estratégia Google (OAuth 2.0)
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback', // Rota no seu backend
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          // Não definimos senha para login social
        };

        try {
          let user = await User.findOne({ email: newUser.email });

          if (user) {
            // Se o usuário já existe mas não tem googleId, atualiza
            if (!user.googleId) {
              user.googleId = profile.id;
              await user.save();
            }
            done(null, user);
          } else {
            // Se o usuário não existe, cria um novo
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
          done(err, null);
        }
      }
    )
  );
};
