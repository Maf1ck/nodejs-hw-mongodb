import { User } from '../models/user.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { Session } from '../models/session.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const registerService = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw createHttpError(400, 'Missing required fields: name, email, password');
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  const userObj = user.toObject();
  delete userObj.password;
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: userObj,
  });
};

export const loginService = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw createHttpError(400, 'Missing required fields: email, password');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createHttpError(401, 'Invalid email or password');
  }
  // Видалити стару сесію
  await Session.deleteMany({ userId: user._id });
  // Генерація токенів
  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  const now = new Date();
  const accessTokenValidUntil = new Date(now.getTime() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  // Створити нову сесію
  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
  // Встановити refreshToken в cookies
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken },
  });
};

export const refreshService = async (req, res) => {
  const { refreshToken } = req.cookies || {};
  if (!refreshToken) {
    throw createHttpError(401, 'No refresh token provided');
  }
  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch (err) {
    throw createHttpError(401, 'Invalid or expired refresh token');
  }
  // Знайти сесію
  const session = await Session.findOne({ userId: payload.userId, refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  // Видалити стару сесію
  await Session.deleteMany({ userId: payload.userId });
  // Створити нову сесію
  const accessToken = jwt.sign({ userId: payload.userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const newRefreshToken = jwt.sign({ userId: payload.userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
  const now = new Date();
  const accessTokenValidUntil = new Date(now.getTime() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  await Session.create({
    userId: payload.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken },
  });
};

export const logoutService = async (req, res) => {
  const { refreshToken } = req.cookies || {};
  if (!refreshToken) {
    throw createHttpError(401, 'No refresh token provided');
  }
  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch (err) {
    throw createHttpError(401, 'Invalid or expired refresh token');
  }
  await Session.deleteMany({ userId: payload.userId, refreshToken });
  res.clearCookie('refreshToken');
  res.status(204).send();
}; 