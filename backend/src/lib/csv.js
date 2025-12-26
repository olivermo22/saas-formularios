export function responsesToCSV(responses) {
  if (!responses.length) return "";

  const headers = responses[0].response_answers.map(
    a => `"${a.form_fields.label}"`
  );

  const rows = responses.map(r =>
    r.response_answers.map(a => `"${a.value || ""}"`).join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

