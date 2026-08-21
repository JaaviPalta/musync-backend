import { createOrder, getOrdersByArtist, getOrderById } from './orders.service.js';

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

export async function getOrdersController(req, res, next) {
  try {
    const orders = await getOrdersByArtist(req.user.userId);
    return res.status(200).json({ data: orders });
  } catch (error) {
    return next(error);
  }
}

export async function getOrderByIdController(req, res, next) {
  try {
    const order = await getOrderById(req.user.userId, req.params.id);
    return res.status(200).json({ data: order });
  } catch (error) {
    return next(error);
  }
}
