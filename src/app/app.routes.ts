import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { userGuard } from './core/guards/user-guard';
import { notloginGuard } from './core/guards/notlogin-guard';
import { scanWaitGuard } from './core/guards/scan-wait-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./user-layout/user-layout').then(m => m.UserLayout),
        children: [
            {
                path: '',
                loadComponent: () => import('./user-layout/home/footer/footer.component').then(m => m.FooterComponent),
                children: [
                    { path: '', loadComponent: () => import('./user-layout/home/home').then(m => m.Home) },
                    { path: 'about', loadComponent: () => import('./user-layout/home/about/about.component').then(m => m.AboutComponent) },
                    { path: 'services', loadComponent: () => import('./user-layout/home/services/services.component').then(m => m.ServicesComponent) },
                    { path: 'pricing', loadComponent: () => import('./user-layout/home/pricing/pricing.component').then(m => m.PricingComponent) },
                ]
            },
            { path: 'result', loadComponent: () => import('./user-layout/result/result').then(m => m.Result), canActivate: [userGuard] },
            { path: 'scanning-wait/:id', loadComponent: () => import('./user-layout/scaning-wait/scaning-wait').then(m => m.ScaningWait), canActivate: [userGuard, scanWaitGuard] },
            { path: 'profile', loadComponent: () => import('./user-layout/profile/profile').then(m => m.Profile) },
            { path: 'user-urls', loadComponent: () => import('./user-layout/user-urls/user-urls').then(m => m.UserUrls), canActivate: [userGuard] },
            { path: 'checkout', loadComponent: () => import('./checkout/checkout').then(m => m.Checkout) },
            { path: 'result/:id', loadComponent: () => import('./user-layout/result/result').then(m => m.Result), canActivate: [userGuard] },
            {
                path: 'login',
                loadComponent: () => import('./user-layout/login/login').then(m => m.Login),
                children: [
                    { path: 'signin', loadComponent: () => import('./user-layout/login/sign-in/sign-in').then(m => m.SignIn), canActivate: [notloginGuard] },
                    { path: 'signup', loadComponent: () => import('./user-layout/login/sign-up/sign-up').then(m => m.SignUp) },
                    { path: 'verify', loadComponent: () => import('./user-layout/login/verify-otp/verify-otp').then(m => m.VerifyOtp) },
                    { path: 'forgot-password', loadComponent: () => import('./user-layout/login/forgot-password/forgot-password').then(m => m.ForgotPassword) },
                    { path: 'reset-password', loadComponent: () => import('./user-layout/login/reset-password/reset-password').then(m => m.ResetPassword) },
                    { path: '', redirectTo: 'signin', pathMatch: 'full' }
                ]
            }
        ]
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard),
        children: [
            { path: '', loadComponent: () => import('./dashboard/pages/overview/overview').then(m => m.Overview) },
            { path: 'vulnerabilities/add', loadComponent: () => import('./dashboard/pages/vulnerabilities/add-vulnerability/add-vulnerability').then(m => m.AddVulnerability) },
            { path: 'urls', loadComponent: () => import('./dashboard/pages/urls/urls').then(m => m.Urls) },
            { path: 'reports', loadComponent: () => import('./dashboard/pages/reports/reports').then(m => m.Reports) },
            { path: 'vulnerabilities', loadComponent: () => import('./dashboard/pages/vulnerabilities/vulnerabilities').then(m => m.Vulnerabilities) },
            { path: 'users', loadComponent: () => import('./dashboard/pages/users/users').then(m => m.Users) },
            { path: 'users-info', loadComponent: () => import('./dashboard/pages/users-info/users-info').then(m => m.UsersInfo) },
            { path: 'logs', loadComponent: () => import('./dashboard/pages/log/log').then(m => m.Log) }
        ],
        canActivate: [adminGuard],
    },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];