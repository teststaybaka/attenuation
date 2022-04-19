import { Spanner } from "@google-cloud/spanner";

let spanner = new Spanner();
let instance = spanner.instance("tiny-instance");
export let USERS_DATABASE = instance.database("users");
export let POSTS_DATABASE = instance.database("posts");
export let USER_TABLE = USERS_DATABASE.table("User");
export let POST_ENTRY_TABLE = POSTS_DATABASE.table("PostEntry");
export let POST_ENTRY_VIEWED_TABLE = POSTS_DATABASE.table("PostEntryViewed");
export let POST_ENTRY_REACTED_TABLE = POSTS_DATABASE.table("PostEntryReacted");
