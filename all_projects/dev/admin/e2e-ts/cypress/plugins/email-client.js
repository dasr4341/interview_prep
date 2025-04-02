const imap = require('imap-simple');
const _ = require('lodash');

async function getResult ({ email, email_credential }) {
  console.log('Fetching password for email...', email, 'email_credential', email_credential);
  var delay =  60 * 1000;
  var yesterday = new Date();
  yesterday.setTime(Date.now() - delay);
  yesterday = yesterday.toDateString();
  var searchCriteria = [
    'UNSEEN',
    ['SINCE', yesterday],
    ['TO', email]
  ];
  var fetchOptions = {
    bodies: ['HEADER', 'TEXT'],
    markSeen: false
  };

  email_credential = email_credential.split(':');
  


  const config = {
    imap: {
      user: email_credential[0],
      password: email_credential[1],
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      authTimeout: 3000
    }
  };
  const connectionP = await imap.connect(config);
  
  try {
    await connectionP.openBox('INBOX');
   
    const results = await connectionP.search(searchCriteria, fetchOptions);

    const parsedData = results.map(function (res) {
      var all = _.find(res.parts, { 'which': 'TEXT' })
      return all.body;
    });

    return {connection: connectionP, results: parsedData};
   
  } catch(err) {
    console.log(err);
  }
}

module.exports = {
  getOtp: (options) => {
    return new Promise((res, rej) => {
      getResult(options).then(data => {
        data.connection.end();
        const passwords  = data.results ? data.results.map(item => { return item.substr(item.indexOf('authentication is ') + 18, 7)}) : [];
        const newPassword = passwords[passwords.length - 1] || 'password';
        console.log('Your one time password for enable two factor authentication is', newPassword);
        res(newPassword);
      }).catch(err => {
        rej(err);
      });
    });
  }
}