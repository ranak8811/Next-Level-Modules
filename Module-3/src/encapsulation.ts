class Employee {
  constructor(
    public name: string,
    private _salary: number,
  ) {}

  get salary() {
    return this._salary;
  }

  set salary(newSalary: number) {
    this._salary = newSalary;
  }
}

const e1 = new Employee("Rana", 10000);
const e2 = new Employee("Anwar", 20000);

e1.salary = -500;

console.log(e1.salary);
