export const WHATSAPP_NUMBER = import.meta.env.WHATSAPP_NUMBER || '212606123321';

// Fallback defaults (kept for backward compatibility — prefer translations from ui.ts)
export const WHATSAPP_MESSAGE_TRIAL = 'Hello! I want a free 12-hour IPTV trial.';
export const WHATSAPP_MESSAGE_BUY = 'Hello! I want to subscribe to IPTV 4K World.';

export function getWhatsAppUrl(message: string): string {
  return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
}

/**
 * Get a language-aware WhatsApp message using the translation dictionary.
 * Usage: getWhatsAppTrialMsg(t) where t = useTranslations(lang)
 */
export function getWhatsAppTrialMsg(t: (key: string) => string): string {
  return t('whatsapp.trial') || WHATSAPP_MESSAGE_TRIAL;
}

export function getWhatsAppBuyMsg(t: (key: string) => string): string {
  return t('whatsapp.buy') || WHATSAPP_MESSAGE_BUY;
}
