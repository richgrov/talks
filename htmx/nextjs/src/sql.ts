import postgres from "postgres";

export const sql = postgres({
  database: "nooks",
  username: "test",
  password: "password",
});
