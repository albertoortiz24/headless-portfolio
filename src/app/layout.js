import Header from '../app/components/Header';
import '../app/globals.css';
export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}