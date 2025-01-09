export default function debounce<T extends (...args: string[]) => void>(
  func: T,
  wait: number
): (...args: string[]) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: string[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
