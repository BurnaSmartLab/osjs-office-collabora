const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = fs.readFileSync(path.resolve(__dirname, './private.key'));
const ivSeparator = ' ';

const encrypt = (text, iv = crypto.randomBytes(16)) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return iv.toString('hex') + ivSeparator + encrypted.toString('hex');
};

const decrypt = (text) => {
  const textParts = text.split(ivSeparator);
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(ivSeparator), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  const decrpyted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decrpyted.toString();
};

module.exports = {
  encrypt,
  decrypt,
};
