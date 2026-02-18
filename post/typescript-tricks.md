# Advanced TypeScript: Utility Types

TypeScript utility types provide powerful ways to transform existing types into new ones, ensuring better code reuse and type safety.

## Core Utilities

### 1. Partial<T>
Constructs a type with all properties of T set to optional.
```typescript
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}
```

### 2. Pick<T, K>
Constructs a type by picking the set of properties K from T.
```typescript
type TodoPreview = Pick<Todo, "title">;
```

### 3. Omit<T, K>
The opposite of Pick; removes keys K from T.

Mastering these transforms your codebase from "repetitive" to "architectural".