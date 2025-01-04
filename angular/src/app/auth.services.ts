import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { UserInterface } from "./user.interface";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private loggedIn = false;
    public $currentUser = new BehaviorSubject<string | undefined | null>(undefined);

    constructor() {
        this.loggedIn = Boolean(this.getToken())
    }

    public getLoggedIn(){
        return this.loggedIn;
    }

    public getToken() {
        return localStorage.getItem('token');
    }

    public setToken(token: string){
        console.log('logged in')
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