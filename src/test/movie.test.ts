import mongoose from 'mongoose';
import request from 'supertest';
import Movie from "../Models/Movie";
import app from "../app";
import {setUpDataBase, userOne} from "./user";
import {describe, expect, test, it, afterEach} from '@jest/globals';
import {User} from "../Models/User";


describe('Movies API', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb+srv://proftoby97:469iHVvyRaTkKD5T@montreal.i85lhyq.mongodb.net/?retryWrites=true&w=majority');
    }, 10000);
    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
        await  setUpDataBase();
        await Movie.deleteMany({});
    }, 20000);

    describe('GET /movies', () => {
        it('should return an empty array when there are no movies', async () => {
            const response = await request(app).get('/movies')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .expect(200)
                console.log(userOne)
                expect(response.body).toEqual([]);
        });

        it('should return an array of movies when there are movies', async () => {
            const movie1 = new Movie({
                title: 'The Godfather',
                url: 'www.hello.com',
                description: 'Francis Ford Coppola',
            });
            await movie1.save();

            const movie2 = new Movie({
                title: 'The Godfather',
                url: 'www.hello.com',
                description: 'Francis Ford Coppola',
            });
            await movie2.save();

            const response = await request(app).get('/movies')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .expect(200)
            expect(response.body).toEqual([
                {
                    title: movie1.title,
                    description: movie1.description,
                    url: movie1.url,
                },
                {
                    title: movie2.title,
                    description: movie2.description,
                    url: movie2.url,
                },
            ]);
        });
    });

    describe('POST /movies', () => {
        it('should create a new movie', async () => {
            const response = await request(app)
                .post('/movies')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send({
                    title: 'The Godfather',
                    url: 'www.goat.com',
                    description: 'Francis Ford Coppola',
                }).expect(201);

            const movie = await Movie.findById(response.body.movie._id);
            expect(movie).toBeDefined();
            expect(movie.title).toBe('The Godfather');
            expect(movie.url).toBe('www.goat.com');
            expect(movie.description).toBe('Francis Ford Coppola');
            expect(movie.createdAt).toEqual(expect.any(Date));
            expect(movie.updatedAt).toEqual(expect.any(Date));
        });

        it('should return a 400 error if the movie data is invalid', async () => {
            const response = await request(app)
                .post('/movies')
                .send({
                    age: 44,
                });

            expect(response.status).toBe(400);
        });
    });

    describe('PUT /movies/:id', () => {
        it('should update an existing movie', async () => {
            const movie = new Movie({
                title: 'The Godfather',
                url: 'somerandomurl.com',
                description: 'Francis Ford Coppola',
            });
            await movie.save();

            const response = await request(app)
                .put(`/movies/${movie._id}`)
                .send({
                    title: 'The Godfather: Part II',
                    url: 'www.url.com',
                    description: 'Francis Ford Coppola',
                });
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                title: 'The Godfather: Part II',
                url: 'www.sdsd.com',
                description: 'Francis Ford Coppola',
                rating: 9.0,
            });

            const updatedMovie = await Movie.findById(movie._id);
            expect(updatedMovie).toBeDefined();
            expect(updatedMovie.title).toBe('The Godfather: Part II');
            expect(updatedMovie.url).toBe('www.sdsd.com');
            expect(updatedMovie.description).toBe('Francis Ford Coppola');
        });

        it('should return a 400 error if the movie data is invalid', async () => {
            const movie = new Movie({
                title: 'The Godfather',
                url: 'www.hello.com',
                description: 'Francis Ford Coppola',
            });
            await movie.save();

            const response = await request(app)
                .put(`/movies/${movie._id}`)
                .send({
                    year: 1972,
                });
            expect(response.status).toBe(400);
        });
    });
});