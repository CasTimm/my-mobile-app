import { type PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="nl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#28543d" />
        <meta name="description" content="Ontdek hondenweides in jouw buurt en ontmoet andere hondenbaasjes." />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/pootmaat.svg" type="image/svg+xml" />
        <style>{'#root,body,html{height:100%}body{overflow:hidden}#root{display:flex}'}</style>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
