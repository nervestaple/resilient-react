/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { usePrismTheme } from "@docusaurus/theme-common";
import styles from "./styles.module.css";
import useIsBrowser from "@docusaurus/useIsBrowser";

function LivePreviewLoader() {
  // Is it worth improving/translating?
  return <div>Loading...</div>;
}

function ResultWithHeader() {
  return (
    <>
      {/* https://github.com/facebook/docusaurus/issues/5747 */}
      <div className={styles.playgroundPreview}>
        <BrowserOnly fallback={<LivePreviewLoader />}>
          {() => (
            <>
              <LivePreview />
              <LiveError />
            </>
          )}
        </BrowserOnly>
      </div>
    </>
  );
}

function ThemedLiveEditor() {
  const isBrowser = useIsBrowser();
  return (
    <div style={{ overflowY: "auto", maxHeight: 450, width: "60%" }}>
      <LiveEditor
        // We force remount the editor on hydration,
        // otherwise dark prism theme is not applied
        key={isBrowser}
        className={styles.playgroundEditor}
      />
    </div>
  );
}

function ComponentWithRefresh({ children }) {
  const [mounted, setMounted] = React.useState(true);

  return (
    <div>
      <div style={{ padding: 10 }}>
        <button
          onClick={() => {
            setMounted(false);
            setTimeout(() => setMounted(true), 200);
          }}
        >
          Refresh
        </button>
        <hr />
      </div>
      {mounted && <div>{children}</div>}
    </div>
  );
}

const SubmitContext = React.createContext(null);

function useSubmit() {
  return React.useContext(SubmitContext);
}

function SubmitProvider({ children }) {
  const [result, setResult] = React.useState(null);

  const apiSubmit = React.useCallback((data) => {
    setResult(null);
    return new Promise((resolve) =>
      setTimeout(() => {
        setResult(data);
        resolve();
      }, 400)
    );
  }, []);

  return (
    <div>
      <div>
        <SubmitContext.Provider value={apiSubmit}>
          {children}
        </SubmitContext.Provider>
      </div>
      {result && (
        <>
          <hr />
          <div
            style={{
              padding: 8,
              background: "tomato",
              color: "white",
              borderRadius: 8,
            }}
          >
            Received by API: {JSON.stringify(result)}
          </div>
        </>
      )}
    </div>
  );
}

const users = {
  1: {
    id: 1,
    name: "Jim X. Magoo",
    age: "59",
    favoriteColor: "goldenrod",
    isHungry: true,
    isThirsty: false,
  },
  2: {
    id: 2,
    name: "Lizzy Gorbmacher-Drizzle",
    age: "22",
    favoriteColor: "tomato",
    isHungry: false,
    isThirsty: true,
  },
};

function apiFetchUserDataById(id) {
  return new Promise((resolve) => setTimeout(() => resolve(users[id], 500)));
}

const steps = [Step1, Step2, Step3];
function UserForm({ userData }) {
  const [tab, setTab] = React.useState(0);
  const [formState, setFormState] = React.useState(
    userData || {
      name: null,
      age: 14,
      favoriteColor: null,
      isHungry: false,
      isThirsty: false,
    }
  );

  function handleChange(update) {
    setFormState((oldFormState) => ({ ...oldFormState, ...update }));
  }

  const apiSubmit = useSubmit(); // mocked function for this demo
  async function handleSubmit(e) {
    e.preventDefault();
    await apiSubmit(formState);
  }

  const Step = steps[tab];
  return (
    <form onSubmit={handleSubmit}>
      <div>
        {steps.map((s, i) => (
          <button
            type="button"
            onClick={() => setTab(i)}
            style={{
              margin: 2,
              backgroundColor: i === tab ? "white" : "lightgray",
              fontWeight: i === tab ? "bold" : null,
            }}
          >
            {i + 1}
          </button>
        ))}
        <div>
          <button type="submit">Submit</button>
        </div>
      </div>
      <hr />
      <Step value={formState} onChange={handleChange} />
    </form>
  );
}

function Step1({ value, onChange }) {
  return (
    <div>
      <div>
        Name:{" "}
        <input
          type="text"
          value={value.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>
      <div>
        Age:{" "}
        <input
          type="number"
          value={value.age}
          onChange={(e) => onChange({ name: e.target.age })}
        />
      </div>
    </div>
  );
}

function Step2({ value, onChange }) {
  return (
    <div>
      <div>
        Favorite Color:{" "}
        <input
          type="text"
          value={value.favoriteColor}
          onChange={(e) => onChange({ favoriteColor: e.target.value })}
        />
        <div
          style={{
            width: 100,
            height: 100,
            backgroundColor: value.favoriteColor,
            margin: 4,
          }}
        />
      </div>
    </div>
  );
}

function Step3({ value, onChange }) {
  return (
    <div>
      <div>
        Are you hungry?{" "}
        <input
          type="checkbox"
          checked={value.isHungry}
          onChange={(e) => onChange({ isHungry: e.target.checked })}
        />
      </div>
      <div>
        Are you thirsty?{" "}
        <input
          type="checkbox"
          checked={value.isThirsty}
          onChange={(e) => onChange({ isThirsty: e.target.checked })}
        />
      </div>
    </div>
  );
}

export default function Playground({
  children,
  transformCode,
  scope,
  ...props
}) {
  const prismTheme = usePrismTheme();
  return (
    <div className={styles.playgroundContainer}>
      <LiveProvider
        code={children.replace(/\n$/, "")}
        transformCode={transformCode || ((code) => `${code}`)}
        theme={prismTheme}
        noInline={true}
        scope={{
          ...scope,
          ComponentWithRefresh,
          useSubmit,
          SubmitProvider,
          UserForm,
          apiFetchUserDataById,
        }}
        {...props}
      >
        <ThemedLiveEditor />
        <ResultWithHeader />
      </LiveProvider>
    </div>
  );
}
