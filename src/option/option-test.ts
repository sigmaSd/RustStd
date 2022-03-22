import { Option } from "./option.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.130.0/testing/asserts.ts";

Deno.test("Option.isSome", () => {
  const some = Option.some(1);
  const none = Option.none();

  assertEquals(some.isSome(), true);
  assertEquals(none.isSome(), false);
});
Deno.test("Option.isNone", () => {
  const some = Option.some(1);
  const none = Option.none();

  assertEquals(some.isNone(), false);
  assertEquals(none.isNone(), true);
});
Deno.test("Option.expect", () => {
  const some = Option.some(1);
  const none = Option.none();

  assertEquals(some.expect("error"), 1);
  assertThrows(() => none.expect("error"));
});
Deno.test("Option.unwrap", () => {
  const some = Option.some(1);
  const none = Option.none();

  assertEquals(some.unwrap(), 1);
  assertThrows(() => none.unwrap());
});
Deno.test("Option.unwrapOr", () => {
  const some = Option.some(1);
  const none = Option.none();

  assertEquals(some.unwrapOr(2), 1);
  assertEquals(none.unwrapOr(2), 2);
});
Deno.test("Option.unwrapOrElse", () => {
  const some = Option.some(1);
  const none = Option.none();

  assertEquals(some.unwrapOrElse(() => 2), 1);
  assertEquals(none.unwrapOrElse(() => 2), 2);
});
Deno.test("Option.map", () => {
  const some = Option.some(1);
  const none = Option.none();

  assertEquals(some.map((x) => x + 1), Option.some(2));
  assertEquals(none.map((x) => x! as number + 1), none); // the function wont run
});
Deno.test("Option.mapOr", () => {
  const some = Option.some(1);
  const none = Option.none();

  assertEquals(some.mapOr(0, (x) => x + 1), 2);
  assertEquals(none.mapOr(0, (x) => x! as number + 1), 0);
});
Deno.test("Option.iter", () => {
  const x = Option.some(4);
  const xIter = x.iter();
  assertEquals(xIter.next().value, 4);
  assertEquals(xIter.next().value, undefined);

  const y = Option.none<number>();
  assertEquals(y.iter().next().value, undefined);
});
Deno.test("Option.and", () => {
  const x = Option.some(4);
  const y = Option.some(5);
  const z = Option.none();

  assertEquals(x.and(y), y);
  assertEquals(x.and(z), z);
  assertEquals(z.and(y), z);
});
Deno.test("Option.andThen", () => {
  const x = Option.some(4);
  const y = Option.some(16);
  const z = Option.none();

  assertEquals(x.andThen((a) => Option.some(a * a)), y);
  assertEquals(x.andThen(() => Option.none()), z);
  assertEquals(z.andThen(() => Option.some(4)), Option.none());
});
Deno.test("Option.filter", () => {
  const x = Option.some(4);
  const y = Option.none();

  assertEquals(x.filter((a) => a > 3), Option.some(4));
  assertEquals(x.filter((a) => a > 5), Option.none());
  assertEquals(y.filter(() => false), Option.none());
});
Deno.test("Option.or", () => {
  const x = Option.some(4);
  const z = Option.some(4);
  const y = Option.none<number>();

  assertEquals(x.or(y), x);
  assertEquals(y.or(x), x);
  assertEquals(x.or(z), x);
});
Deno.test("Option.orElse", () => {
  const x = Option.some(4);
  const y = Option.none<number>();

  assertEquals(x.orElse(() => Option.some(4)), x);
  assertEquals(y.orElse(() => Option.some(4)), Option.some(4));
});
Deno.test("Option.xor", () => {
  const x = Option.some(4);
  const y = Option.some(5);
  const z = Option.none<number>();

  assertEquals(x.xor(y), Option.none());
  assertEquals(x.xor(z), x);
  assertEquals(y.xor(z), y);
  assertEquals(z.xor(z), Option.none());
  assertEquals(z.xor(y), y);
});
Deno.test("Option.take", () => {
  {
    const x = Option.some(2);
    const y = x.take();
    assertEquals(x, Option.none());
    assertEquals(y, Option.some(2));
  }
  {
    const x = Option.none<number>();
    const y = x.take();
    assertEquals(x, Option.none());
    assertEquals(y, Option.none());
  }
});
Deno.test("Option.replace", () => {
  {
    const x = Option.some(2);
    const old = x.replace(5);
    assertEquals(x, Option.some(5));
    assertEquals(old, Option.some(2));
  }
  {
    const x = Option.none<number>();
    const old = x.replace(3);
    assertEquals(x, Option.some(3));
    assertEquals(old, Option.none());
  }
});
Deno.test("Option.zip", () => {
  const x = Option.some(1);
  const y = Option.some("hi");
  const z = Option.none<number>();

  assertEquals(x.zip(y), Option.some([1, "hi"]));
  assertEquals(x.zip(z), Option.none());
});
Deno.test("Option.flatten", () => {
  const x = Option.some(Option.some(1));
  const y = Option.some(Option.none());
  const z = Option.none<Option<number>>();

  assertEquals(x.flatten(), Option.some(1));
  assertEquals(y.flatten(), Option.none());
  assertEquals(z.flatten(), Option.none());

  const q = Option.some(Option.some(Option.some(1)));
  assertEquals(q.flatten(), Option.some(Option.some(1)));
});
Deno.test("Option.mapOrElse", () => {
  const x = Option.some(1);
  const y = Option.none();

  assertEquals(x.mapOrElse(() => 0, (a) => a + 1), 2);
  assertEquals(y.mapOrElse(() => 0, () => 5), 0);
});
