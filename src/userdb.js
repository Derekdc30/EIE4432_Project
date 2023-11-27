import fs from 'fs/promises';
import client from './dbclient.js';
import { GridFSBucket, ObjectId } from 'mongodb';
import { Readable } from 'stream';

const users = client.db('lab5db').collection('user');
const event = client.db('lab5db').collection('event');
const tokens = client.db('lab5db').collection('token');
const transaction = client.db('lab5db').collection('transaction');
const gridFSBucket = new GridFSBucket(client.db('lab5db'));
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
    const existingToken = await tokens.findOne();
    if (!existingToken) {
      const tokenData = await fs.readFile('token.json', 'utf-8');
      const tokenDataArray = JSON.parse(tokenData);
      const result = await tokens.insertMany(tokenDataArray);
      console.log(`Added ${result.insertedCount} token(s) to the database`);
    }
    const existingTransaction = await transaction.findOne();
    if (!existingTransaction) {
      const transactionData = await fs.readFile('token.json', 'utf-8');
      const transactionDataArray = JSON.parse(transactionData);
      const result = await transaction.insertMany(transactionDataArray);
      console.log(`Added ${result.insertedCount} token(s) to the database`);
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
async function update_user(username, password, nickname, gender, birthday, profileImage) {
  const user = await users.findOne({ username : username })
  var temp;
  if(user){
    await sha256(password).then(hash => {
        temp = hash;
      });
    if(user.password != temp){
      password = temp;
    }
    else{
      password = user.password;
    }
  }else{
    await sha256(password).then(hash => {
        password = hash;
      });
  }
  

  try {
    const result = await users.updateOne(
      { username },
      { $set: { password, nickname, gender, birthday } },
      { upsert: true }
    );

    if (result.upsertedCount === 1) {
      console.log('Added 1 user');
    } else {
      console.log('Added 0 users');
    }

    // Handle image upload using GridFS
    if (profileImage) {
      const readableStream = Readable.from(profileImage.buffer);
      const uploadStream = gridFSBucket.openUploadStream(username);
      readableStream.pipe(uploadStream);
      const fileId = uploadStream.id;
      await users.updateOne({ username }, { $set: { profileImageId: fileId } });
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
async function update_event(eventName, bookedSeats) {
  try {
    const result = await event.updateOne(
      { eventname: eventName },
      { $set: { BookedSeat: bookedSeats } }
    );
    if (result.matchedCount === 1) {
      console.log('Updated seat occupation for event:', eventName);
      return true;
    } else {
      console.log('Event not found:', eventName);
      return false;
    }
  } catch (error) {
    console.error('Unable to update the database:', error);
    return false;
  }
}
async function validate_token(token) {
  try {
    const tempuser = await tokens.findOne({ token: token });
    if (tempuser) {
      const user = await users.findOne({ username: tempuser.username });
      if (user) {
        return user;
      } else {
        console.log('User not found for token:', token);
        return false;
      }
    } else {
      console.log('Token not found:', token);
      return false;
    }
  } catch (err) {
    console.error('Unable to fetch from database:', err);
    return false;
  }
}
async function update_token(username, token, password) {
  await sha256(password).then((hash) => {
    password = hash;
  });
  try {
    const result = await tokens.updateOne(
      { username: username },
      { $set: { password, token } },
      { upsert: true }
    );

    if (result.upsertedCount === 1) {
      console.log('Added/Updated token for user:', username);
      return true;
    } else {
      console.log('User not found:', username);
      return false;
    }
  } catch (error) {
    console.error('Unable to update the token:', error);
    return false;
  }
}
async function updatePassword(username, newPassword) {
  await sha256(newPassword).then(hash => {
    newPassword = hash;});
  try {
    const result = await users.updateOne(
      { username },
      { $set: {password:newPassword} },
      { upsert: false }
    );
    return true;
  } catch (err) {
    console.error('Unable to update the database:', err);
    return false;
  }
}
async function forgotPassword(username, birthday, nickname, newPassword) {
  try {
    // Fetch user data based on the provided username
    const userData = await fetch_user(username);

    // Check if the provided security answer matches the stored answer
    if (userData && userData.birthday === birthday && userData.nickname === nickname) {
      // Update the user's password with the new password
      await updatePassword(username,newPassword);
      return { status: 'success', message: 'Password reset successfully' };
    } else {
      return { status: 'error', message: 'Invalid security answer' };
    }
  } catch (error) {
    console.error('Error during password reset:', error);
    return { status: 'error', message: 'An error occurred during password reset' };
  }
}
async function update_transaction(username,date,eventname,price,seat){
  try {
    const result = await transaction.insertOne(
      { username },
      { $set: { eventname, date, price, seat } },
    );

    if (result.insertedCount === 1) {
      console.log('Added 1 transaction');
    } else {
      console.log('Added 0 transaction');
    }
    return true;
  } catch (err) {
    console.error('Unable to update the database:', err);
    return false;
  }
}
async function fetch_transaction(username) {
  try {
    const transactions = await transaction.find({ username: username }).toArray();
    return transactions;
  } catch (err) {
    console.error('Unable to fetch transactions from the database:', err);
    return null;
  }
}

init_db().catch(console.dir);
export {
  init_db,
  users,
  event,
  tokens,
  validate_user,
  update_user,
  fetch_user,
  username_exist,
  update_event,
  update_token,
  validate_token,
  forgotPassword,
  gridFSBucket,
  update_transaction,
  fetch_transaction
};
