import { types, resolveIdentifier } from 'mobx-state-tree';

export function safeReference(T:any) {
  return types.reference(T, {
    get(identifier, parent) {
      return resolveIdentifier(T, parent, identifier);
    },
    set(value) {
      return value;
    },
  });
}
