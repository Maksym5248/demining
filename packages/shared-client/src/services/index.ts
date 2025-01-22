export * from './logger';
export * from './modal';
export * from './types';
import { Logger as LoggerClass } from './logger';

export const Logger = new LoggerClass();
