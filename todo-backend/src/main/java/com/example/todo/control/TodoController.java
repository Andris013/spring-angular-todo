package com.example.todo.control;

import com.example.todo.model.Todo;
import com.example.todo.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/todos")
public class TodoController {
    private final TodoService todoService;

    public TodoController(@Autowired TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping
    public List<Todo> getAll() {
        return this.todoService.getAll();
    }

    @PostMapping
    public Todo create(@RequestBody Todo todo) {
        return this.todoService.create(todo);
    }

    @PutMapping("/{id}")
    public Todo update(@PathVariable Long id, @RequestBody Todo todo) {
        todo.setId(id);
        return this.todoService.update(todo);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        this.todoService.delete(id);
    }
}
