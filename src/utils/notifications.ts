import { Order, NotificationLog } from '../types';

export function createWhatsAppMessage(order: Order): string {
  return (
    `Hello ${order.customerName},\n\n` +
    `Thank you for purchasing from SmartVolt!\n\n` +
    `Your order has been confirmed successfully.\n\n` +
    `Order ID: ${order.id}\n` +
    `Amount Paid: ₹${order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n` +
    `Payment Status: Successful\n` +
    `Delivery Method: ${order.deliveryMethod === 'shop_pickup' ? 'Shop Pickup (SmartVolt Experience Center)' : 'Courier Shipping'}\n\n` +
    `Your digital tax invoice is ready for download: INV-${order.id}\n\n` +
    `Thank you for shopping with SmartVolt!`
  );
}

export function generateWhatsAppDirectUrl(phoneNumber: string, messageText: string): string {
  // Clean phone number (strip whitespace, hyphens, plus)
  let cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  if (cleanNumber.length === 10) {
    cleanNumber = '91' + cleanNumber;
  }
  const encodedText = encodeURIComponent(messageText);
  return `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodedText}`;
}

export function dispatchOrderNotifications(order: Order): NotificationLog[] {
  const waMessage = createWhatsAppMessage(order);
  const waLink = generateWhatsAppDirectUrl(order.customerPhone, waMessage);

  const smsText = `SmartVolt: Order ${order.id} confirmed for ₹${order.totalAmount.toLocaleString('en-IN')}. Tax invoice sent. Track at smartvolt.in/my-orders`;

  const logs: NotificationLog[] = [
    {
      id: `NOTIF-WA-${Date.now()}`,
      orderId: order.id,
      channel: 'whatsapp',
      recipient: order.customerPhone,
      status: 'ready_for_dispatch',
      messageText: waMessage,
      timestamp: new Date().toLocaleTimeString(),
      directLink: waLink
    },
    {
      id: `NOTIF-SMS-${Date.now() + 1}`,
      orderId: order.id,
      channel: 'sms',
      recipient: order.customerPhone,
      status: 'sent',
      messageText: smsText,
      timestamp: new Date().toLocaleTimeString()
    }
  ];

  return logs;
}
