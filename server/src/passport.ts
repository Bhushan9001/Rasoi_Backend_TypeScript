import passport from "passport";
import { Strategy as JwtStrategy , ExtractJwt , StrategyOptions }  from "passport-jwt";
import prisma from "./prisma";

interface JwtPayload {
    id: number,
    name:string
  }
  
  const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:String(process.env.JWT_SECRET),
  };

  passport.use(new JwtStrategy(opts, async(jwt_payload: JwtPayload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where:{id:jwt_payload.id}
      })
      
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  }));
