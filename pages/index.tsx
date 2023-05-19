import { useEffect, useState } from "react";
import Head from "next/head";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import styles from "@/styles/Home.module.css";
import Select from "react-select";
import type { SingleValue } from "react-select/dist/declarations/src";

import { languageExtensions, languageoptions } from "@/util/languages";
import type { Option } from "@/util/languages";

export default function Home() {
  const [code, setCode] = useState("");
  const [lang, setLang] = useState<Option>({
    value: "javascript",
    label: "javascript",
  });
  const [prediction, setPrediction] = useState("");

  useEffect(() => {
    const cmContent = document.querySelector(".cm-content");
    if (cmContent) {
      const lines = Array.from(cmContent.children);
      const erroredLines =
        prediction.match(/(?<=Line )(\d.)/g)?.map((line) => Number(line) - 1) ??
        [];
      lines.forEach((child, index) => {
        if (erroredLines.includes(index)) {
          child.classList.add("highlight-error");
        } else {
          child.classList.remove("highlight-error");
        }
      });
    }
  }, [prediction]);

  const handleCodeChange = (value: string) => {
    setCode(value);
  };

  const handleLanguageChange = (lang: SingleValue<Option>) => {
    setLang(lang as Option);
  };

  const handlePredict = async () => {
    const {
      data: { data },
    } = await axios.post("/api/predict", {
      code,
      lang: lang.value,
    });
    setPrediction(data);
  };

  const extensions = languageExtensions[lang.value];

  return (
    <>
      <Head>
        <title>Inconsistent Security Checker</title>
        <meta
          name="description"
          content="Attempts to identify and isolate security flaws in code"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Select
          options={languageoptions}
          instanceId="language-select"
          value={lang}
          onChange={handleLanguageChange}
        />
        <CodeMirror
          value={code}
          height="200px"
          width="50vw"
          onChange={handleCodeChange}
          extensions={extensions}
        />
        <button onClick={handlePredict}>Click me</button>
        <h3>{prediction}</h3>
      </main>
    </>
  );
}
