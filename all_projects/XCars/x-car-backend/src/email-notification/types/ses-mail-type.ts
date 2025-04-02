export type SesMailType = {
  Source: string;
  Destination: {
    ToAddresses: string[];
  };
  ReplyToAddresses: string[];
  Message: {
    Body: {
      Html: {
        Charset: string;
        Data: string;
      };
    };
    Subject: {
      Charset: string;
      Data: string;
    };
  };
};
