const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

const log = (color: string, label: string, ...args: any[]) => {
  console.log(`${color}${label}${colors.reset}`, ...args);
};

export default {
  info: (...args: any[]) => log(colors.green, "[INFO]", ...args),
  warn: (...args: any[]) => log(colors.yellow, "[WARN]", ...args),
  error: (...args: any[]) => log(colors.red, "[ERROR]", ...args),
  debug: (...args: any[]) => log(colors.blue, "[DEBUG]", ...args),
};
