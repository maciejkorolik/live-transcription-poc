export const groqModels = [
  "llama3-8b-8192",
  "llama3-70b-8192",
  "mixtral-8x7b-32768",
  "gemma-7b-it",
] as const;

export const deepgramModels = [
  "nova-2-general",
  "nova-2-meeting",
  "nova-2-phonecall",
  "nova-2-voicemail",
  "nova-2-finance",
  "nova-2-conversationalai",
  "nova-2-video",
  "nova-2-medical",
  "nova-2-drivethru",
  "nova-2-automotive",
] as const;

export type GroqModel = (typeof groqModels)[number];
export type DeepGramModel = (typeof deepgramModels)[number];
