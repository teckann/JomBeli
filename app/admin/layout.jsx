import AdminNavBar from '@/app/_components/AdminNavBar/AdminNavBar';
import Styles from '@/app/admin/AdminLayout.module.css';

export default function AdminLayout({ children }) {
  return (
    <>
      <div className={Styles.contentPage}>
        <AdminNavBar />
        {children}
      </div>
    </>
  );
}