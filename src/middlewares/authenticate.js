import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !token) {
    return next(createHttpError(401, 'No access token provided'));
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Додаю перевірку токена у сесіях
    const session = await Session.findOne({ userId: payload.userId, accessToken: token });
    if (!session) {
      return next(createHttpError(401, 'Session not found or token is invalidated'));
    }
    const user = await User.findById(payload.userId);
    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(createHttpError(401, 'Access token expired'));
    }
    return next(createHttpError(401, 'Invalid access token'));
  }
}; 