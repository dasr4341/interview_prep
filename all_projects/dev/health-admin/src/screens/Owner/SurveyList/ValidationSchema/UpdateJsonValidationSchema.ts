// API: Backend always send null even when not required
export const validationSchema =  {
  type: 'object',
  items: {
    type: 'object',
    properties: {
      maxLength: {
        type: 'string',
      },
      minLength: {
        type: 'string',
      },
      required: {
        type: 'string',
      },
      patternValidation: {
        type: 'object',
        properties: {
          active: {
            type: 'boolean',
          },
          message: {
            type: 'string',
          },
        },
      },
    },
  },
};

export const UpdateJsonValidationSchema = {
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    properties: {
      id: { type: ['string'] },
      questionName: { type: ['string'] },
      parentQuestionName: { type: ['string', 'null', 'undefined'] },
      inputType: { type: 'string' },
      label: { type: 'string' },
      placeholder: { type: 'string' },
      rangeValue: { type: ['string', 'null'] },
      step: { type: ['string', 'null'] },
      options: { type: ['null', 'array', 'object'] },
      validation: { type: ['null', 'array', 'object'] },
    },
    required: ['id', 'inputType', 'label', 'placeholder', 'rangeValue', 'step'],
    additionalProperties: false,
  },
};
// -------------- UPDATE SCHEMA FOR VALIDATION -------------------
