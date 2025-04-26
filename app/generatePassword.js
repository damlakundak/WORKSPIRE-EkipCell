const bcrypt = require('bcrypt');

const users = [
  //{ employee_id: 1, password: "sifre1" },
  //{ employee_id: 2, password: "sifre2" },
  //{ employee_id: 3, password: "sifre123" },
  // { employee_id: 4, password: "sifre1234" },
  // { employee_id: 5, password: "sifre12345" },
  // { employee_id: 6, password: "sifre123456" },
 // { employee_id: 7, password: "sifre1234567" }
 { employee_id: 8, password: "sifre12345678" }
];

async function hashPasswords(users) {
  for (let user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    console.log(`UPDATE employees SET password='${hashedPassword}' WHERE employee_id=${user.employee_id};`);
  }
}

hashPasswords(users);
