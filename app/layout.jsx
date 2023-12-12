import Head from "next/head";
import "../styles/globals.css";
import Provider from "./wagmiProvider/providers";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={spaceGrotesk.className}>
        <div className="app-container">
          <Provider>{children}</Provider>
        </div>

        <div className="mobile-not-supported">Mobile Devices Not Supported</div>
      </body>
    </html>
  );
}
