import { Prisma } from '@prisma/client';
import CustomError from 'src/global-filters/custom-error-filter';
import ErrorMessage from 'src/global-filters/error-message-filter';
import { StatusCodes } from './enum/status-codes.enum';

// Helper function to get column names for a Prisma model
export function getModelColumnNames<T>(model: T): Array<keyof T> {
  return Object.keys(model) as Array<keyof T>;
}

function createEnum<T extends string>(values: T[]): { readonly [K in T]: K } {
  return values.reduce(
    (acc, value) => {
      const columnName = value.replace(/_([a-z])/g, (match, letter) =>
        letter.toUpperCase(),
      );
      acc[columnName] = columnName;
      return acc;
    },
    {} as { readonly [K in T]: K },
  );
}

export function getColumnNames({ tableName }: { tableName: string }) {
  try {
    const models = Prisma.dmmf.datamodel.models;

    const table = models.find((model) => model.name === tableName);

    if (!table) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        ErrorMessage.custom('No table found!'),
      );
    }

    const columnNames = [];
    for (const field of table.fields) {
      if (field.kind === 'scalar' || field.kind === 'enum') {
        columnNames.push(field.name);
      }
    }
    const carEnum = createEnum(columnNames);

    return carEnum;
  } catch (error) {
    console.log(error);
  }
}

export function createEnumFromObject<T extends Record<string, string>>(
  obj: T,
): Readonly<T> {
  return Object.freeze(obj);
}

export function getISTDateTimeString(date: Date | string): string {
  const newDate = new Date(date);
  const dateString = newDate.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
  });
  const timeString = newDate.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
  });
  return `${dateString} ${timeString}`;
}
