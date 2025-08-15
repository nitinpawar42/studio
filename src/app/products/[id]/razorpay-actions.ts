'use server';

import Razorpay from 'razorpay';
import { z } from 'zod';

const orderSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3),
});

export async function createRazorpayOrder(data: z.infer<typeof orderSchema>) {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: data.amount * 100, // amount in the smallest currency unit
      currency: data.currency,
      receipt: `receipt_order_${new Date().getTime()}`,
    };
    
    const order = await instance.orders.create(options);

    if (!order) {
      return { success: false, error: 'Failed to create order.' };
    }

    return { success: true, order };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
