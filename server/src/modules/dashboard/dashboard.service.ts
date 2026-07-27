import * as repository from "./dashboard.repository";

export async function getDashboard() {
  return repository.getDashboard();
}