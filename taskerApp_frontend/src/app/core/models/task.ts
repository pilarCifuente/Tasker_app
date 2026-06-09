import { TaskPriority } from "./taskPriority";
import { TaskStatus } from "./taskStatus";

export interface Task {
    id?: number; 
    title: string;             
    description?: string;     
    status: TaskStatus;   
    priority: TaskPriority    
    createdAt?:  string; 
    updatedAt?:  string;
    dueDate?: string;
}
