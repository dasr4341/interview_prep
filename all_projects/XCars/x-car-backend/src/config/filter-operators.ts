import { TableColumnType } from 'src/common/enum/column-type.enum';

export const filterOperators = {
  stringOperators: {
    contains: 'contains',
    notContains: 'doesNotContain',
    equal: 'equals',
    notEqual: 'doesNotEqual',
    startsWith: 'startsWith',
    endsWith: 'endsWith',
    null: 'isEmpty',
    notNull: 'isNotEmpty',
    in: 'isAnyOf',
  },
  booleanOperators: {
    equal: 'is',
  },
  numberOperators: {
    equal: '=',
    notEqual: '!=',
    greater: '>',
    greaterOrEqual: '>=',
    less: '<',
    lessOrEqual: '<=',
    null: 'isEmpty',
    notNull: 'isNotEmpty',
    in: 'isAnyOf',
  },
  enumOperators: {
    equal: 'is',
    notEqual: 'not',
    in: 'isAnyOf',
  },
  dateOperators: {
    equal: 'is',
    notEqual: 'not',
    greater: 'isAfter',
    greaterOrEqual: 'isOnOrAfter',
    less: 'isBefore',
    lessOrEqual: 'isOnOBefore',
    null: 'isEmpty',
    notNull: 'isNotEmpty',
  },
};

export const getFilterOperators = (columnType: string): any => {
  if (columnType === TableColumnType.STRING) {
    return filterOperators.stringOperators;
  } else if (columnType === TableColumnType.BOOLEAN) {
    return filterOperators.booleanOperators;
  } else if (columnType === TableColumnType.NUMBER) {
    return filterOperators.numberOperators;
  } else if (columnType === TableColumnType.DATE) {
    return filterOperators.dateOperators;
  } else {
    return filterOperators.enumOperators;
  }
};
