import { createOrder } from './orders.service.js';

export async function createOrderController(req, res, next) {
  try {
    const order = await createOrder(req.body);
    return res.status(201).json({
      data: order,
      message: 'Orden registrada. No se realizó un pago real.',
    });
  } catch (error) {
    return next(error);
  }
}
