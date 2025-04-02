
export interface ProductVariable {
    name: string;
    id: number;
}

export interface CompanyProduct {
    products: ProductVariable[]
}

export interface IndustryVariable {
    id: number
    sector: string,
}

export interface GlobalIndustries {
    pretaaGetGlobalIndustries: IndustryVariable[]
}

export interface DefaultFiltersVariable {
    isChecked?: boolean,
    key?: string,
    name: string
}

export interface DefaultIndustriesVariable {
    isChecked?: boolean;
    id: number
    sector: string
}

export interface FiltersVariable {
    isChecked: boolean;
}

export interface DefaultProductsVariable {
    isChecked?: boolean;
    id: string,
    name: string,
    customerProductId: string
}

export interface NpsScoreVariable {
    min: number | null;
    max: number | null
}

export interface EmployeesVariable {
    min: number | null;
    max: number | null
}

export interface ArrVariable {
    min: number | null;
    max: number | null;
}

export interface RenewalDateVariable {
    from: string | null;
    to: string | null;
}

export interface CloseDateVariable {
    from: string | null;
    to: string | null;
}

export interface SurveyedRangeVariable {
    label: string;
    value: string;
}

export interface ArrRangeVariable {
    label: string;
    value: Array<number> | string;
}

export interface EmployeesRangeVariable {
    label: string;
    value: Array<number> | string;
}

export interface ManualRangeVariable {
    label: string;
    value: string;
}

export interface ReferenceVariable {
    surveyed: boolean,
    surveyedRange: string,
    manual: boolean,
    manualRange: string,
    referredOn: boolean,
    offeredOn: boolean,
    allReference: boolean
}

export interface FormFieldsJson {
    filters?: string[];
    industries?: number[];
    products?: number[];
    npsScore?: NpsScoreVariable
    employeeCount?: EmployeesVariable;
    arr?: ArrVariable;
    renewalDate?: RenewalDateVariable;
    closeDate?: CloseDateVariable;
    references?: ReferenceVariable
}
