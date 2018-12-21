const readline = require('readline');
const bcrypt = require('bcrypt');

//1234 ->ABCD

// async function run(){
//     const salt = await bcrypt.genSalt(10);
//     const hashed = await bcrypt.hash('1234',salt)
//     console.log(salt);
//     console.log(hashed);
// }
async function run (answer) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(answer,salt);
    //console.log(answer);
    console.log('the salt is',salt);
    console.log('the ashed/Salted password is:', hashed);
    return true
}

const rl = readline.createInterface ({
    input: process.stdin,
    output: process.stdout
});

const questionBcrypt = function () {
    rl.question('Please input password to hash:', (answer) => {
        run(answer);
    })
};

questionBcrypt();