const crypto = require("crypto");
const fs = require("fs");
/**
 * 生成密钥对
 * @returns
 */
const generateKeyPem = () => {
  // 生成 RSA 密钥对
  crypto.generateKeyPair(
    "rsa",
    {
      modulusLength: 2048, // 密钥长度
      publicKeyEncoding: {
        type: "pkcs1", // "Public Key Cryptography Standards 1"
        format: "pem", // 输出格式
      },
      privateKeyEncoding: {
        type: "pkcs1", // "Public Key Cryptography Standards 1"
        format: "pem", // 输出格式
      },
    },
    (err, publicKey, privateKey) => {
      if (err) {
        console.error("生成密钥对时发生错误：", err);
        return;
      }

      // 将公钥写入文件
      fs.writeFileSync("public_key.pem", publicKey);

      // 将私钥写入文件
      fs.writeFileSync("private_key.pem", privateKey);
    },
  );
};
const validateKeyPem = encryptedPassword => {
  const privateKey = fs.readFileSync("private_key.pem", "utf8");
  const decryptedPassword = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(encryptedPassword, "base64"),
  );
  return decryptedPassword.toString("utf8");
};
module.exports = { generateKeyPem, validateKeyPem };
