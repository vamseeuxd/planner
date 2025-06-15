import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Todo {
  id: string;
  title: string;
  dueDate: string;
  settleDate: string | null;
  amount: number;
  completed: boolean;
  children?: Todo[];
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  imports:[
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatTreeModule,
    MatSelectModule,
    MatCardModule,
    MatTooltipModule,
    CommonModule,
  ],
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  treeControl = new NestedTreeControl<Todo>(node => node.children);
  dataSource = new MatTreeNestedDataSource<Todo>();
  todoForm: FormGroup;
  editingTodo: Todo | null = null;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      dueDate: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      parentId: ['']
    });
  }

  ngOnInit(): void {
    this.dataSource.data = [
      {
        id: '1',
        title: 'Complete Project Proposal',
        dueDate: '2025-06-20',
        settleDate: null,
        amount: 500,
        completed: false,
        children: [
          { id: '1.1', title: 'Research Market', dueDate: '2025-06-15', settleDate: null, amount: 100, completed: false },
          { id: '1.2', title: 'Draft Outline', dueDate: '2025-06-18', settleDate: null, amount: 150, completed: false }
        ]
      },
      {
        id: '2',
        title: 'Client Meeting',
        dueDate: '2025-06-25',
        settleDate: null,
        amount: 200,
        completed: false
      }
    ];
  }

  hasChild = (_: number, node: Todo) => !!node.children && node.children.length > 0;

  addTodo(): void {
    if (this.todoForm.valid) {
      const newTodo: Todo = {
        id: Math.random().toString(36).substring(2, 9),
        title: this.todoForm.value.title,
        dueDate: this.todoForm.value.dueDate,
        settleDate: null,
        amount: this.todoForm.value.amount,
        completed: false
      };

      const parentId = this.todoForm.value.parentId;
      if (parentId) {
        this.addSubtask(parentId, newTodo);
      } else {
        const data = this.dataSource.data;
        data.push(newTodo);
        this.dataSource.data = [...data];
      }
      this.todoForm.reset();
    }
  }

  addSubtask(parentId: string, newTodo: Todo): void {
    const addToNode = (nodes: Todo[]): boolean => {
      for (const node of nodes) {
        if (node.id === parentId) {
          node.children = node.children || [];
          node.children.push(newTodo);
          return true;
        }
        if (node.children && addToNode(node.children)) {
          return true;
        }
      }
      return false;
    };

    addToNode(this.dataSource.data);
    this.dataSource.data = [...this.dataSource.data];
  }

  toggleComplete(node: Todo): void {
    node.completed = !node.completed;
    if (node.completed) {
      node.settleDate = new Date().toISOString().split('T')[0];
    } else {
      node.settleDate = null;
    }
    this.dataSource.data = [...this.dataSource.data];
  }

  editTodo(node: Todo): void {
    this.editingTodo = node;
    this.todoForm.patchValue({
      title: node.title,
      dueDate: node.dueDate,
      amount: node.amount
    });
  }

  saveEdit(): void {
    if (this.editingTodo && this.todoForm.valid) {
      this.editingTodo.title = this.todoForm.value.title;
      this.editingTodo.dueDate = this.todoForm.value.dueDate;
      this.editingTodo.amount = this.todoForm.value.amount;
      this.dataSource.data = [...this.dataSource.data];
      this.editingTodo = null;
      this.todoForm.reset();
    }
  }

  deleteTodo(node: Todo): void {
    const deleteFromNode = (nodes: Todo[]): boolean => {
      const index = nodes.findIndex(n => n.id === node.id);
      if (index !== -1) {
        nodes.splice(index, 1);
        return true;
      }
      for (const n of nodes) {
        if (n.children && deleteFromNode(n.children)) {
          return true;
        }
      }
      return false;
    };

    deleteFromNode(this.dataSource.data);
    this.dataSource.data = [...this.dataSource.data];
  }
}
