export const PrismaErrors = {
  P2000: "The provided value for the column is too long for the column's type.",
  P2001: 'The record searched for in the where condition does not exist.',
  P2002: 'Unique constraint violation on a field or combination of fields.',
  P2003: 'Foreign key constraint violation on the field.',
  P2004: 'A constraint failed on the database.',
  P2005: 'The value stored in the database for the field is invalid.',
  P2006: 'The provided value is not valid for the field type.',
  P2007: 'Data validation error occurred.',
  P2008: 'Failed to fetch the database schema from the server.',
  P2009: 'Failed to validate the query provided.',
  P2010: 'Raw query failed due to an issue with the database.',
  P2011: 'Null constraint violation on the field.',
  P2012:
    'Missing required value for a field during a create or update operation.',
  P2013: 'Missing required argument in a relation.',
  P2014:
    'The required relation between records would be violated by this action.',
  P2015: 'A related record could not be found.',
  P2016: 'Query interpretation error. The query is invalid.',
  P2017: 'The records for the relation are not connected.',
  P2018: 'The required connected records were not found.',
  P2019: 'Input error occurred on a specific field.',
  P2020: 'The value provided is out of range for the field type.',
  P2021: 'The table does not exist in the current database.',
  P2022: 'The column does not exist in the current database.',
  P2023: 'Inconsistent column data found in the database.',
  P2024: 'Timed out while fetching a result from the database.',
  P2025: 'Record not found. The record to update or delete does not exist.',
  P2026: 'Database server error occurred. Please try again later.',
  P2027: 'Multiple fields are required but only one was provided.',
  P2028:
    'Transaction is already closed. Nested transactions are not supported.',
  P2029: 'Cannot start a transaction due to a database connection issue.',
  P2030: 'Cannot find or retrieve the specified item from the database.',
  P2031:
    'The database transaction could not be started due to an issue with the connection.',
  P2032: 'A unique constraint violation occurred during an upsert operation.',
  P2033:
    'Prisma query engine exited with a panic due to an unexpected internal error.',
  P2034: 'No valid query result returned for the query execution.',
  P2035: 'Connection pooling issue or database timeout occurred.',
  P2036: 'A data error occurred. Invalid cast during field conversion.',
  P2037: 'Relation violation occurred during query execution.',
  P2038: 'Relation constraint violation during an upsert operation.',
  P2039: 'Unique constraint failed during upsert.',
  P2040: 'Failed to parse the query provided.',
  P2041: 'Data type mismatch for the provided value in the field.',
  P2042:
    'The update or delete operation could not complete due to referential integrity.',
  P2043:
    'The requested query operation exceeds the limit allowed by the database.',
  P2044: 'Too many nested operations or relations specified in the query.',
  P2045:
    'The provided value for the field is not compatible with the database schema.',
  P2046: 'The query exceeded the time limit set for the operation.',
  P2047: 'Invalid number of arguments provided for the query.',
  P2048:
    'Conflicting actions detected for the operation, leading to a constraint violation.',
  P2049:
    'Unable to find a suitable index for the query, resulting in a failure.',
  P2050: 'Too many database connections open. Could not execute the query.',
  P2051: 'No matching records found for the query operation.',
  P2052: 'The update operation conflicts with the current state of the record.',
  P2053: 'The delete operation conflicts with the current state of the record.',
  P2054: 'A required field for the relation is missing.',
  P2055: 'A required field for a related model is missing.',
  P2056:
    'The required query execution permissions are missing for the operation.',
  P2057: 'A recursive relationship caused a loop, which could not be resolved.',
  P2058: 'The specified relation is ambiguous and could not be resolved.',
  P2059: 'Invalid identifier or alias used in the query.',
  P2060: 'The database query syntax is invalid or incorrect.',
  P2061: 'The database operation was canceled before completion.',
  P2062: 'The database server is unavailable or down.',
  P2063: 'Database error due to schema incompatibility.',
  P2064:
    'The server encountered an issue and closed the connection prematurely.',
  P2065: 'The database version is incompatible with Prisma. Please upgrade.',
  P2066:
    'The requested transaction could not be executed due to a deadlock situation.',
  P2067:
    'The query contains a field that is not indexed, resulting in a performance issue.',
  P2068:
    'The transaction has already been rolled back due to an earlier error.',
  P2069: 'A long-running query was canceled due to a timeout threshold.',
  P2070: 'Prisma query engine error: Unsupported operation for the database.',
};
