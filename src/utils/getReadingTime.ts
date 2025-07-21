const AVQ_READ_WPM = 200;

export function getReadingTime(text: string): number {
  return Math.ceil(text.split(" ").length / AVQ_READ_WPM);
} 