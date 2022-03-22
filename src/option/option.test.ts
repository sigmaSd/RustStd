import { Option } from "./option.ts";
import { assertEquals, assertThrows } from "../../dev-deps.ts";

Deno.test("Option.isSome", () => {
  const some = Option.Some(1);
  const none = Option.None();

  assertEquals(some.isSome(), true);
  assertEquals(none.isSome(), false);
});
Deno.test("Option.isNone", () => {
  const some = Option.Some(1);
  const none = Option.None();

  assertEquals(some.isNone(), false);
  assertEquals(none.isNone(), true);
});
Deno.test("Option.expect", () => {
  const some = Option.Some(1);
  const none = Option.None();

  assertEquals(some.expect("error"), 1);
  assertThrows(() => none.expect("error"));
});
Deno.test("Option.unwrap", () => {
  const some = Option.Some(1);
  const none = Option.None();

  assertEquals(some.unwrap(), 1);
  assertThrows(() => none.unwrap());
});
Deno.test("Option.unwrapOr", () => {
  const some = Option.Some(1);
  const none = Option.None();

  assertEquals(some.unwrapOr(2), 1);
  assertEquals(none.unwrapOr(2), 2);
});
Deno.test("Option.unwrapOrElse", () => {
  const some = Option.Some(1);
  const none = Option.None();

  assertEquals(some.unwrapOrElse(() => 2), 1);
  assertEquals(none.unwrapOrElse(() => 2), 2);
});
Deno.test("Option.map", () => {
  const some = Option.Some(1);
  const none = Option.None();

  assertEquals(some.map((x) => x + 1), Option.Some(2));
  assertEquals(none.map((x) => x! as number + 1), none); // the function wont run
});
Deno.test("Option.mapOr", () => {
  const some = Option.Some(1);
  const none = Option.None();

  assertEquals(some.mapOr(0, (x) => x + 1), 2);
  assertEquals(none.mapOr(0, (x) => x! as number + 1), 0);
});
Deno.test("Option.iter", () => {
  const x = Option.Some(4);
  const xIter = x.iter();
  assertEquals(xIter.next().value, 4);
  assertEquals(xIter.next().value, undefined);

  const y = Option.None<number>();
  assertEquals(y.iter().next().value, undefined);
});
Deno.test("Option.and", () => {
  const x = Option.Some(4);
  const y = Option.Some(5);
  const z = Option.None();

  assertEquals(x.and(y), y);
  assertEquals(x.and(z), z);
  assertEquals(z.and(y), z);
});
Deno.test("Option.andThen", () => {
  const x = Option.Some(4);
  const y = Option.Some(16);
  const z = Option.None();

  assertEquals(x.andThen((a) => Option.Some(a * a)), y);
  assertEquals(x.andThen(() => Option.None()), z);
  assertEquals(z.andThen(() => Option.Some(4)), Option.None());
});
Deno.test("Option.filter", () => {
  const x = Option.Some(4);
  const y = Option.None();

  assertEquals(x.filter((a) => a > 3), Option.Some(4));
  assertEquals(x.filter((a) => a > 5), Option.None());
  assertEquals(y.filter(() => false), Option.None());
});
Deno.test("Option.or", () => {
  const x = Option.Some(4);
  const z = Option.Some(4);
  const y = Option.None<number>();

  assertEquals(x.or(y), x);
  assertEquals(y.or(x), x);
  assertEquals(x.or(z), x);
});
Deno.test("Option.orElse", () => {
  const x = Option.Some(4);
  const y = Option.None<number>();

  assertEquals(x.orElse(() => Option.Some(4)), x);
  assertEquals(y.orElse(() => Option.Some(4)), Option.Some(4));
});
Deno.test("Option.xor", () => {
  const x = Option.Some(4);
  const y = Option.Some(5);
  const z = Option.None<number>();

  assertEquals(x.xor(y), Option.None());
  assertEquals(x.xor(z), x);
  assertEquals(y.xor(z), y);
  assertEquals(z.xor(z), Option.None());
  assertEquals(z.xor(y), y);
});
Deno.test("Option.take", () => {
  {
    const x = Option.Some(2);
    const y = x.take();
    assertEquals(x, Option.None());
    assertEquals(y, Option.Some(2));
  }
  {
    const x = Option.None<number>();
    const y = x.take();
    assertEquals(x, Option.None());
    assertEquals(y, Option.None());
  }
});
Deno.test("Option.replace", () => {
  {
    const x = Option.Some(2);
    const old = x.replace(5);
    assertEquals(x, Option.Some(5));
    assertEquals(old, Option.Some(2));
  }
  {
    const x = Option.None<number>();
    const old = x.replace(3);
    assertEquals(x, Option.Some(3));
    assertEquals(old, Option.None());
  }
});
Deno.test("Option.zip", () => {
  const x = Option.Some(1);
  const y = Option.Some("hi");
  const z = Option.None<number>();

  assertEquals(x.zip(y), Option.Some([1, "hi"]));
  assertEquals(x.zip(z), Option.None());
});
Deno.test("Option.flatten", () => {
  const x = Option.Some(Option.Some(1));
  const y = Option.Some(Option.None());
  const z = Option.None<Option<number>>();

  assertEquals(x.flatten(), Option.Some(1));
  assertEquals(y.flatten(), Option.None());
  assertEquals(z.flatten(), Option.None());

  const q = Option.Some(Option.Some(Option.Some(1)));
  assertEquals(q.flatten(), Option.Some(Option.Some(1)));
});
Deno.test("Option.mapOrElse", () => {
  const x = Option.Some(1);
  const y = Option.None();

  assertEquals(x.mapOrElse(() => 0, (a) => a + 1), 2);
  assertEquals(y.mapOrElse(() => 0, () => 5), 0);
});
