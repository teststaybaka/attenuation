import { POSTS_DATABASE, USERS_DATABASE } from "./spanner_database";

export let USER_TABLE = USERS_DATABASE.table("User");
export let POST_ENTRY_TABLE = POSTS_DATABASE.table("PostEntry");
export let POST_ENTRY_VIEWED_TABLE = POSTS_DATABASE.table("PostEntryViewed");
export let POST_ENTRY_REACTED_TABLE = POSTS_DATABASE.table("PostEntryReacted");
