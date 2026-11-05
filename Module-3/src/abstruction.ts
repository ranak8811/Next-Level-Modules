abstract class Employee {
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

  abstract calculatePay(): number;
}

class Manager extends Employee {
  calculatePay() {
    return this.salary + 5000;
  }
}
class Developer extends Employee {
  calculatePay() {
    return this.salary + 3000;
  }
}
