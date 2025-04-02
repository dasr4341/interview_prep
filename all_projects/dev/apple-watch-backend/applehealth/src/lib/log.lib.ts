import chalk from 'chalk';

export enum LogType {
  success = 'success',
  error = 'error',
  warning = 'warning',
  neutral = 'neutral',
}

export function log(type: LogType, name: string, message: string) {
  switch (type) {
    case LogType.success:
      console.log(`[${chalk.green(name)}] ${chalk.green(message)}`);
      break;
    case LogType.warning:
      console.log(`[${chalk.yellow(name)}] ${chalk.yellow(message)}`);
      break;
    case LogType.error:
      console.log(`[${chalk.red(name)}] ${chalk.red(message)}`);
      break;
    case LogType.neutral:
      console.log(`[${chalk.blue(name)}] ${chalk.blue(message)}`);
      break;
    default:
      console.log(`[${chalk.white(name)}] ${chalk.white(message)}`);
      break;
  }
}
