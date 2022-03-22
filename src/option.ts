export class Option<T> {
  // write all rust option functions
  // link here https://doc.rust-lang.org/std/option/enum.Option.html
  // go go copilot
  constructor(private value: T | undefined) {
    this.value = value;
  }
  static some<T>(value: T): Option<T | undefined> {
    return new Option(value);
  }
  static none<T>(): Option<T | undefined> {
    return new Option(undefined);
  }
  match<U>(
    { some, none }: {
      some: (value: T) => U;
      none: () => U;
    },
  ): U {
    if (this.value === undefined) {
      return none();
    } else {
      return some(this.value);
    }
  }
  and<U>(other: Option<U>): Option<U | undefined> {
    return this.match({
      some: () => other,
      none: () => Option.none(),
    });
  }
  and_then<U>(f: (value: T) => Option<U>): Option<U | undefined> {
    return this.match({
      some: f,
      none: () => Option.none(),
    });
  }
  contains(value: T): boolean {
    return this.value === value;
  }
  expect(message: string): T {
    if (this.value === undefined) {
      throw new Error(message);
    }
    return this.value;
  }
  flatten<U>(this: Option<Option<U>>): Option<U | undefined> {
    return this.match({
      some: (value) => value,
      none: () => Option.none(),
    });
  }
  getOrInsert(value: T): T {
    if (this.isNone()) {
      this.value = value;
    }
    return this.value!; // value is defined
  }
  getOrInsertWith(f: () => T): T {
    if (this.isNone()) {
      this.value = f();
    }
    return this.value!; // value is defined
  }
  take(): Option<T | undefined> {
    if (this.isNone()) {
      return Option.none();
    }
    const value = this.value;
    this.value = undefined;
    return Option.some(value);
  }
  insert(value: T): void {
    this.value = value;
  }
  isNone() {
    return this.value === undefined;
  }
  isSome() {
    return !this.isNone();
  }
  *iter() {
    yield this.value;
  }
  map<U>(f: (value: T) => U): Option<U | undefined> {
    return this.match({
      some: (value) => Option.some(f(value)),
      none: () => Option.none(),
    });
  }
  mapOr<U>(defaultValue: U, f: (value: T) => U): U {
    return this.match({
      some: (value) => f(value),
      none: () => defaultValue,
    });
  }
  mapOrElse<U>(
    defaultValue: () => U,
    f: (value: T) => U,
  ): U {
    return this.match({
      some: (value) => f(value),
      none: defaultValue,
    });
  }
  or(other: Option<T>): Option<T | undefined> {
    return this.match({
      some: () => this,
      none: () => other,
    });
  }
  orElse(f: () => Option<T>): Option<T | undefined> {
    return this.match({
      some: () => this,
      none: f,
    });
  }
  replace(value: T): Option<T | undefined> {
    const oldValue = this.value;
    this.value = value;
    return Option.some(oldValue);
  }
  unwrap(): T {
    if (this.value === undefined) {
      throw new Error("Option.unwrap: None");
    }
    return this.value;
  }
  unwrapOr(value: T): T {
    if (this.isNone()) {
      return value;
    }
    return this.value!; //value is defined
  }
  unwrapOrElse(f: () => T): T {
    if (this.isNone()) {
      return f();
    }
    return this.value!; //value is defined
  }
  xor(other: Option<T>): Option<T | undefined> {
    if (this.isSome() && other.isSome()) {
      return Option.none();
    }
    if (this.isNone() && other.isNone()) {
      return Option.none();
    }
    return this.match({
      some: () => this,
      none: () => other,
    });
  }
}
