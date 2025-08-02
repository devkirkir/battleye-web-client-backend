export interface DatabaseAdapter {
  connect(): void;
  selectOne(schema: string, ...args: string[]): unknown;
  selectAll(schema: string, ...args: string[]): unknown;
  insert(schema: string, ...args: string[]): unknown;
  query(schema: string): unknown;
}
