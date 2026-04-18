"use client";

import "./globals.css";
import { ClientOnly } from "@/components/ClientOnly";
import { MailProvider } from "@/context/MailContext";
import Layout from "@/components/Layout";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<title>Mailbox</title>
				<meta name="description" content="Modern email client" />
				<link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
			</head>
			<body className="antialiased">
				<ClientOnly>
					<MailProvider>
						<Layout>{children}</Layout>
					</MailProvider>
				</ClientOnly>
			</body>
		</html>
	);
}
