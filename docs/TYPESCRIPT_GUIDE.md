# TypeScript Guide

Hướng dẫn sử dụng TypeScript trong dự án Warehouse.

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Type System](#type-system)
- [Interfaces & Types](#interfaces--types)
- [Generics](#generics)
- [Utility Types](#utility-types)
- [Advanced Types](#advanced-types)
- [Best Practices](#best-practices)
- [Resources](#resources)

---

## 🚀 Giới thiệu

TypeScript là một superset của JavaScript, thêm static type checking và các tính năng hiện đại. Dự án Warehouse sử dụng TypeScript cho cả backend (NestJS) và frontend (Nuxt).

### Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  }
}
```

---

## 📝 Type System

### Basic Types

```typescript
// Primitives
const name: string = 'John';
const age: number = 30;
const isActive: boolean = true;
const nothing: null = null;
const notDefined: undefined = undefined;

// Arrays
const numbers: number[] = [1, 2, 3];
const names: Array<string> = ['John', 'Jane'];

// Objects
const user: { name: string; age: number } = {
  name: 'John',
  age: 30,
};
```

### Type Inference

```typescript
// TypeScript tự động infer type
const name = 'John'; // string
const age = 30; // number
const isActive = true; // boolean

// Array inference
const numbers = [1, 2, 3]; // number[]
```

### Union Types

```typescript
type Status = 'pending' | 'approved' | 'rejected';
const status: Status = 'pending';

type ID = string | number;
const userId: ID = '123';
const productId: ID = 456;
```

### Optional & Nullable

```typescript
// Optional property
interface User {
  name: string;
  email?: string; // Optional
}

// Nullable
type MaybeString = string | null;
const value: MaybeString = null;

// Optional chaining
const email = user?.email?.toLowerCase();
```

---

## 🏗️ Interfaces & Types

### Interfaces

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  createdAt: Date;
}

// Extending interfaces
interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

// Implementing interface
class UserService implements User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}
```

### Type Aliases

```typescript
type UserId = string;
type UserRole = 'admin' | 'user' | 'guest';

type User = {
  id: UserId;
  name: string;
  role: UserRole;
};

// Union types
type Status = 'active' | 'inactive' | 'pending';
```

### Differences

```typescript
// Interface - can be extended, merged
interface User {
  name: string;
}
interface User {
  age: number; // Merged
}

// Type - cannot be merged, but more flexible
type User = {
  name: string;
};
// type User = { age: number }; // Error: Duplicate identifier
```

---

## 🔄 Generics

### Basic Generics

```typescript
// Generic function
function identity<T>(arg: T): T {
  return arg;
}

const number = identity<number>(42);
const string = identity<string>('hello');

// Generic interface
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
}

// Generic class
class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User | null> {
    // Implementation
  }
}
```

### Constraints

```typescript
// Generic with constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'John', age: 30 };
const name = getProperty(user, 'name'); // string
const age = getProperty(user, 'age'); // number
```

### Default Generic Parameters

```typescript
interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

const response: ApiResponse<User> = {
  data: user,
  status: 200,
};
```

---

## 🛠️ Utility Types

### Partial

```typescript
interface User {
  name: string;
  email: string;
  age: number;
}

// All properties optional
type PartialUser = Partial<User>;
// { name?: string; email?: string; age?: number; }
```

### Required

```typescript
interface User {
  name?: string;
  email?: string;
}

// All properties required
type RequiredUser = Required<User>;
// { name: string; email: string; }
```

### Pick

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

// Pick specific properties
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: string; name: string; }
```

### Omit

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Omit specific properties
type PublicUser = Omit<User, 'password'>;
// { id: string; name: string; email: string; }
```

### Record

```typescript
// Record<Keys, Type>
type UserRoles = Record<string, 'admin' | 'user'>;
const roles: UserRoles = {
  'user-1': 'admin',
  'user-2': 'user',
};
```

### Readonly

```typescript
interface User {
  name: string;
  email: string;
}

// All properties readonly
type ReadonlyUser = Readonly<User>;
// { readonly name: string; readonly email: string; }
```

### NonNullable

```typescript
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>; // string
```

---

## 🎯 Advanced Types

### Mapped Types

```typescript
// Make all properties optional
type Optional<T> = {
  [P in keyof T]?: T[P];
};

// Make all properties readonly
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

### Conditional Types

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type IsString<T> = T extends string ? true : false;
type A = IsString<string>; // true
type B = IsString<number>; // false
```

### Template Literal Types

```typescript
type EventName = 'click' | 'scroll' | 'mousemove';
type HandlerName = `on${Capitalize<EventName>}`;
// 'onClick' | 'onScroll' | 'onMousemove'
```

### Index Signatures

```typescript
interface StringDictionary {
  [key: string]: string;
}

const dict: StringDictionary = {
  hello: 'world',
  foo: 'bar',
};
```

---

## ✅ Best Practices

### 1. Use Interfaces for Objects

```typescript
// ✅ Good
interface User {
  name: string;
  email: string;
}

// ❌ Avoid
type User = {
  name: string;
  email: string;
};
```

### 2. Use Types for Unions & Intersections

```typescript
// ✅ Good
type Status = 'active' | 'inactive';
type UserWithRole = User & { role: string };

// ❌ Avoid
interface Status {
  value: 'active' | 'inactive';
}
```

### 3. Avoid `any`

```typescript
// ❌ Bad
function processData(data: any) {
  return data.value;
}

// ✅ Good
function processData<T>(data: { value: T }): T {
  return data.value;
}

// ✅ Or use unknown
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: unknown }).value;
  }
  throw new Error('Invalid data');
}
```

### 4. Use Type Guards

```typescript
// Type guard function
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' && obj !== null && 'name' in obj && 'email' in obj
  );
}

// Usage
if (isUser(data)) {
  console.log(data.name); // TypeScript knows it's User
}
```

### 5. Explicit Return Types

```typescript
// ✅ Good
function getUser(id: string): Promise<User | null> {
  return repository.findById(id);
}

// ❌ Avoid
function getUser(id: string) {
  return repository.findById(id);
}
```

### 6. Use Enums Carefully

```typescript
// ✅ Good for constants
enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}

// ✅ Better: Use union types
type UserRole = 'admin' | 'user' | 'guest';
```

### 7. Destructuring with Types

```typescript
interface Config {
  apiUrl: string;
  timeout: number;
}

function createClient({ apiUrl, timeout }: Config) {
  // Implementation
}
```

### 8. Use `const` Assertions

```typescript
// ✅ Good
const statuses = ['active', 'inactive'] as const;
type Status = (typeof statuses)[number]; // 'active' | 'inactive'

// ❌ Avoid
const statuses = ['active', 'inactive']; // string[]
```

---

## 📚 Resources

- [TypeScript Official Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [TypeScript Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

---

## 🔧 Common Patterns

### API Response Types

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
```

### Error Handling

```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await repository.findById(id);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

### Component Props

```typescript
// Vue component
interface Props {
  title: string;
  count?: number;
  items: string[];
}

defineProps<Props>();
```

---

_Last updated: 2025_
