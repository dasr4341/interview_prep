export function compareAsPerOperator(currentValue: string, conditionalValidationValue: string, operator: string) {
  switch (operator) {
    case '=': {
      return currentValue === conditionalValidationValue;
    }
    case '<': {
      return currentValue < conditionalValidationValue;
    }
    case '>': {
      return currentValue > conditionalValidationValue;
    }
    default : {
      return false;
    }
  }
}
