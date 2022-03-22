export class Option<T> {
  // write all rust option functions
  // link here https://doc.rust-lang.org/std/option/enum.Option.html
  // go go copilot
  private constructor(private value: T | undefined) {
    this.value = value;
  }
  static Some<T>(value: NonNullable<T>): Option<T | undefined> {
    return new Option(value);
  }
  static None<T>(): Option<T | undefined> {
    return new Option(undefined);
  }
  match<U>(
    { some, none }: {
      some: (value: NonNullable<T>) => U;
      none: () => U;
    },
  ): U {
    if (this.isNone()) {
      return none();
    } else {
      return some(this.value!);
    }
  }
  and<U>(other: Option<U>): Option<U | undefined> {
    return this.match({
      some: () => other,
      none: () => Option.None(),
    });
  }
  andThen<U>(f: (value: NonNullable<T>) => Option<U>): Option<U | undefined> {
    return this.match({
      some: (value) => f(value),
      none: () => Option.None(),
    });
  }
  filter(f: (value: NonNullable<T>) => boolean): Option<T | undefined> {
    return this.match({
      some: (value) => (f(value) ? Option.Some(value!) : Option.None()),
      none: () => Option.None(),
    });
  }
  expect(message: string): T {
    if (this.isNone()) {
      throw new Error(message);
    }
    return this.unwrap();
  }
  flatten<U>(this: Option<Option<U> | undefined>): Option<U | undefined> {
    return this.match({
      some: (value) => value,
      none: () => Option.None(),
    });
  }
  take(): Option<T | undefined> {
    if (this.isNone()) {
      return Option.None();
    }
    const value = this.value;
    this.value = undefined;
    return Option.Some(value!); // value is defined
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
  map<U>(f: (value: NonNullable<T>) => NonNullable<U>): Option<U | undefined> {
    return this.match({
      some: (value) => Option.Some(f(value)),
      none: () => Option.None(),
    });
  }
  mapOr<U>(defaultValue: U, f: (value: NonNullable<T>) => U): U {
    return this.match({
      some: (value) => f(value),
      none: () => defaultValue,
    });
  }
  mapOrElse<U>(
    defaultValueFn: () => U,
    f: (value: NonNullable<T>) => U,
  ): U {
    return this.match({
      some: (value) => f(value!),
      none: defaultValueFn,
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
  replace(value: NonNullable<T>): Option<T | undefined> {
    return this.match({
      some: () => {
        const oldValue = this.value;
        this.value = value;
        return Option.Some(oldValue!); // oldValue is defined
      },
      none: () => {
        this.value = value;
        return Option.None();
      },
    });
  }
  unwrap(): T {
    if (this.isNone()) {
      throw new Error("Option.unwrap: None");
    }
    return this.value!; // value is defined
  }
  unwrapOr(value: T): T {
    if (this.isNone()) {
      return value;
    }
    return this.unwrap();
  }
  unwrapOrElse(f: () => T): T {
    if (this.isNone()) {
      return f();
    }
    return this.unwrap();
  }
  xor(other: Option<T>): Option<T | undefined> {
    if (this.isSome() && other.isSome()) {
      return Option.None();
    }
    if (this.isNone() && other.isNone()) {
      return Option.None();
    }
    return this.match({
      some: () => this,
      none: () => other,
    });
  }
  zip<U>(other: Option<U>): Option<[T, U] | undefined> {
    if (this.isNone() || other.isNone()) {
      return Option.None();
    }
    return Option.Some([this.unwrap(), other.unwrap()]);
  }
}
