const pagesValidationSchema = {
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    properties: {
      elements: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            type: { type: 'string' },
            title: { type: 'string' },
            html: { type: 'string' },
            rangeValue: { type: 'string' },
            isRequired: { type: 'boolean' },
            choices: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  value: {
                    type: 'string',
                  },
                  label: {
                    type: 'string',
                  },
                },
              },
            },
            rangeMin: { type: 'number' },
            rangeMax: { type: 'number' },
            step: { type: 'number' },
            startValue: { type: 'number' },
            defaultValue: { type: 'number' },
            required: ['name', 'type'],
          },
          required: ['name', 'type'],
        },
      },
    },
    required: ['elements'],
  },
};

export const CreateTemplateJsonValidation = {
  type: 'object',
  properties: {
    showQuestionNumbers: { type: 'string' },
    questionTitleTemplate: { type: 'string' },
    questionTitlePattern: { type: 'string' },
    requiredText: { type: 'string' },
    title: { type: 'string' },
    showTitle: { type: 'boolean' },
    pages: pagesValidationSchema,
  },
  required: ['pages']
};


