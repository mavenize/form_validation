import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  validateEmail,
  validateCountry,
  validatePostalCode,
  validatePassword,
  validateConfirmPassword,
  validateField,
  fieldValidators,
} from "../src/validation/validators.js";
import { fields, messages, passwordRules } from "../src/data/form.js";
import { countries } from "../src/data/countries.js";

describe("validateEmail", () => {
  it("asks for an email when empty or blank", () => {
    assert.equal(validateEmail(""), messages.email.required);
    assert.equal(validateEmail("   "), messages.email.required);
  });

  for (const value of [
    "a",
    "a@",
    "a@b",
    "a@b.",
    "a@b.c",
    "@b.se",
    "a @b.se",
    "a@@b.se",
  ]) {
    it(`rejects ${JSON.stringify(value)}`, () => {
      assert.equal(validateEmail(value), messages.email.invalid);
    });
  }

  for (const value of [
    "a@b.se",
    "first.last+tag@sub.example.co.uk",
    " name@example.com ",
  ]) {
    it(`accepts ${JSON.stringify(value)}`, () => {
      assert.equal(validateEmail(value), "");
    });
  }
});

describe("validateCountry", () => {
  it("asks for a country when none is chosen", () => {
    assert.equal(validateCountry(""), messages.country.required);
  });

  it("rejects a code that is not in the list", () => {
    assert.equal(validateCountry("XX"), messages.country.required);
  });

  for (const { code } of countries) {
    it(`accepts ${code}`, () => {
      assert.equal(validateCountry(code), "");
    });
  }
});

describe("validatePostalCode", () => {
  it("asks for a postal code when empty, even without a country", () => {
    assert.equal(validatePostalCode("", ""), messages.postalCode.required);
    assert.equal(validatePostalCode("  ", "SE"), messages.postalCode.required);
  });

  it("asks for a country first when none is chosen", () => {
    assert.equal(
      validatePostalCode("11351", ""),
      messages.postalCode.noCountry,
    );
  });

  const samples = {
    SE: {
      valid: ["113 51", "11351", " 113 51 "],
      invalid: ["1135", "113 5A", "12 345", "113  51"],
    },
    DE: { valid: ["10115"], invalid: ["1011", "101155", "10 115", "1011A"] },
    FR: { valid: ["75008"], invalid: ["7500", "7500A", "750 08"] },
    NL: {
      valid: ["1012 AB", "1012AB", "1012ab"],
      invalid: ["1012 A", "AB 1012", "10123 AB", "1012"],
    },
    GB: {
      valid: [
        "SW1A 1AA",
        "sw1a1aa",
        "M1 1AE",
        "B33 8TH",
        "CR2 6XH",
        "DN55 1PT",
        "GIR 0AA",
      ],
      invalid: ["SW1A", "SW1A 1A", "12345", "SW1A 1AAA"],
    },
    US: {
      valid: ["90210", "90210-1234"],
      invalid: ["9021", "902101", "90210-12", "90210 1234"],
    },
  };

  it("has samples for every country in the list", () => {
    assert.deepEqual(
      Object.keys(samples).sort(),
      countries.map((c) => c.code).sort(),
    );
  });

  for (const country of countries) {
    const { valid, invalid } = samples[country.code];

    it(`${country.code}: accepts its own example ${country.example}`, () => {
      assert.equal(validatePostalCode(country.example, country.code), "");
    });

    for (const value of valid) {
      it(`${country.code}: accepts ${JSON.stringify(value)}`, () => {
        assert.equal(validatePostalCode(value, country.code), "");
      });
    }

    for (const value of invalid) {
      it(`${country.code}: rejects ${JSON.stringify(value)} with the country's example`, () => {
        assert.equal(
          validatePostalCode(value, country.code),
          messages.postalCode.invalid(country.name, country.example),
        );
      });
    }
  }

  it("re-judges the same code when the country changes", () => {
    assert.equal(validatePostalCode("113 51", "SE"), "");
    assert.notEqual(validatePostalCode("113 51", "US"), "");
  });
});

describe("validatePassword", () => {
  it("asks for a password when empty", () => {
    assert.equal(validatePassword(""), messages.password.required);
  });

  it(`rejects fewer than ${passwordRules.minLength} characters`, () => {
    assert.equal(
      validatePassword("Abc1234"),
      messages.password.tooShort(passwordRules.minLength),
    );
  });

  it("rejects a password without an uppercase letter", () => {
    assert.equal(validatePassword("abcdefg1"), messages.password.noUppercase);
  });

  it("rejects a password without a lowercase letter", () => {
    assert.equal(validatePassword("ABCDEFG1"), messages.password.noLowercase);
  });

  it("rejects a password without a number", () => {
    assert.equal(validatePassword("Abcdefgh"), messages.password.noDigit);
  });

  it("reports the first failing rule only", () => {
    assert.equal(
      validatePassword("abc"),
      messages.password.tooShort(passwordRules.minLength),
    );
  });

  it("accepts a password that meets every rule", () => {
    assert.equal(validatePassword("Abcdefg1"), "");
    assert.equal(validatePassword("Ångström 2024"), "");
  });

  it("does not trim, so spaces count as characters", () => {
    assert.equal(validatePassword(" Abcde1 "), "");
  });
});

describe("validateConfirmPassword", () => {
  it("asks for confirmation when empty", () => {
    assert.equal(
      validateConfirmPassword("", "Abcdefg1"),
      messages.confirmPassword.required,
    );
  });

  it("rejects a mismatch, including case differences", () => {
    assert.equal(
      validateConfirmPassword("abcdefg1", "Abcdefg1"),
      messages.confirmPassword.mismatch,
    );
  });

  it("accepts a match", () => {
    assert.equal(validateConfirmPassword("Abcdefg1", "Abcdefg1"), "");
  });
});

describe("validateField", () => {
  const valid = {
    email: "a@b.se",
    country: "SE",
    postalCode: "113 51",
    password: "Abcdefg1",
    confirmPassword: "Abcdefg1",
  };

  it("has a validator for every field in the form data", () => {
    assert.deepEqual(
      Object.keys(fieldValidators).sort(),
      Object.keys(fields).sort(),
    );
  });

  it("passes a fully valid form", () => {
    for (const name of Object.keys(fields))
      assert.equal(validateField(name, valid), "");
  });

  it("flags every field of an empty form", () => {
    const empty = Object.fromEntries(
      Object.keys(fields).map((name) => [name, ""]),
    );
    for (const name of Object.keys(fields))
      assert.notEqual(validateField(name, empty), "");
  });

  it("uses the country for the postal code and the password for the confirmation", () => {
    assert.notEqual(
      validateField("postalCode", { ...valid, country: "US" }),
      "",
    );
    assert.equal(
      validateField("confirmPassword", { ...valid, password: "Different1" }),
      messages.confirmPassword.mismatch,
    );
  });
});
