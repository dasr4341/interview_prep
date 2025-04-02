enum KipuSourceSystemKeyHelper {
  SECRET_KEY = 'SECRET KEY',
  APP_ID = 'APP ID',
  ACCESS_ID = 'ACCESS ID',
}

export function getKipuCredentials(
  data: {
    name: string;
    value: string;
    id: string;
    facilityname: string;
  }[],
) {
  // ------------------------------------------
  // extracting the required keys, need to fetch data from kipu
  return data.reduce(
    (
      prevValue: {
        secretKey: string;
        appId: string;
        accessId: string;
      },
      row,
    ) => {
      if (row.name === KipuSourceSystemKeyHelper.ACCESS_ID) {
        prevValue.accessId = row.value;
      } else if (row.name === KipuSourceSystemKeyHelper.APP_ID) {
        prevValue.appId = row.value;
      } else if (row.name === KipuSourceSystemKeyHelper.SECRET_KEY) {
        prevValue.secretKey = row.value;
      }

      return prevValue;
    },
    {
      secretKey: '',
      appId: '',
      accessId: '',
    },
  );
}
