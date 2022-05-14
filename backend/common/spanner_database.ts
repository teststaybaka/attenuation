import { Spanner } from "@google-cloud/spanner";

let SPANNER = new Spanner();
let INSTANCE = SPANNER.instance("tiny-instance");
export let USERS_DATABASE = INSTANCE.database("users");
export let POSTS_DATABASE = INSTANCE.database("posts");
