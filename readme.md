# Passoire

[![CircleCI](https://img.shields.io/circleci/project/jdrouet/passoire.svg?maxAge=2592000)](https://circleci.com/gh/jdrouet/passoire)
[![codecov](https://codecov.io/gh/jdrouet/passoire/branch/master/graph/badge.svg)](https://codecov.io/gh/jdrouet/passoire)
![Dependencies](https://david-dm.org/jdrouet/passoire.svg)

# How to use it

```node
const {Cleaner, Schema} = require('passoire');

const cleaner = new Cleaner();

const Tag = new Schema({
  id: {},
  label: {},
});

const Account = new Schema({
  id: {},
  password: {views: []},
  firstName: {
    views: ['public', 'user', 'admin'],
    transform: (value) => value.toLowerCase(),
  },
  lastName: {views: ['user', 'admin']},
  email: {views: ['user', 'admin']},
  tags: {array: true, schema: 'tag', views: ['user', 'admin']},
});

const account = {
  id: 1,
  password: 'such a funny password',
  firstName: 'Jean',
  lastName: 'Luc',
  email: 'jean-luc@gmail.com',
  tags: [
    {id: 1, label: 'french'},
    {id: 2, label: 'rider'},
  ],
};

cleaner.register('account', Account);
cleaner.register('tag', Tag);

// eslint-disable-next-line
console.log(cleaner.clean('account', account));
// eslint-disable-next-line
console.log(cleaner.clean('account', account, 'public'));
```

Will output
```node
{ id: 1,
  password: 'such a funny password',
  firstName: 'jean',
  lastName: 'Luc',
  email: 'jean-luc@gmail.com',
  tags: [ { id: 1, label: 'french' }, { id: 2, label: 'rider' } ] }
{ id: 1, firstName: 'jean' }
```
