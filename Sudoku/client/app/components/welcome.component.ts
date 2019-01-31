import { Component } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';
import { Http } from '@angular/http';
import { Headers } from '@angular/http';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';

const SERVER_LINK = "http://localhost:3002/";

@Component({
  selector: 'welcome-component',
  templateUrl: 'assets/templates/welcome-component-template.html',
  styleUrls: ['assets/stylesheets/welcome-component-stylesheet.css']
})
export class WelcomeComponent {

  connected: boolean;

  constructor(private http: Http, private router: Router, private cookieService: CookieService)
  {
    if (this.cookieService.get('username') != null)
    {
      this.login(this.cookieService.get('username'), this.cookieService.get('password'));
    }
  }

  loginEvent(username: string, password: string)
  {
    this.login(username, String(Md5.hashStr(password)));
  }

  registerEvent(username: string, password: string, confirm: string)
  {
    if (password !== confirm)
    {
      window.alert("Les mots de passe de se correspondent pas");
    }
    else
    {
      this.register(username, String(Md5.hashStr(password)));
    }
  }

  login(username: string, password: string): void
  {
    let body = "name=" + username + "&pass=" + password;
    let headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    this.http.post(SERVER_LINK + "login", body, {headers: headers}).subscribe(data =>
    {
      if (data.json())
      {
        this.setUser(username, password);
        window.alert("Bienvenue " + username + "!");
        this.router.navigate(['./sudoku']);
      }
      else
      {
        window.alert("Le nom d'utilisateur ou le mot de passe est invalide!");
      }
    });
  }

  register(username: string, password: string): void
  {
    let body = "name=" + username + "&pass=" + password;
    let headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    this.http.post(SERVER_LINK + "register", body, {headers: headers}).subscribe(data =>
    {
      if (data.json())
      {
        this.setUser(username, password);
        window.alert("Votre compte a été crée avec succès");
        this.router.navigate(['./sudoku']);
      }
      else
      {
        window.alert("Le nom d'utilisateur est déjà pris!");
      }
    });
  }

  private setUser(username: string, password: string): void
  {
    this.cookieService.put("username", username);
    this.cookieService.put("password", password);
  }
}
