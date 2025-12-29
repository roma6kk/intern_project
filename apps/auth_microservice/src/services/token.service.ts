import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import {ITokenPayload} from './interfaces/ITokenPayload'
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

export const generateTokens = (payload: ITokenPayload) => {
  const accessJti = uuidv4();
  const refreshJti = uuidv4();

  const accessToken = jwt.sign({ ...payload, jti: accessJti }, ACCESS_SECRET, { 
    expiresIn: '15m' 
  });
  
  const refreshToken = jwt.sign({ ...payload, jti: refreshJti }, REFRESH_SECRET, { 
    expiresIn: '7d' 
  });

  return { 
    accessToken, 
    refreshToken, 
    accessJti,
    refreshJti 
  };
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET) as jwt.JwtPayload;
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET) as jwt.JwtPayload;
};

export const decodeToken = (token: string) => {
  return jwt.decode(token) as jwt.JwtPayload;
};