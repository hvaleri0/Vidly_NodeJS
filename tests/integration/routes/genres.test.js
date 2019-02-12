const request = require('supertest');
const {Genre} = require('../../../models/genre')
const {User} = require('../../../models/user')
const mongoose = require('mongoose')
let server


describe('/api/genres', () => {
    beforeEach( () => { server = require ('../../../index'); });
    afterEach( async () => {
        await Genre.remove({}); 
        await server.close();
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1'},
                { name: 'genre2'}
            ])
            
            const res = await request(server).get('/api/genres');
            
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some( g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some( g => g.name === 'genre2')).toBeTruthy();
        })
    });

    describe('GET /:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({ name: 'genre1'});
            await genre.save();
            
            const res = await request(server).get('/api/genres/' + genre._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
            //expect(res.body).toMatchObject(genre);
        })

        it('should return 404 if an invalid _id is passed', async () => {
            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        })
        it('should return 404 if no genre with the given id exists', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/' + id);

            expect(res.status).toBe(404);
        })
    });

    describe('POST /', () => {
        // define the happy path, and then in each test, we change
        // one parameter that clearly aligns with the name of test.
        let token;
        let name; 

        const exec = async() => {
            return await request(server)
            .post('/api/genres')
            .send({ name })
            .set('x-auth-token', token)
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1'
        })

        it('should return 401 if client is not logged in', async () => {
            token = ''
            
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            name = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });
        
        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            await exec;

            const genre = await Genre.find({ name: 'genre1' });

            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid', async () => {
           
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });

    describe('PUT /:id', () => {
        let token;
        let name;
        let genre;
        let id;
        
        
        const dbEntry = async () => {
            genre = new Genre({ name : 'genreOld' });
            await genre.save();
        }

        const exec = async () => {
            return await request(server)
            .put('/api/genres/'+ id)
            .send({ name })
            .set('x-auth-token', token)
        }

        beforeEach( async() => {
            await dbEntry();
            token = new User().generateAuthToken();
            name = 'genreNew'
            id = genre.id
        })

        it('should return 400 if new genre is less than 5 characters', async () => {
            name = '1234';

            const res = await exec();

            expect(res.status).toBe(400);

        });
        it('should return 400 if new genre is greater than 50 characters', async () => {
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);

        });
        it('should return 404 if genre with the given ID was not found', async () => {
            id = mongoose.Types.ObjectId().toHexString();

            const res = await exec();

            expect(res.status).toBe(404);

        });

        it('should save the genre if its found and changed', async () => {
            await exec();

            const genre = await Genre.find({ name });

            expect(genre).not.toBeNull();

        });

        it('should return the genre if it found and changed', async () => {
           
            const res = await exec();

            expect(res.body).toHaveProperty('_id', id);
            expect(res.body).toHaveProperty('name', name);
        });
     });
    describe('DELETE /:id', () => {
        let token;
        let name;
        let genre;
        let id;
        
        
        const dbEntry = async () => {
            genre = new Genre({ name : 'genre1' });
            await genre.save();
        }

        const exec = async () => {
            return await request(server)
            .delete('/api/genres/'+ id)
            .send({ name })
            .set('x-auth-token', token)
        }

        beforeEach( async() => {
            await dbEntry();
            id = genre.id;
            name = genre.name;
        })

        it('should return 404 if genre with the given ID was not found', async () => {
            id = mongoose.Types.ObjectId().toHexString();
            token = new User({name: 'hector Valerio', isAdmin: true}).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(404);

        });
        it('should return 403 if Access denied.', async () => {
            token = new User({name: 'hector Valerio', isAdmin: false}).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);

        });

        it('should delete the genre if its found', async () => {
            token = new User({name: 'hector Valerio', isAdmin: true}).generateAuthToken();

            await exec();

            const genre = await Genre.find({ name });

            expect(genre).toEqual([]);

        });

        it('should return the genre if deleted', async () => {
            token = new User({name: 'hector Valerio', isAdmin: true}).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id', id);
            expect(res.body).toHaveProperty('name', name);
        });
     });
});

