import { Component, OnInit } from '@angular/core';
import { User } from '../classes/user'
import { UserService } from '../services/user.service'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(private userService:UserService) { }
  
  users:User[] = []
  newUser: User = new User();
  selectedUser: User;
  
  ngOnInit() {
    this.userService.getAll().then((allUsers)=>{
      this.users = allUsers
    })
  }


  create(){
    this.userService.create(this.newUser).then((response)=>{
      alert("User created")
      window.location.reload()
    }).catch((err)=>{
      console.log(err)
      alert("There was an error creating the user"+err)
    })
  }

  viewDetails(user:User){
    this.selectedUser = JSON.parse(JSON.stringify(user));
  }

  delete(id:string){
    this.userService.delete(this.newUser._id).then((response)=>{
      alert("User deleted")
      window.location.reload()
    }).catch((err)=>{
      console.log(err)
      alert("There was an error deleting the user"+err)
    })
  }

  update(){
    this.userService.update(this.selectedUser).then((response)=>{
      alert("User updated")
      window.location.reload()
    }).catch((err)=>{
      console.log(err)
      alert("There was an error updated the user"+err)
    })
  }

}
