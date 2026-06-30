import Styles from '@/app/_components/AdminNavBar/AdminNavBar.module.css';
import { getUser } from '@/app/_lib/auth';
import Image from 'next/image';
import Link from 'next/link';
import { getUserInfo } from '@/app/_lib/data-services';
import AdminLogOutButton from '../AdminLogOutButton/AdminLogOutButton';
import ManageServicesNavBar from './AdminManageServices';

export default async function AdminNavBar(){
    
    const user = await getUser();

    const userInfo = await getUserInfo(user.id);

    return(
        <aside className={Styles.wrapper}>
            <div className={Styles.topContainer}>
                {/* <Image src="/logo.png" alt="Logo" width={200} height={200} /> */}
                <span className={Styles.logo}>JomBeli</span>
            </div>
            <div className={Styles.middleContainer}>
                <div className={Styles.middleMenuSelection}>
                    <span className={Styles.middleMenuText}>Main Menu</span>
                    <div className={Styles.linkContainer}>
                        <Link className={Styles.link} href="/admin/Dashboard">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 64 64" className={Styles.svg}>
                                <path fill="currentColor" d="M32 0C14.355 0 0 14.355 0 32s14.355 32 32 32 32-14.355 32-32S49.645 0 32 0zM15.023 15.023a4 4 0 0 1 5.66 0c1.566 1.57 1.582 4.105.012 5.664-1.559 1.566-4.078 1.582-5.633.023l-.035-.031a4.01 4.01 0 0 1-.004-5.656zM8.102 32c0-2.211 1.77-4 3.977-4h.043a4 4 0 0 1 0 8c-2.212 0-4.02-1.789-4.02-4zm12.609 16.93-.027.039a4.02 4.02 0 0 1-5.66.008 4.004 4.004 0 0 1 .004-5.664c1.566-1.562 4.105-1.578 5.66-.012a3.966 3.966 0 0 1 .023 5.629zM36 32c0 2.211-1.789 4-4 4s-4-1.789-4-4V12c0-2.211 1.789-4 4-4s4 1.789 4 4v20zm7.285-16.941.031-.031a3.998 3.998 0 1 1 5.656 5.656c-1.566 1.566-4.105 1.578-5.668.012-1.562-1.563-1.577-4.079-.019-5.637zm5.692 33.918a4.003 4.003 0 0 1-5.66-.008c-1.566-1.562-1.582-4.109-.02-5.664 1.566-1.566 4.078-1.578 5.637-.02l.039.027a4.028 4.028 0 0 1 .004 5.665zM52 36c-2.211 0-4.02-1.789-4.02-4s1.77-4 3.977-4H52a4 4 0 0 1 0 8z" />
                            </svg>
                            Dashboard
                        </Link>
                        <Link className={Styles.link} href="/admin/ManageUsers">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={Styles.svg}>
                                <g fill="currentColor">
                                <circle cx={9.001} cy={6} r={4} />
                                <ellipse cx={9.001} cy={17.001} rx={7} ry={4} />
                                <path d="M21 17c0 1.657-2.036 3-4.521 3 .732-.8 1.236-1.805 1.236-2.998 0-1.195-.505-2.2-1.239-3.001C18.962 14 21 15.344 21 17ZM18 6a3 3 0 0 1-4.029 2.82A5.688 5.688 0 0 0 14.714 6c0-1.025-.27-1.987-.742-2.819A3 3 0 0 1 18 6.001Z" />
                                </g>
                            </svg>
                            Manage Users
                        </Link>
                        <Link className={Styles.link} href="/admin/ManageCouriers">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 512 512" className={Styles.svg}>
                                <path d="M442.031 402.197c-12.564-18.822-31.647-29.22-49.582-35.98-8.994-3.39-17.784-5.88-25.527-7.997-7.73-2.105-14.455-3.879-18.973-5.578-7.902-2.936-16.25-6.74-22.075-10.831-2.909-2.029-5.15-4.12-6.45-5.9-1.314-1.822-1.671-3.081-1.685-4.182v-29.605c10.109-11.258 24.634-28.684 30.602-56.322 2.084-.942 4.147-2.002 6.134-3.391 4.945-3.41 9.14-8.362 12.695-15.102 3.576-6.766 6.746-15.418 10.129-27.253 1.713-6.003 2.504-11.216 2.504-15.858.007-5.343-1.094-9.992-3.116-13.761-3.032-5.714-7.95-8.892-11.931-10.335-.44-.158-.825-.255-1.251-.378l.302-13.163s.702-13.492.158-20.507c-1.464-19.056-2.991-38.112-4.229-57.188-.241-3.713-.592-7.462-.592-11.189C359.143 35.478 294.803 0 255.997 0 217.19 0 152.85 35.478 152.85 57.676c0 8.494-7.193 85.508-4.456 85.721.007 0 .103 15.102.103 16.34-1.706.536-3.514 1.238-5.439 2.414a21.844 21.844 0 0 0-7.737 8.286c-2.022 3.769-3.129 8.418-3.122 13.768.007 4.642.798 9.854 2.51 15.851 4.525 15.762 8.61 25.94 13.899 33.402 2.641 3.713 5.652 6.691 8.926 8.953 1.988 1.389 4.051 2.448 6.134 3.391 5.969 27.638 20.494 45.064 30.602 56.322v29.605c0 .935-.371 2.284-1.822 4.209-2.124 2.86-6.533 6.326-11.766 9.263-5.22 2.971-11.223 5.536-16.477 7.393-6.169 2.187-16.106 4.456-27.24 7.654-16.731 4.835-36.509 11.808-52.601 25.603-8.032 6.904-15.088 15.569-20.046 26.338-4.965 10.762-7.812 23.547-7.806 38.517 0 3.473.152 7.063.468 10.776.228 2.6 1.218 4.717 2.38 6.464 2.215 3.246 5.151 5.667 8.83 8.149 6.444 4.264 15.37 8.431 26.8 12.522 34.206 12.2 90.837 23.368 161.016 23.382 57.016 0 105.141-7.399 139.491-16.696 17.186-4.663 30.905-9.759 40.822-14.854 4.965-2.572 8.981-5.103 12.165-7.881 1.596-1.403 2.991-2.875 4.167-4.621 1.156-1.747 2.153-3.864 2.38-6.464.31-3.713.461-7.289.461-10.755.025-19.944-5.099-36.022-13.461-48.531zM227.829 57.312h56.336V82.73h-56.336V57.312zm-49.885 181.523-.784-4.436-4.236-1.513c-2.696-.962-4.752-1.946-6.547-3.191-2.648-1.87-5.048-4.422-7.853-9.648-2.772-5.199-5.708-12.97-8.919-24.241-1.41-4.931-1.912-8.755-1.912-11.602.006-3.308.64-5.24 1.286-6.458.977-1.774 2.173-2.531 3.7-3.143 1.224-.468 2.51-.591 3.026-.619l5.866.73 13.953 28.051v-63.522c18.953-7.675 46.055-17.708 76.313-17.708 23.622 0 46.708 6.127 65.792 12.468l18.843 8.878v59.884l14.112-28.381 5.57-.4c.475-.013 2.964.234 4.601 1.32.887.564 1.609 1.225 2.27 2.442.654 1.218 1.279 3.15 1.293 6.45 0 2.854-.502 6.678-1.912 11.609-4.27 15.04-8.101 23.794-11.615 28.649-1.761 2.456-3.37 3.988-5.158 5.24-1.795 1.244-3.851 2.228-6.547 3.191l-4.237 1.513-.784 4.436c-4.958 27.755-19.262 43.373-29.826 55.139l-1.987 2.215v35.539c-.013 5.103 1.974 9.697 4.69 13.362.261.35.584.653.86.997l-14.036 29.206h-75.522l-14.091-29.31c.2-.24.447-.433.633-.68 2.812-3.686 4.972-8.307 4.972-13.576V296.179l-1.987-2.208c-10.565-11.763-24.869-27.381-29.827-55.136zM332.661 447.88l-76.657 42.197-76.657-42.197 11.684-27.508-31.868-24.86 34.041-36.564 62.8 131.129 62.8-131.129 34.041 36.564-31.868 24.867 11.684 27.501z" style={{ fill: "currentColor"}} />
                            </svg>
                            Manage Courier
                        </Link>
                        <Link className={Styles.link} href="/admin">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 385.194 385.194" className={Styles.svg}>
                                <path style={{ fill: "currentColor"}} d="M229.712 242.693H28.152V77.757h266v40.32c2.461-.173 5.003-.27 7.648-.27 7.558 0 14.39.76 20.512 2.243V62.384c0-4.794-3.889-8.68-8.682-8.68H8.682A8.68 8.68 0 0 0 0 62.384v195.684a8.681 8.681 0 0 0 8.682 8.682h107.726c-1.918 11.574-6.324 32.147-15.644 52.44a8.675 8.675 0 0 0 .582 8.307 8.683 8.683 0 0 0 7.307 3.994h97.728a17.56 17.56 0 0 1-.639-8.172c1.569-9.76 3.533-20.54 5.913-31.12a229.181 229.181 0 0 1-5.761-25.449h12.635c3.241-9.832 6.961-18.31 11.183-24.057z" />
                                <path style={{ fill: "currentColor"}} d="M243.346 132.311c7.998 0 14.504-6.505 14.504-14.504 0-7.997-6.506-14.503-14.504-14.503-7.998 0-14.504 6.506-14.504 14.503 0 .75.074 1.48.185 2.2l-66.893 51.432a14.39 14.39 0 0 0-13.318.891l-57.51-33.159c.002-.099.015-.194.015-.293 0-7.998-6.504-14.504-14.504-14.504-7.996 0-14.504 6.506-14.504 14.504 0 7.997 6.508 14.504 14.504 14.504a14.39 14.39 0 0 0 7.505-2.116l57.51 33.159c-.002.099-.015.194-.015.293 0 7.998 6.506 14.505 14.504 14.505 8 0 14.506-6.507 14.506-14.505 0-.751-.075-1.482-.186-2.202l66.891-51.43a14.406 14.406 0 0 0 5.814 1.225zM385.154 325.087c-2.852-17.734-10.668-60.521-21.637-74.756-5.689-7.389-28.137-19.602-32.58-21.975a3.088 3.088 0 0 0-3.357.295c-4.947 3.883-10.365 6.501-16.107 7.779a3.082 3.082 0 0 0-2.213 1.918l-5.848 15.407-5.844-15.407a3.086 3.086 0 0 0-2.213-1.918c-5.742-1.277-11.158-3.896-16.107-7.779a3.087 3.087 0 0 0-3.359-.295c-4.441 2.375-26.891 14.588-32.58 21.975-10.969 14.236-18.785 57.021-21.637 74.756a3.076 3.076 0 0 0 .699 2.49 3.082 3.082 0 0 0 2.35 1.086h157.387a3.09 3.09 0 0 0 2.35-1.086 3.078 3.078 0 0 0 .696-2.49z" />
                                <path style={{ fill: "currentColor"}} d="M259.842 167.49c-4.865 2.59-10.664 6.902-13.215 13.516-2.482 6.434-1.434 13.584 3.104 21.271-.313 1.38-.084 2.876.789 4.126l1.846 2.638a5.2 5.2 0 0 0 4.258 2.216 5.162 5.162 0 0 0 2.975-.938 5.163 5.163 0 0 0 2.137-3.35 5.176 5.176 0 0 0-.859-3.883l-1.848-2.64a5.187 5.187 0 0 0-2.836-2.009c-3.293-5.591-4.156-10.532-2.555-14.701 1.115-2.912 3.297-5.247 5.695-7.063a228.65 228.65 0 0 0-.051 4.788c0 27.442 19.76 49.688 44.131 49.688 24.375 0 44.133-22.245 44.133-49.688 0-27.441-4.012-49.687-44.133-49.687-33.024 0-41.577 15.078-43.571 35.716z" />
                            </svg>
                            Manage Finance
                        </Link>
                        <Link className={Styles.link} href="/admin">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={Styles.svg}>
                                <g data-name="Layer 2">
                                <path fill="none" d="M0 0h48v48H0z" data-name="invisible box" />
                                <g data-name="Layer 7">
                                    <path fill="currentColor" d="M43 7h-5a2 2 0 0 0-1.4.6L34 10.2l-2.6-2.6A2 2 0 0 0 30 7H5a2.9 2.9 0 0 0-3 3v28a2.9 2.9 0 0 0 3 3h25a2 2 0 0 0 1.4-.6l2.6-2.6 2.6 2.6a2 2 0 0 0 1.4.6h5a2.9 2.9 0 0 0 3-3V10a2.9 2.9 0 0 0-3-3Zm-1 30h-3.2l-3.4-3.4a1.9 1.9 0 0 0-2.8 0L29.2 37H6V11h23.2l3.4 3.4a1.9 1.9 0 0 0 2.8 0l3.4-3.4H42Z" />
                                    <path fill="currentColor" d="M34 17a2 2 0 0 0-2 2v2a2 2 0 0 0 4 0v-2a2 2 0 0 0-2-2ZM34 25a2 2 0 0 0-2 2v2a2 2 0 0 0 4 0v-2a2 2 0 0 0-2-2Z" />
                                    <circle fill="currentColor" cx={14} cy={20} r={2} />
                                    <circle fill="currentColor" cx={22} cy={28} r={2} />
                                    <path fill="currentColor" d="m21.6 17.6-10 10a1.9 1.9 0 0 0 0 2.8 1.9 1.9 0 0 0 2.8 0l10-10a2 2 0 0 0-2.8-2.8Z" />
                                </g>
                                </g>
                            </svg>
                            Manage Vouchers
                        </Link>
                        <Link className={Styles.link} href="/admin/ManageProducts">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={Styles.svg}>
                                <g fill="none" fillRule="evenodd">
                                <path d="M0 0h32v32H0z" />
                                <path fill="currentColor" d="m16 0 13.856 8v16L16 32 2.144 24V8zm6.55 10.674-6.562 3.49-6.562-3.49-.939 1.766 6.501 3.456v7.77h2v-7.77l6.502-3.456z" />
                                </g>
                            </svg>
                            Manage Products
                        </Link>
                        <Link className={Styles.link} href="/admin/ManageOrders">
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className={Styles.svg}>
                                <path fill="currentColor" fillRule="evenodd" d="M5.586 4.586C5 5.172 5 6.114 5 8v9c0 1.886 0 2.828.586 3.414C6.172 21 7.114 21 9 21h6c1.886 0 2.828 0 3.414-.586C19 19.828 19 18.886 19 17V8c0-1.886 0-2.828-.586-3.414C17.828 4 16.886 4 15 4H9c-1.886 0-2.828 0-3.414.586ZM9 8a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H9Zm0 4a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Zm0 4a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2H9Z" clipRule="evenodd" />
                            </svg>
                            Manage Orders
                        </Link>
                        <ManageServicesNavBar />
                        <Link className={Styles.link} href="/admin">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={Styles.svg}>
                                <path fill="none" d="M0 0h48v48H0z" />
                                <path fill="currentColor" d="M8 32c0 2.2 1.8 4 4 4h2a4 4 0 0 0 8 0h7a4 4 0 0 0 8 0h3V24l-4-8h-4v-4c0-2.2-1.8-4-4-4H12c-2.2 0-4 1.8-4 4v20zm26 4c0 .551-.449 1-1 1s-1-.449-1-1 .449-1 1-1 1 .449 1 1zm-16 1c-.551 0-1-.449-1-1s.449-1 1-1 1 .449 1 1-.449 1-1 1zm16.146-18L37 24.708V26h-1c-2.2 0-4-1.8-4-4v-3h2.146z" />
                            </svg>
                            Manage Manage Delivery
                        </Link>
                        <Link className={Styles.link} href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={Styles.svg}>
                                <title>{"report"}</title>
                                <path fill="currentColor" d="M15 20h2v4h-2zM20 18h2v6h-2zM10 14h2v10h-2z" />
                                <path fill="currentColor" d="M25 5h-3V4a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v1H7a2 2 0 0 0-2 2v21a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2ZM12 4h8v4h-8Zm13 24H7V7h3v3h12V7h3Z" />
                                <path d="M0 0h32v32H0z" data-name="&lt;Transparent Rectangle&gt;" style={{ fill: "none", }}
                                />
                            </svg>
                            Manage Reports
                        </Link>
                    </div>
                </div>
                <div className={Styles.middleMenuSelection}>
                    <span className={Styles.middleMenuText}>Account</span>
                    <div className={Styles.linkContainer}>
                        <Link className={Styles.link} href="/admin/AdminProfile">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className={Styles.svg} >
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15c-.882 0-1.72-.19-2.473-.532-.523-.236-.784-.355-.929-.396a1.715 1.715 0 0 0-.394-.07 3 3 0 0 0-.488.015 2.432 2.432 0 0 0-.25.031 3 3 0 0 0-2.418 2.418C4 16.73 4 17.048 4 17.684V19.4c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437C4.76 21 5.04 21 5.6 21h2.8M15 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-2.41 14 2.025-.405c.176-.035.265-.053.347-.085a.997.997 0 0 0 .207-.111c.072-.05.136-.114.263-.242L19.59 16a1.414 1.414 0 1 0-2-2l-4.158 4.157c-.127.128-.19.191-.241.264a.999.999 0 0 0-.11.207c-.033.082-.05.17-.086.347L12.59 21Z" />
                            </svg>
                            Profile
                        </Link>
                    </div>
                </div>
                {userInfo.role ==="Super Admin" && <ManageAdminNavBar />}
            </ div>
            <div className={Styles.bottomMenuSelection}>
                <div className={Styles.userInfo}>
                    <div>
                        <Image className={Styles.userImage} src={userInfo.avatar} alt="User Image" width={40} height={40} />
                    </div>
                    <div className={Styles.userDetails}>
                        <span className={Styles.userName}>{userInfo.username}</span>
                        <span className={Styles.role}>{userInfo.role}</span>
                    </div>
                </div>
                <div className={Styles.logOutContainer}>
                    <AdminLogOutButton />
                </div>
            </div>
        </aside>
    ); 
}

export function ManageAdminNavBar() {
    return (
        <div className={Styles.middleMenuSelection}>
            <span className={Styles.middleMenuText}>Super Admin</span>
            <div className={Styles.linkContainer}>
                <Link className={Styles.link} href="/admin/ManageAdmins">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={Styles.svg}>
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path fill="currentColor" d="M12 14v8H4a8 8 0 0 1 8-8zm0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm9 4h1v5h-8v-5h1v-1a3 3 0 0 1 6 0v1zm-2 0v-1a1 1 0 0 0-2 0v1h2z" />
                    </svg>
                    Manage Admins
                </Link>
            </div>
        </div>
    );
}