class Employee {
  name: string;
  salary: number;

  constructor(name: string, salary: number) {
    this.name = name;
    this.salary = salary;
  }
}

const e1 = new Employee("Rana", 10000);
const e2 = new Employee("Anwar", 20000);

console.log(e1 instanceof Employee);

console.log(e1);

console.log(e2 instanceof Employee);
