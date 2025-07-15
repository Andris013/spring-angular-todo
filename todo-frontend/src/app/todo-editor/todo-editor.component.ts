import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface TodoDialogData {
  title: string;
  comment?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

@Component({
  selector: 'app-todo-editor',
  templateUrl: './todo-editor.component.html',
  styleUrl: './todo-editor.component.scss',
  standalone: false,
})
export class TodoEditorComponent {
  todoForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TodoEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TodoDialogData,
    private fb: FormBuilder
  ) {
    this.todoForm = this.fb.group({
      title: [data.title || '', Validators.required],
      comment: [data.comment || ''],
      status: [data.status || 'TODO'],
    });
  }

  onSave(): void {
    if (this.todoForm.valid) {
      this.dialogRef.close({action: "save", todo: this.todoForm.value});
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    this.dialogRef.close({action: "delete"})
  }
}
