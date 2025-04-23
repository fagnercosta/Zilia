global.Buffer =require('buffer').Buffer;

data = 'c3RyaW5nIHRlc3RlAAAAAAAAAAA='

console.log('Dados Recebidos na API:', Buffer.from(data, 'base64').toString('utf-8'));