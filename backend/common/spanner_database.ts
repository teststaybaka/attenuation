import { Spanner } from "@google-cloud/spanner";

let spanner = new Spanner();
let instance = spanner.instance("tiny-instance");
export let USERS_DATABASE = instance.database("users");
export let POSTS_DATABASE = instance.database("posts");
