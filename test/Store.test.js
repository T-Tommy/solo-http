const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const Store = require('../lib/Store');

describe('Store', () => {
  let store = null;

  beforeAll(done => {
    mkdirp('./testData/store', done);
  });

  beforeEach(() => {
    store = new Store('./testData/store');
  });

  beforeEach(done => {
    store.drop(done);
  });

  afterAll(done => {
    rimraf('./testData', done);
  });

  it('creates an object in my store', () => {
    return store.create({ name: 'ryan' })
      .then(createdPerson => {
        expect(createdPerson).toEqual({ name: 'ryan', _id: expect.any(String) });
      });
  });

  it('finds an object by id', () => {
    return store.create({ name: 'uncle bob' })
      .then(createdUncle => Promise.all([
        Promise.resolve(createdUncle),
        store.findById(createdUncle._id)
      ]))
      .then(([createdUncle, foundUncle]) => {
        expect(foundUncle).toEqual(createdUncle);
      });
  });

  it('find all object tracked by the store', () => {
    return Promise.all([
      store.create({ item: 1 }),
      store.create({ item: 2 }),
      store.create({ item: 3 }),
      store.create({ item: 4 }),
      store.create({ item: 5 }),
    ])
      .then((items) => {
        return store.find()
          .then(listOfItems => {
            expect(listOfItems).toHaveLength(5);
            items.forEach(item => expect(listOfItems).toContainEqual(item));
          });
      });
  });

  it('deletes an object with an id', () => {
    return store.create({ item: 'I am going to delete' })
      .then(createdItem => Promise.all([Promise.resolve(createdItem), store.findByIdAndDelete(createdItem._id)]))
      .then(([createdItem, result]) => {
        expect(result).toEqual({ deleted: 1 });
        return createdItem;
      }).then(createdItem => store.findById(createdItem._id))
      .then(foundItem => {
        expect(foundItem).toBeFalsy();
      });

  });

  // it('deletes an object with an id', done => {
  //   store.create({ item: 'I am going to delete' }, (err, createdItem) => {
  //     store.findByIdAndDelete(createdItem._id, (err, result) => {
  //       expect(err).toBeFalsy();
  //       expect(result).toEqual({ deleted: 1 });
  //       store.findById(createdItem._id, (err, foundItem) => {
  //         expect(err).toBeTruthy();
  //         expect(foundItem).toBeFalsy();
  //         done();
  //       });
  //     });
  //   });
  // });

  // it('updates an existing object', done => {
  //   store.create({ name: 'rayn' }, (err, typoCreated) => {
  //     store.findByIdAndUpdate(typoCreated._id, { name: 'ryan' }, (err, updatedWithoutTypo) => {
  //       expect(err).toBeFalsy();
  //       expect(updatedWithoutTypo).toEqual({ name: 'ryan', _id: typoCreated._id });
  //       store.findById(typoCreated._id, (err, foundObj) => {
  //         expect(foundObj).toEqual(updatedWithoutTypo);
  //         done();
  //       });

  //     });
  //   });
  // });
});
