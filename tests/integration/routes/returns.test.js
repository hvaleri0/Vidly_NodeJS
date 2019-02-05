const request = require('supertest')
const {Rental} = require('../../../models/rental');
const {User} = require('../../../models/user');
const mongoose = require('mongoose');

describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;

    const exec = () => {
        return request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({ customerId, movieId })
    };

    beforeEach( async () => { 
        server = require ('../../../index');
        
        customerId = mongoose.Types.ObjectId().toHexString();
        movieId = mongoose.Types.ObjectId().toHexString();
        token = new User().generateAuthToken();

        rental = new Rental({
            customer: {
                _id: customerId ,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title:'12345',
                dailyRentalRate: 2
            }
        });
        await rental.save();
    });

    afterEach( async () => {
        await Rental.remove({});
        await server.close();
    });

    it('should work', async () => {
        const result = await Rental.findById(rental._id);
        expect(result).not.toBeNull();
    });

    it('should return 401 if client is not logged in', async () => {
        token = '';
        
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if customerID is not provided', async () => {
        customerId = '';
        
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if movieID is not provided', async () => {        
        movieId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental found for the customer/movie', async () => {        
        await Rental.remove({});

        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('should return 400 if rental already processed', async () => {        
        const res = await exec();

        expect(res.status).toBe(404);
    });

})