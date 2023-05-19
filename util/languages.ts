import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { php } from "@codemirror/lang-php";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";

export const languageExtensions = {
  cpp: [cpp()],
  java: [java()],
  javascript: [javascript({ jsx: true, typescript: true })],
  php: [php()],
  python: [python()],
  rust: [rust()],
  sql: [sql()],
};

type Lang = keyof typeof languageExtensions;

export interface Option {
  value: Lang;
  label: Lang;
}

export const languageoptions = Object.keys(languageExtensions).map<Option>(
  (lang) => ({
    value: lang as Lang,
    label: lang as Lang,
  })
);
