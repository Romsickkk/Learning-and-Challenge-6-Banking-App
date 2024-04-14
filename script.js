/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
    <div class="movements__row">
     <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = function (movements) {
  const balance = movements.reduce((previousValue, currentValue) => {
    return previousValue + currentValue;
  }, 0);
  labelBalance.textContent = `${balance} EUR`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((value) => value > 0)
    .reduce((acc, value) => acc + value, 0);
  labelSumIn.textContent = incomes + "€";

  const out = acc.movements
    .filter((value) => value < 0)
    .reduce((acc, value) => acc + value, 0);
  labelSumOut.textContent = Math.abs(out) + "€";

  const interest = acc.movements
    .filter((value) => value > 0)
    .map((value) => (value * acc.interestRate) / 100)
    .filter((value) => {
      // console.log(array);
      return value >= 1;
    })
    .reduce((acc, value) => acc + value, 0);
  labelSumInterest.textContent = interest + "€";
};

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  //Display Balance
  calcDisplayBalance(acc.movements);

  //Display summary
  calcDisplaySummary(acc);
};

const createUsernames = (accounts) => {
  accounts.forEach((acc) => {
    acc.username = acc.owner
      .split(" ")
      .map((value) => value[0])
      .join("")
      .toLocaleLowerCase();
  });
};
createUsernames(accounts);

//Event hendlers
let currentAccount;

btnLogin.addEventListener("click", function (e) {
  //Prevent form rom submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message

    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    containerApp.style.opacity = 100;

    // Clear fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    //Add movement
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
    inputLoanAmount.value = "";
  }
});

// My version

btnTransfer.addEventListener("click", function (e) {
  const transferName = inputTransferTo.value;
  e.preventDefault();
  const isAccount =
    accounts.find((element) => element.username === transferName) &&
    transferName != currentAccount.username;
  const enoughMoney =
    inputTransferAmount.value <=
      currentAccount.movements.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0
      ) && inputTransferAmount.value != 0;
  // (isAccount && enoughMoney) || console.log("all ok");

  if (isAccount && enoughMoney) {
    currentAccount.movements.push(Number(-Math.abs(inputTransferAmount.value)));

    // Give money to push in array
    const transferTo = accounts.find(
      (value) => value.username === transferName
    );

    transferTo.movements.push(Number(inputTransferAmount.value));
    inputLoginUsername.value = inputLoginPin.value = "";
    updateUI(currentAccount);
  } else {
    console.error("ERROR");
  }
});

// Sort

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// Learning version
// btnTransfer.addEventListener("click", function (e) {
//   e.preventDefault();
//   const amount = Number(inputTransferAmount.value);
//   const receiverAcc = accounts.find(
//     (acc) => acc.username === inputTransferTo.value
//   );
//   inputTransferAmount.value = inputTransferTo.value = "";

//   if (
//     amount > 0 &&
//     receiverAcc &&
//     currentAccount.balance >= amount &&
//     receiverAcc?.username !== currentAccount.username
//   ) {
//     // Doing the transfer
//     currentAccount.movements.push(-amount);
//     receiverAcc.movements.push(amount);
//     console.log("perevod");
//     // Update UI
//     updateUI(currentAccount);
//   }
// });

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const i = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    // Delete account from arr
    accounts.splice(i, 1);

    console.log(accounts);
    //Hide ui
    containerApp.style.opacity = 0;
  }
  inputLoginUsername.value = inputLoginPin.value = "";
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// //SLICE
// let arr = ["a", "b", "c", "d", "e"];
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(1, -2));
// console.log(...arr);

// //SPLICE
// // console.log(arr.splice(2));
// arr.splice(-1);
// console.log(arr);
// arr.splice(1, 2);
// console.log(arr);

// // REVERS

// arr = ["a", "b", "c", "d", "e"];
// const arr2 = ["j", "i", "h", "g", "f"];
// console.log(arr2.reverse());
// console.log(arr2);

// //CONCAT
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// //JOIN

// console.log(letters.join(" - "));

//////////////////////////////////////////////////
//
// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));

// // getting last array element
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

// console.log("roman".at(0));
// console.log("roman".at(-1));

//////////////////////////////////////////////////
//

// // for (const movement of movements)

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log("---- OREACH ----");
// movements.forEach(function (movement, index, array) {
//   if (movement > 0) {
//     console.log(`Movement ${index + 1}: You deposited ${movement}`, 1);
//   } else {
//     console.log(`Movement ${index + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// });

//0: function(200)
//1: function(450)
//2: function(400)
// ...
////////////////////////////////////////////////////

// const currencies = new Map([
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"],
// ]);

// currencies.forEach(function (value, key, array) {
//   console.log(`${key} : ${value}`);
// });

// //SET
// const currenciesUniqu = new Set(["USD", "GBP", "EUR"]);
// console.log(currenciesUniqu);
// currenciesUniqu.forEach(function (value, key, array) {
//   console.log(`${key} : ${value} : ${array}`);
// });
/////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
// MAP

// const eurToUSD = 1.1;
// const movementsUSD = movements.map((mov) => mov * eurToUSD);
// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];
// for (const mov of movements) {
//   movementsUSDfor.push(mov * eurToUSD);
// }
// console.log(movementsUSDfor);

// const moovmentsDescriptions = movements
//   .map((mov, i, arr) =>
//     mov > 0
//       ? `Movement ${i + 1}: You deposited ${mov}`
//       : `Movement ${i + 1}: You withdrew ${Math.abs(mov)}`
//   )
//   .join(",")
//   .replaceAll(",", "\n");

// console.log(moovmentsDescriptions);

///////////////////////////////////////////////
// // Filter

// const deposits = movements.filter((mov) => mov > 0);
// console.log(deposits);

// const withdrawal = movements.filter((value) => value < 0);
// console.log(withdrawal);
///////////////////////////////////////////////
// Reduce

//accumulator -> SNOWBALL
// const balance = movements.reduce((acc, cur, i, array) => {
//   // console.log(acc);
//   // console.log(cur);
//   console.log(`itaration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);
// console.log(balance);

// const balance = movements.reduce((acc, cur) => acc + cur, 0);
// console.log(balance);
// let balance2 = 0;
// for (const mov of movements) {
//   balance2 += mov;
// }
// console.log(balance2);

// Maximum value
// const maxValue = movements.reduce(
//   (acc, cur) => (acc < cur ? cur : acc),
//   movements[0]
// );
// console.log(maxValue);
////////////////////////////////////////////////////////////////////////////////////////////////////
// Chain
// const euroToUSD = 1.1;
// console.log(movements);

// //PIPELINE
// const totalDipositUSD = movements
//   .filter((mov) => mov < 0)
//   // .map((mov,i,arr) => mov * euroToUSD)
//   .map((mov, i, arr) => {
//     console.log(arr);
//     return mov * euroToUSD;
//   })
//   .reduce((acum, mov) => acum + mov, 0);
// console.log(totalDipositUSD);

//////////////////////////////////////
// const furstWutgdrawl = movements.find((mov) => mov < 0);
// console.log(furstWutgdrawl);

// console.log(accounts);
// const account = accounts.find((acc) => acc.owner === "Jessica Davis");
// // const accountForOf = function (acc) {
// //   for (const key of acc) {
// //     if (key.owner === "Jessica Davis") {
// //       return key;
// //     }
// //   }
// // };
// // console.log(accountForOf(accounts));
// console.log(account);
//////////////////////////////////////////////////////////////////////////////////////////////////
// SOME AND AVERY

// console.log(movements);

// //EQUALITY
// console.log(movements.includes(-130));

// //SOME: CONDITION
// console.log(movements.some((move) => move === -130));

// const anyDeposits = movements.some((mov) => mov > 2999);
// console.log(anyDeposits);

// //EVERY
// console.log(
//   movements.every((mov) => {
//     mov > 0;
//   })
// );

// //Seperate callback
// const deposit = (mov) => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));
//////////////////////////////////////////////////////////////////////////////////////////////////
// flat and flatMap

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// const myName = ["R", ["o"], ["m"], "a"];
// console.log(arr.flat());
// console.log(myName.flat());

// const arrDeep = [[[1, [2]], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(3));

// const accountMovements = accounts.map((acc) => acc.movements);
// console.log(accountMovements);
// const allMovments = accountMovements.flat();
// console.log(allMovments);

// const overalBalance = allMovments.reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

// const overalBalance2 = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance2);
//////////////////////////////////////////////////////////////////////
// Sorging arrays
// const owners = ["Jonas", "Zacj", "Adam", "Marta"];
// console.log(owners.sort());
// console.log(owners);

// Numbers

// console.log(movements.sort());

//return < 0, A, B (keep order)
//return > 0, B, A (switch order)
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (b > a) return -1;
// });
// movements.sort((a, b) => {
//   return a - b;
// });
// console.log(movements);
//////////////////////////////////////////////////////////////////////
// Fill method
// console.log([1, 2, 3, 4, 5, 6, 7]);
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// const x = new Array(7);
// const a = [1, 2, 3, 4, 5, 6, 7];
// // console.log(x);
// // console.log(x.map(() => 5));
// // x.fill(1);
// x.fill(1, 0, 5);
// a.fill(1, 2, 6);
// console.log(x);
// // console.log(a);

// //Arr.from
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// const randomArr = Array.from({ length: 100 }, (a, b) => 100 - b);
// console.log(randomArr);

// labelBalance.addEventListener("click", function () {
//   const movementUI = Array.from(
//     document.querySelectorAll(".movements__value"),
//     (el) => Number(el.textContent.replace("€", ""))
//   );
//   console.log(movementUI);
//   const movementUI2 = [...document.querySelectorAll(".movements__value")];
//   console.log(movementUI2);
// });

//////////////////////////////////////////////////////////////////////
// Array Methods Practice

// // 1.
// const bankDepositSum = accounts
//   .flatMap((acc) => acc.movements)
//   .filter((value) => value > 0)
//   .reduce((acc, summ) => acc + summ, 0);
// console.log(bankDepositSum);

// // 2.
// // const numDeposits1000 = accounts
// //   .flatMap((acc) => acc.movements)
// //   .filter((value) => value >= 1000).length;
// // console.log(numDeposits1000);

// const numDeposits1000 = accounts
//   .flatMap((acc) => acc.movements)
//   // .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
//   .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
// console.log(numDeposits1000);

// // Prefix ++ operator
// let a = 10;
// console.log(++a);

// // 3.

// const { deposits, withdrawls } = accounts
//   .flatMap((acc) => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       // cur > 0 ? (sums.deposits += cur) : (sums.withdrawls += cur);
//       sums[cur > 0 ? "deposits" : "withdrawls"] += cur;
//       return sums;
//     },
//     { deposits: 0, withdrawls: 0 }
//   );
// console.log(deposits, withdrawls);

// // 4.
// // this is a nice title -> Tis Is a Nice Title

// const convertToCapital = function (word) {
//   const capitzalize = (str) => str[0].toUpperCase() + str.slice(1);
//   const exceptions = ["a", "an", "the", "but", "or", "on", "in", "with"];

//   const capital = word
//     .toLowerCase()
//     .split(" ")
//     .map((word) => (exceptions.includes(word) ? word : capitzalize(word)))
//     .join(" ");
//   console.log(capital);
//   return capital;
// };
// convertToCapital("this is a nice title");
// convertToCapital("this is a LONG title but not too long");
// convertToCapital("and here is another title with an EXAMPLE");

// const convertTitleCase = function (title) {
//   const capitzalize = (str) => str[0].toUpperCase() + str.slice(1);

//   const exceptions = ["a", "an", "and", "the", "but", "or", "on", "in", "with"];

//   const titleCase = title
//     .toLowerCase()
//     .split(" ")
//     .map((word) => (exceptions.includes(word) ? word : capitzalize(word)))
//     .join(" ");

//   return capitzalize(titleCase);
// };

// console.log(convertTitleCase("this is a nice title"));
// console.log(convertTitleCase("this is a LONG title but not too long"));
// console.log(convertTitleCase("and here is another title with an EXAMPLE"));

//////////////////////////////////////////////////////////////////////
//=================================================== Challenge #1 =====================================
/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// function correctArray(juliaDogs, kateDogs) {
//   juliaDogs.splice(0, 1);
//   juliaDogs.splice(2);
//   const all = juliaDogs.concat(kateDogs);
//   console.log(all);

//   all.forEach((dog, index) => {
//     if (dog > 3) {
//       console.log(
//         `Dog number ${index + 1} is an adult, and is ${dog} years old`
//       );
//     } else {
//       console.log(`Dog number ${index + 1} is still a puppy 🐶`);
//     }
//   });
// }

// correctArray([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

//////////////////////////////////////////////////////////////////////
//=================================================== Challenge #2 =====================================
/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = function (arr) {
//   const dogHumanAge = arr
//     .map(function (value) {
//       if (value <= 2) {
//         return 2 * value;
//       } else {
//         return 16 + value * 4;
//       }
//     })
//     .filter((age) => {
//       return age > 18;
//     });
//   console.log(
//     `The average human age will be ${Math.floor(
//       dogHumanAge.reduce((acc, val) => {
//         return acc + val;
//       }, 0) / dogHumanAge.length
//     )} `
//   );
//   return dogHumanAge;
// };
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

//////////////////////////////////////////////////////////////////////
//=================================================== Challenge #3 =====================================
/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
// const calcAverageHumanAge = (arr) =>
//   arr
//     .map((value) => (value <= 2 ? 2 * value : 16 + value * 4))
//     .filter((age) => age >= 18)
//     .reduce((acc, val, i, arr) => acc + val / arr.length, 0);

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

//////////////////////////////////////////////////////////////////////
//=================================================== Challenge #4 =====================================

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

GOOD LUCK 😀
*/
const dogs = [
  { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
  { weight: 8, curFood: 200, owners: ["Matilda"] },
  { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
  { weight: 32, curFood: 340, owners: ["Michael"] },
];

dogs.map(
  (value, i) => (value.recomendedFood = Math.floor(value.weight ** 0.75 * 28))
);

const findSaraDog = function (arr) {
  const sarahDog = arr.find((value) =>
    value.owners.find((value) => value === "Sarah")
  );
  if (sarahDog.curFood > sarahDog.recomendedFood) {
    console.log("Sarah's dog eating more ten need");
  } else if (sarahDog.curFood < sarahDog.recomendedFood) {
    console.log("Sarah's dog eating little ten need");
  } else {
    ("its balanced");
  }
};

// const ownersEatTooMuch = dogs.filter(
//   (value) => value.curFood > value.recomendedFood
// );
// const ownersEatTooLittle = dogs.filter(
//   (value) => value.curFood < value.recomendedFood
// );

const [ownersEatTooMuch, ownersEatTooLittle] = [
  dogs
    .filter((value) => value.curFood > value.recomendedFood)
    .map((value) => value.owners),
  dogs
    .filter((value) => value.curFood < value.recomendedFood)
    .map((value) => value.owners),
];

console.log(
  `${ownersEatTooMuch
    .map((value) => value.join(" and "))
    .join(" and ")}'s dogs eat too much! and ${ownersEatTooLittle
    .map((value) => value.join(" and "))
    .join(" and ")}'s dogs eat too little!`
);

console.log(dogs.some((dog) => dog.curFood === dog.recomendedFood));

const [...dogsIsok] = dogs.map(
  (value) =>
    value.curFood >= value.recomendedFood * 0.9 &&
    value.curFood <= value.recomendedFood * 1.1
);

const [...dogsEatingOkay] = dogsIsok.map((value, i, array) => {
  if (value === true) return dogs[i];
});
//console.log(dogs.some(dogsIsok))

const copy = dogs.sort((a, b) => {
  return a.curFood - b.curFood;
});
console.log(dogsEatingOkay);
console.log(copy);
console.log(dogs);
