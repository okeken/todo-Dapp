import getContract from "./utils/getContract.js";
import abi from "../abi.js";
import { CONTRACT_ADDRESS } from "../constant.js";

var signer;
async function getTodoList() {
  const contract = getContract();
  // console.log(contract);
  try {
    const response = await contract.getTodos();
    const formatted = response.map((item) => {
      return {
        name: item[0],
        description: item[1],
        status: item[2],
      };
    });
    return formatted;
  } catch (error) {
    console.log("error", error);
  }
}

const upadateTodoUI = async () => {
  const data = await getTodoList();
  console.log(data, "data");
  data.forEach((item) => {
    todos.innerHTML += `   
    <li class='my-2'>${item.description}</li>`;
  });
};

upadateTodoUI();

// add new list

//connect wallet
const connectWallet = async () => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const Signer = provider.getSigner();
    signer = Signer;
    const contract = getContract(Signer, CONTRACT_ADDRESS, abi);
    // console.log(contract);
    console.log("wallet connected");

    return contract;
  } catch (err) {
    console.log(err);
  }
};

const addTodo = async (title, description, e) => {
  try {
    // e.preventDefault();
    connectWallet();
  
    const contract = getContract(true);
    console.log(contract);
    await contract.createTodo(title, description);

    return contract;
  } catch (err) {
    console.log(err);
  }
};

//event listeners
// const addTodos = document.getElementById("addTodos");
// addTodos.addEventListener("click", addTodo);
const field = document.getElementById("formList");
field.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo(formList.input.value, formList.input.value);
});
