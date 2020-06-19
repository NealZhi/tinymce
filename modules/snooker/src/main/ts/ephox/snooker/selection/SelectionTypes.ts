import { Element as DomElement } from '@ephox/dom-globals';
import { Adt } from '@ephox/katamari';
import { Element } from '@ephox/sugar';

export interface SelectionType {
  fold: <T>(
    none: () => T,
    multiple: (elements: Element<DomElement>[]) => T,
    single: (elements: Element<DomElement>) => T,
  ) => T;
  match: <T> (branches: {
    none: () => T;
    multiple: (elements: Element<DomElement>[]) => T;
    single: (elements: Element<DomElement>) => T;
  }) => T;
  log: (label: string) => void;
}

const type = Adt.generate<{
  none: () => SelectionType;
  multiple: (elements: Element<DomElement>[]) => SelectionType;
  single: (elements: Element<DomElement>) => SelectionType;
}>([
      { none: [] },
      { multiple: [ 'elements' ] },
      { single: [ 'selection' ] }
    ]);

const cata = <T> (subject: SelectionType, onNone: () => T, onMultiple: (multiple: Element<DomElement>[]) => T, onSingle: (elements: Element<DomElement>) => T) =>
  subject.fold(onNone, onMultiple, onSingle);

// tslint:disable-next-line:variable-name
export const SelectionTypes = {
  cata,
  none: type.none,
  multiple: type.multiple,
  single: type.single
};