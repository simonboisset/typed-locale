// Double braces syntax: {{variable}}
// Replace {{variable}} with value
export const buildDoubleBracePhrase = (phrase: string, variables?: Record<string, string | number>) => {
  if (!variables) return phrase;
  return phrase.replace(/{{(\w+)}}/g, (_, key) => variables[key]?.toString() || `{{${key}}}`);
};
