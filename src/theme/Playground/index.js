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
    <div style={{ overflowY: "auto", maxHeight: 500 }}>
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
        scope={{ ...scope, ComponentWithRefresh }}
        {...props}
      >
        <ThemedLiveEditor />
        <ResultWithHeader />
      </LiveProvider>
    </div>
  );
}
