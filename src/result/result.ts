import { Option } from "../option/option.ts";

export class Result<T, E> {
  // port rust result type
  // link https://doc.rust-lang.org/std/result/enum.Result.html

  value: T | undefined;
  error: E | undefined;

  private constructor(
    {
      value,
      error,
    }: {
      value?: T;
      error?: E;
    },
  ) {
    if (value !== undefined) {
      this.value = value;
    } else if (error !== undefined) {
      this.error = error;
    } else {
      throw new Error("Result must be Ok or Err");
    }
  }
  static Ok<T, E>(value: NonNullable<T>): Result<T, E> {
    return new Result({ value });
  }
  static Err<T, E>(error: NonNullable<E>): Result<T, E> {
    return new Result({ error });
  }
  isOk() {
    return this.value !== undefined;
  }
  isErr() {
    return this.error !== undefined;
  }
  unwrap() {
    if (this.isErr()) {
      throw new Error(
        `Called 'Result.unwrap' on an 'Err' value: '${this.error}'`,
      );
    }
    return this.value!;
  }
  unwrapErr() {
    if (this.isOk()) {
      throw new Error(
        `Called 'Result.unwrapErr' on an 'Ok' value: '${this.value}'`,
      );
    }
    return this.error!;
  }
  expectErr(msg: string) {
    if (this.isOk()) {
      throw new Error(`${msg}: ${this.value}`);
    }
    return this.unwrapErr();
  }
  ok() {
    if (this.isOk()) {
      return Option.Some(this.unwrap());
    } else {
      return Option.None();
    }
  }
  match<U>(
    { ok, err }: {
      ok: (value: NonNullable<T>) => U;
      err: (error: NonNullable<E>) => U;
    },
  ): U {
    if (this.isErr()) {
      return err(this.error!);
    } else {
      return ok(this.value!);
    }
  }
  and<U>(res: Result<U, E>): Result<U, E> {
    return this.match({
      ok: () => res,
      err: (e) => Result.Err(e),
    });
  }
  andThen<U>(f: (value: NonNullable<T>) => Result<U, E>): Result<U, E> {
    return this.match({
      ok: (value) => f(value),
      err: (e) => Result.Err(e),
    });
  }
  or<U>(res: Result<T, U>): Result<T, U> {
    return this.match({
      ok: (value) => Result.Ok(value),
      err: () => res,
    });
  }
  orElse<U>(f: (error: NonNullable<E>) => Result<T, U>): Result<T, U> {
    return this.match({
      ok: (value) => Result.Ok(value),
      err: (e) => f(e),
    });
  }
  unwrapOr(defaultValue: T): T {
    if (this.isOk()) {
      return this.unwrap();
    } else {
      return defaultValue;
    }
  }
  unwrapOrElse(f: (error: NonNullable<E>) => T): T {
    if (this.isOk()) {
      return this.unwrap();
    } else {
      return f(this.unwrapErr());
    }
  }
}
