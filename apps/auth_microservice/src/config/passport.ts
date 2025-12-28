import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { authService } from '../services/auth.service';

dotenv.config();

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('MISSING GOOGLE CREDENTIALS IN .ENV');
  process.exit(1);
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const rawEmail = profile.emails?.[0]?.value;
        const photo = profile.photos?.[0]?.value;
        const firstName = profile.name?.givenName;
        const secondName = profile.name?.familyName;

        if (!rawEmail) {
          return done(new Error('Google did not provide an email'), undefined);
        }

        const email: string = rawEmail;

        
        const userPayload = await authService.handleOAuthLogin({
          email: email,
          username: email.split('@')[0] || '',
          firstName: firstName,
          secondName: secondName,
          photo: photo,
        });

        return done(null, userPayload);

      } catch (error) {
        console.error('Google Strategy Error:', error);
        return done(error, undefined);
      }
    }
  )
);

export default passport;