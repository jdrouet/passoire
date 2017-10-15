
const {Cleaner, Schema} = require('./source');

const cleaner = new Cleaner();

const Tag = new Schema({
  id: {},
  label: {},
});

const Account = new Schema({
  id: {},
  password: {views: []},
  firstName: {views: ['public', 'user', 'admin']},
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
