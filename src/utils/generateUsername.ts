export function generateUsername(name: string): string {
  const username = name.toLowerCase().replace(/\s+/g, "");
  return `${username}-${Date.now()}`;
} 