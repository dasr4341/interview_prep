import { useState } from 'react';

export default function Alert(props: any) {
  const [alert, setalert] = useState(false);
  
  const dismissAlert = () => {
    setalert(false);
  };
  return (
    <>{alert &&
      <div id="alert" className="flex p-4 bg-gray-100 dark:bg-gray-700" role="alert">
        {/* <svg aria-hidden="true" className="flex-shrink-0 w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg> */}
        <span className="sr-only">Info</span>
        <div className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          {props.message}
        </div>
        <button onClick={dismissAlert}
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 bg-gray-100 text-gray-500 rounded-lg focus:ring-2 focus:ring-gray-400 p-1.5 hover:bg-gray-200 inline-flex h-8 w-8 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white">
          <span className="sr-only">Dismiss</span>
          {/* <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg> */}
        </button>
      </div>}
    </>
  );
}
