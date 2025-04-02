import { useState } from 'react';
import { Task } from '../interface/Task.interface';
import { toast } from 'react-toastify';

export default function useTask() {
  const [task, setTask] = useState<Task[]>([]);

  function updateTask(taskDetails: { id: string; status?: boolean }) {
    setTask((prevData) => {
      return prevData.map((savedData) => {
        if (savedData.id === taskDetails.id) {
          return {
            ...savedData,
            status: taskDetails.status || !savedData.status,
          };
        }
        return savedData;
      });
    });
  }

  function addTask(taskDetails: { name: string | null | undefined }) {
    if (taskDetails.name) {
      setTask((prevData) => {
        return [
          ...prevData,
          {
            id: String(+new Date()),
            name: String(taskDetails.name),
            updatedAt: null,
            createdAt: new Date(),
            status: false,
          },
        ];
      });
      return;
    }
    toast.error('Please enter task name !');
  }

  return [
    task,
    addTask,
    updateTask
  ];
}
