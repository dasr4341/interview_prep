export interface SelectBox {
  value: string;
  label: string;
}
export interface SelectCareTeam extends SelectBox {
  sourceSystem?: SourceSystemName;
}
export interface SelectEmployeeType extends SelectBox {
  type?: string;
}

interface SourceSystemName {
  name: string;
}
