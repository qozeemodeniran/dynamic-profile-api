const request = require('supertest');
const app = require('../server');

describe('Dynamic Profile API', () => {
    describe('GET /me', () => {
        it('should return 200 OK with correct response structure', async () => {
            const response = await request(app)
            .get('/me')
            .expect('Content-Type', /json/)
            .expect(200);

            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('email');
            expect(response.body.user).toHaveProperty('name');
            expect(response.body.user).toHaveProperty('stack');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('fact');
        });

        it('should have valid ISO 8601 timestamp', async () => {
            const response = await request(app).get('/me');
            const timestamp = response.body.timestamp;
            expect(new Date(timestamp).toISOString()).toBe(timestamp);
        });

        it('should have dynamic timestamp on each request', async () =>{
            const response1 = await request(app).get('/me');
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response2 = await request(app).get('/me');
            expect(response1.body.timestamp).not.toBe(response2.body.timestamp);
        });

        it('should return a valid cat fact string', async() => {
            const response = await request(app).get('/me');
            expect(typeof response.body.fact).toBe('string');
            expect(response.body.fact.length).toBeGreaterThan(0);
        });

        it('should have correct content type header', async ()=> {
            const response = await request(app)
            .get('/me')
            .expect('Content-Type', /application\/json/);
        });
    });

    describe('GET /health', () => {
        it('should return 200 OK', async () => {
            const response = await request(app)
            .get('/health')
            .expect(200);

            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body).toHaveProperty('message', 'Server is healthy');
        });
    });
});