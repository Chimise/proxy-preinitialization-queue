import { initQueueWrapper } from "./queue.js";
import db from "./db.js";

async function main() {
  const newDb = initQueueWrapper(db, ['query', 'get'], "connected");


  newDb.query("SELECT * from users").catch(err => console.log(err))
  newDb.query("SELECT * from name WHERE users.id = id").catch(err => console.log(err));
  newDb.get('User').catch(err => console.log(err));

  newDb.connect();

}

main().catch((err) => console.log(err));
