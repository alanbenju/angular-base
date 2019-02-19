import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { User } from '../classes/user'



@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }


  url = "http://localhost:3000/user"

  getAll() {
    return this.http.get<User[]>(this.url).toPromise()//.then((response)=>response.json())
  }

  getById(id: string) {
    return this.http.get<User>(this.url + '/' + id).toPromise()
  }

  create(user: User) {
    return this.http.post(this.url, user).toPromise()
  }

  update(user: User) {
    return this.http.put(this.url + '/' + user._id, user).toPromise()
  }

  delete(id: string) {
    return this.http.delete(this.url + '/' + id).toPromise()
  }
}
