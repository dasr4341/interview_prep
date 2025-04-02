export const ReportSelectBox = {
  control: (baseStyles: any) => ({
    ...baseStyles,
    borderRadius: '6px',
    borderColor: '#C5C5D8',
    color: '#23265B',
    padding: '3px 6px',
  }),
  placeholder: (defaultStyles: any) => {
    return {
      ...defaultStyles,
      color: '#23265B',
      opacity: '0.5',
      boxShadow: ' 0 !important',
    };
  },
  option: (base: any) => ({
    ...base,
    cursor: 'pointer',
    color: '#4B4C4E',
  }),
};