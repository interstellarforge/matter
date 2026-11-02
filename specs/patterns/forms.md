# Pattern: forms and validation

Scope: what Pulsar (search profiles, filters, CV data) and Atlas (item panel, settings) need now. Complex multi-step forms are out of scope.

## Structure

- Every field has a visible label (`<label for>`); placeholder is a hint only, never the label.
- Help text sits under the label or field and is linked with `aria-describedby`.
- Required fields are marked in text ("required" via a prop-supplied string), not only with colour or an asterisk.
- Group related fields in `<fieldset>` with `<legend>`.

## Validation

| Moment         | Behaviour                                                                                                       |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| While typing   | No errors for untouched fields. Format hints are allowed.                                                       |
| On blur        | Validate the field once it has been touched; show the error under the field.                                    |
| On submit      | Validate all fields, focus the first invalid field, announce the count of errors in a summary (`role="alert"`). |
| After an error | Revalidate on every change so the error disappears as soon as it is fixed.                                      |

- Error text is linked with `aria-describedby`, the field has `aria-invalid="true"`; the error says what to do ("Enter a salary of at least 0"), not just what is wrong.
- Errors use `--m-danger` plus an icon or text; never colour alone.
- Server errors map to the field when possible, otherwise to the form summary. Input is never cleared on error.
- Submit: the button shows a loading state and is `aria-disabled` (not removed) while pending to avoid double submits.

## Text and i18n

Matter components take all strings (labels, errors, help) through props; the consuming app owns translations (no hardcoded UI text in Matter).

## Acceptance (per implementation)

- [ ] Label, help and error are programmatically associated
- [ ] Errors announced once, focus moves to the first invalid field on submit
- [ ] Works with keyboard only and with `touch` density
