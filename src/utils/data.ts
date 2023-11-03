
import isUndefined from "lodash/isUndefined";

import { UpdateValue, CreateValue } from '~/types'

const createUpdateOrderDB = <T, B>(fn: (v: Partial<T>)=> CreateValue<B>) => (value: Partial<T>): UpdateValue<B>  => {
    const createdValues = fn(value);
    const keys = Object.keys(createdValues);
  
    return keys.reduce((acc, key) => {
      const item = createdValues[key as keyof CreateValue<B>];
  
      if(!isUndefined(item)){
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
        // @ts-expect-error
        acc[key] = item
      }
  
      return acc;
    }, {})
  };

  export const data ={
    createUpdateOrderDB
  }