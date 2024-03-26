const yargs = require("yargs");
const fs = require("fs");
const validator = require("validator");
const process = require("process");
const { saveToJSON, checkDuplicate } = require("./Validator-3.js");
/**
 * isi form dalam satu baris, ke object. misal dengan argument: node app.js add --name="diyo"
 * object, (koma akhir wajib)
 */

// check if directory "./data" exists, create the dir if it doesn't
if (!fs.existsSync("./data")){
    fs.mkdirSync("./data");
}

// check if file "contacts.json" in "./data" exists, create the file if it doesn't
if (!fs.existsSync("./data/contacts.json")){
    fs.writeFileSync("./data/contacts.json", "[]", "utf8");
}

yargs.command({
    // build cli level
    // node <file-name> add --help
    // sesuaikan command di cli untuk building object-builder, kalau tidak sesuai obj tidak dibuild
    command: "add",
    describe: "add new contact",
    // build cli in builder, 
    builder:{
        name:{
            describe: "contact name",
            demandOption: true,
            // expected type, not declared type
            type: "string",
        },
        mobile:{
            describe: "contact mobile phone number",
            demandOption: true,
            type: "string",
        },
        email:{
            describe: "contact email address",
            demandOption: false,
            // can be undefined
            type: "string",
        },
    },
    handler(argv){
        const contact = {
            name:argv.name,
            mobile:argv.mobile,
            email:argv.email,
        };
        console.log(contact);

        const filePath = "./data/contacts.json";
        // coba name sebagai primary key, not best practice!!!
        // check if there is argv.name in our database contacts.json, also mobile phone number and email address format are valid
        let success = true;
        
        // cek duplikat nama
        if (checkDuplicate(contact.name, filePath)) {
            console.log(`The name "${contact.name}" already exists`);
            success = false;
        }
        // validasi nomor telepon, format Indonesia
        if (!validator.isMobilePhone(contact.mobile, 'id-ID')) {
            console.log("Wrong phone number format: your phone number must be an Indonesian number");
            success = false;
        }
        // validasi format email
        if (contact.email && !validator.isEmail(contact.email)) {   
            console.log("Wrong email format");
            success = false;
        }

        // if the name is not duplicated (not already exists in our database) and other inputs' format is valid, save to json
        if (success) {
            saveToJSON(contact, filePath);
        }
    },
});

// object builder urutan sesuai builder
yargs.parse(); // process yargs.command()
process.exit();

// // input cli urutan sesuai cli dengan _, ...isi, '$0'
// // output object added + argv
// console.log(yargs.argv);
// console.log(yargs.argv.name);