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


export const routes: Routes = [
    {
        path: '',
        component: UserLayout,
        children: [
            { path: '', component: Home },
            { path: 'result', component: Result},
            { 
                path: 'login', 
                component: Login,
                children: [
                    { path: 'signin', component: SignIn },
                    { path: 'signup', component: SignUp },
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
            { path: 'urls', component: Urls },
            { path: 'reports', component: Reports },
            { path: 'vulnerabilities', component: Vulnerabilities },
            { path: 'users', component: Users },
            { path: 'users-info', component: UsersInfo }
        ]
    }
];