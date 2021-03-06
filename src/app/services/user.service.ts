import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../_models/user';
import { AlertService } from './alert.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private usersUrl = 'http://api.payraven.com.ng/v1/user-list';
  private userUrl = 'http://api.payraven.com.ng/v1/user/';
  private registerUrl = 'http://api.payraven.com.ng/v1/register/';

  constructor(
    private http: HttpClient,
    private alertService: AlertService) {  }

    /** GET schools from the server */
  getUsers (): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
      .pipe(
        tap(users => this.successlog(`Retrieved School List`)),
        catchError(this.handleError('getUsers', []))
      );
  }


    /** GET user by id. Return `undefined` when id not found */
  getUserNo404<Data>(id: number): Observable<User> {
    const url = `${this.usersUrl}/?id=${id}`;
    return this.http.get<User[]>(url)
      .pipe(
        map(users => users[0]), // returns a {0|1} element array
        tap(u => {
          const outcome = u ? `Retrieved` : `Did not find`;
          this.log(`${outcome} user id=${id}`);
        }),
        catchError(this.handleError<User>(`getUser id=${id}`))
      );
  }

    /** GET user by id. Will 404 if id not found */
    // TODO: query by name
  getUser(id: number): Observable<User> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<User>(url).pipe(
      tap(_ => this.successlog(`Retrieved School details`)),
      catchError(this.handleError<User>(`getUser id=${id}`))
    );
  }

    /** GET user by id. Will 404 if id not found */
  getProfile(id: number): Observable<User> {
    const url = `${this.userUrl}/${id}`;
    return this.http.get<User>(url).pipe(
      tap(_ => this.successlog(`Retrieved Profile`)),
      catchError(this.handleError<User>(`getUser id=${id}`))
    );
  }

    /* GET users whose name contains search term */
  searchUsers(term: string): Observable<User[]> {
    if (!term.trim()) {
      // if not search term, return empty user array.
      return of([]);
    }
    return this.http.get<User[]>(`${this.usersUrl}/?search=${term}`).pipe(
      tap(users => this.successlog(`found users matching "${term}"`)),
      catchError(this.handleError<User[]>('searchUsers', []))
    );
  }
  //////// Save methods //////////
  /** POST: add a new user to the server */
  addUser(user: User): Observable<User> {
    console.log(user);
    return this.http.post<User>(this.registerUrl, user, httpOptions)
      .pipe(
      tap(_ => this.successlog(`Registered School w/ id=${user.id}`)),
      catchError(this.handleError<User>('addUser'))
    );
  }

    /** DELETE: delete the user from the server */
  deleteUser (user: User | number): Observable<User> {
    const id = typeof user === 'number' ? user : user.id;
    const url = `${this.usersUrl}/${id}`;
    return this.http.delete<User>(url, httpOptions).pipe(
      tap(_ => this.successlog(`Deleted School id=${id}`)),
      catchError(this.handleError<User>('deleteUser'))
    );
  }

  /** PUT: update the user on the server */
  updateUser (user: User): Observable<any> {
    return this.http.put(this.usersUrl, user, httpOptions).pipe(
      tap(_ => this.successlog(`Updated school id=${user.id}`)),
      catchError(this.handleError<any>('updateUser'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      this.errorlog(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
/** Log a UserService message with the AlertService */

  private log(message: string) {
    this.alertService.log(message);
  }
  /** success logging */
  private successlog(message: string) {
    this.alertService.success(message);
  }

  /** error logging */
  private errorlog(message: string) {
    this.alertService.error(message);
  }
}



