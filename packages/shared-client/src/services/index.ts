export * from './logger';
export * from './modal';
export * from './types';
export * from './error-manager';
import { Logger as LoggerClass } from './logger';

export const Logger = new LoggerClass();
