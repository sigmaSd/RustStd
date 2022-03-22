import { assertEquals, assertThrows } from "../../dev-deps.ts";
import { Option } from "../option/option.ts";
import { Result } from "./result.ts";

Deno.test("Result.isOk", () => {
  const ok = Result.Ok(4);
  const err = Result.Err("error");
  assertEquals(ok.isOk(), true);
  assertEquals(err.isOk(), false);
});
Deno.test("Result.isErr", () => {
  const ok = Result.Ok(4);
  const err = Result.Err("error");
  assertEquals(ok.isErr(), false);
  assertEquals(err.isErr(), true);
});
Deno.test("Result.unwrap", () => {
  const ok = Result.Ok(4);
  const err = Result.Err("error");
  assertEquals(ok.unwrap(), 4);
  assertThrows(() => err.unwrap());
});
Deno.test("Result.unwrapErr", () => {
  const ok = Result.Ok(4);
  const err = Result.Err("error");
  assertThrows(() => ok.unwrapErr());
  assertEquals(err.unwrapErr(), "error");
});
Deno.test("Result.expectErr", () => {
  const ok = Result.Ok(4);
  const err = Result.Err("error");
  assertThrows(() => ok.expectErr("err!"));
  assertEquals(err.expectErr("err!"), "error");
});
Deno.test("Result.ok", () => {
  const ok = Result.Ok(4);
  const err = Result.Err("error");
  assertEquals(ok.ok(), Option.Some(4));
  assertEquals(err.ok(), Option.None());
});
Deno.test("Result.and", () => {
  const ok: Result<number, string> = Result.Ok(4);
  const ok2: Result<number, string> = Result.Ok(5);
  const err = Result.Err("error");
  assertEquals(ok.and(ok2), ok2);
  assertEquals(ok.and(err), err);
  assertEquals(err.and(ok), err);
});
Deno.test("Result.andThen", () => {
  const ok: Result<number, string> = Result.Ok(4);
  const ok2: Result<number, string> = Result.Ok(5);
  const err = Result.Err("error");
  assertEquals(ok.andThen(() => ok2), ok2);
  assertEquals(ok.andThen(() => err), err);
  assertEquals(err.andThen(() => ok), err);
});
Deno.test("Result.or", () => {
  const ok: Result<number, string> = Result.Ok(4);
  const ok2: Result<number, string> = Result.Ok(5);
  const err: Result<number, string> = Result.Err("error");
  assertEquals(ok.or(ok2), ok);
  assertEquals(ok.or(err), ok);
  assertEquals(err.or(ok), ok);
});
Deno.test("Result.orElse", () => {
  const ok: Result<number, string> = Result.Ok(4);
  const ok2: Result<number, string> = Result.Ok(5);
  const err: Result<number, string> = Result.Err("error");
  assertEquals(ok.orElse(() => ok2), ok);
  assertEquals(ok.orElse(() => err), ok);
  assertEquals(err.orElse(() => ok), ok);
});
Deno.test("Result.unwrapOr", () => {
  const ok: Result<number, string> = Result.Ok(4);
  const err: Result<number, string> = Result.Err("error");
  assertEquals(ok.unwrapOr(5), 4);
  assertEquals(err.unwrapOr(5), 5);
});
Deno.test("Result.unwrapOrElse", () => {
  const ok: Result<number, string> = Result.Ok(4);
  const err: Result<number, string> = Result.Err("error");
  assertEquals(ok.unwrapOrElse(() => 5), 4);
  assertEquals(err.unwrapOrElse(() => 5), 5);
});
