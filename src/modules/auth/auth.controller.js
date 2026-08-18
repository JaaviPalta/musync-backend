import {
  registerUser,
  loginUser,
  getCurrentUser,
} from './auth.service.js';

export async function registerController(req, res, next) {
  try {
    const result = await registerUser(req.body);

    return res.status(201).json({
      data: result,
      message: 'Usuario registrado correctamente',
    });
  } catch (error) {
    return next(error);
  }
}

export async function loginController(req, res, next) {
  try {
    const result = await loginUser(req.body);

    return res.status(200).json({
      data: result,
      message: 'Sesión iniciada correctamente',
    });
  } catch (error) {
    return next(error);
  }
}

export async function meController(req, res, next) {
  try {
    const result = await getCurrentUser(req.user.userId);

    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}