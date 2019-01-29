const request = require('supertest');
const {Genre} = require('../../../models/genre')
const {User} = require('../../../models/user')
let server

describe('/api/genres', () => {
    beforeEach( () => { server = require ('../../../index'); });
    afterEach( async () => {
        server.close();
        await Genre.remove({}); 
    });

    let token;

    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1'});
    }

    beforeEach(() => {
        token = new User().generateAuthToken();
    })

    it('should return 401 if no token is provided', async () => {
        token = '';

        const res = await exec ();

        expect(res.status).toBe(401);
    });

});
