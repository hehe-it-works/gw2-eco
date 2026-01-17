import pg from "pg";
import { Pool } from "pg";

const pool = new Pool({
  user: 'beetie',
  password: "TheSecretKingdom3319",
  host: "localhost",
  port: 3001,
  database: "db1", 
});

