import { find } from "./database/repository/keystoreRepo";
import { connectDB } from "./database/index";
connectDB().then(() => {
  const keystore = find(
    1,
    "a3aa9216c08006a029cc092da35e25110b3827f138bb12b5c96623d8ce6a16538eeaf8e2439f69d599d723cf89fa51281e21b64c3969cd04209c52df753feec7",
  ).then((data) => {
    console.log(data);
  });
});
