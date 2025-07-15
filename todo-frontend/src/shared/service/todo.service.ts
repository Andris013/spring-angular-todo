import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../model/todo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private api = 'http://localhost:8080/api/todos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.api);
  }
  create(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.api, todo);
  }
  update(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.api}/${todo.id}`, todo);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
