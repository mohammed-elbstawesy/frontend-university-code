import { Routes } from '@angular/router';
import { Login } from './user-layout/login/login';
import { SignIn } from './user-layout/login/sign-in/sign-in';
import { SignUp } from './user-layout/login/sign-up/sign-up';
import { Result } from './user-layout/result/result';
import { Home } from './user-layout/home/home';
import { UserLayout } from './user-layout/user-layout';

export const routes: Routes = [
    { path: '',component: UserLayout,children: [
            { path: '', component: Home },
            { path: 'result', component: Result },
            { path: 'login', component: Login,children: [
                    { path: 'signin', component: SignIn },
                    { path: 'signup', component: SignUp },
                    { path: '', redirectTo: 'signin', pathMatch: 'full' } 
                ]
            }
        ]
        
    },

];