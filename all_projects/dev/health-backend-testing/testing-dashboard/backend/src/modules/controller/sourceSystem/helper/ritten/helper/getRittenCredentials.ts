enum SourceSystemKeyEnum {
  CLIENT_ID = 'Client ID',
  CLIENT_SECRET = 'Client Secret',
  AUDIENCE = 'Audience',
}

export function getRittenCredentials(
  data: {
    name: string;
    value: string;
    id: string;
    facilityname: string;
  }[],
) {
  // extracting the required keys, need to fetch data from kipu
  return data?.reduce(
    (
      prevValue: {
        clientId: string;
        clientSecret: string;
        audience: string;
      },
      row,
    ) => {
      if (row.name === SourceSystemKeyEnum.AUDIENCE) {
        prevValue.audience = row.value;
      } else if (row.name === SourceSystemKeyEnum.CLIENT_ID) {
        prevValue.clientId = row.value;
      } else if (row.name === SourceSystemKeyEnum.CLIENT_SECRET) {
        prevValue.clientSecret = row.value;
      }

      return prevValue;
    },
    {
      clientId: '',
      clientSecret: '',
      audience: '',
    },
  );
}
