// Replace this placeholder with the boutique's WhatsApp number, country code first, digits only.
const WHATSAPP_NUMBER = "91XXXXXXXXXX";

export const buildWhatsAppLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const generalEnquiryMessage =
  "Namaste Deepa Jewellers, I visited your website and would like to enquire about your jewellery collections. Could you please assist me?";

export const bespokeEnquiryMessage =
  "Namaste Deepa Jewellers, I would like to enquire about a custom-designed piece. Could we discuss it?";

export const productEnquiryMessage = (name: string, category: string) =>
  `Namaste Deepa Jewellers, I came across *${name}* (${category}) on your website and would like to enquire about it. Could you please share the details, availability and pricing? Thank you.`;
