export type TableHeader<Base = any> = {
  [Key in keyof Base]: {
    name?: string;
    label?: string;
    field: Key | ((row: Base) => void);
    required?: boolean;
    align?: 'left' | 'right' | 'center' | 'justify';
    sortable?: boolean;
    sort?: (a: Base[Key], b: Base[Key], rowA: Base, rowB: Base) => number;
    format?: (val: Base[Key], row: Base) => void;
    style?: string;
    classes?: string;
    headerStyle?: string;
    headerClasses?: string;
  };
}[keyof Base];

export type TableActionHeader<T = any> = TableHeader<T & { actions: string }>;
