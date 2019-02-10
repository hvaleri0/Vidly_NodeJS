const logging = require('../../../startup/logging')
const fs = require('fs')

describe('Logging startup', () => {
    //throw an exeption and save to 'uncaughtExceptions.log
    it('throw an exeption and save to uncaughtExceptions.log',() => {
        throw new Error ('FATAL ERROR: uncaught exception');
        const file = fs.access(file, fs.constants.F_OK);
        expect(file).toBeDefined();
    })

    //throw a rejection and save to 'uncaughtExceptions.log

})