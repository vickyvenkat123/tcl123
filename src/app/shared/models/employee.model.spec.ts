import { Employee } from './employee.model';

describe('Employee.Model', () => {
  it('should create an instance', () => {
    expect(new Employee()).toBeTruthy();
  });
});
