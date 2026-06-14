/**
 * Remark plugin that replaces {{WHATSAPP_NUMBER}} placeholders in markdown
 * with the actual WhatsApp number from environment variables at build time.
 *
 * Usage: Put {{WHATSAPP_NUMBER}} in any markdown URL or text.
 * Example: https://wa.me/{{WHATSAPP_NUMBER}}?text=Hello
 */
export default function remarkWhatsAppNumber() {
  const number = process.env.WHATSAPP_NUMBER || '212606123321';
  return (tree) => {
    function walk(node) {
      if (node.type === 'text' && typeof node.value === 'string') {
        node.value = node.value.replace(/\{\{WHATSAPP_NUMBER\}\}/g, number);
      }
      if (node.type === 'inlineCode' && typeof node.value === 'string') {
        node.value = node.value.replace(/\{\{WHATSAPP_NUMBER\}\}/g, number);
      }
      if (typeof node.url === 'string') {
        node.url = node.url.replace(/\{\{WHATSAPP_NUMBER\}\}/g, number);
      }
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(function(child) { walk(child); });
      }
    }
    walk(tree);
  };
}
