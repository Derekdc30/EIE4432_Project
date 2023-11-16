import fs from 'fs/promises';
import client from './dbclient.js';

const users = client.db('lab5db').collection('user');
const event = client.db('lab5db').collection('event');
async function init_db() {
  try {
    const existingUser = await users.findOne();
    if (!existingUser) {
      const userData = await fs.readFile('user.json', 'utf-8');
      const usersDataArray = JSON.parse(userData);
      const result = await users.insertMany(usersDataArray);
      console.log(`Added ${result.insertedCount} users`);
    }
    const existingEvent = await event.findOne();
    if (!existingEvent) {
      const eventData = await fs.readFile('event.json', 'utf-8');
      const eventsDataArray = JSON.parse(eventData);
      const result = await event.insertMany(eventsDataArray);
      console.log(`Added ${result.insertedCount} event(s) to the database`);
    }
  } catch (err) {
    console.error('Unable to initialize the database:', err);
  }
}
async function validate_user(username, password) {
  await sha256(password).then(hash => {
    password = hash;});
  try {
    if (!username || !password) {
      return false;
    }
    const user = await users.findOne({ username : username,password: password });
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
  await sha256(password).then(hash => {
    password = hash;});
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
    const user = await users.findOne({ username: username });//username:username
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
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);                    
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));             
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

init_db().catch(console.dir);
export {
  init_db,
  users,
  event,
  validate_user,
  update_user,
  fetch_user,
  username_exist
};
