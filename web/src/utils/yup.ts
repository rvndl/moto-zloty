import * as yup from "yup";

const notType = ({
  path,
  type,
  value,
  originalValue,
}: {
  path: string;
  type: string;
  value: unknown;
  originalValue: unknown;
}) => {
  const castMsg =
    originalValue != null && originalValue !== value
      ? ` (przekonwertowano z wartości \`${yup.printValue(
          originalValue,
          true
        )}\`).`
      : ".";

  return type !== "mixed"
    ? `${path} musi być typu \`${type}\`, ` +
        `ale ostateczna wartość była: \`${yup.printValue(value, true)}\`` +
        castMsg
    : `${path} musi pasować do skonfigurowanego typu. ` +
        `Zatwierdzona wartość była: \`${yup.printValue(value, true)}\`` +
        castMsg;
};

yup.setLocale({
  mixed: {
    default: "${path} jest nieprawidłowy",
    required: "To pole jest wymagane",
    defined: "${path} musi być zdefiniowany",
    notNull: "${path} nie może być wartością null",
    oneOf: "${path} musi być jedną z następujących wartości: ${values}",
    notOneOf: "${path} nie może być jedną z następujących wartości: ${values}",
    notType,
  },
  string: {
    length: "${path} musi mieć dokładnie ${length} znaków",
    min: "${path} musi mieć co najmniej ${min} znaków",
    max: "${path} może mieć maksymalnie ${max} znaków",
    matches: '${path} musi pasować do następującego wzorca: "${regex}"',
    email: "Wartość musi być prawidłowym adresem e-mail",
    url: "${path} musi być prawidłowym adresem URL",
    uuid: "${path} musi być prawidłowym UUID",
    datetime: "${path} musi być prawidłowym ISO date-time",
    datetime_precision:
      "${path} musi być prawidłowym ISO date-time z precyzją części ułamkowej sekund dokładnie ${precision} cyfr",
    datetime_offset:
      '${path} musi być prawidłowym ISO date-time ze strefą czasową UTC "Z"',
    trim: "${path} musi być obciętym łańcuchem znaków",
    lowercase: "${path} musi być łańcuchem małych liter",
    uppercase: "${path} musi być łańcuchem wielkich liter",
  },
  number: {
    min: "${path} musi być większy lub równy ${min}",
    max: "${path} musi być mniejszy lub równy ${max}",
    lessThan: "${path} musi być mniejszy niż ${less}",
    moreThan: "${path} musi być większy niż ${more}",
    positive: "${path} musi być liczbą dodatnią",
    negative: "${path} musi być liczbą ujemną",
    integer: "${path} musi być liczbą całkowitą",
  },
  date: {
    min: "${path} musi być późniejszy niż ${min}",
    max: "${path} musi być wcześniejszy niż ${max}",
  },
  boolean: {
    isValue: "${path} musi mieć wartość ${value}",
  },
  object: {
    noUnknown: "${path} zawiera nieokreślone klucze: ${unknown}",
  },
  array: {
    min: "${path} musi zawierać co najmniej ${min} elementów",
    max: "${path} może zawierać maksymalnie ${max} elementów",
    length: "${path} musi zawierać ${length} elementów",
  },
  tuple: {
    notType: (params) => {
      const { path, value, spec } = params;
      const typeLen = spec.types.length;
      if (Array.isArray(value)) {
        if (value.length < typeLen)
          return `${path} zawiera zbyt mało elementów, oczekiwano długości ${typeLen}, ale otrzymano ${
            value.length
          } dla wartości: \`${yup.printValue(value, true)}\``;
        if (value.length > typeLen)
          return `${path} zawiera zbyt wiele elementów, oczekiwano długości ${typeLen}, ale otrzymano ${
            value.length
          } dla wartości: \`${yup.printValue(value, true)}\``;
      }

      return yup.ValidationError.formatError(notType, params);
    },
  },
});

export { yup };
