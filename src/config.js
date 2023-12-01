//<!--20060616d Choy Wing Ho-->
//<!--22019343d Siu Ching Him-->
import dotenv from "dotenv";
dotenv.config();
if (!process.env.CONNECTION_STR) {
  console.error('CONNECTION_STR is not defined');
  process.exit(1);
}
export default {
  CONNECTION_STR: process.env.CONNECTION_STR,
};