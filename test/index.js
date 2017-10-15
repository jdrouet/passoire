const {expect} = require('chai');
const {Cleaner, Schema} = require('../source');

const cleaner = new Cleaner();

const Subthing = new Schema({
  id: {},
});

const Thing = new Schema({
  id: {},
  data: {array: true, views: ['admin', 'public']},
  subthing: {schema: 'subthing', views: ['admin']},
  subthings: {array: true, schema: 'subthing', views: ['admin', 'public']},
});

const Account = new Schema({
  id: {},
  password: {views: []},
  adminThings: {array: true, schema: 'thing', views: ['admin']},
  publicThings: {array: true, schema: 'thing', views: ['admin', 'public']},
});

cleaner.register('account', Account);
cleaner.register('thing', Thing);
cleaner.register('subthing', Subthing);

describe('clean', () => {
  it('should keep everything', () => {
    expect(cleaner.clean('account', {
      id: 1,
      password: 'password',
      adminThings: [
        {id: 2, data: ['toto'], subthing: {id: 6}},
        {id: 3},
      ],
      publicThings: [{id: 4, subthings: [{id: 7}]}, {id: 5}],
    })).to.eql({
      id: 1,
      password: 'password',
      adminThings: [
        {id: 2, data: ['toto'], subthing: {id: 6}, subthings: []},
        {id: 3, data: [], subthing: null, subthings: []},
      ],
      publicThings: [
        {id: 4, data: [], subthing: null, subthings: [{id: 7}]},
        {id: 5, data: [], subthing: null, subthings: []},
      ],
    });
  });

  it('should keep everything from the public view', () => {
    expect(cleaner.clean('account', {
      id: 1,
      password: 'password',
      publicThings: [{id: 4}, {id: 5}],
    }, 'public')).to.eql({
      id: 1,
      publicThings: [
        {id: 4, data: [], subthings: []},
        {id: 5, data: [], subthings: []},
      ],
    });
  });

  it('should work with an array', () => {
    expect(cleaner.clean('account', [
      {
        id: 1,
        password: 'password',
        publicThings: [{id: 4}, {id: 5}],
      },
      {
        id: 2,
        password: 'password',
        publicThings: [{id: 6}, {id: 7}],
      },
    ], 'public')).to.eql([
      {
        id: 1,
        publicThings: [
          {id: 4, data: [], subthings: []},
          {id: 5, data: [], subthings: []},
        ],
      },
      {
        id: 2,
        publicThings: [
          {id: 6, data: [], subthings: []},
          {id: 7, data: [], subthings: []},
        ],
      },
    ]);
  });
});
