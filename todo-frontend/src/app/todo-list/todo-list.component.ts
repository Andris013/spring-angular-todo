import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Todo } from 'src/shared/model/todo';
import { TodoService } from 'src/shared/service/todo.service';
import {
  TodoDialogData,
  TodoEditorComponent,
} from '../todo-editor/todo-editor.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
  standalone: false,
})
export class TodoListComponent {
  todoList: Todo[] = [];
  inProgressList: Todo[] = [];
  doneList: Todo[] = [];

  lists: { id: string; label: string; status: string; items: Todo[] }[] = [];

  get connectedDropListsIds(): string[] {
    return this.lists.map((l) => l.id);
  }

  constructor(private readonly todoService: TodoService, private readonly dialog: MatDialog) {}

  ngOnInit(): void {
    this.lists = [
      { id: 'todoList', label: 'To do', status: 'TODO', items: [] },
      {
        id: 'inProgressList',
        label: 'In progress',
        status: 'IN_PROGRESS',
        items: [],
      },
      { id: 'doneList', label: 'Done', status: 'DONE', items: [] },
    ];

    this.fetchTodos();
  }

  fetchTodos() {
    this.todoService.getAll().subscribe({
      next: (todos) => {
        this.lists.forEach(
          (list) =>
            (list.items = todos.filter((todo) => todo.status === list.status))
        );
      },
    });
  }

  dropItem(event: CdkDragDrop<Todo[], any, any>) {
    if (event.previousContainer === event.container) return;

    const movedItem = event.previousContainer.data[event.previousIndex];
    const targetList = this.lists.find((list) => list.id == event.container.id);

    if (!targetList) {
      return;
    }

    movedItem.status = targetList.status;

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    this.todoService.update(movedItem).subscribe({
      next: () => this.fetchTodos(),
    });
  }

  openCreateDialog(status: string): void {
    const dialogRef = this.dialog.open(TodoEditorComponent, {
      width: '400px',
      data: { deleteButtonVisible: false, todo: { title: '', description: '', status: status } },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.action === 'save') {
        this.todoService.create(result.todo).subscribe({
          next: () => this.fetchTodos(),
        });
      }
    });
  }

  openEditDialog(existingTodo: Todo): void {
    const dialogRef = this.dialog.open(TodoEditorComponent, {
      width: '400px',
      data: { deleteButtonVisible: true, todo: { ...existingTodo } as TodoDialogData },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      if (result.action === 'save') {
        const todoToUpdate = { id: existingTodo.id, ...result.todo as TodoDialogData };
        this.todoService.update(todoToUpdate).subscribe({
          next: () => this.fetchTodos(),
        });
      } else if (result.action === 'delete') {
        this.todoService.delete(existingTodo.id!).subscribe({
          next: () => this.fetchTodos(),
        });
      }
    });
  }
}
