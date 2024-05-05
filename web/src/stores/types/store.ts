import { IEmployeeValue } from '..';


export interface IError {
  message: string;
  status: number | null;
  reason: string | null;
}

export interface IFlow {
  inProgress: boolean;
  isLoaded: boolean;
  error: IError;
  hasEverBeenRan: boolean;
  isError: boolean;
  errorMessage: string | null;
  inProgressAgain: boolean;
  canBeRun: boolean;
  start: () => void;
  success: () => void;
  failed: (e: Error, throwError?: boolean) => void;
}

export interface IAsyncAction {
  run: (...args: any[]) => Promise<void>;
}

export interface IEmployeeStore {
  getById: (id:string) => IEmployeeValue;
}

export interface ICollection<T, B> {
  get: (id: string) => T;
  has: (id: string) => boolean;
  set: (id: string, value: B) => void;
  remove: (id: string) => void;
  update: (id: string, value: Partial<T>) => boolean;
  merge: (values: { [id: string]: T }) => void;
  clear: () => void;
}