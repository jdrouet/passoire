const {expect} = require('chai');
const Schema = require('../source');

const Subthing = new Schema({
  id: {},
});

const Thing = new Schema({
  id: {},
  data: {array: true, views: ['admin', 'public']},
  subthing: {schema: Subthing, views: ['admin']},
  subthings: {array: true, schema: Subthing, views: ['admin', 'public']},
});

const Account = new Schema({
  id: {},
  password: {views: []},
  adminThings: {array: true, schema: Thing, views: ['admin']},
  publicThings: {array: true, schema: Thing, views: ['admin', 'public']},
});

describe('clean', () => {
  it('should keep everything', () => {
    expect(Account.clean({
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
    expect(Account.clean({
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
});
