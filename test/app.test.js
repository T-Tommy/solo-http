const app = require('../lib/app.js');
const request = require('supertest');

jest.mock('../lib/service/getCharacter.js');

describe('app routes', () => {
  it('responds to a path', () => {
    return request(app)
      .get('/tester')
      .then(res => {
        expect(res.body).toEqual({ testing: 123 });
      });
  });

  it('responds with an object based on query string', () => {
    return request(app)
      .get('/you?name=tommy')
      .then(res => {
        expect(res.body).toEqual({ text: 'hi there tommy' });
      });
  });

  it('gets Rick object from api', () => {
    return request(app)
      .get('/character/1')
      .then(res => {
        expect(res.body).toEqual({
          name: 'Tommy Tran',
          status: 'Alive',
          species: 'Human'
        });
      });
  });

  it('gets Morty object from api', () => {
    return request(app)
      .get('/character/2')
      .then(res => {
        expect(res.body).toEqual({
          name: 'Morty Smith',
          status: 'Alive',
          species: 'Human'
        });
      });
  });
});

describe('People database', () => {
  it('with POST, it parses the body and adds new person to People database', () => {
    const toSend = { 
      name: 'Tommy',
      age: 24,
      color: 'orange'
    };

    return request(app).post('/people')
      .send(toSend)
      .then(res => {
        expect(res.body.name).toEqual({ 
          name: 'Tommy',
          age: 24,
          color: 'orange',
          _id: expect.any(String)
        });
      });
  });
});
