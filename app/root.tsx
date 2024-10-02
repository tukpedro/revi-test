import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "@remix-run/react";
import "./tailwind.css";
import { useEffect } from "react";
import nProgress from "nprogress";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
	const transition = useNavigation()
	// nprogress
	useEffect(() => {
		if (transition.state === "loading" || transition.state === "submitting") {
			nProgress.start()
		}
		if (transition.state === "idle") {
			nProgress.done()
		}
	}, [transition.state])
  console.log(transition.state)
  return <Outlet />;
}
