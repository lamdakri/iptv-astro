export const WHATSAPP_NUMBER = import.meta.env.WHATSAPP_NUMBER || '212606123321';
export const WHATSAPP_MESSAGE_TRIAL = 'Hello! I want a free 12-hour IPTV trial.';
export const WHATSAPP_MESSAGE_BUY = 'Hello! I want to subscribe to IPTV 4K World.';

export function getWhatsAppUrl(message: string): string {
  return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
}
