import { Spanner } from "@google-cloud/spanner";

let SPANNER = new Spanner();
let INSTANCE = SPANNER.instance("tiny-instance");
export let CORE_DATABASE = INSTANCE.database("core");
