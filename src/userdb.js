import fs from 'fs/promises';
import client from './dbclient.js';
const users = client.db('lab5db').collection('user');
async function init_db() {
  try {
    const count = await users.countDocuments();
    if (count === 0) {
      const userData = await fs.readFile('user.json', 'utf-8');
      const usersDataArray = JSON.parse(userData);
      const result = await users.insertMany(usersDataArray);
      console.log(`Added ${result.insertedCount} users`);
    }
  } catch (err) {
    console.error('Unable to initialize the database:', err);
  }
}
async function validate_user(username, password) {
  try {
    if (!username || !password) {
      return false;
    }
    const user = await users.findOne({ username, password });
    if (user) {
      return user;
    } else {
      return false;
    }
  } catch (err) {
    console.error('Unable to fetch from database:', err);
    return false;
  }
}
async function update_user(username, password, nickname, gender,birthday) {
  try {
    const result = await users.updateOne(
      { username },
      { $set: { password, nickname, gender, birthday} },
      { upsert: true }
    );

    if (result.upsertedCount === 1) {
      console.log('Added 1 user');
    } else {
      console.log('Added 0 users');
    }

    return true;
  } catch (err) {
    console.error('Unable to update the database:', err);
    return false;
  }
}
async function fetch_user(username) {
  try {
    const user = await users.findOne({ username });
    return user;
  } catch (err) {
    console.error('Unable to fetch from database:', err);
    return null;
  }
}
async function username_exist(username) {
  try {
    const user = await fetch_user(username);
    return user !== null;
  } catch (err) {
    console.error('Unable to fetch from database:', err);
    return false;
  }
}
init_db().catch(console.dir);
export {
  init_db,
  users,
  validate_user,
  update_user,
  fetch_user,
  username_exist
};
