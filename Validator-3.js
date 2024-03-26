const fs = require("fs");
const readline = require("readline");
const validator = require("validator");

// membuat cli untuk menerima IO
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const saveToJSON = (data, path) => {
    // menambahkan kontak baru ke json
    const file = fs.readFileSync(path, "utf8");
    const contacts = JSON.parse(file);
    contacts.push(data);
    fs.writeFileSync(path, JSON.stringify(contacts));
    console.log("Terimakasih sudah memasukkan data")
}

// menanyakan pertanyaan dengan validasi
function askQuestion(question, validatorFn, errorMessage) {
    return new Promise((resolve, reject) => { // deafult reject: error (?)
        rl.question(question, (answer) => {
            // tidak bisa do-while, hipotesis: karena rl.question fungsi async yang dipanggil secara callback-hell
            
            // jika tidak membutuhkan validasi, atau format jawaban valid, kembalikan jawaban
            if (validatorFn == null || validatorFn(answer)) {
                resolve(answer);
            } else { // jika membutuhkan validasi, namun format jawaban tidak valid, tanya lagi hingga valid
                console.log(errorMessage);
                resolve(askQuestion(question, validatorFn, errorMessage));
            }
        });
    });
}

// alternative: better practice using arrow function
// const main = async () => {
// }

async function getUserInfoAwait() {    
    // untuk menghandle error agar program tetap berjalan saat error
    try {
        // meminta masukan berupa nama, no. telp, dan email
        const name = await askQuestion(
            'What is your name? ',
            null,
            'Name: wrong format, your name must contain only alphabets'
        );
        const phoneNumber = await askQuestion(
            'What is your phone number? ',
            (input) => validator.isMobilePhone(input, 'id-ID'),
            'Phone number: wrong format, your phone number must be an Indonesian number'
        );
        const email = await askQuestion(
            'What is your email? ',
            (input) => validator.isEmail(input),
            'Email: wrong format, enter input again!'
        );
        const contact = {name, phoneNumber, email};
        const filePath = "./data/contacts.json";
        saveToJSON(contact, filePath);
    } catch (error) {
        console.error('An error occurred:', error.message);
    } finally {
        rl.close();
    }
}

const checkDuplicate = (name, path) => {
    // mengecek duplikasi nama pada file di path
    const file = fs.readFileSync(path, "utf8");
    const contacts = JSON.parse(file);
    return contacts.some((contact) => contact.name == name);

    // // alternative
    // contacts.forEach((contact) => {
    //     if (contact.name == name){
    //         return true;
    //     }
    // });
    // return false;
}

// Usage
module.exports = { getUserInfoAwait, saveToJSON, checkDuplicate };