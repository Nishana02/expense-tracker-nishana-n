const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editId = null;
let expensesCopy = [...expenses];

const onAddTransaction = (event) => {
  event.preventDefault();

  const checkedRadio = document.querySelector('input[name="type"]:checked');
  const userAmount = document.getElementById("amount");
  const userCategory = document.getElementById("category");
  const userDate = document.getElementById("date");
  const userDesc = document.getElementById("description");

  if (checkedRadio == "" ||userAmount.value == "" || userCategory.value == "" ||userDate.value == ""
  ) {
    alert("Please fill out all fields and select a transaction type.");
    return;
  }

  const type = checkedRadio.value;
  const amount = Number(userAmount.value);
  const category = userCategory.value;
  const date = userDate.value;
  const description = userDesc.value;

  if (editId === null) {
    const newExpense = {
      id: Date.now(),
      type,
      amount,
      category,
      date,
      description,
    };
    expenses.push(newExpense);
  } else {
    const index = expenses.findIndex(
      (eachExpense) => eachExpense.id === editId,
    );
    if (index !== -1) {
      expenses[index].type = type;
      expenses[index].amount = amount;
      expenses[index].category = category;
      expenses[index].date = date;
      expenses[index].description = description;
    }

    editId = null;
    document.getElementById("heading").innerHTML = "Add Transaction";
    document.getElementById("submitBtn").innerHTML = "Add Transaction";
  }

  localStorage.setItem("expenses", JSON.stringify(expenses));
  expensesCopy = [...expenses];
  onUpdateTable();

  userAmount.value = "";
  userCategory.value = "";
  userDate.value = "";
  userDesc.value = "";
  checkedRadio.checked = false;

  console.log(expenses);
};

const onUpdateTable = (list = expensesCopy) => {
  let tableBody = document.getElementById("transaction-rows");
  tableBody.innerHTML = "";

  let totalIncome = 0;
  let totalExpense = 0;

  list.forEach((eachExpense, index) => {
    const color = eachExpense.type === "income" ? "green" : "red";

    tableBody.innerHTML += `
    <tr>
      <th scope="row">${index + 1}</th>
      <td>${eachExpense.date}</td>
      <td>${eachExpense.description || "-"}</td>
            <td>${eachExpense.type}</td>
      <td>${eachExpense.category}</td>
      <td style="color: ${color}; font-weight: bold;">Rs. ${eachExpense.amount}</td>
      <td>
        <div style="display: flex; gap: 10px;">
            <button style="background-color: yellow;" onclick="onEditClick(${eachExpense.id})">Edit</button>
            <button style="background-color: red;" onclick="onDeleteClick(${eachExpense.id})">Delete</button>
        </div>
      </td>
    </tr>
    `;
  });

  expenses.forEach((eachExpense) => {
    if (eachExpense.type == "income") {
      totalIncome += eachExpense.amount;
    } else {
      totalExpense += eachExpense.amount;
    }
  });

  document.querySelector(".income-amount").innerText = "Rs. " + totalIncome;
  document.querySelector(".expense-amount").innerText = "Rs. " + totalExpense;
  document.querySelector(".balance-amount").innerText =
    "Rs. " + (totalIncome - totalExpense);
};

const onDeleteClick = (id) => {
  const index = expenses.findIndex((eachExpense) => eachExpense.id === id);
  if (index !== -1) {
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    expensesCopy = [...expenses];
    onUpdateTable();
  }
};

const onEditClick = (id) => {
  document.getElementById("heading").innerHTML = "Edit Transaction";
  document.getElementById("submitBtn").innerHTML = "Update Transaction";

  const expenseId = expenses.findIndex((eachExpense) => eachExpense.id === id);
  if (expenseId === -1) return;

  const editExpense = expenses[expenseId];
  editId = editExpense.id;

  document.getElementById("amount").value = editExpense.amount;
  document.getElementById("category").value = editExpense.category;
  document.getElementById("date").value = editExpense.date;
  document.getElementById("description").value = editExpense.description;

  const radioToCheck = document.querySelector(
    `input[name="type"][value="${editExpense.type}"]`,
  );
  if (radioToCheck) {
    radioToCheck.checked = true;
  }
};
onUpdateTable();
document.getElementById("heading").innerHTML = "Add Transaction";
document.getElementById("submitBtn").innerHTML = "Add Transaction";

const selectedType = document.getElementById("filterType");
const selectedCategory = document.getElementById("filterCategory");

const onFilterChange = () => {
  const typeVal = selectedType ? selectedType.value : "all";
  const catVal = selectedCategory ? selectedCategory.value : "all";

  const filterBy = expensesCopy.filter((eachExpense) => {
    const matchesType = typeVal === "all" || eachExpense.type === typeVal;
    const matchesCategory = catVal === "all" || eachExpense.category === catVal;
    return matchesType && matchesCategory;
  });
  onUpdateTable(filterBy);
};
