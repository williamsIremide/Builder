import { ExpenseCategory } from "./category";
import { Branch } from "./store";
import { BranchAgent } from "./agent";
import {
  MoneyMinorOrPercentScaledField,
  DefaultFields,
  Iso8601DateTimeFormat,
  Periodicity,
} from "../utilTypes";

// Interface for the Expense
export interface Expense extends DefaultFields {
  id: number; // Assuming Django auto-increments the primary key
  name: string; // CharField for the name
  categories?: ExpenseCategory[]; // ForeignKey reference to ExpenseCategory, optional
  created_by?: Branch | null; // Optional ForeignKey reference to Branch for the creator
  average_amount: MoneyMinorOrPercentScaledField;
  ideal_periodicity: Periodicity;

  // Additional computed properties can be added here if necessary
}

// Interface for StoreExpense
export interface StoreBranchExpense extends DefaultFields {
  expense: Expense; // ForeignKey reference to Expense
  branch: Branch; // ForeignKey reference to Branch
  amount: MoneyMinorOrPercentScaledField; // for the amount
  due_date: Iso8601DateTimeFormat; // DateField for the due date
  periodicity: Periodicity;
  // Additional computed properties can be added here if necessary
}

// Interface for EmployeeExpense
export interface EmployeeExpense extends Expense {
  employee: BranchAgent; // ForeignKey reference to StoreEmployee

  // Additional computed properties can be added here if necessary
}
