import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { UserInterface } from '@models/user.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private loggedIn = false;
    public currentUser$ = new BehaviorSubject<UserInterface | null>(null);

    constructor() {
        this.loggedIn = Boolean(this.getToken())
    }

    public getLoggedIn(){
        return this.loggedIn;
    }

    getUserName(): string | null {
        const currentUser = this.currentUser$.getValue();
        const username = currentUser ? currentUser.username : null;
        return username;
    }

    // Get the user's name
    getName(): string | null {
        const currentUser = this.currentUser$.getValue();
        const payload = currentUser && currentUser.token ? JSON.parse( atob( currentUser.token.split('.')[1] ) ) : null;
        return payload.name;
    }

    // Get the user's status
    getStatus(): string | null {
        const currentUser = this.currentUser$.getValue();
        const payload = currentUser && currentUser.token ? JSON.parse( atob( currentUser.token.split('.')[1] ) ) : null;
        return payload.status;
    }
    // Set the current user
    setCurrentUser(user: UserInterface): void {
        this.currentUser$.next(user);
     }

    public getToken() {
        return localStorage.getItem('token');
    }

    public setToken(token: string){
        console.log('logged in');
        this.loggedIn = true;
        return localStorage.setItem('token', token);
    }

    public removeToken(){
        let val = localStorage.removeItem('token');
        console.log('removed token val ', val);
        this.loggedIn = false;
        console.log('Logged Out!');
    }

}