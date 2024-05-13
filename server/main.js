import "dotenv/config";
import { web } from "./application/web.js";

web.listen(process.env.PORT, () => {
    console.log("running on port " + process.env.PORT);
});
