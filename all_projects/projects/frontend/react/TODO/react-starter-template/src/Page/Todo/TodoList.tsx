import { useRef, useState } from 'react';
import useTask from './helper/useTask';

export default function TodoList() {
  const input = useRef<HTMLInputElement | null>(null);
  const [task, addTask, updateTask] = useTask();

  return (
    <>
      <input
        type='text'
        ref={input}
      />
      <button onClick={() => addTask({ name: input.current?.value })}>
        Add
      </button>

      <div>
        TodoList : Total {task.length} / Completed{' '}
        {task.filter((d) => d.status).length}
      </div>

      {task.map((data, i) => {
        return (
          <div key={i}>
            <input
              type='checkbox'
              onChange={() =>
                updateTask({
                  id: data.id,
                })
              }
            />
            {data.name}
          </div>
        );
      })}
    </>
  );
}
