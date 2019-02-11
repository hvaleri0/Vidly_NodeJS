const fs = require('fs')

require('../../../startup/logging')();

describe('Logging startup', () => {

    const exceptionError = () => {
        throw new Error ('FATAL ERROR: uncaught exception');
    }

    //throw an exeption and save to 'uncaughtExceptions.log
    it('throw an exeption and save to uncaughtExceptions.log',async () => {

        let file = 'logfile.log';

        expect(() => {exceptionError()}).toThrow();

        const fileAccess = fs.access(file, fs.constants.F_OK, (err) => {
            console.log(`${file} ${err ? 'does not exist' : 'exists'}`);
        })

        //expect(fileAccess).toBeDefined();

    //throw a rejection and save to 'uncaughtExceptions.log

    })
})