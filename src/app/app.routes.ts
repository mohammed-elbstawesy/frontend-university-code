import { Routes } from '@angular/router';
import { UserLayout } from './user-layout/user-layout';
import { Home } from './user-layout/home/home';
import { Result } from './user-layout/result/result';
import { Login } from './user-layout/login/login';
import { SignIn } from './user-layout/login/sign-in/sign-in';
import { SignUp } from './user-layout/login/sign-up/sign-up';
import { Dashboard } from './dashboard/dashboard';
import { Urls } from './dashboard/pages/urls/urls';
import { Reports } from './dashboard/pages/reports/reports';
import { Vulnerabilities } from './dashboard/pages/vulnerabilities/vulnerabilities';
import { Overview } from './dashboard/pages/overview/overview';
import { UsersInfo } from './dashboard/pages/users-info/users-info';
import { Users } from './dashboard/pages/users/users';
import { adminGuard } from './core/guards/admin.guard';
import { userGuard } from './core/guards/user-guard';
import { AddVulnerability } from './dashboard/pages/vulnerabilities/add-vulnerability/add-vulnerability';
import { Profile } from './user-layout/profile/profile';
import { UserUrls } from './user-layout/user-urls/user-urls';
import { ScaningWait } from './user-layout/scaning-wait/scaning-wait';
import { notloginGuard } from './core/guards/notlogin-guard';
import { VerifyOtp } from './user-layout/login/verify-otp/verify-otp';
import { ForgotPassword } from './user-layout/login/forgot-password/forgot-password';
import { ResetPassword } from './user-layout/login/reset-password/reset-password';
import { Log } from './dashboard/pages/log/log';


export const routes: Routes = [
    {
        path: '',
        component: UserLayout,
        children: [
            { path: '', component: Home },
            { path: 'result', component: Result,canActivate:[userGuard]},
            { path: 'scanning-wait/:id', component: ScaningWait, canActivate: [userGuard] },
            {path: 'profile',component:Profile},
            {path:'user-urls',component:UserUrls,canActivate:[userGuard]},
            // داخل مصفوفة children بتاعة login
            { path: 'result/:id', component: Result,canActivate:[userGuard] },
            { 
                path: 'login', 
                component: Login,
                children: [
                    { path: 'signin', component: SignIn,canActivate:[notloginGuard] },
                    { path: 'signup', component: SignUp },
                    { path: 'verify', component: VerifyOtp },
                    { path: 'forgot-password', component: ForgotPassword },
                    { path: 'reset-password', component: ResetPassword },
                    { path: '', redirectTo: 'signin', pathMatch: 'full' }
                ]
            }
        ]
    },
    
    {
        path: 'dashboard',
        component: Dashboard, 
        children: [
            { path: '', component: Overview },
            { path: 'vulnerabilities/add', component: AddVulnerability },  
            { path: 'urls', component: Urls },
            { path: 'reports', component: Reports },
            { path: 'vulnerabilities', component: Vulnerabilities },
            { path: 'users', component: Users },
            { path: 'users-info', component: UsersInfo },
            { path: 'logs', component: Log }
        ],
    canActivate: [adminGuard],

    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];