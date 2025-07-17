import { registerService, loginService, refreshService, logoutService, sendResetEmailService, resetPasswordService } from '../services/auth.js';

export const registerController = async (req, res, next) => {
  try {
    await registerService(req, res);
  } catch (err) {
    next(err);
  }
};

export const loginController = async (req, res, next) => {
  try {
    await loginService(req, res);
  } catch (err) {
    next(err);
  }
};

export const refreshController = async (req, res, next) => {
  try {
    await refreshService(req, res);
  } catch (err) {
    next(err);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    await logoutService(req, res);
  } catch (err) {
    next(err);
  }
};

export const sendResetEmailController = async (req, res, next) => {
  try {
    await sendResetEmailService(req, res);
  } catch (err) {
    next(err);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    await resetPasswordService(req, res);
  } catch (err) {
    next(err);
  }
}; 