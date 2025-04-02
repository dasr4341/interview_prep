
export interface SelectDateRangeRelativelySubOption {
  label: string;
  value: string;
  numberFieldRequired: boolean;
}

export interface SelectDateRangeRelativelyOptionInterface {
  label: string;
  value: string;
  list: SelectDateRangeRelativelySubOption[];
}

export interface SelectedMonthNDateInfoInterface {
  selectedOption: SelectDateRangeRelativelySubOption;
  numberOfDays: string | null;
}
