const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('TIEN-NGUYEN-BRYAN-TopCV.vn-160626.163539.pdf');

pdf(dataBuffer).then(function(data) {
    console.log(data.text);
});
