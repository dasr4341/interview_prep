import { Injectable } from '@nestjs/common';
import { TableColumnType } from 'src/common/enum/column-type.enum';
import { filterOperators } from 'src/config/filter-operators';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FilterService {
  constructor(private prismaService: PrismaService) {}

  getFilteredData({
    fields,
  }: {
    fields: {
      column: any;
      value?: any;
      operator: string;
      type: TableColumnType;
    }[];
  }) {
    const filterWhereClause = [];
    for (const field of fields) {
      if (field.column === 'firstName') {
        const value = field.value[0].split(/ (?!.* )/);
        field.value = [value[0]];
        if (value[1]) {
          fields.push({
            column: 'lastName',
            value: [value[1]],
            operator: field.operator,
            type: TableColumnType.STRING,
          });
        }
      }
      switch (field.operator) {
        case filterOperators.stringOperators.contains: {
          filterWhereClause.push({
            [field.column]: {
              contains: field.value[0],
              mode: 'insensitive',
            },
          });
          break;
        }

        case filterOperators.stringOperators.notContains: {
          filterWhereClause.push({
            [field.column]: {
              NOT: { contains: field.value[0], mode: 'insensitive' },
            },
          });
          break;
        }

        case filterOperators.stringOperators.startsWith: {
          filterWhereClause.push({
            [field.column]: {
              startsWith: field.value[0],
            },
          });
          break;
        }

        case filterOperators.stringOperators.endsWith: {
          filterWhereClause.push({
            [field.column]: {
              endsWith: field.value[0],
            },
          });
          break;
        }

        case filterOperators.stringOperators.equal:
        case filterOperators.numberOperators.equal:
        case filterOperators.enumOperators.equal:
        case filterOperators.dateOperators.equal:
        case filterOperators.booleanOperators.equal: {
          let value: string | number | boolean = field.value[0];
          if (field.type === TableColumnType.NUMBER) {
            value = Number(value);
          } else if (field.type === TableColumnType.BOOLEAN) {
            value = value === 'false' ? Boolean(false) : Boolean(true);
          }
          filterWhereClause.push({ [field.column]: value });
          break;
        }

        case filterOperators.stringOperators.notEqual:
        case filterOperators.numberOperators.notEqual:
        case filterOperators.dateOperators.notEqual:
        case filterOperators.enumOperators.notEqual: {
          let value = field.value[0];
          if (field.type === TableColumnType.NUMBER) {
            value = Number(value);
          }
          filterWhereClause.push({ [field.column]: { not: value } });
          break;
        }

        case filterOperators.stringOperators.null:
        case filterOperators.numberOperators.null:
        case filterOperators.dateOperators.null: {
          filterWhereClause.push({ [field.column]: null });
          break;
        }

        case filterOperators.stringOperators.notNull:
        case filterOperators.numberOperators.notNull:
        case filterOperators.dateOperators.notNull: {
          filterWhereClause.push({ [field.column]: { not: null } });
          break;
        }

        case filterOperators.stringOperators.in:
        case filterOperators.enumOperators.in:
        case filterOperators.numberOperators.in: {
          let value = field.value;
          if (field.type === TableColumnType.NUMBER) {
            value = Number(value);
          }
          filterWhereClause.push({ [field.column]: { in: value } });
          break;
        }

        case filterOperators.numberOperators.greater:
        case filterOperators.dateOperators.greater: {
          let value = field.value[0];
          if (field.type === TableColumnType.NUMBER) {
            value = Number(value);
          }
          filterWhereClause.push({ [field.column]: { gt: value } });
          break;
        }

        case filterOperators.numberOperators.greaterOrEqual:
        case filterOperators.dateOperators.greaterOrEqual: {
          let value = field.value[0];
          if (field.type === TableColumnType.NUMBER) {
            value = Number(value);
          }
          filterWhereClause.push({ [field.column]: { gte: value } });
          break;
        }

        case filterOperators.numberOperators.less:
        case filterOperators.dateOperators.less: {
          let value = field.value[0];
          if (field.type === TableColumnType.NUMBER) {
            value = Number(value);
          }
          filterWhereClause.push({ [field.column]: { lt: value } });
          break;
        }

        case filterOperators.numberOperators.lessOrEqual:
        case filterOperators.dateOperators.lessOrEqual: {
          let value = field.value[0];
          if (field.type === TableColumnType.NUMBER) {
            value = Number(value);
          }
          filterWhereClause.push({ [field.column]: { lte: value } });
          break;
        }
      }
    }

    return { AND: filterWhereClause };
  }
}
