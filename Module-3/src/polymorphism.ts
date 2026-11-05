class Employee {
  constructor(
    public name: string,
    protected _salary: number,
  ) {}

  get salary() {
    return this._salary;
  }

  set salary(newSalary: number) {
    if (newSalary < 0) {
      throw new Error("Salary cannot be negative value");
    }

    this._salary = newSalary;
  }

  calculatePay(taxRate: number) {
    return this.salary - this.salary * taxRate;
  }
}

class Manager extends Employee {
  override calculatePay() {
    return this.salary + 5000;
  }
}

class Developer extends Employee {
  constructor(
    name: string,
    _salary: number,
    public type: string,
  ) {
    super(name, _salary);
  }

  override calculatePay(taxRate: number) {
    return this.salary - this.salary * taxRate;
  }
}

const e1 = new Employee("Rana", 10000);
const e2 = new Manager("Anwar", 20000);
const e3 = new Developer("Anwar", 15000, "Jr. SWE");

console.log(e1.calculatePay(0.1));
console.log(e2.calculatePay());
console.log(e3.calculatePay(0.2));
