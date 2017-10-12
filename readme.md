# Strainer

[![CircleCI](https://img.shields.io/circleci/project/jdrouet/strainer.svg?maxAge=2592000)](https://circleci.com/gh/jdrouet/strainer)
[![codecov](https://codecov.io/gh/jdrouet/strainer/branch/master/graph/badge.svg)](https://codecov.io/gh/jdrouet/strainer)
![Dependencies](https://david-dm.org/jdrouet/strainer.svg)

# How to use it

```node
const Schema = require('strainer');

const Tag = new Schema({
  id: {},
  label: {},
});

const Account = new Schema({
  id: {},
  password: { views: [] },
  firstName: { views: ['public', 'user', 'admin'] },
  lastName: { views: ['user', 'admin'] },
  email: { views: ['user', 'admin'] },
  tags: { array: true, schema: Tag, views: ['user', 'admin'] }
});

const account = {
  id: 1,
  password: 'such a funny password',
  firstName: 'Jean',
  lastName: 'Luc',
  email: 'jean-luc@gmail.com',
  tags: [
    { id: 1, label: 'french' },
    { id: 2, label: 'rider' },
  ],
};

// Works with a single element
console.log(Account.clean(account));

// Works with an array of elements
console.log(Account.clean([account]));
```

