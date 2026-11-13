// Countries offered in the Country / Region select, each with its postal-code format.
// Patterns are matched against the trimmed value and are case-insensitive.
export const countries = [
  {
    code: "SE",
    name: "Sweden",
    pattern: /^\d{3} ?\d{2}$/,
    example: "113 51",
  },
  {
    code: "DE",
    name: "Germany",
    pattern: /^\d{5}$/,
    example: "10115",
  },
  {
    code: "FR",
    name: "France",
    pattern: /^\d{5}$/,
    example: "75008",
  },
  {
    code: "NL",
    name: "Netherlands",
    pattern: /^\d{4} ?[A-Z]{2}$/i,
    example: "1012 AB",
  },
  {
    code: "GB",
    name: "United Kingdom",
    pattern: /^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0AA)$/i,
    example: "SW1A 1AA",
  },
  {
    code: "US",
    name: "United States",
    pattern: /^\d{5}(-\d{4})?$/,
    example: "90210",
  },
];
